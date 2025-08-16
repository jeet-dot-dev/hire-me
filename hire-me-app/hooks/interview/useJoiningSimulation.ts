import { useEffect, useState } from "react";

export function useJoiningSimulation(steps: string[], totalDuration = 2000, stepIntervalMs = 500) {
  const [isJoining, setIsJoining] = useState(true);
  const [joiningStep, setJoiningStep] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setJoiningStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, stepIntervalMs);

    const joinTimer = setTimeout(() => {
      console.log("Joining simulation completed");
      setIsJoining(false);
      clearInterval(stepInterval);
    }, totalDuration);

    return () => {
      clearTimeout(joinTimer);
      clearInterval(stepInterval);
    };
    
  }, [steps, stepIntervalMs, totalDuration]);

  return { isJoining, joiningStep };
}
