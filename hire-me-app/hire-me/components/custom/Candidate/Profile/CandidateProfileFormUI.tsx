"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { BioSection } from "@/components/mini/form-sections/BioSection";
import { EducationSection } from "@/components/mini/form-sections/EducationSection";
import { SkillsSection } from "@/components/mini/form-sections/SkillsSection";
import { SocialLinksSection } from "@/components/mini/form-sections/SocialLinksSection";
import { ResumeSection } from "@/components/mini/form-sections/ResumeSection";

import { Progress } from "@/components/ui/progress";
import { CandidateProfile } from "@/types/candidate";

type Props = {
  profile: CandidateProfile;
  progress: number;
  errors: {
    firstName?: string;
    lastName?: string;
  };
  isSaving: boolean;
  onUpdate: (updates: Partial<CandidateProfile>) => void;
  onSave: () => void;
  mode: "create" | "edit";
};

const CandidateProfileFormUI = ({
  profile,
  progress,
  errors,
  isSaving,
  onUpdate,
  onSave,
  mode,
}: Props) => {
  const router = useRouter();
  return (
    <div className="dark">
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-0">
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      Candidate Profile
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Create your professional profile to showcase your skills
                      and experience
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">
                      Profile Completion
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      {progress}%
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-medium">
                      {progress}% Complete
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>

              {/* Scrollable form */}
              <ScrollArea className="h-[70vh]">
                <div className="p-6 space-y-8">
                  <BioSection
                    firstName={profile.firstName}
                    lastName={profile.lastName}
                    about={profile.about || ""}
                    profilePicture={
                      mode === "edit"
                        ? `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${profile.profilePicture}`
                        : profile.profilePicture
                    }
                    onFirstNameChange={(firstName) => onUpdate({ firstName })}
                    onLastNameChange={(lastName) => onUpdate({ lastName })}
                    onAboutChange={(about) => onUpdate({ about })}
                    onProfilePictureChange={(profilePicture) =>
                      onUpdate({ profilePicture })
                    }
                    errors={errors}
                  />
                  <Separator className="bg-border" />

                  <EducationSection
                    education={profile.education}
                    onEducationChange={(education) => onUpdate({ education })}
                  />
                  <Separator className="bg-border" />

                  <SkillsSection
                    skills={profile.skills}
                    onSkillsChange={(skills) => onUpdate({ skills })}
                  />
                  <Separator className="bg-border" />

                  <SocialLinksSection
                    socialLinks={profile.socialLinks}
                    onSocialLinksChange={(socialLinks) =>
                      onUpdate({ socialLinks })
                    }
                  />
                  <Separator className="bg-border" />

                  <ResumeSection
                    resume={profile.resume}
                    onResumeChange={(resume) => onUpdate({ resume })}
                  />
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-muted/20">
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/candidate/dashboard/profile")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={onSave}
                    disabled={isSaving}
                    className="min-w-[140px]"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {mode === "edit" ? "Update Profile" : "Save Profile"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileFormUI;
