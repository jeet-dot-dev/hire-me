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

type CreateJobFormProp = {
  job : JobFormData ,
  type : "Create" | "Edit"
}

const CreateJobForm = ({job,type}:CreateJobFormProp) => {
  const router = useRouter();
  const [formData, setFormData] = useState<JobFormData>(job);
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);

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

  const handleAIGenerate = (field: "description" | "tags") => {
    if (field === "description") {
      generateDescription();
      return;
    } else if (field === "tags") {
      generateTags();
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

   
    

    // Optional: Set loading state for the description field
    updateFormData({ description: "Generating..." });
    setDescriptionLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_AI_BACKEND_API}/api/v1/getDescription`,
        contextData
      );

      console.log("AI Response:", res.data);

      // ✅ Update the form with the generated description
      if (res.data.result) {
        updateFormData({
          description: res.data.result,
        });
        setDescriptionLoading(false);
        toast.success("Job description generated successfully!");
      } else {
        toast.error("Error generating description! try again later");
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

  const generateTags = async () => {
    const isReady = isBasicInfo();
    if (!isReady) {
      toast.error("Please fill in basic job information first");
      return;
    }

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

    const contextData = cleanObject(rawContext);

   
    setTagsLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_AI_BACKEND_API}/api/v1/getTags`,
        contextData
      );

      console.log("AI Response:", res.data);
      

      if (res.data.result && Array.isArray(res.data.result)) {
        updateFormData({ tags: res.data.result });
        toast.success("Job tags generated successfully!");
      } else {
        throw new Error("Invalid tags format received from AI");
      }
    } catch (error) {
      console.error("Error generating tags:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        toast.error(`Failed to generate tags: ${errorMessage}`);
      } else {
        toast.error("Failed to generate job tags. Please try again.");
      }

      // Optional: Set empty array as fallback
      updateFormData({ tags: [] });
    } finally {
      setTagsLoading(false);
    }
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.jobTitle.trim()) {
    toast.error("Please enter a job title.");
    return;
  }

  if (!formData.companyName.trim()) {
    toast.error("Please enter a company name.");
    return;
  }

  if (!formData.location.trim()) {
    toast.error("Please enter a location.");
    return;
  }

  if (!formData.description.trim()) {
    toast.error("Please enter a job description.");
    return;
  }

  if (formData.tags.length < 1) {
    toast.error("Please add at least one tag.");
    return;
  }

  setIsSubmitting(true);

  try {
    const endpoint =
      type === "Edit"
        ? `/api/recruiter/job/${formData.id}/edit`
        : "/api/recruiter/job/create";

   await axios.post(endpoint, formData);

    toast.success(
      type === "Edit"
        ? "Your job posting has been updated."
        : "Your job posting has been created and is now live."
    );

    router.push("/recruiter/dashboard/jobs");
  } catch (error: any) {
    console.error(error);

    const backendMessage =
      error?.response?.data?.error || "Something went wrong.";

    toast.error(backendMessage);
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
              { type === "Create" ? "  Create Job Posting" : "Edit Job Posting"}
              </CardTitle>
              <p className="text-muted-foreground">
               {type === "Create" ? " Fill in the details to create a new job posting" : "Update the details of your job post"}
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
                  handleAIGenerate={handleAIGenerate}
                  descriptionLoading={descriptionLoading}
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
                  tagsLoading={tagsLoading}
                />
                <Separator className="bg-border/30" />
                {/* Interview Details */}
                <InterviewDetailsSection
                  formData={formData}
                  updateFormData={updateFormData}
                />

                <Separator className="bg-border/30" />
                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[160px] bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                       {type === "Create" ? " Creating..." : "Updating..."}
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-4 h-4 mr-2" />
                        {type === "Create" ? "Create Job Post" : "Update Job Post"}
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
