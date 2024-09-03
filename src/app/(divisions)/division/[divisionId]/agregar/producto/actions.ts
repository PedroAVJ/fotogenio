'use server';

import { redirect } from 'next/navigation';

import { z } from '@/lib/es-zod';
import { db } from '@/server/db';
import { router } from '@/server/safe-action';

import { productoSchema } from './schemas';

export const createProducto = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(productoSchema)
  .action(async ({ parsedInput: producto, ctx: { orgId } }) => {
    const { unidadDeMedida, productoOServicio, ...otherProductoData } =
      producto;
    await db.producto.create({
      data: {
        unidadDeMedidaId: unidadDeMedida.id,
        productoOServicioId: productoOServicio.id,
        orgId,
        ...otherProductoData,
      },
    });
    redirect('/');
  });

export const searchUnidadesDeMedida = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(z.string())
  .action(async ({ parsedInput: unidadDeMedidaQuery }) => {
    if (!unidadDeMedidaQuery) return [];
    const unidadesDeMedida = await db.unidadDeMedida.findMany({
      where: {
        OR: [
          { clave: { contains: unidadDeMedidaQuery, mode: 'insensitive' } },
          { nombre: { contains: unidadDeMedidaQuery, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });
    return unidadesDeMedida;
  });

export const searchProductoOServicio = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(z.string())
  .action(async ({ parsedInput: productoOServicioQuery }) => {
    if (!productoOServicioQuery) return [];
    const productosOAServicios = await db.productoOServicio.findMany({
      where: {
        OR: [
          { clave: { contains: productoOServicioQuery, mode: 'insensitive' } },
          {
            descripcion: {
              contains: productoOServicioQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: 10,
    });
    return productosOAServicios;
  });

export const isCodigoDuplicate = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(z.string())
  .action(async ({ parsedInput: codigo, ctx: { orgId } }) => {
    const productoCount = await db.producto.count({
      where: { codigo, orgId },
    });
    return productoCount === 0;
  });
