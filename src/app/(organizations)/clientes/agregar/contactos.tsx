'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import es from 'react-phone-number-input/locale/es';

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
import { PhoneInput } from '@/components/ui/phone-input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  type ClienteSchema,
  type ContactoSchema,
  contactoSchema,
} from './schemas';

function Nombre() {
  const { control } = useFormContext<ContactoSchema>();
  return (
    <FormField
      control={control}
      name="nombre"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>Nombre</FormLabel>
          <FormControl>
            <Input placeholder="Nombre" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Grupo() {
  const { control } = useFormContext<ContactoSchema>();
  return (
    <FormField
      control={control}
      name="grupo"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>Grupo</FormLabel>
          <FormControl>
            <Input placeholder="Grupo" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function CorreoElectronico() {
  const { control } = useFormContext<ContactoSchema>();
  return (
    <FormField
      control={control}
      name="correoElectronico"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>Correo electrónico</FormLabel>
          <FormControl>
            <Input placeholder="Correo electrónico" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function LineaFija() {
  const { control } = useFormContext<ContactoSchema>();
  return (
    <FormField
      control={control}
      name="lineaFija"
      render={({ field: { onChange, onBlur, value, disabled, name } }) => (
        <FormItem className="flex-auto">
          <FormLabel>Línea fija</FormLabel>
          <FormControl>
            <PhoneInput
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              disabled={disabled ?? false}
              name={name}
              placeholder="Línea fija"
              defaultCountry="MX"
              labels={es}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Celular() {
  const { control } = useFormContext<ContactoSchema>();
  return (
    <FormField
      control={control}
      name="celular"
      render={({ field: { onChange, onBlur, value, disabled, name } }) => (
        <FormItem className="flex-auto">
          <FormLabel>Celular</FormLabel>
          <FormControl>
            <PhoneInput
              onBlur={onBlur}
              value={value ?? ''}
              disabled={disabled ?? false}
              name={name}
              onChange={(phoneNumber) => {
                if (phoneNumber === '') {
                  onChange(null);
                } else {
                  onChange(phoneNumber);
                }
              }}
              placeholder="Celular"
              defaultCountry="MX"
              labels={es}
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
  contacto,
}: {
  index: number;
  contacto: ContactoSchema;
}) {
  const { control } = useFormContext<ClienteSchema>();
  const { remove, update } = useFieldArray({
    control,
    name: 'contactos',
  });
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ContactoSchema>({
    resolver: zodResolver(contactoSchema),
    mode: 'onChange',
    defaultValues: contacto,
  });
  function onSubmit(data: ContactoSchema) {
    update(index, data);
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
              <DialogTitle>Contacto</DialogTitle>
              <DialogDescription>
                Actualiza la información de este contacto.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="flex flex-col gap-4 py-4 pr-4">
                <Nombre />
                <Grupo />
                <CorreoElectronico />
                <LineaFija />
                <Celular />
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
                Estas seguro que quieres eliminar este contacto?
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

export function Contactos() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ContactoSchema>({
    resolver: zodResolver(contactoSchema),
    mode: 'onChange',
    defaultValues: {
      grupo: '',
      nombre: '',
      correoElectronico: '',
      lineaFija: '',
      celular: null,
    },
  });
  const { control, watch } = useFormContext<ClienteSchema>();
  const { append } = useFieldArray({
    control,
    name: 'contactos',
  });
  const contactos = watch('contactos');
  function onSubmit(data: ContactoSchema) {
    append(data);
    form.reset({
      grupo: '',
      nombre: '',
      correoElectronico: '',
      lineaFija: '',
      celular: null,
    });
    setIsOpen(false);
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Contactos</CardTitle>
          <CardDescription>Tabla de contactos del cliente</CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Agregar contacto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contacto</DialogTitle>
              <DialogDescription>
                Agrega un nuevo contacto a este cliente.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="flex flex-col gap-4 py-4 pr-4">
                <Nombre />
                <Grupo />
                <CorreoElectronico />
                <LineaFija />
                <Celular />
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
                <TableHead>Nombre</TableHead>
                <TableHead>Correo electrónico</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contactos.length ? (
                contactos.map((contacto, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <TableRow key={index}>
                    <TableCell>{contacto.nombre}</TableCell>
                    <TableCell>{contacto.correoElectronico}</TableCell>
                    <TableCell>
                      <Actions index={index} contacto={contacto} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No hay contactos
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
