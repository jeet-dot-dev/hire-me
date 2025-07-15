import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobFormData } from "@/zod/job";

import { Calendar, Factory, Phone, TrendingUp } from 'lucide-react';
import React from 'react'

interface AdditionalInformationSectionProps {
  formData: JobFormData;
  updateFormData: (updates: Partial<JobFormData>) => void;
}

export enum JobLevel {
  INTERN = 'INTERN',
  ENTRY = 'ENTRY',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD'
}

const AdditionalInformationSection = ({formData,
  updateFormData}:AdditionalInformationSectionProps) => {
  return (
    <div className='space-y-6'>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Additional Information
      </h3>
     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {/* industry   */}
      <div className="space-y-2">
          <Label htmlFor="industry" className="text-foreground flex items-center gap-2">
            <Factory className="w-4 h-4" />
            Industry
          </Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) => updateFormData({ industry: e.target.value })}
            placeholder="e.g., Technology, Healthcare"
            className="bg-background/60 border-border/40 text-foreground"
          />
      </div>
      {/* Job Level */}
        <div className="space-y-2">
          <Label className="text-foreground">Job Level</Label>
          <Select
            value={formData.jobLevel}
            onValueChange={(value) => updateFormData({ jobLevel: value as JobLevel })}
          >
            <SelectTrigger className="bg-background/60 border-border/40 text-foreground">
              <SelectValue placeholder="Select job level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={JobLevel.INTERN}>Intern</SelectItem>
              <SelectItem value={JobLevel.ENTRY}>Entry Level</SelectItem>
              <SelectItem value={JobLevel.MID}>Mid Level</SelectItem>
              <SelectItem value={JobLevel.SENIOR}>Senior</SelectItem>
              <SelectItem value={JobLevel.LEAD}>Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>
          {/* Experience Needed */}
        <div className="space-y-2">
          <Label htmlFor="experienceNeeded" className="text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Experience Needed (years)
          </Label>
          <Input
            id="experienceNeeded"
            type="number"
            value={formData.experienceNeeded || ''}
            onChange={(e) => updateFormData({ experienceNeeded: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="e.g., 3"
            min="0"
            className="bg-background/60 border-border/40 text-foreground"
          />
        </div>  
        {/* Contact */}
         <div className="space-y-2">
          <Label htmlFor="contact" className="text-foreground flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact
          </Label>
          <Input
            id="contact"
            value={formData.contact}
            onChange={(e) => updateFormData({ contact: e.target.value })}
            placeholder="e.g., hr@company.com"
            className="bg-background/60 border-border/40 text-foreground"
          />
        </div>
     </div>
    </div>
  )
}

export default AdditionalInformationSection
