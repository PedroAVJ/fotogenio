'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function NavLink<T extends string>({
  href,
  children,
}: {
  href: Route<T> | URL;
  children: ReactNode;
}) {
  const currentPath = usePathname();
  const isActive =
    typeof href === 'string' &&
    (href === '/' ? currentPath === '/' : currentPath.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary hover:bg-muted',
        isActive ? 'bg-muted text-primary' : 'text-secondary-foreground',
      )}
    >
      {children}
    </Link>
  );
}
