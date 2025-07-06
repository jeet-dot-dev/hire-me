import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { Education } from '@/types/candidate';

interface EducationSectionProps {
  education: Education[];
  onEducationChange: (education: Education[]) => void;
}

export function EducationSection({ education, onEducationChange }: EducationSectionProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      startYear: currentYear,
      endYear: null,
      grade: '',
    };
    onEducationChange([...education, newEducation]);
  };

  const removeEducation = (id: string) => {
    onEducationChange(education.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onEducationChange(
      education.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu))
    );
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Education
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Add your educational background
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {education.map((edu, index) => (
          <div key={edu.id} className="p-4 border border-border rounded-lg bg-muted/20">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-foreground">Education {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  placeholder="e.g., Bachelor of Science"
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                  placeholder="e.g., University of Technology"
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Start Year</Label>
                <Select
                  value={edu.startYear.toString()}
                  onValueChange={(value) => updateEducation(edu.id, { startYear: parseInt(value) })}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">End Year</Label>
                <div className="space-y-2">
                  <Select
                    value={edu.endYear?.toString() || ''}
                    onValueChange={(value) => updateEducation(edu.id, { endYear: parseInt(value) })}
                    disabled={edu.endYear === null}
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`current-${edu.id}`}
                      checked={edu.endYear === null}
                      onCheckedChange={(checked) =>
                        updateEducation(edu.id, { endYear: checked ? null : currentYear })
                      }
                    />
                    <Label htmlFor={`current-${edu.id}`} className="text-sm text-muted-foreground">
                      Currently studying here
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-foreground">Grade (Optional)</Label>
                <Input
                  value={edu.grade || ''}
                  onChange={(e) => updateEducation(edu.id, { grade: e.target.value })}
                  placeholder="e.g., A, 3.8 GPA, First Class"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addEducation}
          className="w-full border-border hover:bg-muted"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </CardContent>
    </Card>
  );
}