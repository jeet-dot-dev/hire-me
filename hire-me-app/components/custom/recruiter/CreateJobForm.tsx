"use client";
import AdditionalInformationSection from "@/components/mini/job-form-sections/AdditionalInformationSection";
import BasicInformationSection from "@/components/mini/job-form-sections/BasicInformationSection";
import { InterviewDetailsSection } from "@/components/mini/job-form-sections/InterviewDetailsSection";
import JobDescriptionSection from "@/components/mini/job-form-sections/JobDescriptionSection";
import TagsSection from "@/components/mini/job-form-sections/TagsSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JobFormData } from "@/zod/job";
import axios from "axios";
import { ArrowLeft, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const CreateJobForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<JobFormData>({
    jobTitle: "",
    companyName: "",
    location: "",
    salary: "",
    jobType: "FULL_TIME",
    description: "",
    skillsRequired: [],
    interviewDuration: 10,
    interviewInstruction: "",
    tags: [],
    industry: "",
    jobLevel: "JUNIOR",
    experienceNeeded: undefined,
    contact: "",
    expireAt: undefined,
  });
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionMode, setDescriptionMode] = useState<"edit" | "generate">(
    "generate"
  );

  // clean obj
  const cleanObject = <T extends object>(obj: T): Partial<T> => {
    const cleaned = Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "string") return value.trim().length > 0;
        return value !== null && value !== undefined;
      })
    );

    return cleaned as Partial<T>;
  };

  // helper func
  const updateFormData = (updates: Partial<JobFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skillsRequired.includes(newSkill.trim())) {
      updateFormData({
        skillsRequired: [...formData.skillsRequired, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateFormData({
      skillsRequired: formData.skillsRequired.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData({
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData({
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // func to know is basic info is there or not
  const isBasicInfo = () => {
    const basicInfoComplete =
      formData.jobTitle.trim() &&
      formData.companyName.trim() &&
      formData.location.trim() &&
      formData.skillsRequired.length > 0;
    const additionalInfoHasData =
      formData.industry ||
      formData.jobLevel ||
      formData.experienceNeeded ||
      formData.contact || 
      formData.salary;

    if (!basicInfoComplete) {
      toast.error(
        "Please fill in Job Title, Company Name, Location, and add at least one skill for better AI generation results."
      );
      return false;
    }

    if (!additionalInfoHasData) {
      toast.error(
        "For better results, please fill in additional information like Industry, Job Level, or Experience Needed."
      );
      return false;
    }

    if (basicInfoComplete && additionalInfoHasData) {
      return true;
    }
  };

  const handleAIGenerate = (
    field: "description" | "interviewInstruction" | "tags"
  ) => {
    if (field === "description") {
      generateDescription();
      return;
    } else if (field === "tags") {
      generateTags();
      return;
    } else if (field === "interviewInstruction") {
      generateInterviewInstruction();
      return;
    }

    toast.success("AI generation for ${field} would be implemented here.");
  };

  const generateDescription = async () => {
  const isReady = isBasicInfo();
  if (!isReady) return;

  // Build raw context from form data
  const rawContext = {
    jobTitle: formData.jobTitle,
    companyName: formData.companyName,
    location: formData.location,
    salary: formData.salary,
    jobType: formData.jobType,
    skillsRequired: formData.skillsRequired,
    expireAt: formData.expireAt,
    industry: formData.industry,
    jobLevel: formData.jobLevel,
    experienceNeeded: formData.experienceNeeded,
    contact: formData.contact,
  };

  // ✅ Clean it using your reusable utility
  const contextData = cleanObject(rawContext);

  console.log("Generating description with context:", contextData);

  // Show loading state
  toast.success("Generating job description...");
  
  // Optional: Set loading state for the description field
  updateFormData({ description: "Generating..." });

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_AI_BACKEND_API}/api/v1/getDescription`,
      contextData
    );

    console.log("AI Response:", res.data);

    // ✅ Update the form with the generated description
    if (res.data.result) {
      updateFormData({ 
        description: res.data.result 
      });
      
      toast.success("Job description generated successfully!");
    } else {
      throw new Error("No description received from AI");
    }

  } catch (error) {
    console.error("Error generating description:", error);
    
    // ✅ Clear the loading state and show error
    updateFormData({ description: "" });
    
    // Better error handling
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(`Failed to generate description: ${errorMessage}`);
    } else {
      toast.error("Failed to generate job description. Please try again.");
    }
  }
};

  const generateTags = async () => {};

  const generateInterviewInstruction = async () => {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.jobTitle.trim() ||
      !formData.companyName.trim() ||
      !formData.location.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Your job posting has been created and is now live.");

      console.log("Job posted:", formData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create job posting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dark">
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-full mx-auto">
          <Card className="bg-card/60 backdrop-blur-md border-border/20 shadow-2xl rounded-2xl relative">
            <ArrowLeft
              onClick={() => router.push("/recruiter/dashboard/jobs")}
              className="absolute top-4 left-4 w-6 h-6 text-muted-foreground cursor-pointer hover:text-foreground z-10 transition-colors"
            />
            <CardHeader className="p-6 border-b border-border/30 pl-12">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                Create Job Posting
              </CardTitle>
              <p className="text-muted-foreground">
                Fill in the details to create a new job posting
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <BasicInformationSection
                  formData={formData}
                  updateFormData={updateFormData}
                  newSkill={newSkill}
                  setNewSkill={setNewSkill}
                  addSkill={addSkill}
                  removeSkill={removeSkill}
                />
                <Separator className="bg-border/30" />
                {/* Additional Information */}
                <AdditionalInformationSection
                  formData={formData}
                  updateFormData={updateFormData}
                />
                <Separator className="bg-border/30" />
                {/* Job Description */}
                <JobDescriptionSection
                  formData={formData}
                  updateFormData={updateFormData}
                  descriptionMode={descriptionMode}
                  setDescriptionMode={setDescriptionMode}
                  handleAIGenerate={handleAIGenerate}
                />
                <Separator className="bg-border/30" />
                <TagsSection
                  formData={formData}
                  updateFormData={updateFormData}
                  newTag={newTag}
                  setNewTag={setNewTag}
                  addTag={addTag}
                  removeTag={removeTag}
                  handleAIGenerate={handleAIGenerate}
                />
                <Separator className="bg-border/30" />
                {/* Interview Details */}
                <InterviewDetailsSection
                  formData={formData}
                  updateFormData={updateFormData}
                  handleAIGenerate={handleAIGenerate}
                />

                <Separator className="bg-border/30" />
                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[160px] bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-4 h-4 mr-2" />
                        Create Job Post
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateJobForm;
