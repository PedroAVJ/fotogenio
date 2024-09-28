'use client'

import React, { useState } from 'react'
import { Work_Sans } from 'next/font/google'
import { Button } from "@/components/ui/button"
import { CloudUpload, X, Check, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { uploadPhotosAction } from './actions'
import { useMutation } from '@tanstack/react-query'
import { useLocalStorage } from 'react-use-storage'

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

export function UploadPhotosComponent() {
  const [step, setStep] = useLocalStorage<number>('step', 4)
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file))
      const totalPhotos = uploadedPhotos.length + newPhotos.length
      if (totalPhotos > 20) {
        setError(`You can only upload up to 20 photos. You've selected ${totalPhotos} photos.`)
        return
      }
      setUploadedPhotos(Array.from(files))
      setError(null)
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: uploadPhotosAction,
    onSuccess: () => {
      setStep(5);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  async function handleNextStep() {
    const formData = new FormData();
    uploadedPhotos.forEach((photo) => {
      formData.append('photos', photo);
    });
    mutate(formData);
  }

  const getUploadCountColor = (count: number) => {
    if (count === 0) return 'text-white'
    if (count < 10) return 'text-red-500'
    if (count <= 20) return 'text-green-500'
    return 'text-yellow-500' // This case should not occur now
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
          <p>2. Sube entre 10 y 20 fotos.</p>
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
        <label htmlFor="photo-upload" className="cursor-pointer w-full md:w-1/3">
          <div className="flex flex-col items-center justify-center w-full h-32 md:h-24 border-2 border-dashed border-white rounded-lg hover:bg-white/10 transition-colors">
            <CloudUpload size={24} className="text-white transform scale-x-[-1] mb-2" />
            <p className={`text-sm ${getUploadCountColor(uploadedPhotos.length)}`}>
              {uploadedPhotos.length > 0
                ? `${uploadedPhotos.length} foto${uploadedPhotos.length !== 1 ? 's' : ''} subida${uploadedPhotos.length !== 1 ? 's' : ''}`
                : 'Aún no se han subido fotos'}
            </p>
          </div>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <Button
        size="lg"
        className="flex w-36 font-semibold rounded-md text-[#F5F5F5] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={uploadedPhotos.length < 10 || uploadedPhotos.length > 20 || isPending}
        onClick={handleNextStep}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cargando...
          </>
        ) : (
          'Siguiente'
        )}
      </Button>
    </main>
  )
}
