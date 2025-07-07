"use client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { CandidateProfile } from "@/types/candidate";
import { BioSection } from "@/components/mini/form-sections/BioSection";
import { EducationSection } from "@/components/mini/form-sections/EducationSection";
import { SkillsSection } from "@/components/mini/form-sections/SkillsSection";
import { SocialLinksSection } from "@/components/mini/form-sections/SocialLinksSection";
import { ResumeSection } from "@/components/mini/form-sections/ResumeSection";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { useRouter } from "next/navigation";

/* ───────────────────────────────────── constants ───────────────────────────────────── */
const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB
const MAX_PDF_SIZE = 5 * 1024 * 1024;   // 5 MB

/* ─────────────────────────────────── helpers ───────────────────────────────────────── */
function extAndMimeFromFile(file: File, type: "image" | "pdf"): { ext: string; mime: string } {
  const mime = file.type; // "image/png" | "application/pdf"
  const ext = mime.split("/")[1];
  const ALLOWED = {
    image: ["png", "jpg", "jpeg", "webp"],
    pdf: ["pdf"],
  } as const;
  if (!ALLOWED[type].includes(ext as any)) {
    throw new Error(`Unsupported ${type} type: ${ext}`);
  }
  return { ext, mime };
}

/**
 * Creates a presigned URL for the given file & uploads it to R2.
 * Returns the object key that can be persisted in the DB.
 */
async function uploadToR2(file: File, type: "image" | "pdf"): Promise<string> {
  const { ext, mime } = extAndMimeFromFile(file, type);
  // 1️⃣ ask backend for a presigned URL
  const { data } = await axios.post<{ url: string; key: string }>("/api/r2/upload-url", {
    type,
    ext,
    mime,
  });
  // 2️⃣ upload file
  await fetch(data.url, {
    method: "PUT",
    headers: { "Content-Type": mime },
    body: file,
  });
  return data.key; // object key stored in DB
}

/* ─────────────────────────────── component ─────────────────────────────────────────── */
export function CandidateProfileForm() {
  const [profile, setProfile] = useState<CandidateProfile>({
    firstName: "",
    lastName: "",
    about: "",
    profilePicture: undefined,
    education: [],
    skills: [],
    socialLinks: [],
    resume: undefined,
  });
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter()
  /* ───────────────────────────── progress calc ─────────────────────────────── */
  const calculateProgress = () => {
    let completed = 0;
    const total = 5;
    if (profile.firstName.trim() && profile.lastName.trim()) completed += 1;
    if (profile.education.some(e => e.degree && e.institution)) completed += 1;
    if (profile.skills.length) completed += 1;
    if (profile.socialLinks.some(l => l.url)) completed += 1;
    if (profile.resume) completed += 1;
    return Math.round((completed / total) * 100);
  };
  const progress = calculateProgress();

  /* ───────────────────────────── validation ─────────────────────────────── */
  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!profile.firstName.trim()) newErrors.firstName = "First name is required";
    if (!profile.lastName.trim()) newErrors.lastName = "Last name is required";
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  /* ───────────────────────────── state helper ─────────────────────────────── */
  const updateProfile = (updates: Partial<CandidateProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    setErrors({});
  };

  /* ───────────────────────────── save handler ─────────────────────────────── */
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // size checks
    if (profile.profilePicture && profile.profilePicture.size > MAX_IMAGE_SIZE) {
      toast.error("Profile photo must be ≤ 1 MB.");
      return;
    }
    if (profile.resume && profile.resume.size > MAX_PDF_SIZE) {
      toast.error("Resume PDF must be ≤ 5 MB.");
      return;
    }

    setIsSaving(true);
    const uploadId = toast.loading("Uploading your files…");
    try {
      // 1️⃣ upload files if any
      let profilePictureKey: string | undefined;
      let resumeKey: string | undefined;
      if (profile.profilePicture) {
        profilePictureKey = await uploadToR2(profile.profilePicture, "image");
      }
      if (profile.resume) {
        resumeKey = await uploadToR2(profile.resume, "pdf");
      }
      toast.success("Files uploaded ✔", { id: uploadId });

      // 2️⃣ save profile
      const saveId = toast.loading("Saving profile…");
      await axios.post("/api/candidate/profile", {
        ...profile,
        profilePicture: profilePictureKey,
        resume: resumeKey,
      });
      toast.success("Profile saved!", { id: saveId });
      router.push("/candidate/dashboard/profile")
    } catch (err: any) {
      toast.dismiss(uploadId);
      toast.error(err?.response?.data?.error || err?.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  /* ─────────────────────────────────── UI ─────────────────────────────────── */
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
                    <h1 className="text-2xl font-bold text-foreground">Candidate Profile</h1>
                    <p className="text-muted-foreground mt-1">
                      Create your professional profile to showcase your skills and experience
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Profile Completion</div>
                    <div className="text-lg font-semibold text-foreground">{progress}%</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-medium">{progress}% Complete</span>
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
                    profilePicture={profile.profilePicture}
                    onFirstNameChange={firstName => updateProfile({ firstName })}
                    onLastNameChange={lastName => updateProfile({ lastName })}
                    onAboutChange={about => updateProfile({ about })}
                    onProfilePictureChange={profilePicture => updateProfile({ profilePicture })}
                    errors={errors}
                  />
                  <Separator className="bg-border" />

                  <EducationSection
                    education={profile.education}
                    onEducationChange={education => updateProfile({ education })}
                  />
                  <Separator className="bg-border" />

                  <SkillsSection
                    skills={profile.skills}
                    onSkillsChange={skills => updateProfile({ skills })}
                  />
                  <Separator className="bg-border" />

                  <SocialLinksSection
                    socialLinks={profile.socialLinks}
                    onSocialLinksChange={socialLinks => updateProfile({ socialLinks })}
                  />
                  <Separator className="bg-border" />

                  <ResumeSection
                    resume={profile.resume}
                    onResumeChange={resume => updateProfile({ resume })}
                  />
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-muted/20">
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving} className="min-w-[140px]">
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
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
}
