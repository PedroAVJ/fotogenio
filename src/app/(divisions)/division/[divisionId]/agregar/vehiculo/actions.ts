'use server';

import { redirect } from 'next/navigation';

import { z } from '@/lib/es-zod';
import { db } from '@/server/db';
import { router } from '@/server/safe-action';

import { vehiculoSchema } from './schemas';

export const createVehiculo = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(vehiculoSchema)
  .action(
    async ({
      parsedInput: { chofer, ...otherVehiculoData },
      ctx: { orgId },
    }) => {
      const vehiculo = await db.vehiculo.create({
        data: {
          ...otherVehiculoData,
          orgId,
        },
      });
      if (chofer !== null) {
        await db.choferVehiculo.create({
          data: {
            orgId,
            divisionId: vehiculo.divisionId,
            choferId: chofer.id,
            vehiculoId: vehiculo.id,
          },
        });
      }
      redirect('/');
    },
  );

export const searchChoferes = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(z.string())
  .action(async ({ parsedInput: choferQuery, ctx: { orgId } }) => {
    if (!choferQuery) return [];
    const choferes = await db.chofer.findMany({
      where: {
        orgId,
        OR: [
          { codigo: { contains: choferQuery, mode: 'insensitive' } },
          {
            nombreCompleto: {
              contains: choferQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: 10,
    });
    return choferes;
  });

export const isCodigoDuplicate = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(z.string())
  .action(async ({ parsedInput: codigo, ctx: { orgId } }) => {
    const vehiculoCount = await db.vehiculo.count({
      where: { codigo, orgId },
    });
    return vehiculoCount === 0;
  });
