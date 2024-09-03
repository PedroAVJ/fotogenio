'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';

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
import { DataTablePagination } from '@/components/ui/data-table-pagination';
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

import { PlaceCombobox } from './place-combobox';
import {
  type ClienteSchema,
  type PuntoDeEntregaSchema,
  puntoDeEntregaSchema,
} from './schemas';

function Referencia() {
  const { control } = useFormContext<PuntoDeEntregaSchema>();
  return (
    <FormField
      control={control}
      name="referencia"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>Referencia</FormLabel>
          <FormControl>
            <Input placeholder="Referencia" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function getColumns(): ColumnDef<PuntoDeEntregaSchema>[] {
  return [
    {
      id: 'formattedAddress',
      accessorKey: 'place.formattedAddress',
      header: 'Dirección',
    },
    {
      accessorKey: 'referencia',
      header: 'Referencia',
    },
    {
      id: 'actions',
      cell: function Actions({ row }) {
        const { control, watch } = useFormContext<ClienteSchema>();
        const { remove, update } = useFieldArray({
          control,
          name: 'puntosDeEntrega',
        });
        const [isOpen, setIsOpen] = useState(false);
        const puntoDeEntrega = watch(`puntosDeEntrega.${row.index}`);
        const form = useForm<PuntoDeEntregaSchema>({
          resolver: zodResolver(puntoDeEntregaSchema),
          mode: 'onChange',
          defaultValues: puntoDeEntrega,
        });
        function onSubmit(data: PuntoDeEntregaSchema) {
          update(row.index, data);
          setIsOpen(false);
        }
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
                    <DialogTitle>Punto de entrega</DialogTitle>
                    <DialogDescription>
                      Actualiza la información de este punto de entrega.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form className="flex flex-col gap-4 py-4">
                      <PlaceCombobox />
                      <Referencia />
                    </form>
                  </Form>
                  <DialogFooter>
                    <Button onClick={form.handleSubmit(onSubmit)}>
                      Actualizar
                    </Button>
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
                      Estas seguro que quieres eliminar este punto de entrega?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        remove(row.index);
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
      },
    },
  ];
}

export function PuntosDeEntrega() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { watch, control } = useFormContext<ClienteSchema>();
  const columns = useMemo(() => getColumns(), []);
  const puntosDeEntrega = watch('puntosDeEntrega');
  const table = useReactTable({
    data: puntosDeEntrega,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<PuntoDeEntregaSchema>({
    resolver: zodResolver(puntoDeEntregaSchema),
    mode: 'onChange',
    defaultValues: {
      place: {
        id: '',
        formattedAddress: '',
      },
      referencia: '',
    },
  });
  const { append } = useFieldArray({
    control,
    name: 'puntosDeEntrega',
  });
  function onSubmit(data: PuntoDeEntregaSchema) {
    append(data);
    form.reset({
      place: {
        id: '',
        formattedAddress: '',
      },
      referencia: '',
    });
    setIsOpen(false);
  }
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between space-y-4 p-6">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Puntos de entrega</CardTitle>
          <CardDescription>Tabla de puntos de entrega</CardDescription>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <Input
            placeholder="Filter places..."
            value={
              (table
                .getColumn('formattedAddress')
                ?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table
                .getColumn('formattedAddress')
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="default">Agregar punto de entrega</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Punto de entrega</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo punto de entrega para este cliente.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form className="flex flex-col gap-4 py-4">
                  <PlaceCombobox />
                  <Referencia />
                </form>
              </Form>
              <DialogFooter>
                <Button onClick={form.handleSubmit(onSubmit)}>Agregar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No hay puntos de entrega
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </CardContent>
    </Card>
  );
}
