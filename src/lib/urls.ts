import "server-only";

import { env } from '@/lib/env';

function getBaseUrl() {
  if (env.VERCEL_ENV === 'production') {
    if (!env.VERCEL_PROJECT_PRODUCTION_URL) {
      throw new Error('Production URL not found');
    }
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  } else if (env.VERCEL_ENV === 'preview') {
    if (!env.VERCEL_BRANCH_URL) {
      throw new Error('Preview URL not found');
    }
    return `https://${env.VERCEL_BRANCH_URL}`;
  } else {
    throw new Error('Base URL is used for webhook processing. That means it cannot be used in development.');
  }
}

export const baseUrl = getBaseUrl();
