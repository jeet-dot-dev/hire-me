"use client";

import { SessionProvider } from "next-auth/react";

import { ReactNode } from "react";

import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Toaster richColors position="top-right" />
      {children}
    </SessionProvider>
  );
}
