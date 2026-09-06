import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Reuse a single Redis client across invocations (important in serverless —
// avoids reconnecting on every request within the same warm lambda).
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Sliding window: max 10 requests per 60 seconds, per identifier (user id).
// This is additive to the existing monthly usage cap in lib/checkUsage.js —
// this limiter protects against short bursts (e.g. a script hammering the
// endpoint), the monthly cap protects against total cost over a billing cycle.
export const generateRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  prefix: "ratelimit:generate",
});

/**
 * Checks the rate limit for a given user id.
 * Returns { success, limit, remaining, reset } — same shape as the
 * underlying Upstash Ratelimit.limit() call, so callers can use `remaining`
 * and `reset` to build a friendly error message or Retry-After header.
 */
export async function checkGenerateRateLimit(userId) {
  return generateRatelimit.limit(userId);
}