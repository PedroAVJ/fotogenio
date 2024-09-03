'use client';

import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Small } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { searchProductos } from './actions';
import type { PedidoSchema } from './schemas';

function Loading() {
  return (
    <Small className="flex items-center justify-center p-4">
      <Loader2 className="mr-2 size-4 animate-spin" />
      Cargando
    </Small>
  );
}

function NoResults() {
  return <Small className="p-4">No se encontraron productos</Small>;
}

function Error() {
  return (
    <Small className="p-4">Ocurrió un error al buscar los productos</Small>
  );
}

function SearchResults({
  productoQuery,
  index,
  onChange,
  value,
}: {
  productoQuery: string;
  index: number;
  onChange: (...event: unknown[]) => void;
  value: {
    id: string;
    codigo: string;
    descripcion: string;
  };
}) {
  const { setValue, watch } = useFormContext<PedidoSchema>();
  const clienteId = watch('puntoDeEntrega.clienteId');
  const articulos = watch('articulos');
  const productoIds = articulos.map((articulo) => articulo.producto.id);
  const [debouncedProductoQuery] = useDebounce(productoQuery, 1000);
  const { isPending, isError, data } = useQuery({
    queryKey: [
      'searchProducto',
      debouncedProductoQuery,
      productoIds,
      clienteId,
    ],
    queryFn: async () => {
      if (!debouncedProductoQuery) return [];
      const response = await searchProductos({
        productoQuery: debouncedProductoQuery,
        productoIds,
        clienteId,
      });
      return response?.data ?? [];
    },
  });
  if (!productoQuery) return null;
  if (debouncedProductoQuery !== productoQuery) return <Loading />;
  if (isPending) return <Loading />;
  if (isError) return <Error />;
  if (data.length === 0) return <NoResults />;
  const commandItems = data.map((producto) => {
    return (
      <CommandItem
        key={producto.id}
        onSelect={() => {
          onChange(producto);
          setValue(
            `articulos.${index}.precioUnitario`,
            producto.precioUnitario.toNumber(),
          );
          setValue(
            `articulos.${index}.tasaDeIva`,
            producto.tasaDeIva.toNumber(),
          );
          setValue(
            `articulos.${index}.retencionDeIva`,
            producto.retencionDeIva.toNumber(),
          );
          setValue(
            `articulos.${index}.retencionDeIsr`,
            producto.retencionDeIsr.toNumber(),
          );
          setValue(
            `articulos.${index}.tasaDeIeps`,
            producto.tasaDeIeps.toNumber(),
          );
        }}
      >
        <Check
          className={cn(
            'mr-2 h-4 w-4',
            value.id === producto.id ? 'opacity-100' : 'opacity-0',
          )}
        />
        {`${producto.codigo} - ${producto.descripcion}`}
      </CommandItem>
    );
  });
  return commandItems;
}

export function ProductoCombobox({ index }: { index: number }) {
  const { control } = useFormContext<PedidoSchema>();
  const [productoQuery, setProductoQuery] = useState('');
  return (
    <FormField
      control={control}
      name={`articulos.${index}.producto`}
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-6">
          <FormLabel>Producto</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-full justify-between h-fit min-h-10',
                    !value.id && 'text-muted-foreground',
                  )}
                  disabled={disabled}
                  name={name}
                  onBlur={onBlur}
                  ref={ref}
                >
                  <span className="text-wrap text-left">
                    {value.id
                      ? `${value.codigo} - ${value.descripcion}`
                      : 'Selecciona un producto'}
                  </span>
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0"
            >
              <Command shouldFilter={false}>
                <CommandInput
                  value={productoQuery}
                  onValueChange={setProductoQuery}
                  placeholder="Busca un producto"
                />
                <CommandList>
                  <SearchResults
                    productoQuery={productoQuery}
                    index={index}
                    onChange={onChange}
                    value={value}
                  />
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
