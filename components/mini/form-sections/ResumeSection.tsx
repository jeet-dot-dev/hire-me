import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X } from "lucide-react";
import { useRef } from "react";

interface ResumeSectionProps {
  resume?: string | File | undefined;
  onResumeChange: (file: File | undefined) => void;
}

export function ResumeSection({ resume, onResumeChange }: ResumeSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onResumeChange(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    onResumeChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Resume
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Upload your resume (PDF only)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          {resume ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-foreground">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">{resume instanceof File && resume.name}</p>
                  {resume instanceof File && (
                    <p className="text-sm text-muted-foreground">
                      {(resume.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUploadClick}
                  className="border-border hover:bg-muted"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveFile}
                  className="border-border hover:bg-muted text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-foreground font-medium">
                  Upload your resume
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF files only, max 10MB
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleUploadClick}
                className="border-border hover:bg-muted"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
