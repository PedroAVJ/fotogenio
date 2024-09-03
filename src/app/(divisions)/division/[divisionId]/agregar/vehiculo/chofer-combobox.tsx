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

import { searchChoferes } from './actions';
import type { VehiculoSchema } from './schemas';

function Loading() {
  return (
    <Small className="flex items-center justify-center p-4">
      <Loader2 className="mr-2 size-4 animate-spin" />
      Cargando
    </Small>
  );
}

function NoResults() {
  return <Small className="p-4">No se encontraron choferes</Small>;
}

function Error() {
  return <Small className="p-4">Ocurrió un error al buscar los choferes</Small>;
}

function SearchResults({
  choferQuery,
  onChange,
  value,
}: {
  choferQuery: string;
  onChange: (...event: unknown[]) => void;
  value: {
    id: string;
    nombreCompleto: string;
  } | null;
}) {
  const [debouncedChoferQuery] = useDebounce(choferQuery, 1000);
  const { isPending, isError, data } = useQuery({
    queryKey: ['searchChoferes', debouncedChoferQuery],
    queryFn: async () => {
      if (!debouncedChoferQuery) return [];
      const response = await searchChoferes(debouncedChoferQuery);
      return response?.data ?? [];
    },
  });
  if (!choferQuery) return null;
  if (debouncedChoferQuery !== choferQuery) return <Loading />;
  if (isPending) return <Loading />;
  if (isError) return <Error />;
  if (data.length === 0) return <NoResults />;
  const commandItems = data.map((chofer) => {
    return (
      <CommandItem
        key={chofer.id}
        onSelect={() => {
          onChange(chofer);
        }}
      >
        <Check
          className={cn(
            'mr-2 h-4 w-4',
            value?.id === chofer.id ? 'opacity-100' : 'opacity-0',
          )}
        />
        {chofer.nombreCompleto}
      </CommandItem>
    );
  });
  return commandItems;
}

export function ChoferCombobox() {
  const { control } = useFormContext<VehiculoSchema>();
  const [choferQuery, setChoferQuery] = useState('');
  return (
    <FormField
      control={control}
      name="chofer"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-6">
          <FormLabel>Chofer</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-full justify-between h-fit min-h-10',
                    !value && 'text-muted-foreground',
                  )}
                  disabled={disabled}
                  name={name}
                  onBlur={onBlur}
                  ref={ref}
                >
                  <span className="text-wrap text-left">
                    {value ? value.nombreCompleto : 'Selecciona un cliente'}
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
                  value={choferQuery}
                  onValueChange={setChoferQuery}
                  placeholder="Busca un chofer"
                />
                <CommandList>
                  <SearchResults
                    choferQuery={choferQuery}
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
