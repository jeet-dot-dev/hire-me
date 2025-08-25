import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import ApplicationUI from "./ApplicationUI";
import { ApplicationWithJob, TranscriptMessage } from "@/types/applicationType";
import { ensureCandidateProfile, isProfileComplete } from "@/lib/candidateUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, UserPlus } from "lucide-react";

const page = async () => {
  const session = await auth();
  if (!session || !session.user) {
    return redirect("/auth/login");
  }

  const userId = session?.user?.id;
  
  // Ensure candidate profile exists, create if missing
  const candidate = await ensureCandidateProfile(
    userId, 
    session.user.email || undefined, 
    session.user.name || undefined
  );

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            Error Creating Profile
          </h1>
          <p className="text-muted-foreground">
            We encountered an error setting up your profile. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // First check if candidate has any applications
  const applications = await prisma.jobApplication.findMany({
    where: { candidateId: candidate.id },
    include: {
      job: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // If profile is incomplete AND no applications, show a helpful message
  if (!isProfileComplete(candidate) && applications.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">My Applications</h1>
            <p className="text-muted-foreground">Track and manage your job applications</p>
          </div>

          <Card>
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">No Applications Yet</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground text-lg">
                You haven&apos;t submitted any job applications yet. To start applying for jobs, 
                you&apos;ll need to complete your profile first.
              </p>
              
              <div className="bg-accent border border-border rounded-lg p-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <UserPlus className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-lg">Complete Your Profile</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Add your education, skills, and upload your resume to start applying for jobs.
                </p>
                <Link href="/candidate/dashboard/profile/form">
                  <Button>
                    Complete Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground mb-4">
                  Or browse available jobs to see what&apos;s available
                </p>
                <Link href="/candidate/dashboard/jobs">
                  <Button variant="outline">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const applicationWithJob: ApplicationWithJob[] = applications.map(
    (application) => ({
      ...application,
      transcript: application.transcript as TranscriptMessage[] | null,
    })
  );

  return <ApplicationUI applications={applicationWithJob} role="candidate" />;
};

export default page;
