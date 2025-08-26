# 💼 HireMe – Modern Job Recruitment Platform

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-hireme.stackzy.tech-blue?style=for-the-badge)](https://hireme.stackzy.tech)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)

**HireMe** is a comprehensive, modern job recruitment platform that connects candidates with recruiters through intelligent job matching, AI-powered content generation, and enterprise-grade security. Built with cutting-edge technologies and microservices architecture for scalability and performance.

## 📋 Technical Documentation

### Comprehensive System Documentation
- **[Development Summary & Key Achievements](./docs/00_DEVELOPMENT_SUMMARY_ACHIEVEMENTS.md)** - Overview of all technical achievements
- **[System Architecture Overview](./docs/01_SYSTEM_ARCHITECTURE_OVERVIEW.md)** - Microservices architecture and technology stack
- **[API Security & Rate Limiting](./docs/02_API_SECURITY_RATE_LIMITING.md)** - Enterprise-grade security implementation
- **[File Processing & Resume Extraction](./docs/03_FILE_PROCESSING_RESUME_EXTRACTION.md)** - Serverless file processing system
- **[User Experience & Onboarding](./docs/04_USER_EXPERIENCE_ONBOARDING_OPTIMIZATION.md)** - UX optimization and user journey
- **[AI Integration & Content Generation](./docs/05_AI_INTEGRATION_CONTENT_GENERATION.md)** - AI-powered features and content enhancement
- **[Database Design & Architecture](./docs/06_DATABASE_DESIGN_ARCHITECTURE.md)** - PostgreSQL schema and optimization
- **[Authentication & Authorization](./docs/07_AUTHENTICATION_AUTHORIZATION_SYSTEM.md)** - Security and user management
- **[Frontend Architecture & Components](./docs/08_FRONTEND_ARCHITECTURE_COMPONENT_DESIGN.md)** - React/Next.js component design

## 🌟 Platform Overview

**HireMe** is an advanced job recruitment platform featuring:

### 🏗️ **Microservices Architecture**
- **Main Backend**: Next.js API routes for core business logic
- **AI Backend**: Hono.js microservice for AI-powered features
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Cloudflare R2 for resumes and documents

### 🔐 **Enterprise Security**
- **Multi-tier Rate Limiting**: Intelligent protection against abuse
- **OAuth Authentication**: Google, GitHub, Email/Password
- **Role-based Access Control**: Candidate vs Recruiter permissions
- **JWT Session Management**: Secure, stateless authentication

### 🤖 **AI-Powered Features**
- **Content Generation**: Professional job descriptions with AI
- **Resume Analysis**: Intelligent text extraction and skill matching
- **Skill Tagging**: Automated skill extraction from job descriptions
- **Fallback Systems**: Multiple AI providers for reliability

### 📊 **Performance & UX**
- **Server Components**: Optimized React performance
- **Responsive Design**: Mobile-first, accessible interface
- **Smart Onboarding**: Auto profile creation and guided setup
- **File Processing**: Serverless PDF/DOCX handling

## 🛠️ Technical Stack

### Frontend Excellence
```typescript
Next.js 14 (App Router)    // Server-side rendering & performance
TypeScript                 // Full type safety
Tailwind CSS + shadcn/ui   // Modern design system
React Hook Form + Zod      // Type-safe form validation
```

### Backend Infrastructure
```typescript
Next.js API Routes         // RESTful API endpoints
Hono.js                   // Lightweight AI microservice
PostgreSQL + Prisma       // Type-safe database operations
Redis (Upstash)           // Caching and rate limiting
```

### AI & Processing
```typescript
OpenAI GPT-4             // Primary content generation
Google Gemini            // Fallback AI provider
Serverless Functions     // File processing (PDF/DOCX)
```

## 📁 Project Architecture

```
hire-me/
├── hire-me-app/                 # Main Next.js application
│   ├── app/                     # App router (Next.js 13+)
│   │   ├── api/                 # API routes
│   │   ├── candidate/           # Candidate dashboard
│   │   ├── recruiter/           # Recruiter dashboard
│   │   ├── auth/                # Authentication pages
│   │   └── application/         # Application flow
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # ShadCN UI components
│   │   ├── features/            # Feature-specific components
│   │   └── shared/              # Shared components
│   ├── lib/                     # Utility libraries
│   ├── prisma/                  # Database schema & migrations
│   ├── public/                  # Static assets
│   └── types/                   # TypeScript type definitions
├── ai-backend/                  # Cloudflare Workers AI backend
│   ├── src/                     # Worker source code
│   │   ├── controllers/         # AI processing controllers
│   │   ├── lib/                 # Utility functions
│   │   └── routes/              # API routes
│   └── wrangler.jsonc           # Cloudflare configuration
└── README.md                    # Project documentation
```

## 🔄 Interview Flow

Here's how the complete interview process works:

### Step-by-Step Process:

1. **📝 Job Application**
   - Candidate finds and applies to a job
   - Uploads resume (PDF/DOCX supported)

2. **📄 Resume Processing**
   - System extracts text from uploaded resume
   - Uses PDF.js and Mammoth.js for reliable text extraction
   - Handles various document formats and encoding

3. **🤖 AI Resume Analysis**
   - OpenAI analyzes resume content against job requirements
   - Generates comprehensive skill matching report
   - Provides match score and detailed feedback

4. **📊 Results Display**
   - Shows match percentage and score
   - Lists matched and missing skills
   - Provides AI-generated resume overview

5. **🎥 Interview Preparation**
   - System checks camera, microphone, and browser compatibility
   - Ensures optimal environment for interview

6. **💬 Live AI Interview**
   - AI conducts personalized interview based on job role and resume
   - Real-time speech-to-text using OpenAI Whisper
   - Dynamic question generation based on responses

7. **📈 Analysis & Results**
   - Comprehensive evaluation of interview performance
   - AI-generated feedback on strengths and weaknesses
   - Recommendations for improvement

8. **👥 Recruiter Review**
   - Detailed interview transcript and analysis
   - Candidate scoring and recommendations
   - Easy-to-understand hiring insights

## � Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Cloudflare account (for R2 storage and Workers)
- OpenAI API key
- Google/GitHub OAuth credentials (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/jeet-dot-dev/hire-me.git
cd hire-me
```

### 2. Setup Main Application

```bash
cd hire-me-app

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Setup database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### 3. Setup AI Backend (Optional)

```bash
cd ../ai-backend

# Install dependencies
npm install

# Setup environment variables
cp wrangler.jsonc.example wrangler.jsonc
# Edit wrangler.jsonc with your Cloudflare configuration

# Start development server
npm run dev
```

### 4. Environment Configuration

Create `.env.local` in the `hire-me-app` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hiremedb"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# AI APIs
OPENAI_API_KEY="your-openai-api-key"
GEMINI_API_KEY="your-gemini-api-key"

# Cloudflare R2
NEXT_PUBLIC_R2_PUBLIC_URL="your-r2-public-url"
R2_ENDPOINT="your-r2-endpoint"
R2_ACCESS_KEY_ID="your-r2-access-key"
R2_SECRET_ACCESS_KEY="your-r2-secret-key"

# Email
RESEND_API_KEY="your-resend-api-key"
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **AI Backend**: http://localhost:8787 (if running separately)

## 📝 Usage

### For Candidates:
1. **Sign up** with email or social login
2. **Complete your profile** with education, skills, and resume
3. **Browse jobs** and apply with one click
4. **Take AI interviews** and get instant feedback
5. **Track applications** and improve your profile

### For Recruiters:
1. **Create recruiter account** and company profile
2. **Post jobs** with AI-generated descriptions and tags
3. **Review applications** with AI-powered screening
4. **Conduct interviews** or review AI interview results
5. **Make hiring decisions** based on comprehensive analytics

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing powerful AI capabilities
- **Vercel** for the amazing Next.js framework
- **Cloudflare** for edge computing and storage solutions
- **Prisma** for the excellent ORM experience
- **ShadCN** for beautiful UI components

## 📞 Support

- **Live Demo**: [hireme.stackzy.tech](https://hireme.stackzy.tech)
- **Documentation**: Coming soon
- **Issues**: [GitHub Issues](https://github.com/jeet-dot-dev/hire-me/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jeet-dot-dev/hire-me/discussions)

---

<div align="center">
  <p>Built with ❤️ for the future of hiring</p>
  <p>
    <a href="https://hireme.stackzy.tech">Live Demo</a> •
    <a href="#-key-features">Features</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>
