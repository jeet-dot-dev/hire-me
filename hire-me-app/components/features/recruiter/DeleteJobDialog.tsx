// components/custom/recruiter/DeleteJobDialog.tsx

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  jobTitle: string;
  jobId: string | undefined;
  children: React.ReactNode;
};

const DeleteJobDialog = ({ jobTitle, children, jobId }: Props) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (input.trim() !== jobTitle.trim()) {
      toast.error("Job title doesn't match. Please type it exactly.");
      return;
    }

    if (!jobId) {
      toast.error("Internal Error! Try after sometime");
      return;
    }
    const toastId = toast.loading("Deleting...");
    try {
      await axios.post(`/api/recruiter/job/${jobId}/delete`);
      toast.success("Successfully deleted", { id: toastId });
      router.refresh();

      // Delay closing slightly so it feels natural
      setTimeout(() => {
        setOpen(false);
      }, 300); // 300ms delay is enough
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete job. Please try again.", { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-[#0a0a0a] text-[#f9f9f9]">
        <DialogHeader>
          <DialogTitle className="text-white">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            This will permanently delete the job.
            <br />
            Please type <strong className="text-white/50">{jobTitle}</strong> to
            confirm.
          </DialogDescription>
        </DialogHeader>

        <Input
          className="dark:bg-gray-800 dark:text-white placeholder-[#151515]"
          placeholder="Type job title to confirm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <DialogFooter className="mt-4">
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="cursor-pointer"
          >
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteJobDialog;
