# API Security & Rate Limiting Implementation

## 🎯 Overview

Implemented enterprise-grade API security with **intelligent rate limiting** across both Next.js and Hono backends to protect against abuse, ensure fair resource allocation, and maintain system stability.

## 🛡️ Security Architecture

### Multi-Layer Protection Strategy
```
Request → IP Detection → User Identification → Rate Limit Check → API Endpoint
          ↓              ↓                     ↓
    Headers Parsed → Auth Token → Redis/Memory → Response Headers
```

## 🔧 Implementation Details

### Next.js Backend Rate Limiting

**Location**: `middleware.ts` (Global Middleware)
**Storage**: Redis (Upstash) with sliding window algorithm
**Scope**: All `/api/*` routes

```typescript
// Intelligent user identification
const identifier = token?.sub 
  ? `${group}:user:${token.sub}`    // Authenticated users
  : `${group}:ip:${clientIP}`;      // Anonymous users

const result = await rateLimit(identifier, config);
```

### Hono.js Backend Rate Limiting

**Location**: `src/middlewares/rateLimit.ts`
**Storage**: In-memory with periodic cleanup
**Scope**: AI-powered endpoints

```typescript
// Middleware application
app.use('/api/v1/*', honoRateLimit('strict'));
```

## 📊 Rate Limiting Tiers

### 🔴 Strict Tier (Maximum Protection)
**Limits**: 5 requests/minute (Next.js) | 10 requests/minute (Hono)

**Protected Endpoints**:
- Authentication operations (`/api/auth/*`)
- AI-powered features (`/getTags`, `/getDescription`)
- File operations (`/api/r2/*`, `/extractResumeText`)
- Interview chat (`/api/interview/chat`)

**Rationale**: Expensive operations requiring maximum protection

### 🟡 Medium Tier (Balanced Protection)
**Limits**: 30 requests/minute

**Protected Endpoints**:
- Job management (`/api/recruiter/job/*`)
- Application submissions (`/api/application/create`)
- Profile updates (`/api/candidate/profile`)
- Interview operations (`/api/interview/save`)

**Rationale**: Write operations with moderate resource usage

### 🟢 Light Tier (Basic Protection)
**Limits**: 100 requests/minute

**Protected Endpoints**:
- Search operations (`/api/jobs/search`)
- Data retrieval (`/api/jobs/load-more`)
- All other API endpoints

**Rationale**: Read operations with minimal resource impact

## 🎯 Smart Identification Strategy

### Authenticated Users
```typescript
Identifier: `{tier}:user:{nextauth_user_id}`
Example: "strict:user:clx1234567890"
```
**Benefits**:
- Per-user limits prevent sharing violations
- Personalized rate limiting
- Better user experience tracking

### Anonymous Users
```typescript
Identifier: `{tier}:ip:{client_ip}`
Example: "medium:ip:192.168.1.100"
```
**Benefits**:
- Basic IP-based protection
- Prevents anonymous abuse
- Supports public endpoints

## 🌐 IP Detection Logic

### Priority-Based Header Detection
```typescript
const clientIP = 
  req.headers.get("cf-connecting-ip") ||          // Cloudflare
  req.headers.get("x-forwarded-for")?.split(",")[0] || // Load Balancers
  req.headers.get("x-real-ip") ||                 // Reverse Proxies
  req.headers.get("x-client-ip") ||               // Various Proxies
  "127.0.0.1";                                   // Fallback
```

## 📡 Response Headers

### Standard Rate Limit Headers
```http
X-RateLimit-Limit: 100          # Maximum requests in window
X-RateLimit-Remaining: 87       # Requests remaining
X-RateLimit-Reset: 1693123200   # Unix timestamp for reset
```

### Rate Limited Response (429)
```json
{
  "error": "Too many requests. Try again later.",
  "retryAfter": 1693123200
}
```

## ⚡ Performance Optimizations

### Redis Sliding Window (Next.js)
```typescript
// Atomic Redis operations with pipeline
const pipeline = redis.pipeline();
pipeline.zremrangebyscore(identifier, 0, now - windowSize);
pipeline.zcard(identifier);
pipeline.zadd(identifier, now, `${now}-${Math.random()}`);
pipeline.expire(identifier, Math.ceil(windowSize / 1000));
```

### In-Memory Cleanup (Hono)
```typescript
// Periodic cleanup every 5 minutes
setInterval(() => {
  const cutoff = Date.now() - windowSize;
  for (const [key, requests] of store.entries()) {
    store.set(key, requests.filter(time => time > cutoff));
  }
}, 5 * 60 * 1000);
```

## 🚨 Error Handling & Resilience

### Fail-Open Strategy
```typescript
try {
  const result = await rateLimit(identifier, config);
  if (!result.success) {
    return new Response("Too Many Requests", { status: 429 });
  }
} catch (error) {
  console.error("Rate limit error:", error);
  // Continue processing - availability over strict limiting
}
```

### Monitoring & Logging
- Rate limit violations logged with context
- Redis connection failures tracked
- Performance metrics collected

## 🔄 Configuration Management

### Environment Variables
```env
# Redis Configuration (Next.js)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# NextAuth (User Identification)
NEXTAUTH_SECRET=your-secret-key
```

### Rate Limit Configuration
```typescript
export const rateLimitGroups = {
  strict: { limit: 5, window: 60 },     // 5 req/min
  medium: { limit: 30, window: 60 },    // 30 req/min
  light: { limit: 100, window: 60 },    // 100 req/min
} as const;
```

## 📋 Testing Strategy

### Automated Testing
```bash
# Rate limit testing script
chmod +x test-rate-limits.sh
./test-rate-limits.sh
```

### Expected Behavior
1. **First requests**: Success (200/201)
2. **Approaching limit**: Decreasing X-RateLimit-Remaining
3. **Exceeded limit**: 429 status with retry information
4. **After window**: Normal operation resumed

## 🚀 Production Considerations

### Next.js (Production Ready)
- ✅ Redis-based persistent storage
- ✅ Atomic operations prevent race conditions
- ✅ Automatic cleanup and expiry

### Hono.js (Recommended Upgrades)
- ⚠️ Replace in-memory with Redis/Cloudflare KV
- ⚠️ Add distributed rate limiting
- ⚠️ Implement rate limit analytics

## 📈 Monitoring & Analytics

### Key Metrics
- Rate limit hit rate by endpoint
- False positive detection
- System performance impact
- User experience metrics

### Alerting
- High rate limit violation rates
- Redis connection issues
- Unusual traffic patterns

---

**Interview Summary**: *"I implemented a sophisticated multi-tier rate limiting system that intelligently identifies users, uses different limits for different endpoint types, stores data in Redis for persistence, and gracefully handles failures while maintaining system availability."*
