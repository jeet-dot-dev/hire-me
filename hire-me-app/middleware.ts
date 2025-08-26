import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { 
  rateLimit, 
  createRateLimitIdentifier, 
  determineRateLimitGroup, 
  getRateLimitConfig,
  createRateLimitResponse,
  createRateLimitHeaders
} from "@/lib/rate-limit/rateLimit";

const CANDIDATE_ROUTES = ["/candidate"];
const RECRUITER_ROUTES = ["/recruiter"];
const AUTH_ROUTES = ["/auth/login","/auth/register"] ;

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // 🔒 Rate limiting for all /api routes
    if (pathname.startsWith("/api")) {
        try {
            // Get client IP - try different headers for various deployment environments
            const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                      req.headers.get("x-real-ip") ||
                      req.headers.get("cf-connecting-ip") ||
                      req.headers.get("x-client-ip") ||
                      "127.0.0.1";

            // Determine rate limit group and configuration
            const group = determineRateLimitGroup(pathname);
            const config = getRateLimitConfig(group);

            // Create identifier (user-based if authenticated, IP-based if not)
            const identifier = createRateLimitIdentifier(
                pathname,
                ip,
                token?.sub, // NextAuth user ID
                group
            );

            // Check rate limit
            const result = await rateLimit(identifier, config);

            // If rate limit exceeded, return 429 response
            if (!result.success) {
                return createRateLimitResponse(result);
            }

            // Continue with the request but add rate limit headers
            const response = NextResponse.next();
            const headers = createRateLimitHeaders(result);
            
            Object.entries(headers).forEach(([key, value]) => {
                response.headers.set(key, value);
            });

            return response;

        } catch (error) {
            console.error("Rate limiting error:", error);
            // Fail open - continue with request if rate limiting fails
        }
    }

    // Helper flags for non-API routes
    const isAuthed = !!token;
    const isCandidate = token?.role === "CANDIDATE";
    const isRecruiter = token?.role === "RECRUITER";

    /* ---------- unauthenticated redirects ---------- */
    if (!isAuthed && (pathname.startsWith("/candidate") || pathname.startsWith("/recruiter"))) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
    /* ---------- role‑based redirects ---------- */
    if (isCandidate && RECRUITER_ROUTES.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/candidate/dashboard", req.url))
    }
    
    if (isRecruiter && CANDIDATE_ROUTES.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/recruiter/dashboard", req.url))
    }
    
    /* ---------- prevent authed users visiting /login or /register ---------- */
    if (isAuthed && AUTH_ROUTES.includes(pathname)) {
        return NextResponse.redirect(new URL("/extra/redirect-me", req.url));
    }
    
    return NextResponse.next();
}

export const config = {
  // run on every route including API routes, but exclude _next/static, images, etc.
  matcher: ["/((?!_next|.*\\..*).*)"],
};