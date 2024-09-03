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

import { searchPlaces } from './actions';
import type { PuntoDeEntregaSchema } from './schemas';

function Loading() {
  return (
    <Small className="flex items-center justify-center p-4">
      <Loader2 className="mr-2 size-4 animate-spin" />
      Cargando
    </Small>
  );
}

function NoResults() {
  return <Small className="p-4">No se encontraron direcciones</Small>;
}

function Error() {
  return (
    <Small className="p-4">Ocurrió un error al buscar las direcciones</Small>
  );
}

function SearchResults({
  placeQuery,
  onChange,
  value,
}: {
  placeQuery: string;
  onChange: (...event: unknown[]) => void;
  value: {
    id: string;
    formattedAddress: string;
  };
}) {
  const [debouncedPlaceQuery] = useDebounce(placeQuery, 1000);
  const { isPending, isError, data } = useQuery({
    queryKey: ['searchPlace', debouncedPlaceQuery],
    queryFn: async () => {
      if (!debouncedPlaceQuery) return [];
      const response = await searchPlaces(debouncedPlaceQuery);
      return response?.data ?? [];
    },
  });
  if (!placeQuery) return null;
  if (debouncedPlaceQuery !== placeQuery) return <Loading />;
  if (isPending) return <Loading />;
  if (isError) return <Error />;
  if (data.length === 0) return <NoResults />;
  const commandItems = data.map((place) => {
    return (
      <CommandItem
        key={place.id}
        onSelect={() => {
          onChange(place);
        }}
      >
        <Check
          className={cn(
            'mr-2 h-4 w-4',
            value.id === place.id ? 'opacity-100' : 'opacity-0',
          )}
        />
        {place.formattedAddress}
      </CommandItem>
    );
  });
  return commandItems;
}

export function PlaceCombobox() {
  const { control } = useFormContext<PuntoDeEntregaSchema>();
  const [placeQuery, setPlaceQuery] = useState('');
  return (
    <FormField
      control={control}
      name="place"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="flex-auto">
          <FormLabel>Dirección</FormLabel>
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
                      ? value.formattedAddress
                      : 'Selecciona una dirección'}
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
                  value={placeQuery}
                  onValueChange={setPlaceQuery}
                  placeholder="Busca una dirección"
                />
                <CommandList>
                  <SearchResults
                    placeQuery={placeQuery}
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
