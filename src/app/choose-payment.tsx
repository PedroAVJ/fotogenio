"use client";

import React from "react";
import { Work_Sans } from "next/font/google";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import mujer from "./mujer.png";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { env } from "@/lib/env";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const workSans = Work_Sans({ subsets: ["latin"] });

export function ChoosePaymentComponent({
  clientSecret,
}: {
  clientSecret: string | null;
}) {
  return (
    <ScrollArea>
      <main
        className={` ${workSans.className} flex min-h-dvh w-full flex-col items-center justify-between space-y-8 bg-gradient-to-b from-[#534E4E] to-[#171717] px-2 pb-8 pt-4 text-[#F5F5F5]`}
      >
        <div className="flex w-full space-x-1">
          <h1 className="flex size-16 scroll-m-20 items-center justify-center rounded-lg border-x-4 border-l-[#4776E6] border-r-[#8E54E9] bg-no-repeat text-4xl font-medium tracking-tight text-[#8E54E9] [background-image:linear-gradient(90deg,#4776E6,#8E54E9),linear-gradient(90deg,#4776E6,#8E54E9)] [background-position:0_0,0_100%] [background-size:100%_4px] lg:text-5xl">
            $
          </h1>
          <h3 className="flex grow scroll-m-20 justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 text-xl font-semibold tracking-tight [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-position:0_0,0_100%] [background-size:100%_4px]">
            Forma de Pago
          </h3>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="relative mb-4 size-80">
            <Image
              src={mujer}
              priority
              alt="Mujer de fondo"
              className="rounded-md object-cover"
            />
          </div>
          <ArrowDown className="mb-2 h-8 w-8 text-purple-500" />
          <p className="mb-4 text-xl font-semibold">
            <span className="text-purple-500">$99 pesos</span> por{" "}
            <span className="text-purple-500">25 fotos</span>
          </p>
          {clientSecret && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout className="w-full p-6" />
            </EmbeddedCheckoutProvider>
          )}
          {!clientSecret && (
            <div>Ocurrió un error al crear la sesión de pago</div>
          )}
        </div>
      </main>
    </ScrollArea>
  );
}
