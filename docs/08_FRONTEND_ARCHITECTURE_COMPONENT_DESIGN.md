# Frontend Architecture & Component Design

## 🎨 Frontend Architecture Overview

Built a **modern, scalable React frontend** using Next.js 14 with App Router, TypeScript, and a component-driven architecture featuring reusable UI components, optimized performance, and excellent developer experience.

## 🏗️ Technology Stack & Architecture

### Core Technologies
```
┌─────────────────────┐
│   Next.js 14        │ ← App Router, Server Components
│   (App Directory)   │   Server-Side Rendering
├─────────────────────┤
│   TypeScript        │ ← Type Safety, Developer Experience  
├─────────────────────┤
│   Tailwind CSS      │ ← Utility-First Styling
├─────────────────────┤
│   shadcn/ui         │ ← Pre-built Component Library
├─────────────────────┤
│   React Hook Form   │ ← Form Management & Validation
├─────────────────────┤
│   Zod               │ ← Runtime Schema Validation
└─────────────────────┘
```

### Architecture Patterns
- **Server-First**: Leverage React Server Components for performance
- **Component Composition**: Reusable, composable UI building blocks
- **Type-Safe**: End-to-end TypeScript for reduced runtime errors
- **Design System**: Consistent visual language with shadcn/ui

## 📁 Project Structure & Organization

### Feature-Based Component Organization
```
components/
├── ui/                     # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── form.tsx
│   └── input.tsx
├── shared/                 # Shared business components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorBoundary.tsx
├── features/              # Feature-specific components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── PasswordResetForm.tsx
│   ├── candidate/
│   │   ├── ProfileForm.tsx
│   │   ├── JobSearch.tsx
│   │   └── ApplicationStatus.tsx
│   └── recruiter/
│       ├── JobPostForm.tsx
│       ├── CandidateSearch.tsx
│       └── ApplicationReview.tsx
└── layout/               # Layout components
    ├── DashboardLayout.tsx
    ├── AuthLayout.tsx
    └── PublicLayout.tsx
```

## 🎯 Component Design Principles

### Compound Component Pattern
```tsx
// Flexible, composable job card component
export function JobCard({ children, className, ...props }: JobCardProps) {
  return (
    <Card className={cn("job-card", className)} {...props}>
      {children}
    </Card>
  );
}

// Sub-components for flexible composition
JobCard.Header = function JobCardHeader({ title, company, logo }: HeaderProps) {
  return (
    <CardHeader className="pb-2">
      <div className="flex items-center gap-3">
        {logo && <Avatar><AvatarImage src={logo} alt={company} /></Avatar>}
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
      </div>
    </CardHeader>
  );
};

JobCard.Content = function JobCardContent({ description, skills }: ContentProps) {
  return (
    <CardContent className="pb-2">
      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
        {description}
      </p>
      <div className="flex flex-wrap gap-1">
        {skills.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
        {skills.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{skills.length - 3} more
          </Badge>
        )}
      </div>
    </CardContent>
  );
};

JobCard.Actions = function JobCardActions({ onApply, onSave, applied, saved }: ActionsProps) {
  return (
    <CardFooter className="pt-2">
      <div className="flex gap-2 w-full">
        <Button 
          onClick={onApply} 
          disabled={applied}
          className="flex-1"
        >
          {applied ? "Applied" : "Apply Now"}
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onSave}
          className={saved ? "text-primary" : ""}
        >
          <Heart className={cn("h-4 w-4", saved && "fill-current")} />
        </Button>
      </div>
    </CardFooter>
  );
};

// Usage example
<JobCard>
  <JobCard.Header 
    title="Senior Frontend Developer" 
    company="TechCorp"
    logo="/company-logo.png"
  />
  <JobCard.Content 
    description="Join our team building next-generation web applications..."
    skills={["React", "TypeScript", "Next.js"]}
  />
  <JobCard.Actions 
    onApply={handleApply}
    onSave={handleSave}
    applied={false}
    saved={true}
  />
</JobCard>
```

### Form Components with Validation
```tsx
// Type-safe form component with Zod validation
interface JobApplicationFormProps {
  jobId: string;
  onSubmit: (data: JobApplicationData) => Promise<void>;
}

const applicationSchema = z.object({
  coverLetter: z.string().min(100, "Cover letter must be at least 100 characters"),
  resume: z.instanceof(File).optional(),
  availability: z.enum(["immediate", "2weeks", "1month", "negotiable"]),
  salaryExpectation: z.number().min(0).optional(),
});

type JobApplicationData = z.infer<typeof applicationSchema>;

export function JobApplicationForm({ jobId, onSubmit }: JobApplicationFormProps) {
  const form = useForm<JobApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: "",
      availability: "2weeks",
    },
  });

  const handleSubmit = async (data: JobApplicationData) => {
    try {
      await onSubmit(data);
      toast.success("Application submitted successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us why you're interested in this position..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Personalize your application (minimum 100 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="2weeks">2 weeks notice</SelectItem>
                  <SelectItem value="1month">1 month notice</SelectItem>
                  <SelectItem value="negotiable">Negotiable</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

## 🚀 Performance Optimizations

### Server Components Strategy
```tsx
// Server Component for data fetching
async function JobListings({ searchParams }: { searchParams: SearchParams }) {
  // Data fetching on the server
  const jobs = await searchJobs({
    query: searchParams.q,
    location: searchParams.location,
    type: searchParams.type,
    page: Number(searchParams.page) || 1,
  });

  return (
    <div className="space-y-4">
      {jobs.data.map((job) => (
        <JobCard key={job.id}>
          <JobCard.Header 
            title={job.title}
            company={job.company.name}
            logo={job.company.logo}
          />
          <JobCard.Content 
            description={job.description}
            skills={job.skills.map(s => s.name)}
          />
          <JobCard.Actions 
            onApply={() => applyToJob(job.id)}
            onSave={() => saveJob(job.id)}
            applied={job.hasApplied}
            saved={job.isSaved}
          />
        </JobCard>
      ))}
      
      <Pagination 
        currentPage={jobs.page}
        totalPages={jobs.totalPages}
        baseUrl="/jobs"
        searchParams={searchParams}
      />
    </div>
  );
}
```

### Client-Side State Management
```tsx
// Custom hooks for state management
export function useJobSearch() {
  const [filters, setFilters] = useState<JobFilters>({
    query: "",
    location: "",
    type: "all",
    remote: false,
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const searchJobs = useCallback(async (newFilters?: Partial<JobFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setLoading(true);

    try {
      const response = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFilters),
      });

      const data = await response.json();
      setJobs(newFilters ? data.jobs : [...jobs, ...data.jobs]);
      setHasMore(data.hasMore);
    } catch (error) {
      toast.error("Failed to search jobs");
    } finally {
      setLoading(false);
    }
  }, [filters, jobs]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      searchJobs({ page: Math.floor(jobs.length / 20) + 1 });
    }
  }, [loading, hasMore, jobs.length, searchJobs]);

  return {
    filters,
    jobs,
    loading,
    hasMore,
    searchJobs,
    loadMore,
  };
}
```

### Image Optimization
```tsx
// Optimized image component with Next.js Image
export function CompanyLogo({ src, alt, size = 40 }: CompanyLogoProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg", `w-${size} h-${size}`)}>
      <Image
        src={src || "/default-company-logo.png"}
        alt={alt}
        fill
        className="object-cover"
        sizes={`${size}px`}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
    </div>
  );
}
```

## 🎨 Design System Implementation

### Theme Configuration
```typescript
// tailwind.config.ts - Design system tokens
const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### Typography System
```tsx
// Typography components with consistent styling
export function Typography({ 
  variant, 
  children, 
  className,
  ...props 
}: TypographyProps) {
  const variants = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    lead: "text-xl text-muted-foreground",
    large: "text-lg font-semibold",
    small: "text-sm font-medium leading-none",
    muted: "text-sm text-muted-foreground",
  };

  const Component = variant === 'p' ? 'p' : variant;
  
  return (
    <Component 
      className={cn(variants[variant], className)} 
      {...props}
    >
      {children}
    </Component>
  );
}
```

## 📱 Responsive Design Strategy

### Mobile-First Approach
```tsx
// Responsive job listing component
export function ResponsiveJobGrid({ jobs }: { jobs: Job[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} className="h-full">
          <JobCard.Header 
            title={job.title}
            company={job.company.name}
            logo={job.company.logo}
          />
          <JobCard.Content 
            description={job.description}
            skills={job.skills}
          />
          <JobCard.Actions 
            onApply={() => handleApply(job.id)}
            onSave={() => handleSave(job.id)}
            applied={job.hasApplied}
            saved={job.isSaved}
          />
        </JobCard>
      ))}
    </div>
  );
}
```

### Adaptive Navigation
```tsx
// Navigation that adapts to screen size
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Jobs</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <ListItem href="/jobs" title="Browse Jobs">
                        Explore available positions
                      </ListItem>
                      <ListItem href="/jobs/remote" title="Remote Jobs">
                        Work from anywhere
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink href="/jobs">Jobs</MobileNavLink>
              <MobileNavLink href="/companies">Companies</MobileNavLink>
              <MobileNavLink href="/profile">Profile</MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
```

## 🔄 State Management Patterns

### Server State with React Query
```tsx
// Efficient server state management
export function useJobs(filters: JobFilters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useJobMutations() {
  const queryClient = useQueryClient();

  const applyToJob = useMutation({
    mutationFn: (jobId: string) => submitJobApplication(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      queryClient.invalidateQueries(['applications']);
      toast.success("Application submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit application");
    },
  });

  const saveJob = useMutation({
    mutationFn: (jobId: string) => toggleJobSave(jobId),
    onMutate: async (jobId) => {
      // Optimistic update
      await queryClient.cancelQueries(['jobs']);
      const previousJobs = queryClient.getQueryData(['jobs']);
      
      queryClient.setQueryData(['jobs'], (old: any) => ({
        ...old,
        data: old.data.map((job: Job) =>
          job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
        ),
      }));

      return { previousJobs };
    },
    onError: (err, jobId, context) => {
      queryClient.setQueryData(['jobs'], context?.previousJobs);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });

  return { applyToJob, saveJob };
}
```

## 🧪 Testing Strategy

### Component Testing
```tsx
// Jest + React Testing Library setup
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JobCard } from '../JobCard';

describe('JobCard', () => {
  const mockJob = {
    id: '1',
    title: 'Frontend Developer',
    company: { name: 'TechCorp', logo: '/logo.png' },
    description: 'Build amazing web applications',
    skills: ['React', 'TypeScript'],
    hasApplied: false,
    isSaved: false,
  };

  it('renders job information correctly', () => {
    render(<JobCard job={mockJob} />);
    
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('TechCorp')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('handles apply action', async () => {
    const onApply = jest.fn();
    render(<JobCard job={mockJob} onApply={onApply} />);
    
    fireEvent.click(screen.getByText('Apply Now'));
    
    await waitFor(() => {
      expect(onApply).toHaveBeenCalledWith(mockJob.id);
    });
  });

  it('shows applied state', () => {
    render(<JobCard job={{ ...mockJob, hasApplied: true }} />);
    
    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByText('Applied')).toBeDisabled();
  });
});
```

---

**Interview Summary**: *"I built a scalable React frontend using Next.js 14 with TypeScript, implementing a component-driven architecture with shadcn/ui, server components for performance, comprehensive form handling with validation, and responsive design patterns."*
