import { spawn } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
