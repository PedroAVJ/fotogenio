'use client';

import { useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MAX_PERCENT, MAX_TASA_DE_IVA } from '@/lib/constants';

import type { ProductoSchema } from './schemas';

export function ObjetoDeImpuestoSelect() {
  const objetoDeImpuestoLabels: Record<ObjetoDeImpuesto, string> = {
    [ObjetoDeImpuesto.NO_OBJETO]: 'No objecto de impuesto',
    [ObjetoDeImpuesto.SI_OBJETO]: 'Sí objecto de impuesto',
    [ObjetoDeImpuesto.SI_OBJETO_NO_OBLIGADO]:
      'Sí objecto de impuesto y no obligado al desglose',
  };
  const { control, setValue } = useFormContext<ProductoSchema>();
  return (
    <FormField
      control={control}
      name="objetoDeImpuesto"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-4">
          <FormLabel>Objeto de impuesto</FormLabel>
          <Select
            onValueChange={(objetoDeImpuestoValue) => {
              onChange(objetoDeImpuestoValue);
              if (objetoDeImpuestoValue === ObjetoDeImpuesto.NO_OBJETO) {
                setValue('tipoDeIva', TipoDeIva.NO_APLICA);
                setValue('tasaDeIva', 0);
                setValue('retencionDeIva', 0);
                setValue('retencionDeIsr', 0);
                setValue('tasaDeIeps', 0);
              }
            }}
            value={value}
            name={name}
            {...(disabled !== undefined ? { disabled } : {})}
          >
            <FormControl>
              <SelectTrigger onBlur={onBlur} ref={ref}>
                <SelectValue placeholder="Selecciona un objeto de impuesto" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(objetoDeImpuestoLabels).map(
                ([key, objetoDeImpuestoValue]) => (
                  <SelectItem key={key} value={key}>
                    {objetoDeImpuestoValue}
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

export function TipoDeIvaSelect() {
  const tipoDeIvaLabels: Record<TipoDeIva, string> = {
    [TipoDeIva.TASA_GENERAL]: 'Tasa general',
    [TipoDeIva.ZERO]: 'Al 0%',
    [TipoDeIva.EXENTO]: 'Exento',
    [TipoDeIva.OTRA_TASA]: 'Otra tasa',
    [TipoDeIva.NO_APLICA]: 'N/A',
  };
  const { control, watch, setValue } = useFormContext<ProductoSchema>();
  const objetoDeImpuesto = watch('objetoDeImpuesto');
  const filteredOptions =
    objetoDeImpuesto === ObjetoDeImpuesto.NO_OBJETO
      ? { [TipoDeIva.NO_APLICA]: 'N/A' }
      : tipoDeIvaLabels;
  return (
    <FormField
      control={control}
      name="tipoDeIva"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-3">
          <FormLabel>Tipo de iva</FormLabel>
          <Select
            onValueChange={(tipoDeIva) => {
              onChange(tipoDeIva);
              if (
                tipoDeIva === TipoDeIva.NO_APLICA ||
                tipoDeIva === TipoDeIva.EXENTO ||
                tipoDeIva === TipoDeIva.ZERO
              ) {
                setValue('tasaDeIva', 0);
                setValue('retencionDeIva', 0);
              } else if (tipoDeIva === TipoDeIva.TASA_GENERAL) {
                setValue('tasaDeIva', 16);
              }
            }}
            value={value}
            {...(disabled !== undefined ? { disabled } : {})}
            name={name}
          >
            <FormControl>
              <SelectTrigger ref={ref} onBlur={onBlur}>
                <SelectValue placeholder="Selecciona un tipo de iva" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(filteredOptions).map(([key, tipoDeIvaValue]) => (
                <SelectItem key={key} value={key}>
                  {tipoDeIvaValue}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TasaDeIva() {
  const { control, watch, getValues, setValue } =
    useFormContext<ProductoSchema>();
  const objetoDeImpuesto = watch('objetoDeImpuesto');
  const tipoDeIva = watch('tipoDeIva');
  return (
    <FormField
      control={control}
      name="tasaDeIva"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-2">
          <FormLabel>Tasa de iva</FormLabel>
          <FormControl>
            <NumericFormat
              // React Hook Form
              getInputRef={ref}
              onValueChange={({ floatValue }) => {
                onChange(floatValue);
                if (floatValue === undefined) {
                  return;
                }
                if (floatValue < getValues('retencionDeIva')) {
                  setValue('retencionDeIva', floatValue);
                }
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
                if (objetoDeImpuesto === ObjetoDeImpuesto.NO_OBJETO) {
                  return floatValue === 0;
                }
                if (
                  tipoDeIva === TipoDeIva.EXENTO ||
                  tipoDeIva === TipoDeIva.ZERO ||
                  tipoDeIva === TipoDeIva.NO_APLICA
                ) {
                  return floatValue === 0;
                }
                if (tipoDeIva === TipoDeIva.TASA_GENERAL) {
                  return floatValue === 16;
                }
                return floatValue <= MAX_TASA_DE_IVA;
              }}
              allowNegative={false}
              fixedDecimalScale
              decimalScale={2}
              suffix="%"
              placeholder="Tasa de iva"
              customInput={Input}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function RetencionDeIva() {
  const { control, watch } = useFormContext<ProductoSchema>();
  const tasaDeIva = watch('tasaDeIva');
  const objetoDeImpuesto = watch('objetoDeImpuesto');
  const tipoDeIva = watch('tipoDeIva');
  return (
    <FormField
      control={control}
      name="retencionDeIva"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-2">
          <FormLabel>Retencion de iva</FormLabel>
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
                if (objetoDeImpuesto === ObjetoDeImpuesto.NO_OBJETO) {
                  return floatValue === 0;
                }
                if (
                  tipoDeIva === TipoDeIva.NO_APLICA ||
                  tipoDeIva === TipoDeIva.EXENTO ||
                  tipoDeIva === TipoDeIva.ZERO
                ) {
                  return floatValue === 0;
                }
                return floatValue <= tasaDeIva;
              }}
              allowNegative={false}
              fixedDecimalScale
              decimalScale={2}
              suffix="%"
              placeholder="Retencion de iva"
              customInput={Input}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function RetencionDeIsr() {
  const { control, watch } = useFormContext<ProductoSchema>();
  const objetoDeImpuesto = watch('objetoDeImpuesto');
  return (
    <FormField
      control={control}
      name="retencionDeIsr"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-2">
          <FormLabel>Retencion de isr</FormLabel>
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
                if (objetoDeImpuesto === ObjetoDeImpuesto.NO_OBJETO) {
                  return floatValue === 0;
                }
                return floatValue <= MAX_PERCENT;
              }}
              allowNegative={false}
              fixedDecimalScale
              decimalScale={2}
              suffix="%"
              placeholder="Retencion de isr"
              customInput={Input}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TasaDeIEPS() {
  const { control, watch } = useFormContext<ProductoSchema>();
  const objetoDeImpuesto = watch('objetoDeImpuesto');
  return (
    <FormField
      control={control}
      name="tasaDeIeps"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-2">
          <FormLabel>Tasa de IEPS</FormLabel>
          <FormControl>
            <NumericFormat
              getInputRef={ref}
              onValueChange={({ floatValue }) => {
                onChange(floatValue);
              }}
              onBlur={onBlur}
              value={value}
              disabled={disabled}
              name={name}
              isAllowed={({ floatValue }) => {
                if (floatValue === undefined) {
                  return false;
                }
                if (objetoDeImpuesto === ObjetoDeImpuesto.NO_OBJETO) {
                  return floatValue === 0;
                }
                return floatValue <= MAX_PERCENT;
              }}
              allowNegative={false}
              fixedDecimalScale
              decimalScale={2}
              suffix="%"
              placeholder="Tasa de IEPS"
              customInput={Input}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
