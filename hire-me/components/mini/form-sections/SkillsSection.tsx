import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Code } from 'lucide-react';
import { useState } from 'react';

interface SkillsSectionProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
}

export function SkillsSection({ skills, onSkillsChange }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onSkillsChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const popularSkills = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'C++',
    'HTML',
    'CSS',
    'MongoDB',
    'PostgreSQL',
    'Git',
    'Docker',
    'AWS',
    'Machine Learning',
    'Data Analysis',
  ];

  const addPopularSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      onSkillsChange([...skills, skill]);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Code className="w-5 h-5" />
          Skills
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Add your technical and professional skills
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="newSkill" className="text-foreground">
            Add Skill
          </Label>
          <div className="flex gap-2">
            <Input
              id="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., JavaScript, React, Python"
              className="bg-background border-border text-foreground"
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
        </div>

        {skills.length > 0 && (
          <div className="space-y-2">
            <Label className="text-foreground">Your Skills</Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-muted hover:bg-muted/80 text-foreground"
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
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-foreground">Popular Skills</Label>
          <div className="flex flex-wrap gap-2">
            {popularSkills
              .filter((skill) => !skills.includes(skill))
              .map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="cursor-pointer border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  onClick={() => addPopularSkill(skill)}
                >
                  {skill}
                  <Plus className="w-3 h-3 ml-1" />
                </Badge>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}