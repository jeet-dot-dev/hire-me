# Authentication & Authorization System

## 🔐 Security Architecture Overview

Implemented a **comprehensive authentication and authorization system** using NextAuth.js with multiple OAuth providers, role-based access control, and secure session management for a multi-tenant recruitment platform.

## 🏗️ Authentication Flow Architecture

### Multi-Provider OAuth System
```
User Login Request
    ↓
Provider Selection (Google/GitHub/Email)
    ↓
OAuth Flow / Credential Validation
    ↓
User Creation/Retrieval
    ↓
Role Assignment (Candidate/Recruiter)
    ↓
Session Token Generation (JWT)
    ↓
Secure Session Storage
```

## 🔧 Technical Implementation

### NextAuth.js Configuration
```typescript
// lib/authConfig.ts
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
    verifyRequest: '/auth/verify-email',
  },
  
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;
        
        const { email, password } = validatedFields.data;
        const user = await getUserByEmail(email);
        
        if (!user || !user.password) return null;
        
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) return user;
        
        return null;
      }
    })
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth account linking and validation
      if (account?.provider !== "credentials") {
        return await handleOAuthSignIn(user, account, profile);
      }
      
      // Email verification for credentials
      const existingUser = await getUserByEmail(user.email);
      if (!existingUser?.emailVerified) return false;
      
      return true;
    },
    
    async session({ token, session }) {
      // Attach user data to session
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      return session;
    },
    
    async jwt({ token }) {
      // Populate JWT with user data
      if (!token.sub) return token;
      
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      
      token.role = existingUser.role;
      token.isTwoFactorEnabled = !!existingUser.isTwoFactorEnabled;
      
      return token;
    }
  },
  
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};
```

## 👥 Role-Based Access Control (RBAC)

### User Role System
```typescript
enum UserRole {
  CANDIDATE = "CANDIDATE",
  RECRUITER = "RECRUITER", 
  ADMIN = "ADMIN"
}

// Database schema
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  role          UserRole  @default(CANDIDATE)
  
  // Profile relationships based on role
  candidate     Candidate?
  recruiter     Recruiter?
  
  @@map("users")
}
```

### Permission Matrix
```typescript
const PERMISSIONS = {
  CANDIDATE: [
    'profile:read',
    'profile:update',
    'jobs:browse',
    'applications:create',
    'applications:read',
    'interviews:attend'
  ],
  
  RECRUITER: [
    'jobs:create',
    'jobs:update', 
    'jobs:delete',
    'applications:read',
    'applications:update',
    'interviews:schedule',
    'candidates:search'
  ],
  
  ADMIN: [
    '*' // All permissions
  ]
} as const;
```

### Route Protection Middleware
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  
  // Protect candidate routes
  if (pathname.startsWith('/candidate')) {
    if (!token) return redirectToLogin(req);
    if (token.role !== 'CANDIDATE') return redirectToUnauthorized(req);
  }
  
  // Protect recruiter routes  
  if (pathname.startsWith('/recruiter')) {
    if (!token) return redirectToLogin(req);
    if (token.role !== 'RECRUITER') return redirectToUnauthorized(req);
  }
  
  // API route protection
  if (pathname.startsWith('/api')) {
    return await protectAPIRoutes(req, token);
  }
  
  return NextResponse.next();
}
```

## 🔒 Security Features

### Password Security
```typescript
// Secure password hashing
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string, 
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Password strength validation
export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain uppercase letter")
  .regex(/[a-z]/, "Password must contain lowercase letter") 
  .regex(/\d/, "Password must contain a number")
  .regex(/[^A-Za-z0-9]/, "Password must contain special character");
```

### Email Verification System
```typescript
// Email verification token generation
export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour
  
  // Remove existing tokens
  await db.verificationToken.deleteMany({ where: { email } });
  
  // Create new token
  const verificationToken = await db.verificationToken.create({
    data: { email, token, expires }
  });
  
  return verificationToken;
}

// Email verification process
export async function verifyEmail(token: string) {
  const existingToken = await getVerificationTokenByToken(token);
  
  if (!existingToken) return { error: "Token does not exist!" };
  if (new Date(existingToken.expires) < new Date()) {
    return { error: "Token has expired!" };
  }
  
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "Email does not exist!" };
  
  await db.user.update({
    where: { id: existingUser.id },
    data: { 
      emailVerified: new Date(),
      email: existingToken.email, // Handle email change
    }
  });
  
  await db.verificationToken.delete({
    where: { id: existingToken.id }
  });
  
  return { success: "Email verified!" };
}
```

### Two-Factor Authentication (2FA)
```typescript
// 2FA setup and verification
export async function generateTwoFactorToken(userId: string) {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  
  const existingToken = await getTwoFactorTokenByUserId(userId);
  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id }
    });
  }
  
  const twoFactorToken = await db.twoFactorToken.create({
    data: { userId, token, expires }
  });
  
  return twoFactorToken;
}

export async function verifyTwoFactorToken(userId: string, token: string) {
  const twoFactorToken = await getTwoFactorTokenByUserId(userId);
  
  if (!twoFactorToken || twoFactorToken.token !== token) {
    return { error: "Invalid code!" };
  }
  
  if (new Date(twoFactorToken.expires) < new Date()) {
    return { error: "Code expired!" };
  }
  
  await db.twoFactorToken.delete({
    where: { id: twoFactorToken.id }
  });
  
  return { success: "Code verified!" };
}
```

## 🔄 OAuth Integration

### Google OAuth Implementation
```typescript
// OAuth account linking
async function handleOAuthSignIn(
  user: any, 
  account: any, 
  profile: any
) {
  const existingUser = await getUserByEmail(user.email);
  
  if (existingUser && !existingUser.emailVerified) {
    // Auto-verify OAuth emails
    await db.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date() }
    });
  }
  
  // Link OAuth account
  if (existingUser && account) {
    await linkAccount({
      userId: existingUser.id,
      type: account.type,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      access_token: account.access_token,
      refresh_token: account.refresh_token,
      expires_at: account.expires_at,
    });
  }
  
  return true;
}
```

### GitHub OAuth Implementation
```typescript
// GitHub profile data extraction
async function extractGitHubProfile(profile: any) {
  return {
    name: profile.name || profile.login,
    email: profile.email,
    image: profile.avatar_url,
    // Additional GitHub-specific data
    githubUsername: profile.login,
    publicRepos: profile.public_repos,
    followers: profile.followers,
  };
}
```

## 🛡️ Session Management

### Secure Session Configuration
```typescript
// Session security settings
const sessionConfig = {
  strategy: "jwt" as const,
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60,   // 24 hours
  
  // Secure cookie settings
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  }
};
```

### Session Validation
```typescript
// Server-side session validation
export async function getServerSession(req?: any) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.id) return null;
    
    // Verify user still exists and is active
    const user = await getUserById(session.user.id);
    if (!user || user.deletedAt) return null;
    
    return session;
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}
```

## 🔍 Security Monitoring

### Login Activity Tracking
```typescript
// Track login attempts and patterns
export async function logAuthEvent(
  userId: string | null,
  event: AuthEvent,
  metadata: Record<string, any> = {}
) {
  await db.authLog.create({
    data: {
      userId,
      event,
      metadata,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      timestamp: new Date()
    }
  });
}

enum AuthEvent {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILED = "LOGIN_FAILED", 
  LOGOUT = "LOGOUT",
  PASSWORD_RESET = "PASSWORD_RESET",
  EMAIL_VERIFIED = "EMAIL_VERIFIED",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED"
}
```

### Rate Limiting for Auth Endpoints
```typescript
// Specific rate limits for authentication
const authRateLimits = {
  '/api/auth/signin': { limit: 5, window: 60 },      // 5 attempts/minute
  '/api/auth/register': { limit: 3, window: 60 },    // 3 registrations/minute
  '/api/auth/reset': { limit: 3, window: 300 },      // 3 resets/5 minutes
  '/api/auth/verify': { limit: 10, window: 60 },     // 10 verifications/minute
};
```

## 🎯 User Experience Enhancements

### Seamless Registration Flow
```typescript
// Intelligent role detection during registration
export async function determineUserRole(
  email: string, 
  registrationContext?: any
): Promise<UserRole> {
  // Check email domain patterns
  const corporatePatterns = [
    /@(company|corp|inc|ltd|llc)\./,
    /@(hr|talent|recruiting)\./
  ];
  
  if (corporatePatterns.some(pattern => pattern.test(email))) {
    return UserRole.RECRUITER;
  }
  
  // Default to candidate
  return UserRole.CANDIDATE;
}
```

### Social Login Benefits
```typescript
// Enhanced profile data from OAuth
async function enrichProfileFromOAuth(
  user: User, 
  account: Account, 
  profile: any
) {
  const enrichedData: any = {};
  
  if (account.provider === 'google') {
    enrichedData.image = profile.picture;
    enrichedData.emailVerified = new Date(); // Auto-verify Google emails
  }
  
  if (account.provider === 'github') {
    enrichedData.image = profile.avatar_url;
    enrichedData.githubProfile = profile.html_url;
  }
  
  return enrichedData;
}
```

## 📊 Authentication Analytics

### Security Metrics
```typescript
interface AuthMetrics {
  totalUsers: number;
  activeUsers: number;
  oauthVsCredentials: {
    oauth: number;
    credentials: number;
  };
  failedLogins: number;
  passwordResets: number;
  emailVerifications: number;
}

// Generate auth dashboard data
export async function getAuthMetrics(
  timeframe: 'day' | 'week' | 'month'
): Promise<AuthMetrics> {
  const since = getTimeframeSince(timeframe);
  
  return {
    totalUsers: await db.user.count(),
    activeUsers: await db.user.count({
      where: { lastLoginAt: { gte: since } }
    }),
    // ... more metrics
  };
}
```

---

**Interview Summary**: *"I implemented a comprehensive authentication system using NextAuth.js with multiple OAuth providers, JWT sessions, role-based access control, email verification, two-factor authentication, and security monitoring for a secure multi-tenant platform."*
