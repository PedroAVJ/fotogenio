'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { H1 } from '@/components/ui/typography';

import { createRuta } from './actions';
import { Paradas } from './paradas';
import { type RutaSchema, rutaSchema } from './schemas';

export default function Page() {
  const { divisionId } = useParams<{ divisionId: string }>();
  const form = useForm<RutaSchema>({
    resolver: zodResolver(rutaSchema),
    mode: 'onChange',
    defaultValues: {
      divisionId,
      nombre: '',
      paradas: [],
    },
  });
  const mutation = useMutation({
    mutationFn: createRuta,
    onSuccess() {
      toast.success('Ruta agregada');
    },
    onError(error) {
      toast.error('Ocurrió un error al agregar la ruta', {
        description: error.message,
      });
    },
  });
  function onSubmit(data: RutaSchema) {
    const transformedParadas = data.paradas.map((parada, index) => ({
      ...parada,
      visitOrder: index,
    }));
    mutation.mutate({
      ...data,
      paradas: transformedParadas,
    });
  }
  return (
    <Form {...form}>
      <form className="flex w-full flex-col gap-8">
        <H1 className="w-fit">Agregar ruta</H1>
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem className="col-span-5">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col space-y-4">
          <Paradas />
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
              Agregar ruta
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
