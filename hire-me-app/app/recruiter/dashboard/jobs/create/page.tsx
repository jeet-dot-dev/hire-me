import CreateJobForm from "@/components/features/recruiter/CreateJobForm";
import React from "react";

const page = () => {
  enum JobTypeEnum {
    Remote = "Remote",
    Onsite = "Onsite",
    Hybrid = "Hybrid",
  }
  enum JobLevelEnum {
    INTERN = "INTERN",
    ENTRY = "ENTRY",
    MID = "MID",
    SENIOR = "SENIOR",
    LEAD = "LEAD",
  }
  const job = {
    jobTitle: "",
    companyName: "",
    location: "",
    salary: "",
    jobType: JobTypeEnum.Remote,
    description: "",
    skillsRequired: [],
    interviewDuration: 10,
    interviewInstruction: "",
    tags: [],
    industry: "",
    jobLevel: JobLevelEnum.ENTRY,
    experienceNeeded: undefined,
    contact: "",
    expireAt: undefined,
  };
  return (
    <div>
      <CreateJobForm job={job} type="Create" />
    </div>
  );
};

export default page;
