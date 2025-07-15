import { JobFormData } from "@/zod/job";
import React from "react";

type JobCardUiProp = {
  key: number;
  job: JobFormData;
  role: "CANDIDATE" | "RECRUITER";
};

const JobCardUi = ({ key, job, role }: JobCardUiProp) => {
  return <div>hello</div>;
};

export default JobCardUi;
