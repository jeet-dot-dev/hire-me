"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import React from "react";
import { Plus } from "lucide-react";
import {  JobFormDataUI } from "@/zod/job";
import JobCard from "@/components/shared/job/JobCard";

export type RecruiterJobCompProp = {
   jobs : JobFormDataUI[] ,
   role : "RECRUITER" | "CANDIDATE"
}

const RecruiterJobComp = ({jobs,role}:RecruiterJobCompProp) => {

  const router = useRouter();
  return (
    <div>
      <div className="flex justify-between items-center w-full p-4">
       <div>
         <h2 className="text-3xl font-semibold text-gray-100 ">Job Listings</h2>
        <p className="text-lg text-muted-foreground ">Manage your Job Listings here </p>
       </div>
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
