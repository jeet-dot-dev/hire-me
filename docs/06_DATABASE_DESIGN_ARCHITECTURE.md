# Database Design & Data Architecture

## 🗄️ Database Architecture Overview

Designed a **comprehensive PostgreSQL database schema** with Prisma ORM to support a full-featured job recruitment platform with complex relationships and optimized query performance.

## 🎯 Core Design Principles

### Scalability First
- **Normalized Schema**: Eliminate data redundancy while maintaining performance
- **Strategic Indexing**: Optimized for common query patterns
- **Relationship Optimization**: Efficient joins and data fetching
- **Future-Proof Structure**: Extensible for new features

### Data Integrity
- **Foreign Key Constraints**: Maintain referential integrity
- **Type Safety**: Prisma provides compile-time type checking
- **Validation Rules**: Database-level and application-level validation
- **Soft Deletes**: Preserve data for audit trails

## 📊 Entity Relationship Design

### Core Entity Relationships
```
User (1:1) ─┬─ Candidate
            └─ Recruiter

Company (1:N) ── Job (N:M) ── Application ── Candidate
                  │
                  └─ (1:N) ── Interview Session
```

## 🔧 Schema Implementation

### User Management System
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Authentication relationships
  accounts      Account[]
  sessions      Session[]
  
  // Profile relationships (one-to-one)
  candidate     Candidate?
  recruiter     Recruiter?
  
  @@map("users")
}
```

### Candidate Profile System
```prisma
model Candidate {
  id          String   @id @default(cuid())
  userId      String   @unique
  firstName   String
  lastName    String
  email       String
  phone       String?
  about       String?
  resumeUrl   String?
  location    String?
  experience  Int?     // Years of experience
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relationships
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  applications Application[]
  education   Education[]
  skills      CandidateSkill[]
  wishlist    Wishlist[]
  interviews  Interview[]
  
  @@map("candidates")
}
```

### Job Management System
```prisma
model Job {
  id           String      @id @default(cuid())
  title        String
  description  String
  requirements String?
  location     String?
  jobType      JobType     @default(FULL_TIME)
  workMode     WorkMode    @default(OFFICE)
  salaryMin    Int?
  salaryMax    Int?
  currency     String      @default("USD")
  status       JobStatus   @default(ACTIVE)
  
  // Relationships
  companyId    String
  company      Company     @relation(fields: [companyId], references: [id])
  recruiterId  String
  recruiter    Recruiter   @relation(fields: [recruiterId], references: [id])
  
  // Related entities
  applications Application[]
  skills       JobSkill[]
  wishlist     Wishlist[]
  
  // Timestamps
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  expiresAt    DateTime?
  
  @@map("jobs")
}

enum JobType {
  FULL_TIME
  PART_TIME
  CONTRACT
  INTERNSHIP
  FREELANCE
}

enum WorkMode {
  OFFICE
  REMOTE
  HYBRID
}

enum JobStatus {
  DRAFT
  ACTIVE
  PAUSED
  CLOSED
  EXPIRED
}
```

### Application Tracking System
```prisma
model Application {
  id          String            @id @default(cuid())
  status      ApplicationStatus @default(PENDING)
  coverLetter String?
  notes       String?           // Internal recruiter notes
  
  // Relationships
  candidateId String
  candidate   Candidate         @relation(fields: [candidateId], references: [id])
  jobId       String
  job         Job               @relation(fields: [jobId], references: [id])
  
  // Related processes
  interviews  Interview[]
  
  // Timestamps
  appliedAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  
  // Composite unique constraint
  @@unique([candidateId, jobId])
  @@map("applications")
}

enum ApplicationStatus {
  PENDING
  REVIEWING
  INTERVIEW_SCHEDULED
  INTERVIEWED
  OFFER_MADE
  HIRED
  REJECTED
  WITHDRAWN
}
```

### Interview Management
```prisma
model Interview {
  id            String          @id @default(cuid())
  type          InterviewType
  status        InterviewStatus @default(SCHEDULED)
  scheduledAt   DateTime?
  duration      Int?            // Minutes
  location      String?         // Physical or video link
  notes         String?
  feedback      String?
  rating        Int?            // 1-5 scale
  
  // Relationships
  applicationId String
  application   Application     @relation(fields: [applicationId], references: [id])
  candidateId   String
  candidate     Candidate       @relation(fields: [candidateId], references: [id])
  
  // AI Interview specific
  aiSessionData Json?           // Store AI interview session data
  
  // Timestamps
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  
  @@map("interviews")
}

enum InterviewType {
  PHONE_SCREENING
  VIDEO_CALL
  IN_PERSON
  AI_INTERVIEW
  TECHNICAL_TEST
}

enum InterviewStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}
```

## 🔍 Advanced Features

### Skills Management System
```prisma
model Skill {
  id          String          @id @default(cuid())
  name        String          @unique
  category    SkillCategory
  description String?
  
  // Relationships
  candidates  CandidateSkill[]
  jobs        JobSkill[]
  
  @@map("skills")
}

model CandidateSkill {
  id          String        @id @default(cuid())
  level       SkillLevel    @default(BEGINNER)
  yearsUsed   Int?
  
  candidateId String
  candidate   Candidate     @relation(fields: [candidateId], references: [id])
  skillId     String
  skill       Skill         @relation(fields: [skillId], references: [id])
  
  @@unique([candidateId, skillId])
  @@map("candidate_skills")
}

model JobSkill {
  id          String     @id @default(cuid())
  required    Boolean    @default(false)
  importance  Int        @default(3) // 1-5 scale
  
  jobId       String
  job         Job        @relation(fields: [jobId], references: [id])
  skillId     String
  skill       Skill      @relation(fields: [skillId], references: [id])
  
  @@unique([jobId, skillId])
  @@map("job_skills")
}

enum SkillCategory {
  PROGRAMMING
  FRAMEWORK
  DATABASE
  CLOUD
  DEVOPS
  DESIGN
  SOFT_SKILL
  METHODOLOGY
}

enum SkillLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}
```

### Education & Experience Tracking
```prisma
model Education {
  id          String         @id @default(cuid())
  institution String
  degree      String
  field       String?
  startDate   DateTime
  endDate     DateTime?
  gpa         Float?
  description String?
  
  candidateId String
  candidate   Candidate      @relation(fields: [candidateId], references: [id])
  
  @@map("education")
}

model Experience {
  id          String    @id @default(cuid())
  company     String
  position    String
  description String?
  startDate   DateTime
  endDate     DateTime?
  isCurrent   Boolean   @default(false)
  
  candidateId String
  candidate   Candidate @relation(fields: [candidateId], references: [id])
  
  @@map("experience")
}
```

## 🚀 Performance Optimizations

### Strategic Indexing
```prisma
model Job {
  // ... other fields
  
  @@index([status, createdAt])     // Job listings
  @@index([companyId, status])     // Company job management
  @@index([location, jobType])     // Location-based search
  @@index([salaryMin, salaryMax])  // Salary range filtering
}

model Application {
  // ... other fields
  
  @@index([candidateId, appliedAt]) // Candidate application history
  @@index([jobId, status])          // Job application tracking
  @@index([status, appliedAt])      // Status-based filtering
}

model Candidate {
  // ... other fields
  
  @@index([location])              // Location-based matching
  @@index([experience])            // Experience level filtering
  @@index([updatedAt])             // Recent activity tracking
}
```

### Query Optimization Patterns
```typescript
// Efficient job search with related data
const searchJobs = await prisma.job.findMany({
  where: {
    status: 'ACTIVE',
    title: { contains: searchTerm, mode: 'insensitive' },
    location: { in: locations },
  },
  include: {
    company: {
      select: { name: true, logo: true }
    },
    skills: {
      include: { skill: true }
    },
    _count: {
      select: { applications: true }
    }
  },
  orderBy: { createdAt: 'desc' },
  take: 20,
  skip: page * 20
});
```

## 🔐 Data Security & Privacy

### Soft Delete Implementation
```prisma
model User {
  // ... other fields
  deletedAt   DateTime?
  
  @@map("users")
}

// Custom delete function
async function softDeleteUser(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() }
  });
}
```

### Data Encryption (Sensitive Fields)
```typescript
// Encrypt sensitive data before storage
const encryptedData = {
  phone: encrypt(candidateData.phone),
  ssn: encrypt(candidateData.ssn),
  salary: encrypt(candidateData.salary)
};
```

## 📊 Analytics & Reporting Schema

### Application Analytics
```prisma
model ApplicationMetrics {
  id          String   @id @default(cuid())
  jobId       String
  date        DateTime @default(now())
  
  // Daily metrics
  views       Int      @default(0)
  applications Int     @default(0)
  interviews  Int      @default(0)
  hires       Int      @default(0)
  
  @@unique([jobId, date])
  @@map("application_metrics")
}
```

### User Activity Tracking
```prisma
model ActivityLog {
  id        String      @id @default(cuid())
  userId    String
  action    String      // 'job_view', 'application_submit', etc.
  entityId  String?     // ID of related entity
  metadata  Json?       // Additional context data
  timestamp DateTime    @default(now())
  ipAddress String?
  userAgent String?
  
  user      User        @relation(fields: [userId], references: [id])
  
  @@index([userId, timestamp])
  @@index([action, timestamp])
  @@map("activity_logs")
}
```

## 🔄 Migration Strategy

### Version Control
```typescript
// Database migrations with Prisma
npx prisma migrate dev --name add_interview_system
npx prisma migrate deploy // Production deployment
```

### Data Seeding
```typescript
// prisma/seed.ts
async function seedDatabase() {
  // Create default skills
  const skills = await prisma.skill.createMany({
    data: [
      { name: 'JavaScript', category: 'PROGRAMMING' },
      { name: 'React', category: 'FRAMEWORK' },
      { name: 'Node.js', category: 'PROGRAMMING' },
      // ... more skills
    ]
  });
  
  // Create sample companies
  const companies = await prisma.company.createMany({
    data: [
      { name: 'TechCorp', industry: 'Technology' },
      { name: 'StartupInc', industry: 'Startup' },
      // ... more companies
    ]
  });
}
```

## 📈 Scalability Considerations

### Read Replicas Strategy
```typescript
// Separate read/write connections
const writeClient = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_WRITE_URL } }
});

const readClient = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_READ_URL } }
});
```

### Connection Pooling
```typescript
// Optimized connection configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
      connectionLimit: 20,
      poolTimeout: 30
    }
  }
});
```

## 🔍 Data Validation

### Schema-Level Validation
```prisma
model User {
  email    String @unique @db.VarChar(255)
  name     String @db.VarChar(100)
  phone    String? @db.VarChar(20)
  
  @@constraint("email_format", check: "email ~ '^[^@]+@[^@]+\\.[^@]+$'")
}
```

### Application-Level Validation
```typescript
// Zod schemas for type-safe validation
export const candidateProfileSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/).optional(),
  experience: z.number().min(0).max(50).optional()
});
```

---

**Interview Summary**: *"I designed a comprehensive PostgreSQL database schema with Prisma ORM featuring normalized relationships, strategic indexing, soft deletes, and optimized query patterns to support a scalable job recruitment platform with complex many-to-many relationships."*
