import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JobFormData } from "@/zod/job";
import { Edit, FileText, Sparkles, Wand2, Eye } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const [previewMode, setPreviewMode] = useState(false);

  // Function to fix markdown formatting if needed
  const fixMarkdownFormatting = (text: string): string => {
    if (!text) return text;

    return (
      text
        // Fix headings that might be missing proper markdown syntax
        .replace(/^([A-Z][^#\n]*?)$/gm, (match, heading) => {
          // If it looks like a heading but doesn't have #, add ###
          if (
            heading.length < 50 &&
            !heading.includes(".") &&
            !heading.includes("-")
          ) {
            return `### ${heading}`;
          }
          return match;
        })
        // Ensure proper spacing after headings
        .replace(/^(#{1,6}\s.*?)$/gm, "$1\n")
        // Fix bullet points that might be missing dashes
        .replace(/^([A-Z][^-\n]*?:?\s*$)/gm, (match, item) => {
          // If it looks like a list item but doesn't have -, add -
          if (item.length < 100 && !item.includes("#")) {
            return `- ${item}`;
          }
          return match;
        })
        // Clean up extra spaces
        .replace(/\n\n\n+/g, "\n\n")
    );
  };

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

          {/* Preview Toggle */}
          {formData.description && (
            <Button
              type="button"
              variant={previewMode ? "default" : "outline"}
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? "Hide Preview" : "Preview"}
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground">
            Description *
          </Label>

          {previewMode ? (
            // Markdown Preview
            <div className="bg-background/60 border border-border/40 rounded-md p-4 min-h-[120px]">
              <div
                className="prose prose-sm max-w-none dark:prose-invert
                  prose-headings:text-foreground prose-p:text-foreground 
                  prose-strong:text-foreground prose-ul:text-foreground 
                  prose-ol:text-foreground prose-li:text-foreground"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {fixMarkdownFormatting(
                    formData.description || "No description available"
                  )}
                </ReactMarkdown>
              </div>
            </div>
          ) : descriptionMode === "edit" ? (
            // Edit Mode
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="bg-background/60 border-border/40 text-foreground min-h-[120px]"
              required
            />
          ) : (
            // Generate Mode
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

        {/* Helper text */}
        {descriptionMode === "edit" && !previewMode && (
          <p className="text-sm text-muted-foreground">
            💡 You can use Markdown formatting (# headers, **bold**, *italic*, -
            lists)
          </p>
        )}
      </div>
    </div>
  );
};

export default JobDescriptionSection;
