'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Work_Sans } from 'next/font/google'

const workSans = Work_Sans({ subsets: ['latin'] })

export function GenderSelection() {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null)

  const handleImageClick = (gender: 'male' | 'female') => {
    setSelectedGender(prevGender => prevGender === gender ? null : gender)
  }

  return (
    <div className={`flex items-center justify-center min-h-screen w-full bg-gradient-to-b from-[#534E4E] to-[#171717] text-white ${workSans.className}`}>
      <div className="w-full max-w-[320px] md:max-w-[800px] mx-auto pt-4 pb-6 px-4 flex flex-col">
        <div className="space-y-4 flex-grow">
          <div className="flex items-center w-full mb-4 md:mb-8">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg border-2 border-[#4776E6] flex items-center justify-center text-[#8E54E9] font-bold text-lg md:text-xl mr-2">
              1
            </div>
            <div className="text-lg md:text-2xl font-semibold text-white border-2 border-[#8E54E9] rounded-md px-2 py-1 flex-grow flex items-center justify-center">
              Escoge Tu Género
            </div>
          </div>
          <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex">
            <div 
              className={`relative cursor-pointer rounded-lg overflow-hidden ${selectedGender === 'male' ? 'ring-2 ring-[#8CF486]' : ''} md:w-1/2`}
              onClick={() => handleImageClick('male')}
            >
              <Image
                src="https://uxsi5qpvaazgwqzm.public.blob.vercel-storage.com/gender-male-k92XCfMROnzg0OlAT39xsiJC1xfm4S.png"
                alt="Male character"
                width={400}
                height={500}
                className="w-full h-[200px] md:h-[400px] object-cover"
              />
            </div>
            <div 
              className={`relative cursor-pointer rounded-lg overflow-hidden ${selectedGender === 'female' ? 'ring-2 ring-[#8CF486]' : ''} md:w-1/2`}
              onClick={() => handleImageClick('female')}
            >
              <Image
                src="https://uxsi5qpvaazgwqzm.public.blob.vercel-storage.com/gender-female-tpgFLyrunZe1K0FK4m0JeEO2Y6evh3.png"
                alt="Female character"
                width={400}
                height={500}
                className="w-full h-[200px] md:h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6 md:mt-8">
          <Button 
            className="px-8 py-2 md:px-12 md:py-3 text-white font-semibold text-sm md:text-base rounded-md bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#3665D5] hover:to-[#7D43D8] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedGender}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}