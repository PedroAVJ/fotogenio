'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { H1 } from '@/components/ui/typography';

import { createCliente } from './actions';
import { Contactos } from './contactos';
import {
  Descuento,
  DiasACredito,
  EsPrecioEspecial,
  TopeDeCredito,
} from './datos-de-credito';
import {
  CuentaContableSelect,
  FormaDePagoSelect,
  IdTributario,
  NombreLegal,
  RegimenFiscalSelect,
  RFC,
  UsoDeCFDISelect,
} from './datos-fiscales';
import {
  Calle,
  Ciudad,
  Codigo,
  CodigoPostal,
  Colonia,
  Estado,
  NombreComercial,
  PaisInput,
  RegimenCapital,
} from './datos-generales';
import { PreciosEspeciales } from './precios-especiales';
import { PuntosDeEntrega } from './puntos-de-entrega';
import { type ClienteSchema, clienteSchema } from './schemas';

export default function Page() {
  const form = useForm<ClienteSchema>({
    resolver: zodResolver(clienteSchema),
    mode: 'onChange',
    defaultValues: {
      codigo: '',
      nombreComercial: '',
      regimenCapital: '',
      codigoPostal: '',
      calle: '',
      colonia: '',
      estado: '',
      ciudad: '',
      contactos: [],
      puntosDeEntrega: [],
      nombreLegal: '',
      rfc: '',
      idTributario: '',
      esPrecioEspecial: false,
      preciosEspeciales: [],
    },
  });
  const mutation = useMutation({
    mutationFn: createCliente,
    onSuccess() {
      toast.success('Cliente agregado');
    },
    onError(error) {
      toast.error('Ocurrió un error al agregar el cliente', {
        description: error.message,
      });
    },
  });
  function onSubmit(data: ClienteSchema) {
    mutation.mutate(data);
  }
  const [tab, setTab] = useState('general');
  const { errors } = form.formState;
  useEffect(() => {
    const generalFields = new Set([
      'codigo',
      'nombreComercial',
      'regimenCapital',
      'codigoPostal',
      'colonia',
      'pais',
      'calle',
      'ciudad',
      'estado',
      'nombreLegal',
      'rfc',
      'idTributario',
      'cuentaContable',
      'usoDeCFDI',
      'regimenFiscal',
      'formaDePago',
    ]);
    const creditoFields = new Set([
      'topeDeCredito',
      'descuento',
      'diasACredito',
      'esPrecioEspecial',
    ]);
    const errorFields = new Set(Object.keys(errors));
    if (generalFields.intersection(errorFields).size > 0) {
      setTab('general');
    } else if (creditoFields.intersection(errorFields).size > 0) {
      setTab('credito');
    }
  }, [errors]);
  return (
    <FormProvider {...form}>
      <H1 className="p-12">Agregar cliente</H1>
      <form className="flex w-full flex-col space-y-10 self-center pb-4">
        <Tabs
          defaultValue="general"
          className="flex w-full flex-col space-y-8"
          value={tab}
          onValueChange={setTab}
        >
          <TabsList className="flex w-fit">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="credito">Crédito</TabsTrigger>
            <TabsTrigger value="contactos">Contactos</TabsTrigger>
            <TabsTrigger value="puntosDeEntrega">Puntos de entrega</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="flex flex-col space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Datos generales</CardTitle>
                <CardDescription>
                  Información general del cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Codigo />
                <NombreComercial />
                <RegimenCapital />
                <CodigoPostal />
                <PaisInput />
                <Estado />
                <Ciudad />
                <Colonia />
                <Calle />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Datos fiscales</CardTitle>
                <CardDescription>
                  Información fiscal del cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <NombreLegal />
                <RFC />
                <IdTributario />
                <CuentaContableSelect />
                <UsoDeCFDISelect />
                <FormaDePagoSelect />
                <RegimenFiscalSelect />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="credito" className="flex flex-col space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Datos de crédito</CardTitle>
                <CardDescription>
                  Información de crédito del cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <TopeDeCredito />
                <Descuento />
                <DiasACredito />
                <EsPrecioEspecial />
              </CardContent>
            </Card>
            <PreciosEspeciales />
          </TabsContent>
          <TabsContent value="contactos">
            <Contactos />
          </TabsContent>
          <TabsContent value="puntosDeEntrega">
            <PuntosDeEntrega />
          </TabsContent>
        </Tabs>
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
            Guardar
          </Button>
        )}
      </form>
    </FormProvider>
  );
}
