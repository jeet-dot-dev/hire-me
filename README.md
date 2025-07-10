# 🚀 HireMe — AI-Powered Interview Platform

**HireMe** is a full-stack AI-powered platform where:
- 🎯 **Recruiters** can create job posts, receive AI-generated interview results, and approve or reject candidates.
- 👨‍💻 **Candidates** can browse jobs, upload resumes, and give AI-evaluated mock interviews — all tracked in real-time.

This project is part of my **#learnInPublic challenge** to build a major project in **30 days** to land an internship.

---

## 📌 Project Goals

- Connect recruiters with job-seeking candidates.
- Use AI to conduct personalized interviews based on resume and job role.
- Generate structured interview feedback using LLMs.
- Build a real-world production-ready SaaS application.

---

## 🧠 Tech Stack

| Layer        | Tech                                   |
|--------------|----------------------------------------|
| Frontend     | Next.js, Tailwind CSS, ShadCN UI       |
| Auth         | Auth.js (NextAuth) with Google/GitHub  |
| Backend      | API Routes / Prisma ORM                |
| Database     | PostgreSQL                             |
| AI Layer     | OpenAI / Claude (planned)              |
| Emails       | Resend (for email verification + reset)|


 ### DB Diagram

User
├── 1️⃣1 Account
├── 1️⃣1 Session
├── 1️⃣1 Candidate (if role = CANDIDATE)
└── 1️⃣1 Recruiter (if role = RECRUITER)

Recruiter
└── 1️⃣* Job

Candidate
├── 1️⃣* Education
├── 1️⃣* Skill
├── 1️⃣* SocialLink
└── 1️⃣1 JobApplication

Job
└── 1️⃣1 JobApplication

JobApplication
├── 1️⃣1 Job
└── 1️⃣1 Candidate

VerificationToken
└── Unique on (identifier, token)

PasswordResetToken
└── Unique on (email, token)
