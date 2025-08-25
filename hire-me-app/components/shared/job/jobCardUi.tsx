"use client";
import { useState } from "react";
import { JobFormDataUI } from "@/zod/job";
import JobTableRow from "./JobTableRow";
import JobCardView from "./JobCardView";

type JobCardUiProp = {
  job: JobFormDataUI;
  role: "RECRUITER" | "CANDIDATE";
  styleType: boolean;
  index: number;
};

const JobCardUi = ({ job, role, styleType, index }: JobCardUiProp) => {
  const [jobStatus, setJobStatus] = useState(job.status);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const getDaysRemaining = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const confirmDeactivate = () => {
    setJobStatus(false);
    setShowConfirmDialog(false);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const daysRemaining = getDaysRemaining(job.expireAt ? new Date(job.expireAt).toISOString() : "");
  const isExpired = daysRemaining < 0;

  if (styleType) {
    return (
      <JobTableRow
        job={job}
        role={role}
        jobStatus={jobStatus}
        daysRemaining={daysRemaining}
        isExpired={isExpired}
        formatDate={formatDate}
        handleWishlist={handleWishlist}
        isWishlisted={isWishlisted}
        index={index}
      />
    );
  }

  return (
    <JobCardView
      job={job}
      role={role}
      jobStatus={jobStatus}
      isExpired={isExpired}
      daysRemaining={daysRemaining}
      showConfirmDialog={showConfirmDialog}
      setShowConfirmDialog={setShowConfirmDialog}
      confirmDeactivate={confirmDeactivate}
      handleWishlist={handleWishlist}
      isWishlisted={isWishlisted}
    />
  );
};

export default JobCardUi;
