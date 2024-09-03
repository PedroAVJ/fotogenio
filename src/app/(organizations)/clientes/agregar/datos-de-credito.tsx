'use client';

import { useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { MAX_PERCENT } from '@/lib/constants';

import type { ClienteSchema } from './schemas';

export function TopeDeCredito() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="topeDeCredito"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="flex-auto">
          <FormLabel>Tope de crédito</FormLabel>
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
              fixedDecimalScale
              decimalScale={2}
              prefix="$"
              thousandsGroupStyle="thousand"
              thousandSeparator=","
              placeholder="Tope de crédito"
              customInput={Input}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function Descuento() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="descuento"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="flex-auto">
          <FormLabel>Descuento</FormLabel>
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
              isAllowed={({ floatValue }) => {
                if (floatValue === undefined) {
                  return false;
                }
                return floatValue <= MAX_PERCENT;
              }}
              allowNegative={false}
              fixedDecimalScale
              decimalScale={2}
              suffix="%"
              placeholder="Descuento"
              customInput={Input}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function DiasACredito() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="diasACredito"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="flex-auto">
          <FormLabel>Días a crédito</FormLabel>
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
              placeholder="Días a crédito"
              customInput={Input}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function EsPrecioEspecial() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="esPrecioEspecial"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="flex flex-row items-center justify-between gap-6 rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>Precio especial</FormLabel>
            <FormDescription>
              Solamente los supervisores pueden asignar precios especiales.
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={value}
              onCheckedChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              name={name}
              ref={ref}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
