import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

interface RateLimitConfig {
  limit: number;
  window: number; // in seconds
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// Rate limiting groups with different limits for Hono backend
export const honoRateLimitGroups = {
  strict: { limit: 10, window: 60 },   // 10 requests per minute for AI calls
  medium: { limit: 50, window: 60 },   // 50 requests per minute for other endpoints
} as const;

export type HonoRateLimitGroup = keyof typeof honoRateLimitGroups;

/**
 * Simple in-memory rate limiter for Hono backend
 * For production, consider using Redis or KV storage
 */
class InMemoryRateLimiter {
  private requests: Map<string, number[]> = new Map();

  async checkLimit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - (config.window * 1000);
    
    // Periodic cleanup to prevent memory leaks
    if (Math.random() < 0.1) { // 10% chance to clean up on each request
      this.cleanup();
    }
    
    // Get existing requests for this identifier
    const existingRequests = this.requests.get(identifier) || [];
    
    // Filter out old requests outside the window
    const validRequests = existingRequests.filter(timestamp => timestamp > windowStart);
    
    // Add current request
    validRequests.push(now);
    
    // Update the stored requests
    this.requests.set(identifier, validRequests);
    
    const remaining = Math.max(0, config.limit - validRequests.length);
    const resetTime = Math.ceil((now + (config.window * 1000)) / 1000);

    return {
      success: validRequests.length <= config.limit,
      limit: config.limit,
      remaining,
      reset: resetTime,
    };
  }

  // Clean up old entries periodically
  cleanup() {
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);

    for (const [identifier, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(ts => ts > fiveMinutesAgo);
      if (validTimestamps.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validTimestamps);
      }
    }
  }
}

// Global rate limiter instance
const rateLimiter = new InMemoryRateLimiter();

// Note: Cleanup is handled within the checkLimit method to avoid global scope issues

/**
 * Get rate limit configuration for a specific route group
 */
export function getHonoRateLimitConfig(group: HonoRateLimitGroup): RateLimitConfig {
  return honoRateLimitGroups[group];
}

/**
 * Determine rate limit group based on Hono route path
 */
export function determineHonoRateLimitGroup(pathname: string): HonoRateLimitGroup {
  // AI-related endpoints are more expensive
  if (pathname.includes('/getTags') || pathname.includes('/getDescription')) {
    return 'strict';
  }
  
  // Default to medium for other endpoints
  return 'medium';
}

/**
 * Create rate limit identifier for Hono backend
 */
export function createHonoRateLimitIdentifier(
  pathname: string,
  ip: string,
  group?: HonoRateLimitGroup
): string {
  const actualGroup = group || determineHonoRateLimitGroup(pathname);
  return `hono:${actualGroup}:${ip}`;
}

/**
 * Hono rate limiting middleware
 */
export function honoRateLimit(group?: HonoRateLimitGroup): MiddlewareHandler {
  return async (c, next) => {
    try {
      const pathname = new URL(c.req.url).pathname;
      const actualGroup = group || determineHonoRateLimitGroup(pathname);
      const config = getHonoRateLimitConfig(actualGroup);

      // Get client IP from headers
      const ip = c.req.header("cf-connecting-ip") ||
                c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
                c.req.header("x-real-ip") ||
                "127.0.0.1";

      const identifier = createHonoRateLimitIdentifier(pathname, ip, actualGroup);
      const result = await rateLimiter.checkLimit(identifier, config);

      // Add rate limit headers
      c.header("X-RateLimit-Limit", result.limit.toString());
      c.header("X-RateLimit-Remaining", result.remaining.toString());
      c.header("X-RateLimit-Reset", result.reset.toString());

      if (!result.success) {
        throw new HTTPException(429, {
          message: "Too many requests. Try again later.",
        });
      }

      await next();
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }
      
      console.error("Rate limiting error:", error);
      // Fail open - continue with request if rate limiting fails
      await next();
    }
  };
}

/**
 * Apply rate limiting to specific routes with different groups
 */
export const strictRateLimit = honoRateLimit('strict');
export const mediumRateLimit = honoRateLimit('medium');
