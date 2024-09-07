import '@/globals.css';

import { esMX } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { Work_Sans } from 'next/font/google';
import type { ReactNode } from 'react';

import { QueryClientProvider } from './query-client-provider';

const workSans = Work_Sans({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${workSans.className}`}
      suppressHydrationWarning
    >
      <ClerkProvider localization={esMX}>
        <body className="h-screen w-screen">
          <QueryClientProvider>
            <main>{children}</main>
          </QueryClientProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
