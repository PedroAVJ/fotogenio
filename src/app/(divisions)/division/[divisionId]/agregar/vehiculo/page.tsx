'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { H1 } from '@/components/ui/typography';

import { createVehiculo } from './actions';
import { ChoferCombobox } from './chofer-combobox';
import {
  Codigo,
  Descripcion,
  FechaDeExpiracionDePolizaDeSeguro,
  Horometraje,
  IdentificadorDeGps,
  NumeroDePolizaDeSeguro,
  TipoDeCombustibleInput,
  TipoDeOdometroInput,
  TipoDeVehiculoInput,
} from './datos-generales';
import { type VehiculoSchema, vehiculoSchema } from './schemas';

export default function Page() {
  const { divisionId } = useParams<{ divisionId: string }>();
  const form = useForm<VehiculoSchema>({
    resolver: zodResolver(vehiculoSchema),
    mode: 'onChange',
    defaultValues: {
      divisionId,
      codigo: '',
      descripcion: '',
      chofer: null,
      identificadorDeGps: '',
      numeroDePolizaDeSeguro: '',
    },
  });
  const mutation = useMutation({
    mutationFn: createVehiculo,
    onSuccess() {
      toast.success('Vehiculo agregado');
    },
    onError(error) {
      toast.error('Ocurrió un error al agregar el vehiculo', {
        description: error.message,
      });
    },
  });
  function onSubmit(data: VehiculoSchema) {
    mutation.mutate(data);
  }
  return (
    <Form {...form}>
      <form className="grid w-full gap-12">
        <H1 className="w-fit">Agregar vehiculo</H1>
        <div className="flex flex-col gap-6">
          <div className="grid w-full grid-cols-12 gap-6">
            <Codigo />
            <Descripcion />
            <TipoDeOdometroInput />
            <ChoferCombobox />
            <TipoDeVehiculoInput />
            <IdentificadorDeGps />
            <TipoDeCombustibleInput />
            <NumeroDePolizaDeSeguro />
            <FechaDeExpiracionDePolizaDeSeguro />
            <Horometraje />
          </div>
        </div>
        <div className="flex justify-end">
          {mutation.isPending ? (
            <Button type="button" disabled className="w-fit">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Guardando
            </Button>
          ) : (
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              className="w-fit"
            >
              Agregar vehiculo
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
