'use server';

import { redirect } from 'next/navigation';

import { z } from '@/lib/es-zod';
import { db } from '@/server/db';
import { router } from '@/server/safe-action';

import { pedidoSchema } from './schemas';

export const createPedido = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(pedidoSchema)
  .action(async ({ parsedInput: pedido, ctx: { orgId } }) => {
    const { puntoDeEntrega, ...otherPedidoData } = pedido;
    const cleanArticulos = pedido.articulos.map(
      ({ producto, ...otherArticuloData }) => ({
        ...otherArticuloData,
        productoId: producto.id,
        orgId,
      }),
    );
    await db.pedido.create({
      data: {
        orgId,
        ...otherPedidoData,
        puntoDeEntregaId: puntoDeEntrega.id,
        articulos: {
          createMany: {
            data: cleanArticulos,
          },
        },
      },
    });
    redirect('/');
  });

export const searchClientes = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(z.string())
  .action(async ({ parsedInput: clienteQuery, ctx: { orgId } }) => {
    if (!clienteQuery) return [];
    const clientes = await db.cliente.findMany({
      where: {
        orgId,
        OR: [
          { codigo: { contains: clienteQuery, mode: 'insensitive' } },
          {
            nombreComercial: {
              contains: clienteQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: 10,
    });
    return clientes;
  });

const searchProductoSchema = z.object({
  productoQuery: z.string(),
  productoIds: z.array(z.string()),
  clienteId: z.string(),
});

export const searchProductos = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(searchProductoSchema)
  .action(
    async ({
      parsedInput: { productoQuery, productoIds, clienteId },
      ctx: { orgId },
    }) => {
      if (!productoQuery) return [];
      const productos = await db.producto.findMany({
        where: {
          orgId,
          id: { notIn: productoIds },
          OR: [
            { codigo: { contains: productoQuery, mode: 'insensitive' } },
            { descripcion: { contains: productoQuery, mode: 'insensitive' } },
          ],
        },
        take: 10,
        include: {
          preciosEspeciales: {
            where: {
              clienteId,
            },
          },
        },
      });
      return productos;
    },
  );

export const searchPuntosDeEntrega = router
  .metadata({
    roles: [],
    permissions: [],
  })
  .schema(z.string())
  .action(async ({ parsedInput: puntoDeEntregaQuery, ctx: { orgId } }) => {
    if (!puntoDeEntregaQuery) return [];
    const puntosDeEntrega = await db.puntoDeEntrega.findMany({
      where: {
        orgId,
        formattedAddress: {
          contains: puntoDeEntregaQuery,
          mode: 'insensitive',
        },
      },
      take: 10,
    });
    return puntosDeEntrega;
  });
