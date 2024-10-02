'use client'

import { Work_Sans } from 'next/font/google'
import { Button } from "@/components/ui/button"
import { X, Check, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { addPhotosToDb } from './actions'
import { useMutation } from '@tanstack/react-query'
import { useLocalStorage } from 'react-use-storage'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FileUploader } from "@/components/ui/file-uploader"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUploadFile } from '@/hooks/use-upload-file'

const workSans = Work_Sans({ subsets: ['latin'] })

import ejemploMalo1 from './fotos/ejemplo-malo-1.png'
import ejemploMalo2 from './fotos/ejemplo-malo-2.png'
import ejemploMalo3 from './fotos/ejemplo-malo-3.png'
import ejemploBueno1 from './fotos/ejemplo-bueno-1.png'
import ejemploBueno2 from './fotos/ejemplo-bueno-2.png'
import ejemploBueno3 from './fotos/ejemplo-bueno-3.png'

const placeholderImages = [
  { foto: ejemploMalo1, status: 'rejected' },
  { foto: ejemploMalo2, status: 'rejected' },
  { foto: ejemploMalo3, status: 'rejected' },
  { foto: ejemploBueno1, status: 'accepted' },
  { foto: ejemploBueno2, status: 'accepted' },
  { foto: ejemploBueno3, status: 'accepted' },
]

const subirFotosSchema = z.object({
  images: z.array(z.instanceof(File)),
})

type SubirFotosSchema = z.infer<typeof subirFotosSchema>

export function UploadPhotosComponent() {
  const form = useForm<SubirFotosSchema>({
    resolver: zodResolver(subirFotosSchema),
    defaultValues: {
      images: [],
    },
  })
  const [step, setStep] = useLocalStorage<number>('step', 4)
  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
    "subirFotos",
    { defaultUploadedFiles: [] }
  )
  const { mutate, isPending } = useMutation({
    mutationFn: addPhotosToDb,
    onSuccess: () => {
      setStep(5);
    },
  });
  function onSubmit(data: SubirFotosSchema) {
    mutate(data);
  }
  return (
    <main className={`
      ${workSans.className}
      h-dvh w-dvw
      flex size-full flex-col items-center justify-between
      px-2 pb-8 pt-4
      text-[#F5F5F5]
      bg-gradient-to-b from-[#534E4E] to-[#171717]
    `}>
      <div className="flex w-full space-x-2">
        <h1 
          className="scroll-m-20 text-3xl tracking-tight lg:text-5xl flex size-16 items-center justify-center rounded-lg border-x-4 border-l-[#4776E6] border-r-[#8E54E9] bg-no-repeat font-semibold text-[#8E54E9] [background-image:linear-gradient(90deg,#4776E6,#8E54E9),linear-gradient(90deg,#4776E6,#8E54E9)] [background-size:100%_4px] [background-position:0_0,0_100%]"
        >
          {step}
        </h1>
        <h3 className="scroll-m-20 text-xl tracking-tight flex grow justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 font-semibold [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-size:100%_4px] [background-position:0_0,0_100%]">
          Sube Tus Fotos
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-md md:max-w-4xl px-4">
        <div className="text-sm mb-4 w-full text-left">
          <p>1. Sube Fotos Variadas.</p>
          <p>2. Sube entre 1 y 20 fotos.</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 gap-y-8 w-full">
          {placeholderImages.map((placeholderImage, index) => (
            <div key={index} className="relative aspect-square overflow-visible">
              <Image
                src={placeholderImage.foto}
                alt={`Ejemplo ${index + 1}`}
                className="rounded-md object-cover"
              />
              {placeholderImage.status === 'rejected' ? (
                <div className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center rounded-full border border-red-500">
                  <X className="text-red-500" size={20} />
                </div>
              ) : (
                <div className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center rounded-full border border-green-500">
                  <Check className="text-green-500" size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFileCount={20}
                        maxSize={8 * 1024 * 1024}
                        progresses={progresses}
                        onUpload={onUpload}
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
          </form>
        </Form>
      </div>
      <Button
        size="lg"
        className="flex w-36 font-semibold rounded-md text-[#F5F5F5] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!form.formState.isValid || isPending}
        onClick={() => form.handleSubmit(onSubmit)}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subiendo...
          </>
        ) : (
          'Subir fotos'
        )}
      </Button>
    </main>
  )
}
