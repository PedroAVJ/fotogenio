'use client'

import React from 'react'
import { Work_Sans } from 'next/font/google'
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Image from 'next/image'
import { useLocalStorage } from 'react-use-storage'

const workSans = Work_Sans({ subsets: ['latin'] })

enum Gender {
  male = 'male',
  female = 'female'
}

export function ChooseGender() {
  const [selectedGender, setSelectedGender] = useLocalStorage<Gender | null>('selectedGender', null)
  const [step, setStep] = useLocalStorage<number>('step', 1)

  const handleGenderChange = (value: string) => {
    if (value === '') {
      setSelectedGender(null)
    } else {
      setSelectedGender(value as Gender)
    }
  }

  const handleNextStep = () => {
    setStep(2)
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
          className="scroll-m-20 text-4xl tracking-tight lg:text-5xl flex size-16 items-center justify-center rounded-lg border-x-4 border-l-[#4776E6] border-r-[#8E54E9] bg-no-repeat font-medium text-[#8E54E9] [background-image:linear-gradient(90deg,#4776E6,#8E54E9),linear-gradient(90deg,#4776E6,#8E54E9)] [background-size:100%_4px] [background-position:0_0,0_100%]"
        >
          {step}
        </h1>
        <h3 className="scroll-m-20 text-2xl tracking-tight flex grow justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 font-medium [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-size:100%_4px] [background-position:0_0,0_100%]">
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
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DgiC6O5i2MQTLIxkUEpvpbUvwXWcON.png"
            alt="Male character - Asian man in a black coat"
            fill
            className="size-full rounded-md object-cover p-0.5"
          />
        </ToggleGroupItem>
        <ToggleGroupItem
          value={Gender.female}
          aria-label="Toggle female"
          className="relative h-56 w-72 md:h-72 md:w-96 p-0 hover:bg-[#8CF486] data-[state=on]:bg-[#8CF486]"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-in6wI8Org9scHHjYf0SUXAel8KcQC9.png"
            alt="Female character - Fantasy warrior woman in red and black outfit"
            fill
            className="size-full rounded-md object-cover p-0.5"
          />
        </ToggleGroupItem>
      </ToggleGroup>
      <Button
        size="lg"
        className="flex w-36 rounded-md text-[#F5F5F5] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!selectedGender}
        onClick={handleNextStep}
      >
        Siguiente
      </Button>
    </main>
  )
}