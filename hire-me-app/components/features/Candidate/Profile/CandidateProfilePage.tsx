"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Edit,
  FileText,
  Code,
  GraduationCap,
  Github,
  Linkedin,
  Globe,
  Twitter,
  ExternalLink,
  User,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type platformtypes =
  | "GITHUB"
  | "LINKEDIN"
  | "PORTFOLIO"
  | "TWITTER"
  | "DEVFOLIO";

type candidatePropType = {
  candidate: {
    firstName: string;
    lastName: string;
    about: string | null;
    profilePic: string | null;
    resume: string | null;
    education: education[];
    skills: skillsTypes[];
    socials: socialsTypes[];
  };
};

type education = {
  candidateId: string;
  createdAt: Date;
  degree: string;
  endYear?: number;
  startYear: number;
  grade?: string;
  id: string;
  institution: string;
};

type socialsTypes = {
  candidateId: string;
  id: string;
  platform: platformtypes;
  url: string;
};

type skillsTypes = {
  candidateId: string;
  id: string;
  name: string;
};

export function CandidateProfilePage({ candidate }: candidatePropType) {
  console.log(candidate);
   const router = useRouter();
  const handleEditProfile = () => {
     router.push("/candidate/dashboard/profile/form")
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "GITHUB":
        return Github;
      case "LINKEDIN":
        return Linkedin;
      case "PORTFOLIO":
        return Globe;
      case "TWITTER":
        return Twitter;
      case "DEVFOLIO":  
        return Globe;
      default:
        return Globe;
    }
  };

  // Calculate profile completion
  const calculateProgress = () => {
    let completedSections = 0;
    const totalSections = 5;

    // Bio section (required fields)
    if (candidate.firstName && candidate.lastName) {
      completedSections += 1;
    }

    // Education section
    if (candidate.education?.length > 0) {
      completedSections += 1;
    }

    // Skills section
    if (candidate.skills.length > 0) {
      completedSections += 1;
    }

    // Social Links section
    if (candidate.socials.length > 0) {
      completedSections += 1;
    }

    // Resume section
    if (candidate.resume) {
      completedSections += 1;
    }

    return Math.round((completedSections / totalSections) * 100);
  };

  const progress = calculateProgress();

  if (!candidate) {
    return <div>loading ....</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-background/60 backdrop-blur-md border-border/20 shadow-2xl rounded-2xl overflow-hidden">
          {/* Edit Button - Fixed positioning */}
          <div className="absolute right-4 top-4 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditProfile}
              className="bg-background/80 backdrop-blur-sm border-border/40 hover:bg-background/90 hover:border-primary/40 transition-all duration-200"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <CardHeader className="relative p-0">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-t-2xl" />

            <div className="relative p-6 pt-16">
              {/* Profile Progress Bar */}
              {progress !== 100 && (
                <div className="mb-6 p-4 bg-muted/20 backdrop-blur-sm rounded-xl border border-border/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {progress === 100 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      )}
                      <span className="text-sm font-medium text-foreground">
                        {progress === 100
                          ? "Profile Complete!"
                          : "Please complete your profile"}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2 bg-muted/40" />
                  {progress < 100 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Complete all sections to improve your profile visibility
                    </p>
                  )}
                </div>
              )}

              {/* Basic Info Section */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="w-24 h-24 ring-2 ring-primary/20 ring-offset-2 ring-offset-background/60">
                  <AvatarImage
                    src={
                      `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${candidate.profilePic}` ||
                      " "
                    }
                  />
                  <AvatarFallback className="bg-muted/40 text-muted-foreground text-2xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {candidate.firstName} {candidate.lastName}
                    </h1>

                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>Kolkata,India</span>
                    </div>
                  </div>

                  {candidate.about && (
                    <p className="text-muted-foreground leading-relaxed max-w-2xl">
                      {candidate.about}
                    </p>
                  )}

                  {/* Social Links - Moved here after bio */}
                  {candidate.socials && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {candidate.socials.map((link) => {
                        const IconComponent = getSocialIcon(link.platform);
                        return (
                          <Button
                            key={link.id}
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(link.url, "_blank")}
                            className="bg-muted/20 border-border/30 hover:bg-muted/40 hover:border-primary/40 transition-all duration-200"
                          >
                            <IconComponent className="w-4 h-4 mr-2" />
                            {link.platform.toLocaleLowerCase()}
                            <ExternalLink className="w-3 h-3 ml-2" />
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {/* Resume Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Resume
              </h2>
              <Card className="bg-muted/20 border-border/30 rounded-xl">
                <CardContent className="p-4">
                  {candidate.resume ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            Resume.pdf
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Click to view
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (candidate.resume) {
                            const resumeUrl = `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${candidate.resume}`;

                            console.log(process.env.NEXT_PUBLIC_R2_PUBLIC_URL);
                            window.open(resumeUrl, "_blank");
                          } else {
                            toast.error("Resume not uploaded.");
                          }
                        }}
                        className="bg-background/60 border-border/40 hover:bg-background/80"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Resume
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No resume uploaded
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Separator className="bg-border/30" />

            {/* Skills Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Technical Skills
              </h2>
              {candidate.skills && (
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="secondary"
                      className="bg-muted/30 hover:bg-muted/50 text-foreground border-border/30 px-3 py-1 transition-colors duration-200"
                    >
                      <Code className="w-3 h-3 mr-1" />
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator className="bg-border/30" />

            {/* Education Section - Updated design like the image */}
            {candidate.education && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </h2>
                <div className="space-y-4">
                  {candidate.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="bg-muted/20 border border-border/30 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-4">
                        {/* Circular graduation cap icon - matching the image */}
                        <div className="w-12 h-12 bg-muted/60 rounded-full flex items-center justify-center border border-border/40 flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-muted-foreground" />
                        </div>

                        {/* Education content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-foreground mb-1 leading-tight">
                            {edu.degree}
                          </h3>
                          <p className="text-muted-foreground mb-2 font-medium">
                            {edu.institution}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {edu.startYear} - {edu.endYear || "Present"}
                            </span>
                            {edu.grade && (
                              <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary border-primary/20 text-xs"
                              >
                                {edu.grade}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
