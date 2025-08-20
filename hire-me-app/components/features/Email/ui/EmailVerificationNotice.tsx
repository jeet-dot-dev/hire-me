import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail } from "lucide-react";
import { toast } from "sonner";

export default function EmailVerificationNotice({
  email,
  onVerified,
}: {
  email: string;
  onVerified: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
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
        // toast.error("Email verification timeout. Please try again.");
        console.error("Email verification timeout. Please try again.");
        return;
      }

      const res = await fetch(`/api/email/check-verification?email=${email}`);
      const data = await res.json();

      if (data.verified) {
        clearInterval(poll);
        setIsVerified(true);
        // toast.success("Email verified! Logging in...");
        console.log("Email verified! Logging in...");
        onVerified();
      }
    }, 5000);

    return () => clearInterval(poll);
  }, [email, onVerified]);

  // Handle resend
  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await fetch(`/api/email/resend-email?email=${email}`);
      if (res.ok) {
        // Show success toast
        toast.success("A resend link has been sent to your email");

        setCanResend(false);
        setTimeLeft(30);
      } else {
        toast.error("Could not resend email");
      }
    } catch (error: unknown) {
      console.log(error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent  flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {isVerified ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle size={64} className="text-green-500 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-white">
                Email Verified!
              </h1>
              <p className="text-muted-foreground text-sm">
                Your email has been successfully verified. You&apos;re being
                logged in...
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-zinc-900 rounded-full">
                  <Mail size={32} className="text-zinc-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-white">
                  Check Your Email
                </h1>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">
                    We&apos;ve sent a verification email to
                  </p>
                  <p className="text-white font-medium">{email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  Please check your inbox and click the verification link.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                  <span className="text-zinc-400 text-sm">
                    Waiting for verification
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleResend}
                disabled={!canResend || isResending}
                variant={canResend && !isResending ? "default" : "secondary"}
                className={`w-full cursor-pointer ${
                  canResend && !isResending
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                }`}
              >
                {isResending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : canResend ? (
                  "Resend Email"
                ) : (
                  `Resend in ${timeLeft}s`
                )}
              </Button>

              <p className="text-zinc-500 text-xs">
                Didn&apos;t receive the email? Check your spam folder or try
                resending.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
