import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JobFormData } from "@/zod/job";
import { Edit, FileText, Sparkles, Wand2 } from "lucide-react";
import React from "react";

interface JobDescriptionSectionProps {
  formData: JobFormData;
  updateFormData: (updates: Partial<JobFormData>) => void;
  descriptionMode: "edit" | "generate";
  setDescriptionMode: (mode: "edit" | "generate") => void;
  handleAIGenerate: (
    field: "description" | "interviewInstruction" | "tags"
  ) => void;
}

const JobDescriptionSection = ({
  formData,
  updateFormData,
  descriptionMode,
  setDescriptionMode,
  handleAIGenerate,
}: JobDescriptionSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Job Description
      </h3>
      <div className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={descriptionMode === "edit" ? "default" : "outline"}
            onClick={() => setDescriptionMode("edit")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            Edit Mode
          </Button>
          <Button
            type="button"
            variant={descriptionMode === "generate" ? "default" : "outline"}
            onClick={() => setDescriptionMode("generate")}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-white cursor-pointer"
          >
            <Wand2 className="w-4 h-4" />
            AI Generate Mode
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground">
            Description *
          </Label>
          {descriptionMode === "edit" ? (
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="bg-background/60 border-border/40 text-foreground min-h-[120px]"
              required
            />
          ) : (
            <div className="flex gap-2">
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  updateFormData({ description: e.target.value })
                }
                placeholder="AI will generate description based on job details..."
                className="bg-background/60 border-border/40 text-foreground min-h-[120px] flex-1"
                required
              />
             
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAIGenerate("description")}
                className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 px-3 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                 Generate
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionSection;
