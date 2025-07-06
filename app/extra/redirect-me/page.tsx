import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/authConfig";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return redirect("/auth/login");
  }

  const role = session.user.role;

  if (!role) {
    return redirect("/login");
  }

  if (role === "RECRUITER") {
    return redirect("/recruiter/dashboard");
  } else if (role === "CANDIDATE") {
    return redirect("/");
  } else {
    return redirect("/login");
  }
}
