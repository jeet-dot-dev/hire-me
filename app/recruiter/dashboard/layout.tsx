import DashboardLayout from "@/components/generic/DashboardLayout"; // this is the CLIENT component
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) redirect("/auth/login");

  // Fetch role from your DB if not already in session
  const role = session.user.role; // or fetch from DB using session.user.email
  

  return (
    <DashboardLayout role={role}>
      {children}
    </DashboardLayout>
  );
}
