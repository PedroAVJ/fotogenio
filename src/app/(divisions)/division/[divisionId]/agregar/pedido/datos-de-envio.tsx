'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import type { PedidoSchema } from './schemas';

export function FechaDeEntrega() {
  const { control } = useFormContext<PedidoSchema>();
  return (
    <FormField
      control={control}
      name="fechaDeEntrega"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Fecha de entrega</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  disabled={disabled ?? false}
                  ref={ref}
                  name={name}
                  onBlur={onBlur}
                  className={cn(
                    'w-full justify-between',
                    !value && 'text-muted-foreground',
                  )}
                >
                  <span className="line-clamp-1">
                    {value
                      ? format(value, 'PPP', { locale: es })
                      : 'Selecciona una fecha'}
                  </span>
                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="flex w-auto flex-col space-y-2 p-2"
            >
              <Select
                onValueChange={(presetValue) =>
                  onChange(addDays(new Date(), parseInt(presetValue, 10)))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Acciones" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="1">Mañana</SelectItem>
                  <SelectItem value="3">En 3 días</SelectItem>
                  <SelectItem value="7">En una semana</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar
                  mode="single"
                  locale={es}
                  selected={value}
                  onSelect={onChange}
                  disabled={(date) => {
                    const today = startOfDay(new Date());
                    return isBefore(startOfDay(date), today);
                  }}
                  initialFocus
                />
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
