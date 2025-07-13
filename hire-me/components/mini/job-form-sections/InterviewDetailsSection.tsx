import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare,
  Clock,
  Sparkles
} from 'lucide-react';
import { JobFormData } from '@/zod/job';

interface InterviewDetailsSectionProps {
  formData: JobFormData;
  updateFormData: (updates: Partial<JobFormData>) => void;
  handleAIGenerate: (field: 'description' | 'interviewInstruction' | 'tags') => void;
}

export function InterviewDetailsSection({
  formData,
  updateFormData,
  handleAIGenerate
}: InterviewDetailsSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Interview Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="interviewDuration" className="text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Interview Duration (minutes) *
          </Label>
          <Select
            value={formData.interviewDuration.toString()}
            onValueChange={(value) => updateFormData({ interviewDuration: parseInt(value) })}
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
            onChange={(e) => updateFormData({ interviewInstruction: e.target.value })}
            placeholder="Provide instructions for the interview process..."
            className="bg-background/60 border-border/40 text-foreground min-h-[100px] flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleAIGenerate('interviewInstruction')}
            className=" cursor-pointer bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 px-3"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            AI Generate
          </Button>
        </div>
      </div>
    </div>
  );
}