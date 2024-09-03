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

import { searchUnidadesDeMedida } from './actions';
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
  return <Small className="p-4">No se encontraron unidades de medida</Small>;
}

function Error() {
  return (
    <Small className="p-4">
      Ocurrió un error al buscar las unidades de medida
    </Small>
  );
}

function SearchResults({
  unidadDeMedidaQuery,
  onChange,
  value,
}: {
  unidadDeMedidaQuery: string;
  onChange: (...event: unknown[]) => void;
  value: {
    id: string;
    clave: string;
    nombre: string;
  };
}) {
  const [debouncedUnidadDeMedidaQuery] = useDebounce(unidadDeMedidaQuery, 1000);
  const { isPending, isError, data } = useQuery({
    queryKey: ['searchUnidadesDeMedida', debouncedUnidadDeMedidaQuery],
    queryFn: async () => {
      if (!debouncedUnidadDeMedidaQuery) return [];
      const response = await searchUnidadesDeMedida(
        debouncedUnidadDeMedidaQuery,
      );
      return response?.data ?? [];
    },
  });
  if (!unidadDeMedidaQuery) return null;
  if (debouncedUnidadDeMedidaQuery !== unidadDeMedidaQuery) return <Loading />;
  if (isPending) return <Loading />;
  if (isError) return <Error />;
  if (data.length === 0) return <NoResults />;
  const commandItems = data.map((unidadDeMedida) => {
    return (
      <CommandItem
        key={unidadDeMedida.id}
        onSelect={() => {
          onChange(unidadDeMedida);
        }}
      >
        <Check
          className={cn(
            'mr-2 h-4 w-4',
            value.id === unidadDeMedida.id ? 'opacity-100' : 'opacity-0',
          )}
        />
        {`${unidadDeMedida.clave} - ${unidadDeMedida.nombre}`}
      </CommandItem>
    );
  });
  return commandItems;
}

export function UnidadDeMedidaCombobox() {
  const { control } = useFormContext<ProductoSchema>();
  const [unidadDeMedidaQuery, setUnidadDeMedidaQuery] = useState('');
  return (
    <FormField
      control={control}
      name="unidadDeMedida"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-6">
          <FormLabel>Unidad de medida</FormLabel>
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
                      ? `${value.clave} - ${value.nombre}`
                      : 'Selecciona una unidad de medida'}
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
                  value={unidadDeMedidaQuery}
                  onValueChange={setUnidadDeMedidaQuery}
                  placeholder="Busca una unidad de medida"
                />
                <CommandList>
                  <SearchResults
                    unidadDeMedidaQuery={unidadDeMedidaQuery}
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
