'use server';

import { PlacesClient } from '@googlemaps/places';
import { JWT } from 'google-auth-library';
import { redirect } from 'next/navigation';

import { db } from '@/db';
import {
  cliente as clienteTable,
  clienteSchema,
  contacto as contactoTable,
  contactoSchema,
  precioEspecial as precioEspecialTable,
  precioEspecialSchema,
  puntoDeEntrega as puntoDeEntregaTable,
  puntoDeEntregaSchema,
} from '@/db/schema/organizations/cliente';
import { z } from '@/lib/es-zod';
import { env } from '@/server/env';
import { api } from '@/server/trpc';

export const createCliente = api
  .meta({
    roles: [],
    permissions: [],
  })
  .input(
    z.object({
      cliente: clienteSchema.omit({ id: true }),
      contactos: z.array(contactoSchema.omit({ id: true, clienteId: true })),
      preciosEspeciales: z.array(
        precioEspecialSchema.omit({ id: true, clienteId: true }),
      ),
      puntosDeEntrega: z.array(
        puntoDeEntregaSchema.omit({ id: true, clienteId: true }),
      ),
    }),
  )
  .mutation(async ({ input }) => {
    await db.transaction(async (tx) => {
      const [cliente] = await tx
        .insert(clienteTable)
        .values(input.cliente)
        .returning();
      await tx.insert(contactoTable).values(
        input.contactos.map((contacto) => ({
          ...contacto,
          celular: contacto.celular ?? null,
          clienteId: cliente?.id ?? '',
        })),
      );
      await tx.insert(precioEspecialTable).values(
        input.preciosEspeciales.map((precioEspecial) => ({
          ...precioEspecial,
          clienteId: cliente?.id ?? '',
        })),
      );
      await tx.insert(puntoDeEntregaTable).values(
        input.puntosDeEntrega.map((puntoDeEntrega) => ({
          ...puntoDeEntrega,
          clienteId: cliente?.id ?? '',
        })),
      );
    });
    redirect('/');
  });

export const searchProductos = api
  .meta({
    roles: [],
    permissions: [],
  })
  .input(
    z.object({
      productoQuery: z.string().min(1),
      productoIds: z.array(z.string()),
    }),
  )
  .query(async ({ input: { productoQuery, productoIds } }) => {
    const productos = await db.query.producto.findMany({
      where: (producto, { and, or, notInArray, ilike }) => {
        return and(
          notInArray(producto.id, productoIds),
          or(
            ilike(producto.codigo, productoQuery),
            ilike(producto.descripcion, productoQuery),
          ),
        );
      },
      limit: 10,
    });
    return productos;
  });

export const searchPlaces = api
  .meta({
    roles: [],
    permissions: [],
  })
  .input(z.string())
  .query(async ({ input: placesQuery }) => {
    if (!placesQuery) return [];
    const authClient = new JWT();
    authClient.fromAPIKey(env.GOOGLE_PLACES_API_KEY);
    const client = new PlacesClient({
      authClient,
    });
    const [response] = await client.autocompletePlaces({
      input: placesQuery,
      includedRegionCodes: ['mx'],
      languageCode: 'es-MX',
      locationBias: {
        circle: {
          center: {
            latitude: 27.4811957,
            longitude: -99.55517,
          },
          radius: 10000,
        },
      },
      regionCode: 'mx',
    });
    const predictions =
      response.suggestions?.map((suggestion) => ({
        id: suggestion.placePrediction?.placeId ?? '',
        formattedAddress: suggestion.placePrediction?.text?.text ?? '',
      })) ?? [];
    return predictions;
  });

export const isCodigoDuplicate = api
  .meta({
    roles: [],
    permissions: [],
  })
  .input(z.string())
  .query(async ({ input: codigo }) => {
    const clientes = await db.query.cliente.findFirst({
      where: (cliente, { eq }) => eq(cliente.codigo, codigo),
    });
    return !!clientes;
  });
