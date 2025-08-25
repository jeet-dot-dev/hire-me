import { resend } from "@/lib/resend";
import VerificationEmailComp from "./ui/VerificationEmail";
import ResetPasswordEmail from "./ui/ResetPasswordEmail";

type EmailKind = "verification" | "password-reset";

interface sendVerificationEmailProps {
  email: string;
  name: string;
  token: string;
  kind: EmailKind;
}

export async function sendVerificationEmail({
  email,
  name,
  token,
  kind,
}: sendVerificationEmailProps) {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const verifyUrl =
    kind === "password-reset"
      ? `${base}/extra/email/reset-password?token=${token}`
      : `${base}/extra/email/verify-email?token=${token}`;

  const reactMarkup =
    kind === "password-reset"
      ? ResetPasswordEmail({ name, resetUrl: verifyUrl })
      : VerificationEmailComp({ name, verifyUrl });

  const { data, error } = await resend.emails.send({
    from: "noreply@hireme.stackzy.tech",
    to: email,
    subject: "Verify your email address - Hire-me",
    react: reactMarkup,
  });
  if (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
  console.log("Verification email sent successfully:", data);
  return data;
}
