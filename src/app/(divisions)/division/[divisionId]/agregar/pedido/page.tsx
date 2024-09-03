'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { addDays } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useForm, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { H1, H2 } from '@/components/ui/typography';

import { createPedido } from './actions';
import { Articulos } from './articulos';
import { FechaDeEntrega } from './datos-de-envio';
import { PuntoDeEntregaCombobox } from './punto-de-entrega-combobox';
import { type PedidoSchema, pedidoSchema } from './schemas';

function PedidoBreakdown() {
  const { watch } = useFormContext<PedidoSchema>();
  const articulos = watch('articulos');
  const subTotal = articulos.reduce(
    (acc, articulo) => acc + articulo.cantidad * articulo.precioUnitario,
    0,
  );
  const importeDeIva = articulos.reduce(
    (acc, articulo) =>
      acc +
      (articulo.cantidad * articulo.precioUnitario * articulo.tasaDeIva) / 100,
    0,
  );
  const importeDeRetencionDeIva = articulos.reduce(
    (acc, articulo) =>
      acc +
      (articulo.cantidad * articulo.precioUnitario * articulo.retencionDeIva) /
        100,
    0,
  );
  const importeDeRetencionDeIsr = articulos.reduce(
    (acc, articulo) =>
      acc +
      (articulo.cantidad * articulo.precioUnitario * articulo.retencionDeIsr) /
        100,
    0,
  );
  const importeDeIeps = articulos.reduce(
    (acc, articulo) =>
      acc +
      (articulo.cantidad * articulo.precioUnitario * articulo.tasaDeIeps) / 100,
    0,
  );
  const total =
    subTotal +
    importeDeIva -
    importeDeRetencionDeIva -
    importeDeRetencionDeIsr +
    importeDeIeps;
  return (
    <div className="col-span-1 flex w-full flex-col items-end gap-4">
      <div className="flex flex-col gap-4">
        <Label>Subtotal</Label>
        <NumericFormat
          // React Hook Form
          value={subTotal}
          // Number Format
          fixedDecimalScale
          decimalScale={2}
          prefix="$"
          thousandsGroupStyle="thousand"
          thousandSeparator=","
          placeholder="Subtotal"
          customInput={Input}
          readOnly
        />
      </div>
      <div className="flex flex-col gap-4">
        <Label>IVA</Label>
        <NumericFormat
          value={importeDeIva}
          fixedDecimalScale
          decimalScale={2}
          prefix="$"
          thousandsGroupStyle="thousand"
          thousandSeparator=","
          placeholder="IVA"
          customInput={Input}
          readOnly
        />
      </div>
      <div className="flex flex-col gap-4">
        <Label>Retención de IVA</Label>
        <NumericFormat
          value={importeDeRetencionDeIva}
          fixedDecimalScale
          decimalScale={2}
          prefix="$"
          thousandsGroupStyle="thousand"
          thousandSeparator=","
          placeholder="Retención de IVA"
          customInput={Input}
          readOnly
        />
      </div>
      <div className="flex flex-col gap-4">
        <Label>Retención de ISR</Label>
        <NumericFormat
          value={importeDeRetencionDeIsr}
          fixedDecimalScale
          decimalScale={2}
          prefix="$"
          thousandsGroupStyle="thousand"
          thousandSeparator=","
          placeholder="Retención de ISR"
          customInput={Input}
          readOnly
        />
      </div>
      <div className="flex flex-col gap-4">
        <Label>IEPS</Label>
        <NumericFormat
          value={importeDeIeps}
          fixedDecimalScale
          decimalScale={2}
          prefix="$"
          thousandsGroupStyle="thousand"
          thousandSeparator=","
          placeholder="IEPS"
          customInput={Input}
          readOnly
        />
      </div>
      <div className="flex flex-col gap-4">
        <Label>Total</Label>
        <NumericFormat
          value={total}
          fixedDecimalScale
          decimalScale={2}
          prefix="$"
          thousandsGroupStyle="thousand"
          thousandSeparator=","
          placeholder="Total"
          customInput={Input}
          readOnly
        />
      </div>
    </div>
  );
}

export default function Page() {
  const { divisionId } = useParams<{ divisionId: string }>();
  const form = useForm<PedidoSchema>({
    resolver: zodResolver(pedidoSchema),
    mode: 'onChange',
    defaultValues: {
      divisionId,
      puntoDeEntrega: {
        id: '',
        clienteId: '',
        formattedAddress: '',
      },
      fechaDeEntrega: addDays(new Date(), 1),
      articulos: [],
    },
  });
  const mutation = useMutation({
    mutationFn: createPedido,
    onSuccess() {
      toast.success('Pedido agregado');
    },
    onError(error) {
      toast.error('Ocurrió un error al agregar el pedido', {
        description: error.message,
      });
    },
  });
  function onSubmit(data: PedidoSchema) {
    mutation.mutate(data);
  }
  return (
    <Form {...form}>
      <form className="flex w-full flex-col gap-4 p-4">
        <H1>Agregar pedido</H1>
        <div className="flex flex-col gap-4">
          <Articulos />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1 flex flex-col gap-4">
            <H2>Datos de envio</H2>
            <PuntoDeEntregaCombobox />
            <FechaDeEntrega />
          </div>
          <PedidoBreakdown />
        </div>
        {mutation.isPending ? (
          <Button className="w-fit self-end" disabled>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Guardando
          </Button>
        ) : (
          <Button
            className="w-fit self-end"
            onClick={form.handleSubmit(onSubmit)}
          >
            Agregar pedido
          </Button>
        )}
      </form>
    </Form>
  );
}
