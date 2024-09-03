'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { isCodigoDuplicate } from './actions';
import { type VehiculoSchema } from './schemas';

export function Codigo() {
  const form = useFormContext<VehiculoSchema>();
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

export function Descripcion() {
  const form = useFormContext<VehiculoSchema>();
  return (
    <FormField
      control={form.control}
      name="descripcion"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-6">
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Input
              placeholder="Descripción"
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

export function TipoDeOdometroInput() {
  const tipoDeOdometroLabels: Record<TipoDeOdometro, string> = {
    [TipoDeOdometro.KILOMETROS]: 'Kilómetros',
    [TipoDeOdometro.MILLAS]: 'Millas',
    [TipoDeOdometro.HORAS]: 'Horas',
    [TipoDeOdometro.SIN_ODOMETRO]: 'Sin odómetro',
  };
  const { control } = useFormContext<VehiculoSchema>();
  return (
    <FormField
      control={control}
      name="tipoDeOdometro"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-3">
          <FormLabel>Tipo de odómetro</FormLabel>
          <Select
            onValueChange={onChange}
            value={value}
            name={name}
            {...(disabled !== undefined ? { disabled } : {})}
          >
            <FormControl>
              <SelectTrigger onBlur={onBlur} ref={ref}>
                <SelectValue placeholder="Selecciona un tipo de odómetro" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(tipoDeOdometroLabels).map(
                ([key, tipoDeOdometroValue]) => (
                  <SelectItem key={key} value={key}>
                    {tipoDeOdometroValue}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TipoDeVehiculoInput() {
  const tipoDeVehiculoLabels: Record<TipoDeVehiculo, string> = {
    [TipoDeVehiculo.PROPIO]: 'Propio',
    [TipoDeVehiculo.TERCEROS]: 'Terceros',
  };
  const { control } = useFormContext<VehiculoSchema>();
  return (
    <FormField
      control={control}
      name="tipoDeVehiculo"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-3">
          <FormLabel>Tipo de vehículo</FormLabel>
          <Select
            onValueChange={onChange}
            value={value}
            name={name}
            {...(disabled !== undefined ? { disabled } : {})}
          >
            <FormControl>
              <SelectTrigger onBlur={onBlur} ref={ref}>
                <SelectValue placeholder="Selecciona un tipo de vehículo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(tipoDeVehiculoLabels).map(
                ([key, tipoDeVehiculoValue]) => (
                  <SelectItem key={key} value={key}>
                    {tipoDeVehiculoValue}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function IdentificadorDeGps() {
  const form = useFormContext<VehiculoSchema>();
  return (
    <FormField
      control={form.control}
      name="identificadorDeGps"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-4">
          <FormLabel>Identificador de GPS</FormLabel>
          <FormControl>
            <Input
              placeholder="Identificador de GPS"
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

export function TipoDeCombustibleInput() {
  const tipoDeCombustibleLabels: Record<TipoDeCombustible, string> = {
    [TipoDeCombustible.GASOLINA]: 'Gasolina',
    [TipoDeCombustible.DIESEL]: 'Diésel',
    [TipoDeCombustible.GAS_BUTANO]: 'Gas butano',
  };
  const { control } = useFormContext<VehiculoSchema>();
  return (
    <FormField
      control={control}
      name="tipoDeCombustible"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-3">
          <FormLabel>Tipo de combustible</FormLabel>
          <Select
            onValueChange={onChange}
            value={value}
            name={name}
            {...(disabled !== undefined ? { disabled } : {})}
          >
            <FormControl>
              <SelectTrigger onBlur={onBlur} ref={ref}>
                <SelectValue placeholder="Selecciona un tipo de combustible" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(tipoDeCombustibleLabels).map(
                ([key, tipoDeCombustibleValue]) => (
                  <SelectItem key={key} value={key}>
                    {tipoDeCombustibleValue}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function NumeroDePolizaDeSeguro() {
  const form = useFormContext<VehiculoSchema>();
  return (
    <FormField
      control={form.control}
      name="numeroDePolizaDeSeguro"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-3">
          <FormLabel>Número de póliza de seguro</FormLabel>
          <FormControl>
            <Input
              placeholder="Número de póliza de seguro"
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

export function FechaDeExpiracionDePolizaDeSeguro() {
  const { control } = useFormContext<VehiculoSchema>();
  return (
    <FormField
      control={control}
      name="fechaDeExpiracionDePolizaDeSeguro"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-4">
          <FormLabel>Fecha de expiración de la póliza de seguro</FormLabel>
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

export function Horometraje() {
  const { control } = useFormContext<VehiculoSchema>();
  return (
    <FormField
      control={control}
      name="horometraje"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-2">
          <FormLabel>Horometraje</FormLabel>
          <FormControl>
            <NumericFormat
              // React Hook Form
              getInputRef={ref}
              onValueChange={({ floatValue }) => {
                onChange(floatValue);
              }}
              onBlur={onBlur}
              value={value}
              disabled={disabled}
              name={name}
              // Number Format
              allowNegative={false}
              fixedDecimalScale={false}
              decimalScale={0}
              placeholder="Horometraje"
              customInput={Input}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
