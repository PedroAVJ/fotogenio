'use client'

import React from 'react'
import { Work_Sans } from 'next/font/google'
import Image from 'next/image'
import { ArrowDown } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import mujer from './mujer.png'
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { env } from '@/server/env'

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const workSans = Work_Sans({ subsets: ['latin'] })

export function ChoosePaymentComponent({ clientSecret }: { clientSecret: string | null }) {
  return (
    <ScrollArea>
      <main className={`
        ${workSans.className}
        min-h-dvh w-full
        flex flex-col items-center justify-between space-y-8
        px-2 pb-8 pt-4
        text-[#F5F5F5]
        bg-gradient-to-b from-[#534E4E] to-[#171717]
      `}>
        <div className="flex w-full space-x-1">
          <h1 
            className="scroll-m-20 text-4xl tracking-tight lg:text-5xl flex size-16 items-center justify-center rounded-lg border-x-4 border-l-[#4776E6] border-r-[#8E54E9] bg-no-repeat font-medium text-[#8E54E9] [background-image:linear-gradient(90deg,#4776E6,#8E54E9),linear-gradient(90deg,#4776E6,#8E54E9)] [background-size:100%_4px] [background-position:0_0,0_100%]"
          >
            $
          </h1>
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight flex grow justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-size:100%_4px] [background-position:0_0,0_100%]">
            Forma de Pago
          </h3>
        </div>
        <div className="flex flex-col items-center w-full">
          <div className="relative size-80 mb-4">
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
          {clientSecret && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout className="p-6 w-full" />
            </EmbeddedCheckoutProvider>
          )}
          {!clientSecret && (
            <div>Ocurrió un error al crear la sesión de pago</div>
          )}
        </div>
      </main>
    </ScrollArea>
  )
}