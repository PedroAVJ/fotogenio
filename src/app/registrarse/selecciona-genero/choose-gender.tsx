'use client'

import { useState } from 'react'
import Link from "next/link"
import { Work_Sans } from 'next/font/google'
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Image from 'next/image'
import hombre from './hombre.png'
import mujer from '../mujer.png'

const workSans = Work_Sans({ subsets: ['latin'] })

enum Gender {
  male = 'male',
  female = 'female'
}

export function ChooseGender() {
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null)
  const handleGenderChange = (value: string) => {
    if (value === '') {
      setSelectedGender(null)
    } else {
      setSelectedGender(value as Gender)
    }
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
          1
        </h1>
        <h3 className="scroll-m-20 text-xl tracking-tight flex grow justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 font-semibold [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-size:100%_4px] [background-position:0_0,0_100%]">
          Escoge Tu Género
        </h3>
      </div>
      <ToggleGroup
        type="single"
        value={selectedGender || ''}
        onValueChange={handleGenderChange}
        className="flex w-full flex-col items-center justify-evenly space-y-4 md:flex-row"
      >
        <ToggleGroupItem
          value={Gender.male}
          aria-label="Toggle male"
          className="relative h-56 w-72 md:h-72 md:w-96 p-0 hover:bg-[#8CF486] data-[state=on]:bg-[#8CF486]"
        >
          <Image
            src={hombre}
            alt="Personaje masculino - Hombre asiático con abrigo negro"
            className="size-full rounded-md object-cover p-0.5"
          />
        </ToggleGroupItem>
        <ToggleGroupItem
          value={Gender.female}
          aria-label="Toggle female"
          className="relative h-56 w-72 md:h-72 md:w-96 p-0 hover:bg-[#8CF486] data-[state=on]:bg-[#8CF486]"
        >
          <Image
            src={mujer}
            alt="Personaje femenino - Mujer asiática con vestido blanco"
            className="size-full rounded-md object-cover p-0.5"
          />
        </ToggleGroupItem>
      </ToggleGroup>
      <Button
        size="lg"
        className="flex w-36 font-semibold rounded-md text-[#F5F5F5] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!selectedGender}
      >
        <Link href={`/registrarse/selecciona-estilos?gender=${selectedGender}`}>Siguiente</Link>
      </Button>
    </main>
  )
}
