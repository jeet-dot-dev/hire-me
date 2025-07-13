import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Tag, Plus, X, Sparkles, Loader2 } from "lucide-react";

import { JobFormData } from "@/zod/job";

interface TagsSectionProps {
  formData: JobFormData;
  updateFormData: (updates: Partial<JobFormData>) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  handleAIGenerate: (field: "description" | "tags") => void;
  tagsLoading?: boolean;
}

const TagsSection = ({
  formData,
  newTag,
  setNewTag,
  addTag,
  removeTag,
  tagsLoading,
  handleAIGenerate,
}: TagsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Tag className="w-5 h-5 text-primary" />
        Tags
      </h3>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTag())
            }
            placeholder="Add a tag..."
            className="bg-background/60 border-border/40 text-foreground flex-1"
          />
          <Button
            type="button"
            onClick={addTag}
            disabled={!newTag.trim()}
            className="px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleAIGenerate("tags")}
            className="bg-gradient-to-r cursor-pointer from-purple-500/20 to-blue-500/20 border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 px-3"
          >
            {tagsLoading ? (
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
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-border/40 text-muted-foreground hover:text-foreground"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsSection;
