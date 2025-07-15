"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import React from "react";
import { Plus } from "lucide-react";
import { JobFormData } from "@/zod/job";
import JobCard from "@/components/generic/job/JobCard";

export type RecruiterJobCompProp = {
   jobs : JobFormData[] ,
   role : "RECRUITER" | "CANDIDATE"
}

const RecruiterJobComp = ({jobs,role}:RecruiterJobCompProp) => {

  const router = useRouter();
  return (
    <div>
      <div className="flex justify-end items-center w-full p-4">
        <Button
          variant={"outline"}
          size={"lg"}
          className="cursor-pointer text-white "
          onClick={() => router.push("/recruiter/dashboard/jobs/create")}
        >
          Create Job
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <Separator className="my-4" />
      <div>
      <JobCard jobs={jobs} role={role} />
      </div>
    </div>
  );
};

export default RecruiterJobComp;
