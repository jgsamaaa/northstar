export type ChatRateLimitOptions = {
  windowMs: number;
  maxRequests: number;
  maxEntries: number;
};

type RateEntry = { count: number; resetAt: number };

export type ChatRateLimitResult = {
  limited: boolean;
  retryAfterSeconds: number;
};

export function normalizeClientKey(value: string | null | undefined): string {
  const firstForwardedValue = (value ?? "").split(",", 1)[0]?.trim().toLowerCase() ?? "";
  if (!firstForwardedValue) return "unknown";
  return firstForwardedValue.slice(0, 128);
}

export function createInMemoryChatRateLimiter(options: ChatRateLimitOptions) {
  const entries = new Map<string, RateEntry>();

  function removeExpired(now: number) {
    for (const [key, entry] of entries) {
      if (entry.resetAt <= now) entries.delete(key);
    }
  }

  function makeRoom(now: number) {
    removeExpired(now);
    while (entries.size >= options.maxEntries) {
      const oldestKey = entries.keys().next().value as string | undefined;
      if (oldestKey === undefined) break;
      entries.delete(oldestKey);
    }
  }

  return {
    consume(key: string, now = Date.now()): ChatRateLimitResult {
      removeExpired(now);
      const existing = entries.get(key);
      if (!existing) {
        makeRoom(now);
        entries.set(key, { count: 1, resetAt: now + options.windowMs });
        return { limited: false, retryAfterSeconds: 0 };
      }
      existing.count += 1;
      if (existing.count <= options.maxRequests) return { limited: false, retryAfterSeconds: 0 };
      return {
        limited: true,
        retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1_000)),
      };
    },

    entryCount() {
      return entries.size;
    },
  };
}
