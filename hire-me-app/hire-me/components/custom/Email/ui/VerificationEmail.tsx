import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type VerificationEmailCompProps = {
  name: string;
  verifyUrl: string;
};
export default function VerificationEmailComp({
  name,
  verifyUrl,
}: VerificationEmailCompProps) {
   return (
     <Html>
    <Head />
    <Preview>Verify your email address to complete your Hire-me account setup</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logoText}>Hire-me</Text>
        </Section>
        
        <Section style={headerSection}>
          <Text style={heading}>Verify your email address</Text>
          <Text style={paragraph}>
            Hi {name}, welcome to Hire-me! 
          </Text>
          <Text style={paragraph}>
            To complete your account setup and start using Hire-me, please verify your email address by clicking the button below.
          </Text>
        </Section>

        <Section style={buttonSection}>
          <Button style={button} href={verifyUrl}>
            Verify Email Address
          </Button>
        </Section>

        <Section style={infoSection}>
          <Text style={infoText}>
            This verification link will expire in 1 hour for security reasons.
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={footerSection}>
          <Text style={footerText}>
            If you didn&apos;t create an account with Hire-me, you can safely ignore this email.
          </Text>
          <Text style={footerText}>
            If the button above doesn&apos;t work, copy and paste this link into your browser:
          </Text>
          <Text style={linkText}>
            <Link href={verifyUrl} style={link}>
              {verifyUrl}
            </Link>
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={supportSection}>
          <Text style={supportText}>
            Need help? Contact our support team or visit our help center.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
   )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "560px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const logoSection = {
  padding: "32px 20px 24px",
  textAlign: "center" as const,
  borderBottom: "1px solid #e5e7eb",
};

const logoText = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "0",
  letterSpacing: "-0.5px",
};

const headerSection = {
  padding: "32px 20px 24px",
};

const heading = {
  fontSize: "24px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#1f2937",
  margin: "0 0 16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#374151",
  margin: "0 0 16px",
};

const buttonSection = {
  padding: "0 20px 32px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
};

const infoSection = {
  padding: "0 20px 24px",
  textAlign: "center" as const,
};

const infoText = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
  fontStyle: "italic",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "0",
};

const footerSection = {
  padding: "24px 20px",
  backgroundColor: "#f9fafb",
};

const footerText = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#6b7280",
  margin: "0 0 8px",
};

const linkText = {
  fontSize: "12px",
  lineHeight: "1.4",
  color: "#6b7280",
  margin: "8px 0 0",
  wordBreak: "break-all" as const,
};

const link = {
  color: "#3b82f6",
  textDecoration: "underline",
};

const supportSection = {
  padding: "16px 20px",
  textAlign: "center" as const,
  backgroundColor: "#f9fafb",
};

const supportText = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0",
};
