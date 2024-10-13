import { env } from '@/server/env';

let baseUrl: URL;
let webhookBaseUrl: URL;

if (env.VERCEL_ENV === 'production') {
  const url = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  baseUrl = new URL(url);
  webhookBaseUrl = new URL('/api/webhooks', baseUrl);
} else if (env.VERCEL_ENV === 'preview') {
  const url = `https://${env.VERCEL_BRANCH_URL}`;
  baseUrl = new URL(url);
  webhookBaseUrl = new URL('/api/webhooks', baseUrl);
} else {
  const localhostUrl = 'http://localhost:3000';
  baseUrl = new URL(localhostUrl);
  webhookBaseUrl = new URL('/api/webhooks', baseUrl);
}

export { baseUrl, webhookBaseUrl };
