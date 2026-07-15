import { spawn } from "node:child_process";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";

const [, , label, ...commandParts] = process.argv;

if (!label || commandParts.length === 0) {
  console.error("Usage: node scripts/run-with-diagnostics.mjs <label> <command> [args...]");
  process.exit(2);
}

const diagnosticsDirectory = resolve(".diagnostics");
mkdirSync(diagnosticsDirectory, { recursive: true });

const startedAt = new Date();
const timestamp = startedAt.toISOString().replaceAll(":", "-").replaceAll(".", "-");
const logPath = resolve(diagnosticsDirectory, `${label}-${timestamp}.log`);
const latestRunPath = resolve(diagnosticsDirectory, "latest-run.json");
const latestCrashPath = resolve(diagnosticsDirectory, "latest-crash.md");
const log = createWriteStream(logPath, { flags: "a" });
const executionParts = resolveExecutionParts(commandParts);
const shellCommand = executionParts.map(quoteShellArgument).join(" ");

const runMetadata = {
  label,
  command: commandParts.join(" "),
  cwd: process.cwd(),
  pid: process.pid,
  startedAt: startedAt.toISOString(),
  status: "running",
  logPath,
};

writeFileSync(latestRunPath, `${JSON.stringify(runMetadata, null, 2)}\n`);
log.write(`[diagnostics] started ${runMetadata.startedAt}\n`);
log.write(`[diagnostics] command ${runMetadata.command}\n\n`);

// `npm test` includes a production build. Serializing it with `npm run build`
// prevents concurrent Vite processes from emptying and writing `dist` at the
// same time, which is especially prone to ENOTEMPTY failures on Windows.
const releaseBuildLock = ["build", "test"].includes(label)
  ? await acquireBuildLock()
  : () => {};

const child = spawn(shellCommand, {
  cwd: process.cwd(),
  env: process.env,
  shell: true,
  stdio: ["inherit", "pipe", "pipe"],
});

child.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
  log.write(chunk);
});

child.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
  log.write(chunk);
});

let requestedSignal = null;

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    requestedSignal = signal;
    log.write(`\n[diagnostics] parent received ${signal}; forwarding to child\n`);
    child.kill(signal);
  });
}

child.on("error", (error) => {
  releaseBuildLock();
  const finishedAt = new Date();
  const report = {
    ...runMetadata,
    status: "failed-to-start",
    finishedAt: finishedAt.toISOString(),
    error: error.stack ?? String(error),
  };

  writeFileSync(latestRunPath, `${JSON.stringify(report, null, 2)}\n`);
  writeCrashReport(report);
  log.end(`\n[diagnostics] failed to start: ${report.error}\n`);
  process.exitCode = 1;
});

child.on("close", (code, signal) => {
  releaseBuildLock();
  const finishedAt = new Date();
  const intentionallyStopped = Boolean(requestedSignal) && (code === 0 || signal === requestedSignal || code === null);
  const crashed = !intentionallyStopped && (code !== 0 || signal !== null);
  const report = {
    ...runMetadata,
    status: crashed ? "crashed" : intentionallyStopped ? "stopped" : "completed",
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    exitCode: code,
    signal,
    requestedSignal,
  };

  writeFileSync(latestRunPath, `${JSON.stringify(report, null, 2)}\n`);
  log.end(`\n[diagnostics] ${report.status}; exit=${code ?? "none"}; signal=${signal ?? "none"}\n`);

  if (crashed) {
    writeCrashReport(report);
    console.error(`\n[diagnostics] Crash report: ${latestCrashPath}`);
  }

  process.exitCode = intentionallyStopped ? 0 : (code ?? (signal ? 1 : 0));
});

process.on("exit", releaseBuildLock);

async function acquireBuildLock() {
  const lockPath = resolve(diagnosticsDirectory, "build.lock");
  const token = randomUUID();
  const owner = {
    token,
    pid: process.pid,
    label,
    startedAt: new Date().toISOString(),
  };
  let announcedWait = false;

  while (true) {
    try {
      writeFileSync(lockPath, `${JSON.stringify(owner, null, 2)}\n`, { flag: "wx" });
      if (announcedWait) {
        const message = "[diagnostics] build lock acquired; continuing\n";
        process.stdout.write(message);
        log.write(message);
      }

      let released = false;
      return () => {
        if (released) return;
        released = true;
        removeLockIfOwned(lockPath, token);
      };
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
    }

    const currentOwner = readLockOwner(lockPath);
    if (currentOwner && !isProcessRunning(currentOwner.pid)) {
      removeLockIfOwned(lockPath, currentOwner.token);
      continue;
    }

    // A malformed lock can only be removed after it has remained unchanged for
    // a while. This covers a process killed between creating and writing it.
    if (!currentOwner && isOlderThan(lockPath, 30_000)) {
      try {
        unlinkSync(lockPath);
      } catch (error) {
        if (error?.code !== "ENOENT") throw error;
      }
      continue;
    }

    if (!announcedWait) {
      const ownerDescription = currentOwner
        ? `${currentOwner.label ?? "another task"} (pid ${currentOwner.pid})`
        : "another task";
      const message = `[diagnostics] waiting for ${ownerDescription} to finish using dist\n`;
      process.stdout.write(message);
      log.write(message);
      announcedWait = true;
    }

    await new Promise((resolveDelay) => setTimeout(resolveDelay, 200));
  }
}

function readLockOwner(lockPath) {
  try {
    return JSON.parse(readFileSync(lockPath, "utf8"));
  } catch {
    return null;
  }
}

function removeLockIfOwned(lockPath, token) {
  try {
    if (readLockOwner(lockPath)?.token === token) unlinkSync(lockPath);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

function isProcessRunning(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error?.code === "EPERM";
  }
}

function isOlderThan(path, ageMs) {
  try {
    return Date.now() - statSync(path).mtimeMs > ageMs;
  } catch {
    return false;
  }
}

function writeCrashReport(report) {
  const logTail = readLogTail(logPath, 80);
  const reason = report.error
    ? `The command could not start: ${report.error}`
    : report.signal
      ? `The process was terminated by signal ${report.signal}.`
      : `The process exited with code ${report.exitCode}.`;

  const markdown = `# Latest crash\n\n` +
    `- Time: ${report.finishedAt}\n` +
    `- Task: ${report.label}\n` +
    `- Command: \`${report.command}\`\n` +
    `- Working directory: \`${report.cwd}\`\n` +
    `- Reason: ${reason}\n` +
    `- Full log: \`${report.logPath}\`\n\n` +
    `## Last log lines\n\n\`\`\`text\n${logTail}\n\`\`\`\n`;

  writeFileSync(latestCrashPath, markdown);
}

function readLogTail(path, maximumLines) {
  if (!existsSync(path)) return "No log output was captured.";
  return readFileSync(path, "utf8").split(/\r?\n/).slice(-maximumLines).join("\n");
}

function quoteShellArgument(value) {
  if (process.platform === "win32") {
    return `"${value.replaceAll("%", "%%").replaceAll('"', '""')}"`;
  }

  return `'${value.replaceAll("'", `'\\''`)}'`;
}

function resolveExecutionParts(parts) {
  const [command, ...args] = parts;

  // npm scripts put node_modules/.bin first on PATH. Some dependency trees
  // contain an incomplete npm shim there, so reuse the known-good parent CLI.
  if (command === "npm" && process.env.npm_execpath) {
    return [process.execPath, process.env.npm_execpath, ...args];
  }

  return parts;
}
