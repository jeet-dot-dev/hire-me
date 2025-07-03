// EmailVerificationNotice.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react"; // or use animated SVG

export default function EmailVerificationNotice({ email, onVerified }: { email: string, onVerified:  () => void }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Poll every 5 seconds to check if verified
useEffect(() => {
  let pollCount = 0;
  const maxPolls = 20; // 60 x 5s = 5 minutes

  const poll = setInterval(async () => {
    pollCount++;
    if (pollCount >= maxPolls) {
      clearInterval(poll);
      toast.error("Email verification timeout. Please try again.");
      return;
    }

    const res = await fetch(`/api/email/check-verification?email=${email}`);
    const data = await res.json();

    if (data.verified) {
      clearInterval(poll);
      setIsVerified(true);
      toast.success("Email verified! Logging in...");
       onVerified();
    }
  }, 5000);

  return () => clearInterval(poll);
}, [email, onVerified]);


  // Handle resend
  const handleResend = async () => {
    try {
      const res = await fetch(`/api/email/resend-email?email=${email}`);
      if (res.ok) {
        toast.success("Verification email sent again!");
        setCanResend(false);
        setTimeLeft(30);
      } else {
        toast.error("Could not resend email");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="text-center mt-6">
      {isVerified ? (
        <div className="flex flex-col items-center gap-2">
          <CheckCircle size={48} className="text-green-500 animate-pulse" />
          <p className="text-lg font-semibold">Email verified!</p>
        </div>
      ) : (
        <>
          <p className="text-white">We&apos;ve sent a verification email to <strong>{email}</strong>.</p>
          <p className="text-white">Please check your inbox and click the link.</p>
          <p className="text-white">Waiting for verification ..</p>
          <div className="mt-4">
            <button
              onClick={handleResend}
              disabled={!canResend}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              {canResend ? "Resend Email" : `Resend in ${timeLeft}s`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
