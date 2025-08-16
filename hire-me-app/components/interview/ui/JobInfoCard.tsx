import React from "react";
import { Clock, Users, Shield } from "lucide-react";
import { JobFormDataUI } from "@/zod/job";

type Props = {
  job?: JobFormDataUI;
  isJoining: boolean;
  timeLeft: string;
};

const JobInfoCard = ({ job, isJoining, timeLeft }: Props) => {
  return (
    <section>
      <div className="min-h-[100px] bg-[#1c1c1c] mx-5 my-4 rounded-2xl flex justify-between border border-gray-700">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500 text-sm font-medium">
              {isJoining ? "Connecting..." : "Live"}
            </span>
          </div>
          <p className="text-lg font-semibold">{job?.jobTitle}</p>
          <p className="text-muted-foreground">{job?.companyName}</p>
          <span className="flex justify-start gap-4 text-muted-foreground items-center mt-2">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <p>{job?.interviewDuration} min</p>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <p>1-on-1</p>
            </div>
          </span>
        </div>

        <div className="px-5 py-4 flex flex-col items-end">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-green-500 text-sm">Secure</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Time left</p>
            <p className="text-lg font-mono">{timeLeft}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobInfoCard;
