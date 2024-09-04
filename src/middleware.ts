import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { ratelimit } from './server/ratelimit';

const isProtectedRoute = createRouteMatcher(['(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = auth().protect();
    const { success } = await ratelimit.limit(userId);
    if (!success) return new Response('Too many requests', { status: 429 });
  } else {
    const { ip } = req;
    const { success } = await ratelimit.limit(ip ?? '');
    if (!success) return new Response('Too many requests', { status: 429 });
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
