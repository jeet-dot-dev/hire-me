

"use client"
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';
import { CandidateProfile } from '@/types/candidate';
import { BioSection } from '@/components/mini/form-sections/BioSection';
import { EducationSection } from '@/components/mini/form-sections/EducationSection';
import { SkillsSection } from '@/components/mini/form-sections/SkillsSection';
import { SocialLinksSection } from '@/components/mini/form-sections/SocialLinksSection';
import { ResumeSection } from '@/components/mini/form-sections/ResumeSection';
import { toast } from "sonner";
import { Progress } from '@/components/ui/progress';

export function CandidateProfileForm() {

  
  const [profile, setProfile] = useState<CandidateProfile>({
    firstName: '',
    lastName: '',
    about: '',
    profilePicture: undefined,
    education: [],
    skills: [],
    socialLinks: [],
    resume: undefined,
  });

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
  }>({});

  const [isSaving, setIsSaving] = useState(false);

  const calculateProgress = () => {
    let completedSections = 0;
    const totalSections = 5;

    // Bio section (required fields)
    if (profile.firstName.trim() && profile.lastName.trim()) {
      completedSections += 1;
    }

    // Education section
    if (profile.education.length > 0 && profile.education.some(edu => edu.degree && edu.institution)) {
      completedSections += 1;
    }

    // Skills section
    if (profile.skills.length > 0) {
      completedSections += 1;
    }

    // Social Links section
    if (profile.socialLinks.length > 0 && profile.socialLinks.some(link => link.url)) {
      completedSections += 1;
    }

    // Resume section
    if (profile.resume) {
      completedSections += 1;
    }

    return Math.round((completedSections / totalSections) * 100);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!profile.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!profile.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.")
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Your candidate profile has been successfully saved.")
      
      console.log('Profile saved:', profile);
    } catch (error) {
      toast.error("There was an error saving your profile. Please try again.");
      console.log(error)
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfile = (updates: Partial<CandidateProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    setErrors({}); // Clear errors when user makes changes
  };

  const progress = calculateProgress();

  return (
    <div className='dark'>
      <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card border-border shadow-lg">
          <CardContent className="p-0">
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Candidate Profile</h1>
                  <p className="text-muted-foreground mt-1">
                    Create your professional profile to showcase your skills and experience
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
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">{progress}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            <ScrollArea className="h-[70vh]">
              <div className="p-6 space-y-8">
                <BioSection
                  firstName={profile.firstName}
                  lastName={profile.lastName}
                  about={profile.about || ""}
                  profilePicture={profile.profilePicture}
                  onFirstNameChange={(firstName) => updateProfile({ firstName })}
                  onLastNameChange={(lastName) => updateProfile({ lastName })}
                  onAboutChange={(about) => updateProfile({ about })}
                  onProfilePictureChange={(profilePicture) => updateProfile({ profilePicture })}
                  errors={errors}
                />

                <Separator className="bg-border" />

                <EducationSection
                  education={profile.education}
                  onEducationChange={(education) => updateProfile({ education })}
                />

                <Separator className="bg-border" />

                <SkillsSection
                  skills={profile.skills}
                  onSkillsChange={(skills) => updateProfile({ skills })}
                />

                <Separator className="bg-border" />

                <SocialLinksSection
                  socialLinks={profile.socialLinks}
                  onSocialLinksChange={(socialLinks) => updateProfile({ socialLinks })}
                />

                <Separator className="bg-border" />

                <ResumeSection
                  resume={profile.resume}
                  onResumeChange={(resume) => updateProfile({ resume })}
                />
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-border bg-muted/20">
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="min-w-[140px]"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
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