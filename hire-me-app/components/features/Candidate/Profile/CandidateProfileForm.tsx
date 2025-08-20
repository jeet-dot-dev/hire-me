"use client";
import { useState } from "react";
import { CandidateProfile } from "@/types/candidate";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import CandidateProfileFormUI from "./CandidateProfileFormUI";

/* ───────────────────────────── constants ───────────────────────────── */
const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB
const MAX_PDF_SIZE = 5 * 1024 * 1024;   // 5 MB

/* ───────────────────────────── helpers ───────────────────────────── */
function extAndMimeFromFile(file: File, type: "image" | "pdf") {
  const mime = file.type;
  const ext = mime.split("/")[1];
  const ALLOWED = {
    image: ["png", "jpg", "jpeg", "webp"],
    pdf: ["pdf"],
  } as const;
  const allowedExtensions = ALLOWED[type] as readonly string[];
  if (!allowedExtensions.includes(ext)) {
    throw new Error(`Unsupported ${type} type: ${ext}`);
  }
  return { ext, mime };
}

async function uploadToR2(file: File, type: "image" | "pdf"): Promise<string> {
  const { ext, mime } = extAndMimeFromFile(file, type);
  const { data } = await axios.post<{ url: string; key: string }>("/api/r2/upload-url", {
    type,
    ext,
    mime,
  });

  await fetch(data.url, {
    method: "PUT",
    headers: { "Content-Type": mime },
    body: file,
  });

  return data.key;
}

/* ───────────────────────────── types ───────────────────────────── */
type Props = {
  initialData: CandidateProfile;
  mode: "create" | "edit";
};

/* ───────────────────────────── main component ───────────────────────────── */
export function CandidateProfileForm({ initialData, mode }: Props) {
  const [profile, setProfile] = useState<CandidateProfile>(initialData);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const calculateProgress = () => {
    let completed = 0;
    const total = 5;
    if (profile.firstName.trim() && profile.lastName.trim()) completed += 1;
    if (profile.education.some((e) => e.degree && e.institution)) completed += 1;
    if (profile.skills.length) completed += 1;
    if (profile.socialLinks.some((l) => l.url)) completed += 1;
    if (profile.resume) completed += 1;
    return Math.round((completed / total) * 100);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!profile.firstName.trim()) newErrors.firstName = "First name is required";
    if (!profile.lastName.trim()) newErrors.lastName = "Last name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateProfile = (updates: Partial<CandidateProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    setErrors({});
  };

const handleSave = async () => {
  if (!validateForm()) {
    toast.error("Please fill in all required fields.");
    return;
  }

  // ✅ Type checks
  if (profile.profilePicture instanceof File && profile.profilePicture.size > MAX_IMAGE_SIZE) {
    toast.error("Profile photo must be ≤ 1 MB.");
    return;
  }

  if (profile.resume instanceof File && profile.resume.size > MAX_PDF_SIZE) {
    toast.error("Resume PDF must be ≤ 5 MB.");
    return;
  }

  setIsSaving(true);
  const toastId = toast.loading("Uploading your files…");

  try {
    let profilePictureKey = typeof profile.profilePicture === "string" ? profile.profilePicture : undefined;
    let resumeKey = typeof profile.resume === "string" ? profile.resume : undefined;

    if (profile.profilePicture instanceof File) {
      profilePictureKey = await uploadToR2(profile.profilePicture, "image");
    }

    if (profile.resume instanceof File) {
      resumeKey = await uploadToR2(profile.resume, "pdf");
    }

    toast.loading("Saving profile…", { id: toastId });

    await axios.post("/api/candidate/profile", {
      ...profile,
      profilePicture: profilePictureKey,
      resume: resumeKey,
    });

    toast.success("Profile saved successfully!", { id: toastId });
    router.push("/candidate/dashboard/profile");

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Something went wrong.";
    toast.error(errorMsg, { id: toastId });
  } finally {
    setIsSaving(false);
  }
};


  return (
    <CandidateProfileFormUI
      profile={profile}
      progress={calculateProgress()}
      errors={errors}
      isSaving={isSaving}
      onUpdate={updateProfile}
      onSave={handleSave}
      mode={mode}
    />
  );
}
