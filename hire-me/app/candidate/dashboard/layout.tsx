import DashboardLayout from "@/components/generic/DashboardLayout"; // this is the CLIENT component
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

export default async function Layout({ children }: { children: React.ReactNode }) {
  //await delay(10000); // ⏳ artificial 3-second delay

  const session = await auth();

  if (!session) redirect("/auth/login");

  const role = session.user.role as "RECRUITER" | "CANDIDATE";

  return (
    <DashboardLayout role={role}>
      {children}
    </DashboardLayout>
  );
}
