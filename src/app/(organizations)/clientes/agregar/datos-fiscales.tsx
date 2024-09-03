'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { ClienteSchema } from './schemas';

export function NombreLegal() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="nombreLegal"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>Nombre legal</FormLabel>
          <FormControl>
            <Input placeholder="Nombre legal" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function RFC() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="rfc"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>RFC</FormLabel>
          <FormControl>
            <Input placeholder="RFC" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function IdTributario() {
  const { control } = useFormContext<ClienteSchema>();
  return (
    <FormField
      control={control}
      name="idTributario"
      render={({ field }) => (
        <FormItem className="flex-auto">
          <FormLabel>Id tributario</FormLabel>
          <FormControl>
            <Input placeholder="Id tributario" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function UsoDeCFDISelect() {
  const { control } = useFormContext<ClienteSchema>();
  const usoDeCFDILabels = {
    [UsoDeCFDI.CP01]: 'CP01 - Pagos',
    [UsoDeCFDI.D01]:
      'D01 - Honorarios médicos, dentales y gastos hospitalarios.',
    [UsoDeCFDI.D02]: 'D02 - Gastos médicos por incapacidad o discapacidad',
    [UsoDeCFDI.D03]: 'D03 - Gastos funerales.',
    [UsoDeCFDI.D04]: 'D04 - Donativos.',
    [UsoDeCFDI.D05]:
      'D05 - Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación).',
    [UsoDeCFDI.D06]: 'D06 - Aportaciones voluntarias al SAR.',
    [UsoDeCFDI.D07]: 'D07 - Primas por seguros de gastos médicos.',
    [UsoDeCFDI.D08]: 'D08 - Gastos de transportación escolar obligatoria.',
    [UsoDeCFDI.D09]:
      'D09 - Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones.',
    [UsoDeCFDI.D10]: 'D10 - Pagos por servicios educativos (colegiaturas)',
    [UsoDeCFDI.G01]: 'G01 - Adquisición de mercancias',
    [UsoDeCFDI.G02]: 'G02 - Devoluciones, descuentos o bonificaciones',
    [UsoDeCFDI.G03]: 'G03 - Gastos en general',
    [UsoDeCFDI.I01]: 'I01 - Construcciones',
    [UsoDeCFDI.I02]: 'I02 - Mobilario y equipo de oficina por inversiones',
    [UsoDeCFDI.I03]: 'I03 - Equipo de transporte',
    [UsoDeCFDI.I04]: 'I04 - Equipo de computo y accesorios',
    [UsoDeCFDI.I05]: 'I05 - Dados, troqueles, moldes, matrices y herramental',
    [UsoDeCFDI.I06]: 'I06 - Comunicaciones telefónicas',
    [UsoDeCFDI.I07]: 'I07 - Comunicaciones satelitales',
    [UsoDeCFDI.I08]: 'I08 - Otra maquinaria y equipo',
    [UsoDeCFDI.P01]: 'P01 - Por definir',
    [UsoDeCFDI.S01]: 'S01 - Sin efectos fiscales',
  };
  return (
    <FormField
      control={control}
      name="usoDeCfdi"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="flex-auto">
          <FormLabel>Uso de cfdi</FormLabel>
          <Select
            onValueChange={onChange}
            value={value}
            name={name}
            {...(disabled !== undefined ? { disabled } : {})}
          >
            <FormControl>
              <SelectTrigger onBlur={onBlur} ref={ref}>
                <SelectValue placeholder="Selecciona un uso de CFDI" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(usoDeCFDILabels).map(([key, usoDeCFDIValue]) => (
                <SelectItem key={key} value={key}>
                  {usoDeCFDIValue}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function RegimenFiscalSelect() {
  const { control } = useFormContext<ClienteSchema>();
  const regimenFiscalLabels = {
    [RegimenFiscal.C601]: '601 - General de Ley Personas Morales',
    [RegimenFiscal.C603]: '603 - Personas Morales con Fines no Lucrativos',
    [RegimenFiscal.C605]:
      '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios',
    [RegimenFiscal.C606]: '606 - Arrendamiento',
    [RegimenFiscal.C607]:
      '607 - Régimen de Enajenación o Adquisición de Bienes',
    [RegimenFiscal.C608]: '608 - Demás ingresos',
    [RegimenFiscal.C610]:
      '610 - Residentes en el Extranjero sin Establecimiento Permanente en México',
    [RegimenFiscal.C611]:
      '611 - Ingresos por Dividendos (socios y accionistas)',
    [RegimenFiscal.C612]:
      '612 - Personas Físicas con Actividades Empresariales y Profesionales',
    [RegimenFiscal.C614]: '614 - Ingresos por intereses',
    [RegimenFiscal.C615]:
      '615 - Régimen de los ingresos por obtención de premios',
    [RegimenFiscal.C616]: '616 - Sin obligaciones fiscales',
    [RegimenFiscal.C620]:
      '620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos',
    [RegimenFiscal.C621]: '621 - Incorporación Fiscal',
    [RegimenFiscal.C622]:
      '622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras',
    [RegimenFiscal.C623]: '623 - Opcional para Grupos de Sociedades',
    [RegimenFiscal.C624]: '624 - Coordinados',
    [RegimenFiscal.C625]:
      '625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Te',
    [RegimenFiscal.C626]: '626 - Régimen Simplificado de Confianza',
  };
  return (
    <FormField
      control={control}
      name="regimenFiscal"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="flex-auto">
          <FormLabel>Régimen fiscal</FormLabel>
          <Select
            onValueChange={onChange}
            value={value}
            name={name}
            {...(disabled !== undefined ? { disabled } : {})}
          >
            <FormControl>
              <SelectTrigger onBlur={onBlur} ref={ref}>
                <SelectValue placeholder="Selecciona un régimen fiscal" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(regimenFiscalLabels).map(
                ([key, regimenFiscalValue]) => (
                  <SelectItem key={key} value={key}>
                    {regimenFiscalValue}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function FormaDePagoSelect() {
  const { control } = useFormContext<ClienteSchema>();
  const formaDePagoLabels = {
    [FormaDePago.C01]: '01 - Efectivo',
    [FormaDePago.C02]: '02 - Cheque nominativo',
    [FormaDePago.C03]: '03 - Transferencia electrónica de fondos',
    [FormaDePago.C04]: '04 - Tarjeta de crédito',
    [FormaDePago.C05]: '05 - Monedero electrónico',
    [FormaDePago.C06]: '06 - Dinero electrónico',
    [FormaDePago.C08]: '08 - Vales de despensa',
    [FormaDePago.C12]: '12 - Dación en pago',
    [FormaDePago.C13]: '13 - Pago por subrogación',
    [FormaDePago.C14]: '14 - Pago por consignación',
    [FormaDePago.C15]: '15 - Condonación',
    [FormaDePago.C17]: '17 - Compensación',
    [FormaDePago.C23]: '23 - Novación',
    [FormaDePago.C24]: '24 - Confusión',
    [FormaDePago.C25]: '25 - Remisión de deuda',
    [FormaDePago.C26]: '26 - Prescripción o caducidad',
    [FormaDePago.C27]: '27 - A satisfacción del acreedor',
    [FormaDePago.C28]: '28 - Tarjeta de débito',
    [FormaDePago.C29]: '29 - Tarjeta de servicios',
    [FormaDePago.C30]: '30 - Aplicación de anticipos',
    [FormaDePago.C31]: '31 - Intermediario pagos',
    [FormaDePago.C99]: '99 - Por definir',
  };
  return (
    <FormField
      control={control}
      name="formaDePago"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="flex-auto">
          <FormLabel>Forma de pago</FormLabel>
          <Select
            onValueChange={onChange}
            value={value}
            name={name}
            {...(disabled !== undefined ? { disabled } : {})}
          >
            <FormControl>
              <SelectTrigger onBlur={onBlur} ref={ref}>
                <SelectValue placeholder="Selecciona una forma de pago" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(formaDePagoLabels).map(
                ([key, formaDePagoValue]) => (
                  <SelectItem key={key} value={key}>
                    {formaDePagoValue}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CuentaContableSelect() {
  const { control } = useFormContext<ClienteSchema>();
  const cuentaContableLabels: Record<CuentaContable, string> = {
    [CuentaContable.VEHICULOS]: 'Vehículos',
    [CuentaContable.COMPUTADORAS]: 'Computadoras',
  };
  return (
    <FormField
      control={control}
      name="cuentaContable"
      render={({ field: { onChange, onBlur, value, disabled, name, ref } }) => (
        <FormItem className="flex-auto">
          <FormLabel>Cuenta contable</FormLabel>
          <Select
            onValueChange={onChange}
            value={value}
            name={name}
            {...(disabled !== undefined ? { disabled } : {})}
          >
            <FormControl>
              <SelectTrigger onBlur={onBlur} ref={ref}>
                <SelectValue placeholder="Selecciona una cuenta contable" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(cuentaContableLabels).map(
                ([key, cuentaContableValue]) => (
                  <SelectItem key={key} value={key}>
                    {cuentaContableValue}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
