'use client'

import React, { useState } from 'react'
import { Work_Sans } from 'next/font/google'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Camera, ArrowDown } from 'lucide-react'
import Image from 'next/image'

const workSans = Work_Sans({ 
  subsets: ['latin'],
})

interface HomeProps {
  numberOfPhotos?: number;
  imageUrls?: string[];
}

export function HomeComponent({ numberOfPhotos = 100, imageUrls }: HomeProps) {
  const defaultImageUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rLbkqWY8hHDI8hltjJ1P1dNg58jQDC.png"
  const images = imageUrls || Array(10).fill(defaultImageUrl)

  const [touchedIndex, setTouchedIndex] = useState<number | null>(null)

  const handleDownload = (url: string) => {
    window.open(`${url}?download=1`, '_blank')
  }

  const handleTouchStart = (index: number) => {
    setTouchedIndex(index)
  }

  const handleTouchEnd = () => {
    setTouchedIndex(null)
  }

  return (
    <main className={`
      ${workSans.className}
      h-screen w-full
      text-[#F5F5F5]
      bg-gradient-to-b from-[#534E4E] to-[#171717]
    `}>
      <ScrollArea className="h-full">
        <div className="flex flex-col items-center px-2 pb-8 pt-4">
          <h3 className="scroll-m-20 text-[20px] leading-normal tracking-[0.02em] text-center flex items-center justify-center p-4 font-semibold">
            <span className="inline-block">
              ¡Puedes generar{' '}
              <span className="inline-block bg-gradient-to-b from-[#8E54E9] to-white bg-clip-text text-transparent">
                {numberOfPhotos}
              </span>
              {' '}fotos más!
            </span>
          </h3>
          <Button
            asChild
            size="lg"
            className="flex items-center justify-center gap-2 px-4 py-2 mb-8 rounded-xl text-[#F5F5F5] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 text-[14px] leading-[12px] tracking-[0.02em] font-semibold"
          >
            <Link href="/nuevo-estilo">
              Generar Nuevas Fotos
              <Camera className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <div className="flex flex-col items-center gap-4">
            {images.map((url, index) => (
              <div 
                key={index} 
                className="relative w-[303px] h-[420px] rounded-[10px] overflow-hidden group cursor-pointer"
                onClick={() => handleDownload(url)}
                onTouchStart={() => handleTouchStart(index)}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={url}
                  alt={`Generated image ${index + 1}`}
                  width={303}
                  height={420}
                  className="object-cover rounded-[10px]"
                />
                <div className={`absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center transition-opacity duration-300 ${
                  touchedIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <p className="text-white text-lg font-semibold mb-4">¡Descarga tus fotos!</p>
                  <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                    <ArrowDown className="text-white w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </main>
  )
}