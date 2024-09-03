'use client';

import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from '@hello-pangea/dnd';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

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
import { H2, P } from '@/components/ui/typography';

import { PuntoDeEntregaCombobox } from './punto-de-entrega-combobox';
import { Recurrencia } from './recurrencia';
import type { RutaSchema } from './schemas';

export function Paradas() {
  const { control } = useFormContext<RutaSchema>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'paradas',
    keyName: 'customId',
  });
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };
  return (
    <>
      <H2>Paradas</H2>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-1"
            >
              {fields.length === 0 && <P>No hay paradas</P>}
              {fields.map((field, index) => (
                <Draggable
                  key={field.customId}
                  draggableId={field.customId}
                  index={index}
                >
                  {(nestedProvided) => (
                    <section
                      ref={nestedProvided.innerRef}
                      {...nestedProvided.draggableProps}
                      {...nestedProvided.dragHandleProps}
                      className="grid grid-cols-12 items-end gap-4 space-y-4"
                    >
                      <PuntoDeEntregaCombobox index={index} />
                      <Recurrencia index={index} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="destructive"
                            className="col-span-1"
                          >
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Estas seguro de que quieres eliminar esta parada?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove(index)}>
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </section>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        type="button"
        className="w-fit"
        onClick={() => {
          append({
            puntoDeEntrega: {
              id: '',
              formattedAddress: '',
            },
            lunes: true,
            martes: true,
            miercoles: true,
            jueves: true,
            viernes: true,
            sabado: false,
            domingo: false,
            visitOrder: 0,
          });
        }}
      >
        Agregar parada
      </Button>
    </>
  );
}
