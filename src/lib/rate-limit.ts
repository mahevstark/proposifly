/** Simple in-memory rate limiter using sliding window */
const requests = new Map<string, number[]>();

// Clean up old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  requests.forEach((timestamps, key) => {
    const valid = timestamps.filter((t) => now - t < 60000);
    if (valid.length === 0) requests.delete(key);
    else requests.set(key, valid);
  });
}, 5 * 60 * 1000);

/**
 * Check if a request should be rate limited
 * @param key - unique identifier (IP or user ID)
 * @param maxRequests - max requests per window (default 10)
 * @param windowMs - time window in ms (default 60s)
 * @returns true if rate limited
 */
export function isRateLimited(
  key: string,
  maxRequests = 10,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const timestamps = requests.get(key) || [];
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= maxRequests) {
    return true;
  }

  valid.push(now);
  requests.set(key, valid);
  return false;
}
