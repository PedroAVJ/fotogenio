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

import { isCodigoDuplicate } from './actions';
import type { ProductoSchema } from './schemas';

export function Codigo() {
  const { control, setError } = useFormContext<ProductoSchema>();
  return (
    <FormField
      control={control}
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
                  setError('codigo', {
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
  const { control } = useFormContext<ProductoSchema>();
  return (
    <FormField
      control={control}
      name="descripcion"
      render={({ field }) => (
        <FormItem className="col-span-5">
          <FormLabel>Descripcion</FormLabel>
          <FormControl>
            <Input placeholder="Descripcion" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function Identificador() {
  const { control } = useFormContext<ProductoSchema>();
  return (
    <FormField
      control={control}
      name="identificador"
      render={({ field }) => (
        <FormItem className="col-span-2">
          <FormLabel>Identificador</FormLabel>
          <FormControl>
            <Input placeholder="Identificador" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CuentaContableSelect() {
  const cuentaContableLabels: Record<CuentaContable, string> = {
    [CuentaContable.VEHICULOS]: 'Vehículos',
    [CuentaContable.COMPUTADORAS]: 'Computadoras',
  };
  const { control } = useFormContext<ProductoSchema>();
  return (
    <FormField
      control={control}
      name="cuentaContable"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-3">
          <FormLabel>Cuenta contable</FormLabel>
          <Select
            onValueChange={onChange}
            value={value}
            name={name}
            {...(disabled !== undefined ? { disabled } : {})}
          >
            <FormControl>
              <SelectTrigger onBlur={onBlur} ref={ref}>
                <SelectValue placeholder="Selecciona una cuenta contable" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(cuentaContableLabels).map(
                ([key, cuentaContableValue]) => (
                  <SelectItem key={key} value={key}>
                    {cuentaContableValue}
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

export function PrecioUnitario() {
  const { control } = useFormContext<ProductoSchema>();
  return (
    <FormField
      control={control}
      name="precioUnitario"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-2">
          <FormLabel>Precio unitario</FormLabel>
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
              placeholder="Precio unitario"
              customInput={Input}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
