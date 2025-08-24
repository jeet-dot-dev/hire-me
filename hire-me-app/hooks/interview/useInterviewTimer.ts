import { useEffect, useState } from "react";
import { JobFormDataUI } from "@/zod/job";

export function useInterviewTimer(job: JobFormDataUI | undefined) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startTime, setStartTime] = useState<Date | null>(null);

  // ✅ Initialize startTime only once and persist it in sessionStorage
  useEffect(() => {
    const storedStart = sessionStorage.getItem("interviewStartTime");

    if (storedStart) {
      setStartTime(new Date(storedStart));
    } else {
      const newStart = new Date();
      sessionStorage.setItem("interviewStartTime", newStart.toISOString());
      setStartTime(newStart);
    }
  }, []);

  // ✅ Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getInterviewDuration = () => {
    if (!job?.interviewDuration || !startTime) return "00:00";

    const totalSeconds = 5 * 60; // interviewDuration is in minutes
    const elapsed = Math.floor(
      (currentTime.getTime() - startTime.getTime()) / 1000
    );
    let remaining = totalSeconds - elapsed;

    if (remaining < 0) remaining = 0;

    const minutes = Math.floor(remaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (remaining % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  return getInterviewDuration;
}
