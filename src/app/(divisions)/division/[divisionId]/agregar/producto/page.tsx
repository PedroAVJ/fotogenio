'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { H1, H2 } from '@/components/ui/typography';

import { createProducto } from './actions';
import {
  ObjetoDeImpuestoSelect,
  RetencionDeIsr,
  RetencionDeIva,
  TasaDeIEPS,
  TasaDeIva,
  TipoDeIvaSelect,
} from './datos-de-impuesto';
import {
  Codigo,
  CuentaContableSelect,
  Descripcion,
  Identificador,
  PrecioUnitario,
} from './datos-generales';
import { ProductoOServicioCombobox } from './producto-o-servicio-combobox';
import { type ProductoSchema, productoSchema } from './schemas';
import { UnidadDeMedidaCombobox } from './unidad-de-medida-combobox';

export default function Page() {
  const { divisionId } = useParams<{ divisionId: string }>();
  const form = useForm<ProductoSchema>({
    resolver: zodResolver(productoSchema),
    mode: 'onChange',
    defaultValues: {
      divisionId,
      codigo: '',
      descripcion: '',
      identificador: '',
      unidadDeMedida: {
        id: '',
        clave: '',
        nombre: '',
      },
      productoOServicio: {
        id: '',
        clave: 0,
        descripcion: '',
      },
    },
  });
  const mutation = useMutation({
    mutationFn: createProducto,
    onSuccess() {
      toast.success('Producto agregado');
    },
    onError(error) {
      toast.error('Ocurrió un error al agregar el producto', {
        description: error.message,
      });
    },
  });
  function onSubmit(data: ProductoSchema) {
    mutation.mutate(data);
  }
  return (
    <Form {...form}>
      <form className="grid w-full gap-12">
        <H1 className="w-fit">Agregar producto</H1>
        <div className="flex flex-col gap-6">
          <H2>Datos generales</H2>
          <div className="grid w-full grid-cols-12 gap-4">
            <Codigo />
            <Descripcion />
            <Identificador />
            <PrecioUnitario />
            <CuentaContableSelect />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <H2>Datos de impuestos</H2>
          <div className="grid w-full grid-cols-12 gap-4">
            <ProductoOServicioCombobox />
            <UnidadDeMedidaCombobox />
            <ObjetoDeImpuestoSelect />
            <TipoDeIvaSelect />
            <TasaDeIva />
            <RetencionDeIva />
            <RetencionDeIsr />
            <TasaDeIEPS />
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
              Agregar producto
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
