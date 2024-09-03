'use client';

import { useFormContext } from 'react-hook-form';

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
import type { ClienteSchema } from './schemas';

export function Codigo() {
  const { control, setError } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="codigo"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="flex-auto">
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

export function PaisInput() {
  const paisLabels: Record<Pais, string> = {
    [Pais.CANADA]: 'Canadá',
    [Pais.MEXICO]: 'México',
    [Pais.ESTADOS_UNIDOS]: 'Estados Unidos',
  };
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="pais"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="flex-auto">
          <FormLabel>País</FormLabel>
          <Select
            onValueChange={onChange}
            value={value}
            name={name}
            {...(disabled !== undefined ? { disabled } : {})}
          >
            <FormControl>
              <SelectTrigger onBlur={onBlur} ref={ref}>
                <SelectValue placeholder="Selecciona un país" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(paisLabels).map(([key, countryValue]) => (
                <SelectItem key={key} value={key}>
                  {countryValue}
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

export function NombreComercial() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="nombreComercial"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>Nombre comercial</FormLabel>
          <FormControl>
            <Input placeholder="Nombre comercial" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function RegimenCapital() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="regimenCapital"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>Régimen capital</FormLabel>
          <FormControl>
            <Input placeholder="Régimen capital" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CodigoPostal() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="codigoPostal"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>Codigo postal</FormLabel>
          <FormControl>
            <Input placeholder="Codigo postal" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function Colonia() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="colonia"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>Colonia</FormLabel>
          <FormControl>
            <Input placeholder="Colonia" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function Calle() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="calle"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>Calle</FormLabel>
          <FormControl>
            <Input placeholder="Calle" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function Ciudad() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="ciudad"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>Ciudad</FormLabel>
          <FormControl>
            <Input placeholder="Ciudad" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function Estado() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="estado"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>Estado</FormLabel>
          <FormControl>
            <Input placeholder="Estado" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
