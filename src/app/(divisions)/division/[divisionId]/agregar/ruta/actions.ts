'use server';

import { omit } from 'lodash';
import { redirect } from 'next/navigation';

import { z } from '@/lib/es-zod';
import { db } from '@/server/db';
import { router } from '@/server/safe-action';

import { rutaSchema } from './schemas';

export const createRuta = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(rutaSchema)
  .action(
    async ({
      parsedInput: { nombre, divisionId, paradas },
      ctx: { orgId },
    }) => {
      const cleanedParadas = paradas.map((parada) => ({
        ...omit(parada, 'puntoDeEntrega'),
        puntoDeEntregaId: parada.puntoDeEntrega.id,
        orgId,
      }));
      await db.ruta.create({
        data: {
          nombre,
          divisionId,
          orgId,
          paradas: {
            createMany: {
              data: cleanedParadas,
            },
          },
        },
      });
      redirect('/');
    },
  );

export const searchDivisiones = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(z.string())
  .action(async ({ parsedInput: divisionQuery, ctx: { orgId } }) => {
    if (!divisionQuery) return [];
    const divisiones = await db.division.findMany({
      where: {
        orgId,
        nombre: { contains: divisionQuery, mode: 'insensitive' },
      },
      take: 10,
    });
    return divisiones;
  });

const searchPuntosDeEntregaSchema = z.object({
  divisionId: z.string(),
  puntoDeEntregaQuery: z.string(),
  puntosDeEntregaIds: z.array(z.string()),
});

export const searchPuntosDeEntrega = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(searchPuntosDeEntregaSchema)
  .action(
    async ({
      parsedInput: { divisionId, puntoDeEntregaQuery, puntosDeEntregaIds },
      ctx: { orgId },
    }) => {
      if (!puntoDeEntregaQuery) return [];
      const puntosDeEntrega = await db.puntoDeEntrega.findMany({
        where: {
          AND: [
            {
              orgId,
            },
            {
              id: { notIn: puntosDeEntregaIds },
            },
            {
              formattedAddress: {
                contains: puntoDeEntregaQuery,
                mode: 'insensitive',
              },
            },
            {
              paradas: {
                none: {
                  ruta: {
                    orgId,
                    divisionId,
                  },
                },
              },
            },
          ],
        },
        include: {
          paradas: {
            include: {
              ruta: true,
            },
          },
        },
        take: 10,
      });
      return puntosDeEntrega;
    },
  );

export const isNombreDuplicate = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(z.string())
  .action(async ({ parsedInput: nombre, ctx: { orgId } }) => {
    const rutaCount = await db.ruta.count({
      where: { nombre, orgId },
    });
    return rutaCount === 0;
  });
