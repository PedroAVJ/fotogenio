import "server-only";

import { db } from '@/lib/clients';
import { Gender } from '@prisma/client';

const count = await db.prompt.count({
  where: {
    style: {
      gender: Gender.female
    },
  },
});

console.log(`Total count of ${Gender.female} prompts: ${count.toString()}`);
