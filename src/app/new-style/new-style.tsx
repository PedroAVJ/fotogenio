'use client'

import React, { useState, useEffect } from 'react'
import { Work_Sans } from 'next/font/google'
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'
import { Camera, Loader2, Plus } from 'lucide-react'
import { createCheckoutSessionAction, createImages } from '@/app/new-style/actions'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const workSans = Work_Sans({ subsets: ['latin'] })

interface Style {
  id: string;
  coverPhotoUrl: string;
  description: string;
  imageCount: number;
}

const placeholderStyles: Style[] = Array.from({ length: 10 }, (_, index) => ({
  id: `style-${index}`,
  coverPhotoUrl: "/placeholder.svg?height=215&width=149",
  description: `Style ${index + 1}: ${['Casual', 'Formal', 'Sporty', 'Vintage', 'Bohemian', 'Punk', 'Preppy', 'Grunge', 'Minimalist', 'Eclectic'][index % 10]} look`,
  imageCount: Math.floor(Math.random() * 5) + 2 // Random number between 2 and 6
}))

interface NewStyleProps {
  initialCredits?: number;
  styles?: Style[];
}

export function NewStyleComponent({ initialCredits = 21, styles = placeholderStyles }: NewStyleProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [remainingCredits, setRemainingCredits] = useState(initialCredits)

  const handleStyleChange = (value: string[]) => {
    setSelectedStyles(value)
  }

  useEffect(() => {
    const usedCredits = selectedStyles.reduce((total, styleId) => {
      const style = styles.find(s => s.id === styleId)
      return total + (style ? style.imageCount : 0)
    }, 0)
    setRemainingCredits(Math.max(0, initialCredits - usedCredits))
  }, [selectedStyles, styles, initialCredits])

  const mutation = useMutation({
    mutationFn: createImages,
    onSuccess: ({ message }) => {
      toast.error(message)
    },
  })

  const creditsMutation = useMutation({
    mutationFn: createCheckoutSessionAction,
    onSuccess: ({ message }) => {
      toast.error(message)
    },
  })

  return (
    <main className={`
      ${workSans.className}
      h-screen w-full
      flex flex-col
      text-[#F5F5F5]
      bg-gradient-to-b from-[#534E4E] to-[#171717]
      relative
    `}>
      <ScrollArea className="h-full w-full">
        <div className="px-2 pt-4 pb-24">
          <div className="flex w-full flex-col space-y-8 items-center mb-8">
            <h3 className="scroll-m-20 text-[20px] leading-[102%] tracking-[0px] font-semibold flex justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-size:100%_4px] [background-position:0_0,0_100%] w-11/12">
              Escoge un Nuevo Estilo
            </h3>
            <h3 className="scroll-m-20 text-[20px] leading-[102%] tracking-[0px] font-semibold justify-center items-center rounded-lg border-x-4 border-l-white border-r-[#4776E6] bg-no-repeat px-6 py-4 [background-image:linear-gradient(90deg,white,#4776E6),linear-gradient(90deg,white,#4776E6)] [background-size:100%_4px] [background-position:0_0,0_100%] inline-flex space-x-4">
              <Camera />
              <span className="bg-gradient-to-b from-[#4776E6] to-white bg-clip-text text-transparent text-[24px] leading-[102%] tracking-[0px] font-semibold">x {remainingCredits}</span>
              <div 
                className="rounded-full border-[2px] border-white p-0.5 flex items-center justify-center w-5 h-5 cursor-pointer"
                onClick={() => {
                  if (creditsMutation.isPending) return;
                  creditsMutation.mutate();
                }}
                onTouchStart={() => {
                  if (creditsMutation.isPending) return;
                  creditsMutation.mutate();
                }}
              >
                <Plus size={12} strokeWidth={3} />
              </div>
            </h3>
          </div>
          <div className="flex justify-center">
            <ToggleGroup
              type="multiple"
              value={selectedStyles}
              onValueChange={handleStyleChange}
              className="grid grid-cols-2 gap-x-2 gap-y-4 w-full max-w-[320px] mb-20"
            >
              {styles.map((style) => (
                <ToggleGroupItem
                  key={style.id}
                  value={style.id}
                  aria-label={`Toggle ${style.description}`}
                  className="relative w-[149px] h-[215px] p-0 rounded-md overflow-hidden group data-[state=on]:ring-2 data-[state=on]:ring-[#8CF486]"
                  disabled={!selectedStyles.includes(style.id) && remainingCredits < style.imageCount}
                >
                  <Image
                    src={style.coverPhotoUrl}
                    alt={style.description}
                    width={149}
                    height={215}
                    className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-center font-semibold px-2">{style.description}</p>
                  </div>
                  <div className="absolute bottom-2 right-2 text-white text-xs font-semibold">
                    x {style.imageCount}
                  </div>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </ScrollArea>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4">
        <Button
          size="lg"
          className="w-48 rounded-[12px] text-[#F5F5F5] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 disabled:opacity-50 disabled:cursor-not-allowed text-[14px] leading-[102%] tracking-[0px] font-semibold"
          disabled={selectedStyles.length === 0 || mutation.isPending}
          onClick={() => mutation.mutate({ styleIds: selectedStyles })}
        >
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generar imágenes'}
        </Button>
      </div>
    </main>
  )
}