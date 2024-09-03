'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { H2, P } from '@/components/ui/typography';

import { ProductoCombobox } from './producto-combobox';
import { type PedidoSchema } from './schemas';

function Cantidad({ index }: { index: number }) {
  const { control } = useFormContext<PedidoSchema>();
  return (
    <FormField
      control={control}
      name={`articulos.${index}.cantidad` as const}
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="col-span-2">
          <FormLabel>Cantidad</FormLabel>
          <FormControl>
            <NumericFormat
              // React Hook Form
              getInputRef={ref}
              onValueChange={({ floatValue }) => {
                if (floatValue === undefined) {
                  return;
                }
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
              thousandsGroupStyle="thousand"
              thousandSeparator=","
              placeholder="Cantidad"
              customInput={Input}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function PrecioUnitario({ index }: { index: number }) {
  const { watch } = useFormContext<PedidoSchema>();
  const precioUnitario = watch(`articulos.${index}.precioUnitario`);
  return (
    <div className="flex flex-col gap-4">
      <Label>Precio unitario</Label>
      <NumericFormat
        // React Hook Form
        value={precioUnitario}
        // Number Format
        fixedDecimalScale
        decimalScale={2}
        prefix="$"
        thousandsGroupStyle="thousand"
        thousandSeparator=","
        placeholder="Precio unitario"
        customInput={Input}
        readOnly
      />
    </div>
  );
}

function Subtotal({ index }: { index: number }) {
  const { watch } = useFormContext<PedidoSchema>();
  const cantidad = watch(`articulos.${index}.cantidad`);
  const precioUnitario = watch(`articulos.${index}.precioUnitario`);
  const subtotal = cantidad * precioUnitario;
  return (
    <div className="flex flex-col gap-4">
      <Label>Subtotal</Label>
      <NumericFormat
        // React Hook Form
        value={subtotal}
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
  );
}

export function Articulos() {
  const [animationParent] = useAutoAnimate();
  const { control, watch } = useFormContext<PedidoSchema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'articulos',
  });
  const puntoDeEntrega = watch('puntoDeEntrega.id');
  return (
    <>
      <H2>Articulos</H2>
      <div ref={animationParent}>
        {fields.length === 0 && <P>No hay articulos</P>}
        {fields.map((field, index) => {
          return (
            <section
              key={field.id}
              className="grid grid-cols-12 items-center gap-4"
            >
              <ProductoCombobox index={index} />
              <Cantidad index={index} />
              <PrecioUnitario index={index} />
              <Subtotal index={index} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="col-span-1 self-end"
                  >
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Estas seguro que quieres eliminar este articulo?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </section>
          );
        })}
      </div>
      <Button
        type="button"
        className="w-fit"
        onClick={() => {
          append({
            cantidad: 0,
            producto: {
              id: '',
              codigo: '',
              descripcion: '',
            },
            tasaDeIva: 0,
            retencionDeIva: 0,
            retencionDeIsr: 0,
            tasaDeIeps: 0,
            precioUnitario: 0,
          });
        }}
        disabled={puntoDeEntrega === ''}
      >
        Agregar articulo
      </Button>
    </>
  );
}
