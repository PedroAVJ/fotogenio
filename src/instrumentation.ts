import * as Sentry from '@sentry/nextjs';
import { env } from './lib/env';

export async function register() {
  if (process.env['TURBOPACK']) {
    return;
  }
  if (env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
