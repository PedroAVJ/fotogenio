'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
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

import { createDivision, isNombreDuplicate } from './actions';
import { type DivisionSchema, divisionSchema } from './schemas';

export default function Page() {
  const form = useForm<DivisionSchema>({
    resolver: zodResolver(divisionSchema),
    mode: 'onChange',
    defaultValues: {
      nombre: '',
    },
  });
  const mutation = useMutation({
    mutationFn: createDivision,
    onSuccess() {
      toast.success('Division agregada');
    },
    onError(error) {
      toast.error('Ocurrió un error al agregar la division', {
        description: error.message,
      });
    },
  });
  function onSubmit(data: DivisionSchema) {
    mutation.mutate(data);
  }
  return (
    <Form {...form}>
      <form className="grid w-full gap-12">
        <H1 className="w-fit">Agregar division</H1>
        <div className="flex flex-col gap-6">
          <div className="grid w-full grid-cols-12 gap-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({
                field: { onChange, onBlur, value, disabled, name, ref },
              }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre"
                      onChange={async (e) => {
                        onChange(e);
                        const nombre = e.target.value;
                        if (!nombre) return;
                        const response = await isNombreDuplicate(nombre);
                        if (!response?.data) {
                          form.setError('nombre', {
                            type: 'manual',
                            message: 'El nombre ya está en uso',
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
              Agregar division
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
