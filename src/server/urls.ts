import { env } from '@/server/env';

let baseUrl: string;
let webhookBaseUrl: string;

if (env.VERCEL_ENV === 'production') {
  baseUrl = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  webhookBaseUrl = `${baseUrl}/api/webhooks`;
} else if (env.VERCEL_ENV === 'preview') {
  baseUrl = `https://${env.VERCEL_BRANCH_URL}`;
  webhookBaseUrl = `${baseUrl}/api/webhooks`;
} else {
  baseUrl = 'http://localhost:3000';
  const ngrokUrl = `https://${process.env['NGROK_URL']}`;
  webhookBaseUrl = `${ngrokUrl}/api/webhooks`;
}

export { baseUrl, webhookBaseUrl };
