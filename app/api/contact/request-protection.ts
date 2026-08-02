export type ContactProtectionOptions = {
  windowMs: number;
  maxRequests: number;
  maxEntries: number;
};

export type ContactProtection = {
  isRateLimited(key: string, now?: number): boolean;
  reserveDuplicate(key: string, now?: number): boolean;
  releaseDuplicate(key: string): void;
  entryCount(): number;
};

type RateEntry = { count: number; resetAt: number };

export async function readBoundedUtf8Body(
  request: Pick<Request, "body" | "headers">,
  maxBytes: number,
): Promise<string | null> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null) {
    const parsedLength = Number(declaredLength);
    if (!Number.isSafeInteger(parsedLength) || parsedLength < 0 || parsedLength > maxBytes) return null;
  }
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(body);
}

export function createInMemoryContactProtection(options: ContactProtectionOptions): ContactProtection {
  const attempts = new Map<string, RateEntry>();
  const reservations = new Map<string, number>();

  function removeExpired(now: number) {
    for (const [key, entry] of attempts) if (entry.resetAt <= now) attempts.delete(key);
    for (const [key, expiresAt] of reservations) if (expiresAt <= now) reservations.delete(key);
  }

  function removeOldestEntry() {
    const attemptKey = attempts.keys().next().value as string | undefined;
    if (attemptKey !== undefined) {
      attempts.delete(attemptKey);
      return;
    }
    const reservationKey = reservations.keys().next().value as string | undefined;
    if (reservationKey !== undefined) reservations.delete(reservationKey);
  }

  function makeRoom(now: number) {
    removeExpired(now);
    while (attempts.size + reservations.size >= options.maxEntries) removeOldestEntry();
  }

  return {
    isRateLimited(key, now = Date.now()) {
      removeExpired(now);
      const existing = attempts.get(key);
      if (!existing) {
        makeRoom(now);
        attempts.set(key, { count: 1, resetAt: now + options.windowMs });
        return false;
      }
      existing.count += 1;
      return existing.count > options.maxRequests;
    },

    reserveDuplicate(key, now = Date.now()) {
      removeExpired(now);
      if (reservations.has(key)) return false;
      makeRoom(now);
      reservations.set(key, now + options.windowMs);
      return true;
    },

    releaseDuplicate(key) {
      reservations.delete(key);
    },

    entryCount() {
      return attempts.size + reservations.size;
    },
  };
}

export async function withDuplicateReservation(
  protection: ContactProtection,
  key: string,
  operation: () => Promise<boolean>,
  now = Date.now(),
): Promise<"success" | "duplicate" | "failed"> {
  if (!protection.reserveDuplicate(key, now)) return "duplicate";
  try {
    if (await operation()) return "success";
  } catch {
    // Provider details are intentionally not propagated through this boundary.
  }
  protection.releaseDuplicate(key);
  return "failed";
}
