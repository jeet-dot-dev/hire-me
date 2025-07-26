import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JobFormData } from "@/zod/job";
import { FileText, Sparkles, Eye, Info, Loader2, X } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface JobDescriptionSectionProps {
  formData: JobFormData;
  updateFormData: (updates: Partial<JobFormData>) => void;
  handleAIGenerate: (
    field: "description"| "tags"
  ) => void;
  descriptionLoading: boolean; // Fixed typo: should be boolean, not string
}

const JobDescriptionSection = ({
  formData,
  updateFormData,
  handleAIGenerate,
  descriptionLoading
}: JobDescriptionSectionProps) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [showMarkdownInfo, setShowMarkdownInfo] = useState(true);

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

  const handleToggleMarkdownInfo = () => {
    setShowMarkdownInfo(!showMarkdownInfo);
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
          
          {/* Markdown Info Toggle - only show in edit mode */}
          {!previewMode && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMarkdownInfo(!showMarkdownInfo)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Info className="w-4 h-4" />
              {showMarkdownInfo ? "Hide Instructions" : "Show Instructions"}
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
          ) : (
            // Edit Mode
            <div className="space-y-3">
              {/* Markdown Info Banner */}
              {showMarkdownInfo && (
                <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900/50 dark:via-blue-900/30 dark:to-indigo-900/30 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm relative">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-full">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        Markdown formatting supported
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded text-xs font-mono"># Heading 1</code>
                          <span className="text-xs text-slate-600 dark:text-slate-400">main titles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded text-xs font-mono">## Heading 2</code>
                          <span className="text-xs text-slate-600 dark:text-slate-400">sections</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded text-xs font-mono">### Heading 3</code>
                          <span className="text-xs text-slate-600 dark:text-slate-400">subsections</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded text-xs font-mono">- List item</code>
                          <span className="text-xs text-slate-600 dark:text-slate-400">bullet points</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded text-xs font-mono">**Bold text**</code>
                          <span className="text-xs text-slate-600 dark:text-slate-400">emphasis</span>
                        </div>
                      </div>
                    </div>
                    {/* Close Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleMarkdownInfo}
                      className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
                    >
                      <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Textarea and Generate Button */}
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
                  disabled={descriptionLoading}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAIGenerate("description")}
                  disabled={descriptionLoading}
                  className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 px-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {descriptionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-1" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionSection;