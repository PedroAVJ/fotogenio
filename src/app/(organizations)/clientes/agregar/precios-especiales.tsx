'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { ProductoCombobox } from './producto-combobox';
import {
  type ClienteSchema,
  type PrecioEspecialSchema,
  precioEspecialSchema,
} from './schemas';

function PrecioEspecialInput() {
  const { control } = useFormContext<PrecioEspecialSchema>();
  return (
    <FormField
      control={control}
      name="precioEspecial"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="flex-auto">
          <FormLabel>Precio especial</FormLabel>
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
              placeholder="Precio especial"
              customInput={Input}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Actions({
  index,
  defaultPrecioEspecial,
}: {
  index: number;
  defaultPrecioEspecial: PrecioEspecialSchema;
}) {
  const { control, watch } = useFormContext<ClienteSchema>();
  const { remove, update } = useFieldArray({
    control,
    name: 'preciosEspeciales',
  });
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<PrecioEspecialSchema>({
    resolver: zodResolver(precioEspecialSchema),
    mode: 'onChange',
    defaultValues: defaultPrecioEspecial,
  });
  function onSubmit(data: PrecioEspecialSchema) {
    update(index, data);
    setIsOpen(false);
  }
  const preciosEspeciales = watch('preciosEspeciales');
  const productoIds = preciosEspeciales.map(
    (precioEspecial) => precioEspecial.producto.id,
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
              }}
            >
              Editar
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Precio especial</DialogTitle>
              <DialogDescription>
                Actualiza la información de este precio especial.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="flex flex-col gap-4 py-4 pr-4">
                <ProductoCombobox productoIds={productoIds} />
                <PrecioEspecialInput />
              </form>
            </Form>
            <DialogFooter>
              <Button onClick={form.handleSubmit(onSubmit)}>Actualizar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
              }}
            >
              Eliminar
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Estas seguro que quieres eliminar este precio especial?
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PreciosEspeciales() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<PrecioEspecialSchema>({
    resolver: zodResolver(precioEspecialSchema),
    mode: 'onChange',
    defaultValues: {
      precioEspecial: 0,
      producto: {
        id: '',
        divisionId: '',
        codigo: '',
        descripcion: '',
      },
    },
  });
  const { control, watch } = useFormContext<ClienteSchema>();
  const { append } = useFieldArray({
    control,
    name: 'preciosEspeciales',
  });
  const preciosEspeciales = watch('preciosEspeciales');
  function onSubmit(data: PrecioEspecialSchema) {
    append(data);
    form.reset({
      precioEspecial: 0,
      producto: {
        id: '',
        divisionId: '',
        codigo: '',
        descripcion: '',
      },
    });
    setIsOpen(false);
  }
  const productoIds = preciosEspeciales.map(
    (precioEspecial) => precioEspecial.producto.id,
  );
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Precios Especiales</CardTitle>
          <CardDescription>
            Tabla de precios especiales para este cliente.
          </CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Agregar precio especial</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Precio especial</DialogTitle>
              <DialogDescription>
                Agrega un nuevo precio especial a este cliente.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="flex flex-col gap-4 py-4 pr-4">
                <ProductoCombobox productoIds={productoIds} />
                <PrecioEspecialInput />
              </form>
            </Form>
            <DialogFooter>
              <Button onClick={form.handleSubmit(onSubmit)}>Agregar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Precio especial</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preciosEspeciales.length ? (
                preciosEspeciales.map((precioEspecial, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <TableRow key={index}>
                    <TableCell>{precioEspecial.producto.codigo}</TableCell>
                    <TableCell>{precioEspecial.producto.descripcion}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(precioEspecial.precioEspecial)}
                    </TableCell>
                    <TableCell>
                      <Actions
                        index={index}
                        defaultPrecioEspecial={precioEspecial}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No hay precios especiales
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
