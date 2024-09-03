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

import { searchPuntosDeEntrega } from './actions';
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
  return <Small className="p-4">No se encontraron puntos de entrega</Small>;
}

function Error() {
  return (
    <Small className="p-4">
      Ocurrió un error al buscar los puntos de entrega
    </Small>
  );
}

function SearchResults({
  puntoDeEntregaQuery,
  onChange,
  value,
}: {
  puntoDeEntregaQuery: string;
  onChange: (...event: unknown[]) => void;
  value: {
    id: string;
    clienteId: string;
    formattedAddress: string;
  };
}) {
  const { setValue } = useFormContext<PedidoSchema>();
  const [debouncedPuntoDeEntregaQuery] = useDebounce(puntoDeEntregaQuery, 1000);
  const { isPending, isError, data } = useQuery({
    queryKey: ['searchPuntoDeEntrega', debouncedPuntoDeEntregaQuery],
    queryFn: async () => {
      if (!debouncedPuntoDeEntregaQuery) return [];
      const response = await searchPuntosDeEntrega(
        debouncedPuntoDeEntregaQuery,
      );
      return response?.data ?? [];
    },
  });
  if (!puntoDeEntregaQuery) return null;
  if (debouncedPuntoDeEntregaQuery !== puntoDeEntregaQuery) return <Loading />;
  if (isPending) return <Loading />;
  if (isError) return <Error />;
  if (data.length === 0) return <NoResults />;
  const commandItems = data.map((puntoDeEntrega) => {
    return (
      <CommandItem
        key={puntoDeEntrega.id}
        onSelect={() => {
          if (value.clienteId !== puntoDeEntrega.clienteId) {
            setValue('articulos', []);
          }
          onChange(puntoDeEntrega);
        }}
      >
        <Check
          className={cn(
            'mr-2 h-4 w-4',
            value.id === puntoDeEntrega.id ? 'opacity-100' : 'opacity-0',
          )}
        />
        {puntoDeEntrega.formattedAddress}
      </CommandItem>
    );
  });
  return commandItems;
}

export function PuntoDeEntregaCombobox() {
  const { control } = useFormContext<PedidoSchema>();
  const [puntoDeEntregaQuery, setPuntoDeEntregaQuery] = useState('');
  return (
    <FormField
      control={control}
      name="puntoDeEntrega"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-6">
          <FormLabel>Punto de entrega</FormLabel>
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
                  disabled={disabled ?? false}
                  name={name}
                  onBlur={onBlur}
                  ref={ref}
                >
                  <span className="text-wrap text-left">
                    {value.id
                      ? value.formattedAddress
                      : 'Selecciona un punto de entrega'}
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
                  value={puntoDeEntregaQuery}
                  onValueChange={setPuntoDeEntregaQuery}
                  placeholder="Busca un punto de entrega"
                />
                <CommandList>
                  <SearchResults
                    puntoDeEntregaQuery={puntoDeEntregaQuery}
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
