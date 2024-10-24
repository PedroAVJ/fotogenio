import "@/lib/global.css";

import { esMX } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "@/app/api/uploadthing/core";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Work_Sans } from "next/font/google";

import { QueryClientProvider } from "./query-client-provider";
import { CSPostHogProvider } from "./posthog-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fotogenio",
};

const workSans = Work_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-MX" className={workSans.className}>
      <ClerkProvider localization={esMX}>
        <CSPostHogProvider>
          <body className="h-dvh w-dvw">
            <QueryClientProvider>
              <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
              <ScrollArea className="size-full">
                <main className="bg-gradient-to-b from-[#534E4E] to-[#171717]">
                  {children}
                </main>
              </ScrollArea>
            </QueryClientProvider>
            <Toaster />
          </body>
        </CSPostHogProvider>
      </ClerkProvider>
    </html>
  );
}
