import { resend } from "@/lib/resend";
import VerificationEmailComp from "./ui/VerificationEmail";

interface sendVerificationEmailProps {
    email: string;
    name: string;
    token: string;
}

export async function sendVerificationEmail({email,name,token}:sendVerificationEmailProps) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/extra/email/verify-email?token=${token}`;
  const {data,error} = await resend.emails.send({
    from : 'onboarding@resend.dev',
    to : email ,
    subject : 'Verify your email address - Hire-me',
    react : VerificationEmailComp({
      name ,
      verifyUrl
    })
  })
   if(error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email")
    }
    console.log("Verification email sent successfully:", data);
    return data; 
}