'use client';

import { EllipsisIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';

import type { RutaSchema } from './schemas';

export function Recurrencia({ index }: { index: number }) {
  const { control, setValue } = useFormContext<RutaSchema>();
  return (
    <div className="col-span-5 grid gap-4">
      <Label>Días de entrega</Label>
      <div className="flex flex-wrap items-center gap-2">
        <FormField
          control={control}
          name={`paradas.${index}.lunes`}
          render={({
            field: { onChange, onBlur, value, disabled, name, ref },
          }) => (
            <FormItem>
              <FormControl>
                <Toggle
                  aria-label="Lunes"
                  ref={ref}
                  name={name}
                  onPressedChange={onChange}
                  onBlur={onBlur}
                  pressed={value}
                  disabled={disabled}
                >
                  L
                </Toggle>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`paradas.${index}.martes`}
          render={({
            field: { onChange, onBlur, value, disabled, name, ref },
          }) => (
            <FormItem>
              <FormControl>
                <Toggle
                  aria-label="Martes"
                  ref={ref}
                  name={name}
                  onPressedChange={onChange}
                  onBlur={onBlur}
                  pressed={value}
                  disabled={disabled}
                >
                  M
                </Toggle>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`paradas.${index}.miercoles`}
          render={({
            field: { onChange, onBlur, value, disabled, name, ref },
          }) => (
            <FormItem>
              <FormControl>
                <Toggle
                  aria-label="Miércoles"
                  ref={ref}
                  name={name}
                  onPressedChange={onChange}
                  onBlur={onBlur}
                  pressed={value}
                  disabled={disabled}
                >
                  X
                </Toggle>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`paradas.${index}.jueves`}
          render={({
            field: { onChange, onBlur, value, disabled, name, ref },
          }) => (
            <FormItem>
              <FormControl>
                <Toggle
                  aria-label="Jueves"
                  ref={ref}
                  name={name}
                  onPressedChange={onChange}
                  onBlur={onBlur}
                  pressed={value}
                  disabled={disabled}
                >
                  J
                </Toggle>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`paradas.${index}.viernes`}
          render={({
            field: { onChange, onBlur, value, disabled, name, ref },
          }) => (
            <FormItem>
              <FormControl>
                <Toggle
                  aria-label="Viernes"
                  ref={ref}
                  name={name}
                  onPressedChange={onChange}
                  onBlur={onBlur}
                  pressed={value}
                  disabled={disabled}
                >
                  V
                </Toggle>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`paradas.${index}.sabado`}
          render={({
            field: { onChange, onBlur, value, disabled, name, ref },
          }) => (
            <FormItem>
              <FormControl>
                <Toggle
                  aria-label="Sábado"
                  ref={ref}
                  name={name}
                  onPressedChange={onChange}
                  onBlur={onBlur}
                  pressed={value}
                  disabled={disabled}
                >
                  S
                </Toggle>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`paradas.${index}.domingo`}
          render={({
            field: { onChange, onBlur, value, disabled, name, ref },
          }) => (
            <FormItem>
              <FormControl>
                <Toggle
                  aria-label="Domingo"
                  ref={ref}
                  name={name}
                  onPressedChange={onChange}
                  onBlur={onBlur}
                  pressed={value}
                  disabled={disabled}
                >
                  D
                </Toggle>
              </FormControl>
            </FormItem>
          )}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisIcon className="size-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setValue(`paradas.${index}.lunes`, true);
                setValue(`paradas.${index}.martes`, true);
                setValue(`paradas.${index}.miercoles`, true);
                setValue(`paradas.${index}.jueves`, true);
                setValue(`paradas.${index}.viernes`, true);
                setValue(`paradas.${index}.sabado`, true);
                setValue(`paradas.${index}.domingo`, true);
              }}
            >
              Diario
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
