import { redis } from "@/lib/rate-limit/redis";

export interface RateLimitConfig {
  limit: number;
  window: number; // in seconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// Rate limiting groups with different limits
export const rateLimitGroups = {
  strict: { limit: 5, window: 60 },    // 5 requests per minute
  medium: { limit: 30, window: 60 },   // 30 requests per minute  
  light: { limit: 100, window: 60 },   // 100 requests per minute
} as const;

export type RateLimitGroup = keyof typeof rateLimitGroups;

/**
 * Sliding window rate limiter using Redis
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  const window = config.window * 1000; // Convert to milliseconds
  const windowStart = now - window;

  try {
    // Use Redis pipeline for atomic operations
    const pipeline = redis.pipeline();
    
    // Remove old entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart);
    
    // Count current requests in window
    pipeline.zcard(key);
    
    // Add current request
    pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });
    
    // Set expiry on the key
    pipeline.expire(key, config.window + 1);
    
    const results = await pipeline.exec();
    
    if (!results) {
      throw new Error("Redis pipeline failed");
    }

    const currentCount = (results[1] as number) || 0;
    const remaining = Math.max(0, config.limit - currentCount - 1);
    const resetTime = Math.ceil((now + window) / 1000);

    return {
      success: currentCount < config.limit,
      limit: config.limit,
      remaining,
      reset: resetTime,
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    // Fail open - allow request if Redis is down
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: Math.ceil((now + window) / 1000),
    };
  }
}

/**
 * Get rate limit configuration for a specific route group
 */
export function getRateLimitConfig(group: RateLimitGroup): RateLimitConfig {
  return rateLimitGroups[group];
}

/**
 * Determine rate limit group based on API route path
 */
export function determineRateLimitGroup(pathname: string): RateLimitGroup {
  // Strict group - expensive, sensitive, or security-critical endpoints
  const strictPatterns = [
    '/api/auth/register',
    '/api/auth/login',
    '/api/auth/update-password',
    '/api/auth/forget-password',
    '/api/interview/chat',
    '/api/interview/stt',
    '/api/extractResumeText',
    '/api/application/resume',
    '/api/r2/',
  ];

  // Medium group - write operations or moderately costly requests  
  const mediumPatterns = [
    '/api/application/create',
    '/api/application/status',
    '/api/candidate/profile',
    '/api/candidate/wishlist',
    '/api/recruiter/job/create',
    '/api/recruiter/job/[id]/edit',
    '/api/recruiter/job/[id]/delete',
    '/api/interview/save',
    '/api/interview/start',
    '/api/jobs/status',
  ];

  // Check for strict patterns
  for (const pattern of strictPatterns) {
    if (pathname.startsWith(pattern)) {
      return 'strict';
    }
  }

  // Check for medium patterns
  for (const pattern of mediumPatterns) {
    if (pathname.startsWith(pattern)) {
      return 'medium';
    }
  }

  // Default to light group for all other API routes
  return 'light';
}

/**
 * Create rate limit identifier based on user authentication status
 */
export function createRateLimitIdentifier(
  pathname: string,
  ip: string,
  userId?: string,
  group?: RateLimitGroup
): string {
  const actualGroup = group || determineRateLimitGroup(pathname);
  
  // Use user ID if authenticated, otherwise fallback to IP
  const identifier = userId || ip;
  
  return `${actualGroup}:${identifier}`;
}

/**
 * Create rate limit headers for HTTP responses
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}

/**
 * Create 429 Too Many Requests response with rate limit headers
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({ 
      error: "Too many requests. Try again later.",
      retryAfter: result.reset 
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...createRateLimitHeaders(result),
      },
    }
  );
}

/**
 * Environment variable validation for rate limiting
 */
export function validateRateLimitEnvironment(): void {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("⚠️ Redis environment variables not found. Rate limiting will fail open.");
  }
}
