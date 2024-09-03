'use server';

import { redirect } from 'next/navigation';

import { z } from '@/lib/es-zod';
import { db } from '@/server/db';
import { router } from '@/server/safe-action';

import { divisionSchema } from './schemas';

export const createDivision = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(divisionSchema)
  .action(async ({ parsedInput: { nombre }, ctx: { orgId } }) => {
    await db.division.create({
      data: {
        nombre,
        orgId,
      },
    });
    redirect('/');
  });

export const isNombreDuplicate = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(z.string())
  .action(async ({ parsedInput: nombre, ctx: { orgId } }) => {
    const divisionCount = await db.division.count({
      where: { nombre, orgId },
    });
    return divisionCount === 0;
  });
