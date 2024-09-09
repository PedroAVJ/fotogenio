'use client';

import Image from 'next/image';
import { useLocalStorage } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { H1, H3 } from '@/components/ui/typography';
import type { genderChoices } from '@/server/db/styles';

export function ChooseStyles() {
  const [selectedGender, setSelectedGender] = useLocalStorage<
    (typeof genderChoices)[number] | null
  >('gender', null);
  const [currentStep, setCurrentStep] = useLocalStorage('step', 1);
  return (
    <div className="flex size-full flex-col items-center space-y-20 px-3 pb-12 pt-3">
      <div className="flex w-full space-x-2">
        <H1 className="border-gradient-step flex size-16 items-center justify-center rounded-lg border-x-4 border-l-secondary border-r-primary bg-no-repeat font-medium text-primary">
          {currentStep}
        </H1>
        <H3 className="border-gradient-main flex grow justify-center rounded-lg border-x-4 border-l-primary border-r-secondary bg-no-repeat p-4 font-medium">
          Escoge Tus Estilos
        </H3>
      </div>
      <ToggleGroup
        type="single"
        onValueChange={(value) => {
          if (value === '') {
            setSelectedGender(null);
          } else {
            setSelectedGender(value as (typeof genderChoices)[number]);
          }
        }}
        className="flex w-full grow flex-col items-center justify-evenly space-y-4 md:flex-row"
      >
        <ToggleGroupItem
          value="male"
          aria-label="Toggle male"
          className="relative h-60 w-72 md:h-72 md:w-96"
        >
          <Image
            src="https://uxsi5qpvaazgwqzm.public.blob.vercel-storage.com/gender-male-k92XCfMROnzg0OlAT39xsiJC1xfm4S.png"
            alt="Male character"
            fill
            className="size-full rounded-md object-cover p-0.5"
          />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="female"
          aria-label="Toggle female"
          className="relative h-60 w-72 md:h-72 md:w-96"
        >
          <Image
            src="https://uxsi5qpvaazgwqzm.public.blob.vercel-storage.com/gender-female-tpgFLyrunZe1K0FK4m0JeEO2Y6evh3.png"
            alt="Female character"
            fill
            className="size-full rounded-md object-cover p-0.5"
          />
        </ToggleGroupItem>
      </ToggleGroup>
      <Button
        variant="custom"
        size="lg"
        className="flex w-36 rounded-md"
        disabled={!selectedGender}
        onClick={() => setCurrentStep(2)}
      >
        Siguiente
      </Button>
    </div>
  );
}
