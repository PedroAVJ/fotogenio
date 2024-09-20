'use client'

import React, { useEffect, useState } from 'react'
import { Work_Sans } from 'next/font/google'
import { Button } from "@/components/ui/button"
import Lottie from 'lottie-react'

const workSans = Work_Sans({ subsets: ['latin'] })

export function WaitingComponent() {
  const [animationData, setAnimationData] = useState(null)

  useEffect(() => {
    fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Animation%20-%201725891597214-LLEgcagqDJnN7MxXTFFqf3x2rU2qcQ.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error fetching animation data:', error))
  }, [])

  const handleClose = () => {
    // Handle closing the component
    console.log("Closing the component")
  }

  return (
    <main className={`
      ${workSans.className}
      h-dvh w-dvw
      flex size-full flex-col
      px-2 pb-4 pt-2
      text-[#F5F5F5]
      bg-gradient-to-b from-[#534E4E] to-[#171717]
    `}>
      <div className="flex w-full space-x-2 mb-4">
        <h1 
          className="scroll-m-20 flex size-16 items-center justify-center rounded-lg border-x-4 border-l-[#4776E6] border-r-[#8E54E9] bg-no-repeat font-semibold text-[32px] tracking-[0.02em] text-[#8E54E9] [background-image:linear-gradient(90deg,#4776E6,#8E54E9),linear-gradient(90deg,#4776E6,#8E54E9)] [background-size:100%_4px] [background-position:0_0,0_100%]"
        >
          $
        </h1>
        <h3 className="scroll-m-20 flex grow items-center justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat font-semibold text-[20px] tracking-[0.02em] [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-size:100%_4px] [background-position:0_0,0_100%]">
          ¡Éxito!
        </h3>
      </div>
      
      <div className="flex flex-col items-center w-full max-w-md mx-auto flex-grow">
        <h2 className="font-semibold text-[20px] tracking-[0.02em] text-center mb-4">
          ¡Tus fotos se estan generando!
        </h2>
        {animationData ? (
          <div className="w-full max-w-md flex-grow flex items-center justify-center">
            <Lottie animationData={animationData} loop={true} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-32">Cargando animación...</div>
        )}
        <p className="font-semibold text-[12px] leading-[20px] tracking-[0.02em] mt-4">
          Tiempo aprox. 30 min
        </p>
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          size="lg"
          className="flex w-36 rounded-md text-[#F5F5F5] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-[14px] tracking-[0.02em]"
          onClick={handleClose}
        >
          Cerrar
        </Button>
      </div>
    </main>
  )
}