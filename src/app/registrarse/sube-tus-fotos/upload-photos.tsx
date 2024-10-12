'use client'

import { Work_Sans } from 'next/font/google'
import { Button } from "@/components/ui/button"
import { X, Check, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { FileUploader } from "@/components/ui/file-uploader"
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUploadFile } from '@/hooks/use-upload-file'
import JSZip from 'jszip';
import { toast } from 'sonner'
import { ReactNode, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import * as Sentry from '@sentry/nextjs';

const workSans = Work_Sans({ subsets: ['latin'] })

import malo1 from './ejemplos/malo-1.png'
import malo2 from './ejemplos/malo-2.png'
import malo3 from './ejemplos/malo-3.png'
import bueno1 from './ejemplos/bueno-1.png'
import bueno2 from './ejemplos/bueno-2.png'
import bueno3 from './ejemplos/bueno-3.png'

const placeholderImages = [
  { foto: malo1, status: 'rejected' },
  { foto: malo2, status: 'rejected' },
  { foto: malo3, status: 'rejected' },
  { foto: bueno1, status: 'accepted' },
  { foto: bueno2, status: 'accepted' },
  { foto: bueno3, status: 'accepted' },
]

function LoadingToastContent({ progress, length }: { progress: number | undefined, length: number }): ReactNode {
  if (!progress) {
    return 'Preparando fotos...'
  }
  return `Subiendo ${length} fotos... ${Math.round(progress * 100)}%`
}

export function UploadPhotosComponent() {
  const [files, setFiles] = useState<File[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const { onUpload, isUploading, uploadedFiles, progresses } = useUploadFile("subirZip", {
    defaultUploadedFiles: []
  });
  const progress = progresses['uploaded_photos.zip']
  async function handleUpload() {
    const zip = new JSZip();
    for (const file of files) {
      zip.file(file.name, file);
    }
    const content = await zip.generateAsync({ type: 'arraybuffer' });
    const zippedPhotos = new File([content], 'uploaded_photos.zip', { type: 'application/zip' });
    toast.promise(onUpload([zippedPhotos]), {
      loading: <LoadingToastContent progress={progress} length={files.length} />,
      success: () => {
        const zip = uploadedFiles[0]
        if (!zip) {
          Sentry.captureMessage('No zip file uploaded', 'error');
          return "Las fotos no se pudieron subir"
        }
        const params = new URLSearchParams(searchParams);
        params.set('zippedPhotosUrl', zip.appUrl);
        router.push(`/registrarse/agrega-tu-correo?${params.toString()}`);
        return "Las fotos se han subido con éxito!"
      },
    })
  }
  return (
    <ScrollArea>
      <main className={`
        ${workSans.className}
        min-h-dvh
        flex flex-col items-center justify-between p-4 space-y-4
        text-[#F5F5F5]
        bg-gradient-to-b from-[#534E4E] to-[#171717]
      `}>
          <div className="flex w-full space-x-2">
            <h1 
              className="scroll-m-20 text-3xl tracking-tight lg:text-5xl flex size-16 items-center justify-center rounded-lg border-x-4 border-l-[#4776E6] border-r-[#8E54E9] bg-no-repeat font-semibold text-[#8E54E9] [background-image:linear-gradient(90deg,#4776E6,#8E54E9),linear-gradient(90deg,#4776E6,#8E54E9)] [background-size:100%_4px] [background-position:0_0,0_100%]"
            >
              3
            </h1>
            <h3 className="scroll-m-20 text-xl tracking-tight flex grow justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 font-semibold [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-size:100%_4px] [background-position:0_0,0_100%]">
              Sube Tus Fotos
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-md md:max-w-4xl px-4">
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
            <FileUploader
              value={files}
              accept={{
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/png': ['.png'],
              }}
              onValueChange={setFiles}
              maxFileCount={20}
              maxSize={8 * 1024 * 1024}
            />
          </div>
          <Button
            size="lg"
            className="flex w-36 font-semibold rounded-md text-[#F5F5F5] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={files.length < 12 || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              'Subir fotos'
            )}
          </Button>
      </main>
    </ScrollArea>
  )
}
