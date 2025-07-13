import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Clock } from "lucide-react";
import { JobFormData } from "@/zod/job";

interface InterviewDetailsSectionProps {
  formData: JobFormData;
  updateFormData: (updates: Partial<JobFormData>) => void;
}

export function InterviewDetailsSection({
  formData,
  updateFormData,
}: InterviewDetailsSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Interview Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="interviewDuration"
            className="text-foreground flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Interview Duration (minutes) *
          </Label>
          <Select
            value={formData.interviewDuration.toString()}
            onValueChange={(value) =>
              updateFormData({ interviewDuration: parseInt(value) })
            }
          >
            <SelectTrigger className="bg-background/60 border-border/40 text-foreground">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 minutes</SelectItem>
              <SelectItem value="20">20 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interviewInstruction" className="text-foreground">
          Interview Instructions
        </Label>
        <div className="flex gap-2">
          <Textarea
            id="interviewInstruction"
            value={formData.interviewInstruction}
            onChange={(e) =>
              updateFormData({ interviewInstruction: e.target.value })
            }
            placeholder="E.g. Focus on communication, JS fundamentals, and API knowledge. Ask about past projects or situations where they handled bugs or teamwork challenges."
            className="bg-background/60 border-border/40 text-foreground min-h-[100px] flex-1"
          />
        </div>
      </div>
    </div>
  );
}
