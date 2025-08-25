import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UserPlus,
  Briefcase,
  FileText,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

interface SimpleDashboardProps {
  userName?: string;
  recentJobsCount?: number;
}

export function SimpleDashboard({
  userName = "there",
  recentJobsCount = 0,
}: SimpleDashboardProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-white font-bold mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to take the next step in your career? Let&apos;s get started.
          </p>
        </div>

        {/* Profile Completion Prompt */}
        <Card className="mb-8 bg-gradient-to-r from-accent/50 to-secondary/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Complete Your Profile
                  </h3>
                  <p className="text-muted-foreground">
                    Stand out to recruiters and get better job matches by
                    completing your profile.
                  </p>
                </div>
              </div>
              <Link href="/candidate/dashboard/profile/form">
                <Button className="cursor-pointer">
                  Complete Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Available Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{recentJobsCount}</div>
              <p className="text-muted-foreground text-sm">
                New opportunities waiting
              </p>
              <Link href="/candidate/dashboard/jobs">
                <Button variant="outline" size="sm" className="mt-3">
                  Browse Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">0</div>
              <p className="text-muted-foreground text-sm">
                Applications submitted
              </p>
              <Link href="/candidate/dashboard/application">
                <Button variant="outline" size="sm" className="mt-3">
                  View Applications
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Profile Strength
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">20%</div>
              <p className="text-muted-foreground text-sm">
                Complete your profile
              </p>
              <Link href="/candidate/dashboard/profile/form">
                <Button variant="outline" size="sm" className="mt-3">
                  Improve Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Getting Started</CardTitle>
            <CardDescription>
              Here&apos;s how to make the most of your Hire-me experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-accent/50">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Complete Your Profile</h4>
                  <p className="text-muted-foreground text-sm">
                    Add your education, skills, and upload your resume to
                    attract recruiters.
                  </p>
                  <Link href="/candidate/dashboard/profile/form">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary hover:text-primary/80"
                    >
                      Start now →
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg bg-accent/50">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Explore Job Opportunities</h4>
                  <p className="text-muted-foreground text-sm">
                    Browse through hundreds of job listings and find your
                    perfect match.
                  </p>
                  <Link href="/candidate/dashboard/jobs">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary hover:text-primary/80"
                    >
                      Browse jobs →
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg bg-accent/50">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Apply and Practice</h4>
                  <p className="text-muted-foreground text-sm">
                    Apply to jobs and practice with our AI-powered interview
                    system.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-muted-foreground/50"
                    disabled
                  >
                    Complete profile first
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
