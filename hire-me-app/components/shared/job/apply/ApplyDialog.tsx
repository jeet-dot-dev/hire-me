import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { JobFormDataUI } from "@/zod/job";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Building, FileText, X, Clock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteR2ObjectSingle } from "@/lib/r2/deleteR2Object";
import { ProtectedActionButton } from "@/components/features/ProtectedActionButton";
import { UpgradeModal } from "@/components/features/UpgradeModal";

type ApplyDialogProps = {
  job: JobFormDataUI;
  children?: React.ReactNode;
};

const ApplyDialog = ({ job, children }: ApplyDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();
  
  const handleCancel = () => {
    setIsOpen(false);
    setResume(null); // Clear file when cancelling
  };

  const ALLOWED_TYPES = [
    "application/pdf", // PDF
    "application/msword", // DOC (old Word format)
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  ];
  const handleSubmit = async () => {
    const toastId = toast.loading("Preparing to upload your resume...");
    setUploading(true);
    if (!resume) {
      toast.error("Please upload your resume before submitting.", {
        id: toastId,
      });
      setUploading(false);
      return;
    }
    if (resume.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.", { id: toastId });
      setUploading(false);
      return;
    }
    console.log("Resume file:", resume);
    if (!ALLOWED_TYPES.includes(resume.type)) {
      toast.error("Invalid file type. Please upload a PDF or DOC file.", {
        id: toastId,
      });
      setUploading(false);
      return;
    }

    const deleteKey = `resumes/${Date.now()}-${resume.name}`;

    try {
      // Step 1: Request signed URL
      toast.loading("Requesting upload URL...", { id: toastId });
      const response = await fetch("/api/application/resume", {
        method: "POST",
        body: JSON.stringify({ key: resume.name, type: resume.type }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();

      // Step 2: Upload to R2
      toast.loading("Uploading your resume to storage...", { id: toastId });
      const uploadRes = await fetch(data.signedUrl, {
        method: "PUT",
        body: resume,
        headers: { "Content-Type": resume.type },
      });

      if (!uploadRes.ok) {
        setUploading(false);
        throw new Error(await uploadRes.text());
      }

      // Step 3: Create application in DB
      toast.loading("Submitting your application...", { id: toastId });
      const appRes = await fetch("/api/application/create", {
        method: "POST",
        body: JSON.stringify({
          jobId: job.id,
          resumeUrl: data.key,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!appRes.ok) {
        const errorData = await appRes.json().catch(() => ({ error: "Unknown error" }));
        await deleteR2ObjectSingle(data.key);
        
        // Handle credit-related errors
        if (appRes.status === 402 && errorData.upgradeRequired) {
          setUploading(false);
          setShowUpgradeModal(true);
          toast.error(errorData.error || "Free tier limit reached. Please upgrade to continue.", { id: toastId });
          return;
        }
        
        setUploading(false);
        throw new Error(errorData.error || "Application submission failed");
      }

      const application = await appRes.json();
      // ✅ Preload the application page before redirecting
      router.push(`/application/${application.id}`);
      setUploading(false);

      toast.success("Application submitted successfully!", { id: toastId });
      router.push(`/application/${application.id}`);
    } catch (err) {
      await deleteR2ObjectSingle(deleteKey);
      setUploading(false);
      console.error("Error:", err);
      toast.error("Something went wrong while applying.", { id: toastId });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  const removeFile = () => {
    setResume(null);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="w-[95vw] max-w-[520px] p-0 bg-black border border-white/20 shadow-2xl mx-2 sm:mx-0">
        {/* Header */}
        <div className="relative border-b border-white/10 p-4 sm:p-6 pb-3 sm:pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2"></div>
              <div className="space-y-1">
                <p className="text-base sm:text-lg font-semibold text-white leading-tight">
                  Apply for {job.jobTitle}
                </p>
                <div className="flex items-center gap-1.5">
                  <Building className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-white/60 font-medium truncate">
                    {job.companyName}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-white/60 font-medium truncate">
                    {job.interviewDuration} min (Interview Duration)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Resume Upload Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <p className="text-white/70 text-sm">
                Just upload your resume and submit your application
              </p>
            </div>

            {/* Upload Area or File Display */}
            {!resume ? (
              <div className="relative">
                <div className="border-2 border-dashed border-white/30 rounded-lg p-4 sm:p-8 text-center hover:border-white/50 transition-colors bg-white/5">
                  <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                    <div className="p-2 sm:p-3 rounded-full bg-white/10">
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-medium text-white">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-white/50">
                        PDF, DOC up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="border border-white/30 rounded-lg p-4 bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-white/10">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {resume.name}
                      </p>
                      <p className="text-xs text-white/50">
                        {(resume.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={removeFile}
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/10 p-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Option to replace file */}
                <div className="relative mt-3">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4 border-t border-white/10">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 cursor-pointer bg-transparent border-white/30 text-white hover:bg-white hover:text-black transition-all duration-200 text-sm sm:text-base py-2 sm:py-3"
            >
              Cancel
            </Button>
            <ProtectedActionButton
              onAction={handleSubmit}
              onUpgradeRequired={() => setShowUpgradeModal(true)}
              disabled={!resume || uploading}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 font-semibold transition-all duration-200 text-sm sm:text-base py-2 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <span className="animate-caret-blink">Uploading...</span>
                </>
              ) : (
                "Submit Application"
              )}
            </ProtectedActionButton>
          </div>
        </div>

        {/* Upgrade Modal */}
        <UpgradeModal 
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          creditsRemaining={0}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ApplyDialog;
