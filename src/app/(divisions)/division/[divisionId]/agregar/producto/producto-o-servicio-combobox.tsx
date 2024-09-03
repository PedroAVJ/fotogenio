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

import { searchProductoOServicio } from './actions';
import type { ProductoSchema } from './schemas';

function Loading() {
  return (
    <Small className="flex items-center justify-center p-4">
      <Loader2 className="mr-2 size-4 animate-spin" />
      Cargando
    </Small>
  );
}

function NoResults() {
  return <Small className="p-4">No se encontraron productos o servicios</Small>;
}

function Error() {
  return (
    <Small className="p-4">
      Ocurrió un error al buscar los productos o servicios
    </Small>
  );
}

function SearchResults({
  productoOServicioQuery,
  onChange,
  value,
}: {
  productoOServicioQuery: string;
  onChange: (...event: unknown[]) => void;
  value: {
    id: string;
    descripcion: string;
    clave: number;
  };
}) {
  const [debouncedProductoOServicioQuery] = useDebounce(
    productoOServicioQuery,
    1000,
  );
  const { isPending, isError, data } = useQuery({
    queryKey: ['searchProductoOServicio', debouncedProductoOServicioQuery],
    queryFn: async () => {
      if (!debouncedProductoOServicioQuery) return [];
      const response = await searchProductoOServicio(
        debouncedProductoOServicioQuery,
      );
      return response?.data ?? [];
    },
  });
  if (!productoOServicioQuery) return null;
  if (debouncedProductoOServicioQuery !== productoOServicioQuery)
    return <Loading />;
  if (isPending) return <Loading />;
  if (isError) return <Error />;
  if (data.length === 0) return <NoResults />;
  const commandItems = data.map((productoOServicio) => {
    return (
      <CommandItem
        key={productoOServicio.id}
        onSelect={() => {
          onChange(productoOServicio);
        }}
      >
        <Check
          className={cn(
            'mr-2 h-4 w-4',
            value.id === productoOServicio.id ? 'opacity-100' : 'opacity-0',
          )}
        />
        {`${productoOServicio.clave} - ${productoOServicio.descripcion}`}
      </CommandItem>
    );
  });
  return commandItems;
}

export function ProductoOServicioCombobox() {
  const { control } = useFormContext<ProductoSchema>();
  const [productoOServicioQuery, setProductoOServicioQuery] = useState('');
  return (
    <FormField
      control={control}
      name="productoOServicio"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-6">
          <FormLabel>Producto o servicio</FormLabel>
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
                      ? `${value.clave} - ${value.descripcion}`
                      : 'Selecciona un producto o servicio'}
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
                  value={productoOServicioQuery}
                  onValueChange={setProductoOServicioQuery}
                  placeholder="Busca un producto o servicio"
                />
                <CommandList>
                  <SearchResults
                    productoOServicioQuery={productoOServicioQuery}
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
