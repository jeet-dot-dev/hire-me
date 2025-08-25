import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, BookOpen, BrainCircuit, Heart } from "lucide-react";

interface IncompleteProfileWelcomeProps {
  userName?: string;
  showCompletionPrompt?: boolean;
}

export function IncompleteProfileWelcome({ 
  userName = "there", 
  showCompletionPrompt = true 
}: IncompleteProfileWelcomeProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome to Hire-me, {userName}! 👋
          </CardTitle>
          <CardDescription className="text-lg">
            Your account has been created successfully. Let&apos;s help you get started on your career journey.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {showCompletionPrompt && (
            <div className="bg-accent border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <BrainCircuit className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Complete Your Profile</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    To unlock the full potential of our platform and get better job matches, consider completing your profile.
                  </p>
                  <Link href="/candidate/dashboard/profile/form">
                    <Button size="sm">
                      Complete Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-medium">Explore Jobs</h3>
              <p className="text-muted-foreground text-sm">
                Browse thousands of job opportunities that match your interests.
              </p>
              <Link href="/candidate/dashboard/jobs">
                <Button variant="outline" size="sm">
                  View Jobs
                </Button>
              </Link>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <BrainCircuit className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-medium">AI Interviews</h3>
              <p className="text-muted-foreground text-sm">
                Practice with our AI-powered interview system to improve your skills.
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-medium">Save Favorites</h3>
              <p className="text-muted-foreground text-sm">
                Build your wishlist of dream jobs and track your applications.
              </p>
              <Link href="/candidate/dashboard/wishlist">
                <Button variant="outline" size="sm">
                  My Wishlist
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-center text-muted-foreground text-sm">
              Need help getting started? Check out our{" "}
              <Link href="/help" className="text-primary hover:text-primary/80">
                help center
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="text-primary hover:text-primary/80">
                contact support
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
