import '@/globals.css';

import { esMX } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { GeistSans } from 'geist/font/sans';
import type { ReactNode } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';

import { Header } from './header';
import { QueryClientProvider } from './query-client-provider';
import { ThemeProvider } from './theme-provider';

interface MainLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function MainLayout({ sidebar, children }: MainLayoutProps) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <ClerkProvider localization={esMX}>
        <body className="flex h-screen w-screen overflow-hidden">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryClientProvider>
              {sidebar}
              <div className="flex w-full flex-col">
                <Header />
                <ScrollArea>
                  <main className="flex flex-col items-center gap-4 p-6">
                    {children}
                  </main>
                </ScrollArea>
              </div>
              <Toaster />
            </QueryClientProvider>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}