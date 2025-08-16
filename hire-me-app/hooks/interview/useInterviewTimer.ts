import { useEffect, useState } from "react";
import { JobFormDataUI } from "@/zod/job";

export function useInterviewTimer(job: JobFormDataUI | undefined) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getInterviewDuration = () => {
    if (!job?.interviewDuration) return "00:00";
    const totalSeconds = job.interviewDuration * 60;
    const elapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
    let remaining = totalSeconds - elapsed;
    if (remaining < 0) remaining = 0;

    const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
    const seconds = (remaining % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return getInterviewDuration;
}
