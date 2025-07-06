import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User } from 'lucide-react';
import { useRef, useState } from 'react';

interface BioSectionProps {
  firstName: string;
  lastName: string;
  about: string;
  profilePicture?: File;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onAboutChange: (value: string) => void;
  onProfilePictureChange: (file: File | undefined) => void;
  errors?: {
    firstName?: string;
    lastName?: string;
  };
}

export function BioSection({
  firstName,
  lastName,
  about,
  profilePicture,
  onFirstNameChange,
  onLastNameChange,
  onAboutChange,
  onProfilePictureChange,
  errors,
}: BioSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onProfilePictureChange(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Personal Information</CardTitle>
        <CardDescription className="text-muted-foreground">
          Basic information about yourself
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={imagePreview || undefined} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              <User className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>
          <Button
            type="button"
            variant="outline"
            onClick={handleUploadClick}
            className="border-border hover:bg-muted"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Profile Picture
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {profilePicture && (
            <p className="text-sm text-muted-foreground">{profilePicture.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground">
              First Name *
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder="Enter your first name"
              className="bg-background border-border text-foreground"
              required
            />
            {errors?.firstName && (
              <p className="text-sm text-destructive">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground">
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              placeholder="Enter your last name"
              className="bg-background border-border text-foreground"
              required
            />
            {errors?.lastName && (
              <p className="text-sm text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="about" className="text-foreground">
            About Me
          </Label>
          <Textarea
            id="about"
            value={about}
            onChange={(e) => onAboutChange(e.target.value)}
            placeholder="Tell us about yourself..."
            className="bg-background border-border text-foreground min-h-[100px]"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}