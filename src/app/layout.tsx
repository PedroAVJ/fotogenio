import '@/lib/global.css';

import { esMX } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';
import { Toaster } from "@/components/ui/sonner"

import { QueryClientProvider } from './query-client-provider';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fotogenio',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-MX">
      <ClerkProvider localization={esMX}>
        <body className="h-dvh w-dvw">
          <QueryClientProvider>
            {children}
          </QueryClientProvider>
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
