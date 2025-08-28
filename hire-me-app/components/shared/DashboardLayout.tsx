// app/candidate/dashboard/layout.tsx
"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Search, FileUser, Bookmark, LogOut } from "lucide-react";
import { IconBrandTabler, IconUserBolt } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type DashboardLayoutProps = {
  children: React.ReactNode;
  role: "RECRUITER" | "CANDIDATE";
};

export default function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const router = useRouter();

  const candidateLinks = [
    {
      label: "Dashboard",
      href: "/candidate/dashboard",
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
    {
      label: "Profile",
      href: "/candidate/dashboard/profile",
      icon: <IconUserBolt className="h-5 w-5" />,
    },
    {
      label: "Open Roles",
      href: "/candidate/dashboard/jobs",
      icon: <Search className="h-5 w-5" />,
    },
    {
      label: "My Journey",
      href: "/candidate/dashboard/application",
      icon: <FileUser className="h-5 w-5" />,
    },
    {
      label: "My Picks",
      href: "/candidate/dashboard/wishlist",
      icon: <Bookmark className="h-5 w-5" />,
    },
  ];

  const recruiterLinks = [
    {
      label: "Dashboard",
      href: "/recruiter/dashboard",
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
    {
      label: "Jobs",
      href: "/recruiter/dashboard/jobs",
      icon: <Search className="h-5 w-5" />,
    },
    {
      label: "Application",
      href: "/recruiter/dashboard/application",
      icon: <FileUser className="h-5 w-5" />,
    },
  ];

  const links = role === "CANDIDATE" ? candidateLinks : recruiterLinks;

  return (
    <div className="dark">
      <div
        className={cn(
          "mx-auto flex w-full h-screen rounded-md border border-neutral-700 bg-black",
          "flex-col md:flex-row"
        )}
      >
        <Sidebar open={open} setOpen={setOpen} animate={false}>
          <SidebarBody className="justify-between gap-10 bg-neutral-900 border-neutral-700">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {/* Header with close button */}
              <div className="flex items-center justify-between mb-4">
                <a
                  onClick={() => router.push("/")}
                  className="text-white  cursor-pointer font-bold mt-5 text-2xl"
                >
                  Hire-me
                </a>
              </div>

              {/* Navigation links */}
              <div className="flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={link}
                    className="text-neutral-400 hover:text-white"
                  />
                ))}
              </div>
            </div>

            {/* Logout button at the bottom */}
            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer text-white hover:text-neutral-400 hover:bg-neutral-800 transition-colors w-full"
              >
                <LogOut className="h-6 w-6" />
                Logout
              </button>
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Main content with mobile-first responsive design */}
        <main
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6",
            // Ensure main content is visible when sidebar is closed on mobile
            !open && "block",
            // Hide main content when sidebar is open on mobile (optional)
            open && "hidden md:block"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
