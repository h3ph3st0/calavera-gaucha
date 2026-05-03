import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { checkRateLimit as checkRateLimitMemory } from "./sanitize";

// Caché de instancias por config (max:windowSec)
const limiters = new Map<string, Ratelimit | null>();

function getUpstashLimiter(max: number, windowSec: number): Ratelimit | null {
  const key = `${max}:${windowSec}`;
  if (limiters.has(key)) return limiters.get(key)!;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    limiters.set(key, null);
    return null;
  }

  try {
    const limiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
      analytics: false,
    });
    limiters.set(key, limiter);
    return limiter;
  } catch {
    limiters.set(key, null);
    return null;
  }
}

// Usa Upstash Redis cuando UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN están seteados.
// Si no están configurados, cae en el rate limit in-memory (válido para desarrollo local).
export async function checkRateLimit(
  ip: string,
  max = 10,
  windowMs = 60_000
): Promise<{ allowed: boolean; remaining: number }> {
  const limiter = getUpstashLimiter(max, Math.round(windowMs / 1000));

  if (limiter) {
    try {
      const { success, remaining } = await limiter.limit(ip);
      return { allowed: success, remaining };
    } catch {
      // Redis caído → fallback in-memory
    }
  }

  return checkRateLimitMemory(ip, max, windowMs);
}
