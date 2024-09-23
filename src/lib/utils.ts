import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { env } from '@/lib/env';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (env.VERCEL_ENV === 'preview') {
    return `https://${env.VERCEL_BRANCH_URL}`;
  } else if (env.VERCEL_ENV === 'production') {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  throw new Error('Invalid environment');
}
