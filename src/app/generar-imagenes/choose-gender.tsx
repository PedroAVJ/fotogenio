'use client';

import { Gender } from '@prisma/client';
import Image from 'next/image';
import { useLocalStorage } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { H1, H3 } from '@/components/ui/typography';

export function ChooseGender() {
  const [selectedGender, setSelectedGender] = useLocalStorage<Gender | null>(
    'gender',
    null,
  );
  const [currentStep, setCurrentStep] = useLocalStorage('step', 1);
  return (
    <>
      <div className="flex w-full space-x-2">
        <H1 className="border-gradient-step flex size-16 items-center justify-center rounded-lg border-x-4 border-l-secondary border-r-primary bg-no-repeat font-medium text-primary">
          {currentStep}
        </H1>
        <H3 className="border-gradient-main flex grow justify-center rounded-lg border-x-4 border-l-primary border-r-secondary bg-no-repeat p-4 font-medium">
          Escoge Tu Género
        </H3>
      </div>
      <ToggleGroup
        type="single"
        onValueChange={(value) => {
          if (value === '') {
            setSelectedGender(null);
          } else {
            setSelectedGender(value as Gender);
          }
        }}
        className="flex w-full flex-col items-center justify-evenly space-y-4 md:flex-row"
      >
        <ToggleGroupItem
          value={Gender.male}
          aria-label="Toggle male"
          className="relative h-56 w-72 md:h-72 md:w-96"
        >
          <Image
            src="https://uxsi5qpvaazgwqzm.public.blob.vercel-storage.com/gender-male-k92XCfMROnzg0OlAT39xsiJC1xfm4S.png"
            alt="Male character"
            fill
            className="size-full rounded-md object-cover p-0.5"
          />
        </ToggleGroupItem>
        <ToggleGroupItem
          value={Gender.female}
          aria-label="Toggle female"
          className="relative h-56 w-72 md:h-72 md:w-96"
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
    </>
  );
}
