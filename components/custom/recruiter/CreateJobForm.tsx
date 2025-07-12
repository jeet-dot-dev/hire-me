"use client";
import AdditionalInformationSection from "@/components/mini/job-form-sections/AdditionalInformationSection";
import BasicInformationSection from "@/components/mini/job-form-sections/BasicInformationSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JobFormData } from "@/zod/job";
import { Briefcase } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const CreateJobForm = () => {
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

  const handleAIGenerate = (
    field: "description" | "interviewInstruction" | "tags"
  ) => {
    if (field === "description") {
      generateDescription();
      return;
    }

    toast.success("AI generation for ${field} would be implemented here.");
  };

  const generateDescription = () => {
    // Check if basic information is complete
    const basicInfoComplete =
      formData.jobTitle.trim() &&
      formData.companyName.trim() &&
      formData.location.trim() &&
      formData.skillsRequired.length > 0;

    // Check if additional information has some data
    const additionalInfoHasData =
      formData.industry ||
      formData.jobLevel ||
      formData.experienceNeeded ||
      formData.contact;

    if (!basicInfoComplete) {
      toast.error(
        "Please fill in Job Title, Company Name, Location, and add at least one skill for better AI generation results."
      );
      return;
    }

    if (!additionalInfoHasData) {
      toast.error(
        "For better results, please fill in additional information like Industry, Job Level, or Experience Needed."
      );
      return;
    }

    // If all data is available, proceed with AI generation
    const contextData = {
      // Basic Information
      jobTitle: formData.jobTitle,
      companyName: formData.companyName,
      location: formData.location,
      salary: formData.salary,
      jobType: formData.jobType,
      skillsRequired: formData.skillsRequired,
      expireAt: formData.expireAt,

      // Additional Information
      industry: formData.industry,
      jobLevel: formData.jobLevel,
      experienceNeeded: formData.experienceNeeded,
      contact: formData.contact,
    };

    // Here you would call your AI service with the contextData
    console.log("Generating description with context:", contextData);

    toast.success(
      "AI is generating a job description based on your provided information..."
    );

    // Simulate AI generation (replace with actual AI call)
    setTimeout(() => {
      const generatedDescription = `We are looking for a talented ${formData.jobTitle} to join our team at ${formData.companyName} in ${formData.location}. 

Key Requirements:
${formData.skillsRequired.map((skill) => `• ${skill}`).join("\n")}

${formData.experienceNeeded ? `Experience: ${formData.experienceNeeded}+ years` : ""}
${formData.jobLevel ? `Level: ${formData.jobLevel}` : ""}
${formData.industry ? `Industry: ${formData.industry}` : ""}

This is a ${formData.jobType.replace("_", " ").toLowerCase()} position offering competitive compensation${formData.salary ? ` (${formData.salary})` : ""}.`;

      updateFormData({ description: generatedDescription });

      toast(
        "AI has successfully generated a job description. You can edit it further if needed."
      );
    }, 2000);
  };

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
          <Card className="bg-card/60 backdrop-blur-md border-border/20 shadow-2xl rounded-2xl">
            <CardHeader className="p-6 border-b border-border/30">
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
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateJobForm;
