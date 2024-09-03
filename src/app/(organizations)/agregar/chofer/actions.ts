'use server';

import { redirect } from 'next/navigation';

import { z } from '@/lib/es-zod';
import { db } from '@/server/db';
import { router } from '@/server/safe-action';

import { choferSchema } from './schemas';

export const createChofer = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(choferSchema)
  .action(async ({ parsedInput: chofer, ctx: { orgId } }) => {
    await db.chofer.create({
      data: {
        ...chofer,
        orgId,
      },
    });
    redirect('/');
  });

export const isCodigoDuplicate = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(z.string())
  .action(async ({ parsedInput: codigo, ctx: { orgId } }) => {
    const choferCount = await db.chofer.count({
      where: { codigo, orgId },
    });
    return choferCount === 0;
  });
