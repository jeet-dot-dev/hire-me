-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('Remote', 'Onside', 'Hybrid');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'close');

-- CreateEnum
CREATE TYPE "JobLevel" AS ENUM ('INTERN', 'ENTRY', 'MID', 'SENIOR', 'LEAD');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('Pending', 'Accepted', 'Rejected');

-- CreateTable
CREATE TABLE "Recruiter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Recruiter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expireAt" TIMESTAMP(3),
    "jobTitle" VARCHAR(100) NOT NULL,
    "companyName" VARCHAR(100) NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "salary" VARCHAR(100),
    "jobType" "JobType" NOT NULL,
    "description" TEXT NOT NULL,
    "skillsRequired" TEXT[],
    "interviewDuration" INTEGER NOT NULL,
    "interviewInstruction" TEXT,
    "tags" TEXT[],
    "status" "Status" NOT NULL,
    "industry" TEXT,
    "jobLevel" "JobLevel",
    "experienceNeeded" INTEGER,
    "contact" TEXT,
    "shareLink" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ApplicationStatus" NOT NULL,
    "feedback" VARCHAR(500),

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recruiter_userId_key" ON "Recruiter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_jobId_key" ON "JobApplication"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_candidateId_key" ON "JobApplication"("candidateId");

-- AddForeignKey
ALTER TABLE "Recruiter" ADD CONSTRAINT "Recruiter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
