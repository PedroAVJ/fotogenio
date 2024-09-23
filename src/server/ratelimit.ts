import { Ratelimit } from '@upstash/ratelimit';
import { kv } from "@vercel/kv";

export const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: 'fotogenio',
});
