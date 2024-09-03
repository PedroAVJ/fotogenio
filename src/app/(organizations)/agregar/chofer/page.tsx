'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { H1 } from '@/components/ui/typography';

import { createChofer } from './actions';
import {
  Codigo,
  FechaDeExpiracionDeLicencia,
  Licencia,
  NombreCompleto,
} from './datos-generales';
import { type ChoferSchema, choferSchema } from './schemas';

export default function Page() {
  const form = useForm<ChoferSchema>({
    resolver: zodResolver(choferSchema),
    mode: 'onChange',
    defaultValues: {
      codigo: '',
      nombreCompleto: '',
      numeroDeLicencia: '',
    },
  });
  const mutation = useMutation({
    mutationFn: createChofer,
    onSuccess() {
      toast.success('Chofer agregado');
    },
    onError(error) {
      toast.error('Ocurrió un error al agregar el chofer', {
        description: error.message,
      });
    },
  });
  function onSubmit(data: ChoferSchema) {
    mutation.mutate(data);
  }
  return (
    <Form {...form}>
      <form className="grid w-full gap-12">
        <H1 className="w-fit">Agregar chofer</H1>
        <div className="flex flex-col gap-6">
          <div className="grid w-full grid-cols-12 gap-6">
            <Codigo />
            <NombreCompleto />
            <Licencia />
            <FechaDeExpiracionDeLicencia />
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
              Agregar chofer
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
