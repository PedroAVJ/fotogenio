'use client'

import React, { useState, useEffect } from 'react'
import { Work_Sans } from 'next/font/google'
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'
import { Camera, Loader2, Plus } from 'lucide-react'
import { createImages } from './api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Prisma } from '@prisma/client'
import Link from 'next/link'

const workSans = Work_Sans({ subsets: ['latin'] })

type StyleWithCount = Prisma.StyleGetPayload<{
  include: {
    _count: {
      select: {
        prompts: true;
      };
    };
  };
}>;

interface NewStyleProps {
  credits: number;
  styles: StyleWithCount[];
}

export function NewStyleComponent({ credits, styles }: NewStyleProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [remainingCredits, setRemainingCredits] = useState(credits)

  const handleStyleChange = (value: string[]) => {
    setSelectedStyles(value)
  }

  useEffect(() => {
    const usedCredits = selectedStyles.reduce((total, styleId) => {
      const style = styles.find(s => s.id === styleId)
      return total + (style ? style._count.prompts : 0)
    }, 0)
    setRemainingCredits(Math.max(0, credits - usedCredits))
  }, [selectedStyles, styles, credits])

  const mutation = useMutation({
    mutationFn: createImages,
    onSuccess: ({ message }) => {
      toast.error(message)
    },
  })
  return (
    <main className={`
      ${workSans.className}
      h-dvh w-dvw
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
              <Link 
                href="/comprar-creditos"
                className="rounded-full border-[2px] border-white p-0.5 flex items-center justify-center w-5 h-5 cursor-pointer"
              >
                <Plus size={12} strokeWidth={3} />
              </Link>
            </h3>
          </div>
          <div className="flex justify-center">
            <ToggleGroup
              type="multiple"
              value={selectedStyles}
              onValueChange={handleStyleChange}
              className="grid grid-cols-2 gap-x-2 gap-y-4 w-full max-w-[320px] mb-20"
            >
              {styles.map((style, index) => (
                <ToggleGroupItem
                  key={style.id}
                  value={style.id}
                  aria-label={`Toggle ${style.description}`}
                  className="relative w-[149px] h-[215px] p-0 rounded-md overflow-hidden group data-[state=on]:ring-2 data-[state=on]:ring-[#8CF486]"
                  disabled={!selectedStyles.includes(style.id) && remainingCredits < style._count.prompts}
                >
                  <Image
                    src={style.coverPhotoUrl}
                    alt={style.description}
                    fill
                    sizes="(min-width: 768px) 16.67vw, 50vw"
                    priority={index < 6}
                    className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-center font-semibold px-2">{style.description}</p>
                  </div>
                  <div className="absolute bottom-2 right-2 text-white text-xs font-semibold">
                    x {style._count.prompts}
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
          onClick={function () {
            mutation.mutate({ styleIds: selectedStyles });
          }}
        >
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generar imágenes'}
        </Button>
      </div>
    </main>
  )
}