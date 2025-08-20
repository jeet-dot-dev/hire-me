"use client";
import React, { useState } from "react";
import Toggle from "@/components/ui/toggle";
import { toast } from "sonner";

type JobStatusChangePropType = {
  status: boolean | undefined;
  id: string | undefined;
};

const JobStatusChange = ({ status = false, id }: JobStatusChangePropType) => {
  const [currentStatus, setCurrentStatus] = useState(status);

const confirmToast = (msg: string): Promise<boolean> => {
  return new Promise((resolve) => {
    let resolved = false;

    toast(msg, {
      action: {
        label: 'Confirm',
        onClick: () => {
          if (!resolved) {
            resolved = true;
            resolve(true);
          }
        },
      },
      duration: 5000, // optional: auto-dismiss
    });

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
    }, 5000);
  });
};


  const handleChange = async (s: boolean) => {
  if (!id) return;

  // Confirm before turning off (deactivating)
  if(!s){
     const confirmed = await confirmToast(
      'Are you sure? The job will no longer be visible to candidates.'
    );

    if (!confirmed) return; // cancel toggle if not confirmed

  }

  try {
    toast.loading("Please wait... updating status", { id: "status" });

    const res = await fetch("/api/jobs/status", {
      method: "POST",
      body: JSON.stringify({ id, status: s }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to update");

    setCurrentStatus(s);
    toast.success(`Status updated. Job is now ${s ? "visible" : "hidden"} to candidates.`, {
      id: "status",
    });
  } catch (err) {
    console.log(err);
    toast.error("Update failed", { id: "status" });
  }
};


  return <Toggle status={currentStatus} handleChange={handleChange} />;
};

export default JobStatusChange;
