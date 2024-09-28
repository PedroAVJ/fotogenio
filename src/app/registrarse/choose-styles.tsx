'use client'

import React from 'react'
import { Work_Sans } from 'next/font/google'
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Image from 'next/image'
import { useLocalStorage } from 'react-use-storage'
import { Style } from '@prisma/client'

const workSans = Work_Sans({ subsets: ['latin'] })

enum Gender {
  male = 'male',
  female = 'female'
}

export function ChooseStyles({
  maleStyles,
  femaleStyles,
}: {
  maleStyles: Style[];
  femaleStyles: Style[];
}) {
  const [selectedGender] = useLocalStorage<Gender | null>('selectedGender', null)
  const [step, setStep] = useLocalStorage<number>('step', 2)
  const [selectedStyles, setSelectedStyles] = useLocalStorage<string[]>('selectedStyles', [])

  const styles = selectedGender === Gender.male ? maleStyles : femaleStyles

  const handleStyleChange = (value: string[]) => {
    setSelectedStyles(value)
  }

  const handleNextStep = () => {
    setStep(3)
  }

  return (
    <main className={`
      ${workSans.className}
      min-h-dvh w-full
      flex flex-col items-center justify-between
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
          Escoge Tus Estilos
        </h3>
      </div>
      <div className="w-full flex justify-center">
        <ToggleGroup
          type="multiple"
          value={selectedStyles}
          onValueChange={handleStyleChange}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-[320px] md:max-w-4xl justify-items-center"
        >
          {styles.map((style) => (
            <ToggleGroupItem
              key={style.id}
              value={style.id}
              aria-label={`Toggle ${style.description}`}
              className="relative w-36 h-48 md:w-48 md:h-64 p-0 hover:bg-[#8CF486] data-[state=on]:bg-[#8CF486]"
            >
              <Image
                src={style.coverPhotoUrl}
                alt={style.description}
                fill
                className="size-full rounded-md object-cover p-0.5"
              />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <Button
        size="lg"
        className="flex w-36 font-semibold rounded-md text-[#F5F5F5] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={selectedStyles.length === 0}
        onClick={handleNextStep}
      >
        Siguiente
      </Button>
    </main>
  )
}