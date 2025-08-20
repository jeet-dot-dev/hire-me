import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobFormData } from "@/zod/job";
import {
  Briefcase,
  Building,
  Calendar,
  Code,
  DollarSign,
  MapPin,
  Plus,
  X,
} from "lucide-react";
import React from "react";

interface BasicInformationSectionProps {
  formData: JobFormData;
  updateFormData: (updates: Partial<JobFormData>) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  addSkill: () => void;
  removeSkill: (skill: string) => void;
}
enum JobType {
  Remote = "Remote",
  Onsite = "Onsite",
  Hybrid = "Hybrid",
}

const BasicInformationSection = ({
  formData,
  updateFormData,
  newSkill,
  setNewSkill,
  addSkill,
  removeSkill,
}: BasicInformationSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Building className="w-5 h-5 text-primary" />
        Basic Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Job Title */}
        <div className="space-y-2">
          <Label
            htmlFor="jobTitle"
            className="text-foreground flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            Job Title *
          </Label>
          <Input
            id="jobTitle"
            value={formData.jobTitle ?? ""}
            onChange={(e) => updateFormData({ jobTitle: e.target.value })}
            placeholder="e.g. ,Senior Frontend Developer"
            className="bg-background/60 border-border/40 text-foreground"
            required
          />
        </div>
        {/* Company Name  */}
        <div className="space-y-2">
          <Label
            htmlFor="companyName"
            className="text-foreground flex items-center gap-2"
          >
            <Building className="w-4 h-4" />
            Company Name *
          </Label>
          <Input
            id="companyName"
            value={formData.companyName ?? ""}
            onChange={(e) => updateFormData({ companyName: e.target.value })}
            placeholder="e.g., TechCorp Inc."
            className="bg-background/60 border-border/40 text-foreground"
            required
          />
        </div>
        {/* location */}
        <div className="space-y-2">
          <Label
            htmlFor="location"
            className="text-foreground flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Location *
          </Label>
          <Input
            id="location"
            value={formData.location ?? ""}
            onChange={(e) => updateFormData({ location: e.target.value })}
            placeholder="e.g., San Francisco, CA"
            className="bg-background/60 border-border/40 text-foreground"
            required
          />
        </div>
        {/* salary */}
        <div className="space-y-2">
          <Label
            htmlFor="salary"
            className="text-foreground flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Salary
          </Label>
          <Input
            id="salary"
            value={formData.salary ?? ""}
            onChange={(e) => updateFormData({ salary: e.target.value })}
            placeholder="e.g., $80,000 - $120,000"
            className="bg-background/60 border-border/40 text-foreground"
          />
        </div>
        {/* Job Type  */}
        <div className="space-y-2">
          <Label className="text-foreground">Job Type *</Label>
          <Select
            value={formData.jobType ?? undefined}
            onValueChange={(value) =>
              updateFormData({ jobType: value as JobType })
            }
          >
            <SelectTrigger className="bg-background/60 border-border/40 text-foreground">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={JobType.Hybrid}>Hybrid</SelectItem>
              <SelectItem value={JobType.Onsite}>Onsite</SelectItem>
              <SelectItem value={JobType.Remote}>Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Expire Date */}
        <div className="space-y-2">
          <Label
            htmlFor="expireAt"
            className="text-foreground flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Expire Date
          </Label>
          <Input
            id="expireAt"
            type="date"
            value={
              formData.expireAt
                ? formData.expireAt.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              updateFormData({
                expireAt: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
            className="bg-background/60 border-border/40 text-foreground"
          />
        </div>
        {/* skills  */}
        <div className="space-y-4">
          <Label className="text-foreground flex items-center gap-2">
            <Code className="w-4 h-4" />
            Skills Required *
          </Label>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill())
              }
              placeholder="Add a skill..."
              className="bg-background/60 border-border/40 text-foreground flex-1"
            />
            <Button
              type="button"
              onClick={addSkill}
              disabled={!newSkill.trim()}
              className="px-3"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {formData.skillsRequired.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.skillsRequired.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-muted/60 hover:bg-muted/80 text-foreground"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
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
    </div>
  );
};

export default BasicInformationSection;
