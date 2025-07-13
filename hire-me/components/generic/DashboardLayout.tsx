// app/candidate/dashboard/layout.tsx
"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Search, FileUser } from "lucide-react";
import {
  IconArrowLeft,
  IconBrandTabler,  
  IconUserBolt,
} from "@tabler/icons-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React, { useState } from "react";


type DashboardLayoutProps = {
  children: React.ReactNode;
  role: "RECRUITER" | "CANDIDATE";
};


export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };
  
 const candidateLinks = [
    { label: "Dashboard", href: "/candidate/dashboard", icon: <IconBrandTabler className="h-5 w-5" /> },
    { label: "Profile", href: "/candidate/dashboard/profile", icon: <IconUserBolt className="h-5 w-5" /> },
    { label: "Jobs", href: "/candidate/dashboard/jobs", icon: <Search className="h-5 w-5" /> },
    { label: "My Application", href: "/candidate/dashboard/application", icon: <FileUser className="h-5 w-5" /> },
  ];

    const recruiterLinks = [
    { label: "Dashboard", href: "/recruiter/dashboard", icon: <IconBrandTabler className="h-5 w-5" /> },
    { label: "Jobs", href: "/recruiter/dashboard/jobs", icon: <Search className="h-5 w-5" /> },
    { label: "Application", href: "/recruiter/dashboard/application", icon: <FileUser className="h-5 w-5" /> },
  ];
 const links = role === "CANDIDATE" ? candidateLinks : recruiterLinks;
  return (
    <div className="dark">
      <div className={cn("mx-auto flex w-full h-screen rounded-md border border-neutral-700 bg-neutral-900 md:flex-row")}>
        <Sidebar open={open} setOpen={setOpen} animate={false}>
          <SidebarBody className="justify-between gap-10 bg-neutral-900 border-neutral-700">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              <a href="#" className="text-white font-bold text-xl mb-4">Hire-me</a>
              <div className="flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-neutral-800"
                >
                  <IconArrowLeft className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
            <SidebarLink
              link={{
                label: session?.user?.name || "User",
                href: "#",
                icon: (
                  <Image
                    src={session?.user?.image || "https://assets.aceternity.com/manu.png"}
                    width={30}
                    height={30}
                    alt="Avatar"
                    className="rounded-full"
                  />
                ),
              }}
            />
          </SidebarBody>
        </Sidebar>

        {/* This is where routed content loads */}
       <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
    {children}
  </main>
      </div>
    </div>
  );
}

//flex min-h-screen w-full flex-col md:flex-row bg-neutral-900 border border-neutral-700 rounded-md
//flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6