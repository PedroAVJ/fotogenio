'use client'

import React from 'react'
import { Work_Sans } from 'next/font/google'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useLocalStorage } from 'react-use-storage'
import { ArrowDown, Loader2 } from 'lucide-react'
import { createCheckoutSessionAction } from './actions'
import { toast } from "sonner"
import { useMutation } from '@tanstack/react-query'
import mujer from './fotos/mujer.png'

const workSans = Work_Sans({ subsets: ['latin'] })

export function ChoosePaymentComponent() {
  const [step] = useLocalStorage<number>('step', 5)
  const mutation = useMutation({
    mutationFn: createCheckoutSessionAction,
    onSuccess: ({ message }) => {
      toast.error(message)
    },
  })
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
          className="scroll-m-20 text-4xl tracking-tight lg:text-5xl flex size-16 items-center justify-center rounded-lg border-x-4 border-l-[#4776E6] border-r-[#8E54E9] bg-no-repeat font-medium text-[#8E54E9] [background-image:linear-gradient(90deg,#4776E6,#8E54E9),linear-gradient(90deg,#4776E6,#8E54E9)] [background-size:100%_4px] [background-position:0_0,0_100%]"
        >
          {step}
        </h1>
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight flex grow justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-size:100%_4px] [background-position:0_0,0_100%]">
          Forma de Pago
        </h3>
      </div>
      <div className="flex flex-col items-center w-full max-w-md">
        <div className="relative w-64 h-64 mb-4">
          <Image
            src={mujer}
            alt="Mujer de fondo"
            className="rounded-md object-cover"
          />
        </div>
        <ArrowDown className="h-8 w-8 text-purple-500 mb-2" />
        <p className="text-xl font-semibold mb-4">
          <span className="text-purple-500">$99 pesos</span> por <span className="text-purple-500">25 fotos</span>
        </p>
      </div>
      <Button
        size="lg"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="flex w-36 rounded-md text-[#F5F5F5] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 font-semibold"
      >
        {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : '¡Crear Fotos!'}
      </Button>
    </main>
  )
}
