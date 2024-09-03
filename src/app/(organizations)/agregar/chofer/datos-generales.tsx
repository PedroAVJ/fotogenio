'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format, isBefore, startOfDay } from 'date-fns';
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
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { isCodigoDuplicate } from './actions';
import { type ChoferSchema } from './schemas';

export function Codigo() {
  const form = useFormContext<ChoferSchema>();
  return (
    <FormField
      control={form.control}
      name="codigo"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-3">
          <FormLabel>Código</FormLabel>
          <FormControl>
            <Input
              placeholder="Código"
              onChange={async (e) => {
                onChange(e);
                const codigo = e.target.value;
                if (!codigo) return;
                const response = await isCodigoDuplicate(codigo);
                if (!response?.data) {
                  form.setError('codigo', {
                    type: 'manual',
                    message: 'El código ya está en uso',
                  });
                }
              }}
              onBlur={onBlur}
              value={value}
              disabled={disabled}
              name={name}
              ref={ref}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function NombreCompleto() {
  const form = useFormContext<ChoferSchema>();
  return (
    <FormField
      control={form.control}
      name="nombreCompleto"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-6">
          <FormLabel>Nombre completo</FormLabel>
          <FormControl>
            <Input
              placeholder="Nombre completo"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              disabled={disabled}
              name={name}
              ref={ref}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function Licencia() {
  const form = useFormContext<ChoferSchema>();
  return (
    <FormField
      control={form.control}
      name="numeroDeLicencia"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-3">
          <FormLabel>Número de licencia</FormLabel>
          <FormControl>
            <Input
              placeholder="Número de licencia"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              disabled={disabled}
              name={name}
              ref={ref}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function FechaDeExpiracionDeLicencia() {
  const { control } = useFormContext<ChoferSchema>();
  return (
    <FormField
      control={control}
      name="fechaDeExpiracionDeLicencia"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-3">
          <FormLabel>Fecha de expiración de la licencia</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  disabled={disabled}
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
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                fromYear={new Date().getFullYear()}
                toYear={new Date().getFullYear() + 10}
                locale={es}
                selected={value}
                onSelect={onChange}
                disabled={(date) => {
                  const today = startOfDay(new Date());
                  return isBefore(startOfDay(date), today);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
