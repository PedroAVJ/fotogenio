'use client';

import { Gender } from '@prisma/client';
import Image from 'next/image';
import { useLocalStorage } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { H1, H3 } from '@/components/ui/typography';
import { Style } from '@prisma/client';

export function ChooseStyles({
  maleStyles,
  femaleStyles,
}: {
  maleStyles: Style[];
  femaleStyles: Style[];
}) {
  const [selectedGender] = useLocalStorage<Gender | null>(
    'gender',
    null,
  );
  const [selectedStyles, setSelectedStyles] = useLocalStorage<string[]>(
    'styles',
    [],
  );
  const [currentStep, setCurrentStep] = useLocalStorage('step', 2);
  return (
    <>
      <div className="flex w-full space-x-2">
        <H1 className="border-gradient-step flex size-16 items-center justify-center rounded-lg border-x-4 border-l-secondary border-r-primary bg-no-repeat font-medium text-primary">
          {currentStep}
        </H1>
        <H3 className="border-gradient-main flex grow justify-center rounded-lg border-x-4 border-l-primary border-r-secondary bg-no-repeat p-4 font-medium">
          Escoge Tus Estilos
        </H3>
      </div>
      <ToggleGroup
        type="multiple"
        onValueChange={(styles) => {
          if (styles.length === 0) {
            setSelectedStyles([]);
          } else {
            setSelectedStyles(styles);
          }
        }}
        className="grid grid-cols-2 gap-4 w-full md:grid-cols-4"
      >
        {selectedGender === Gender.male
          ? maleStyles.map((style) => (
              <ToggleGroupItem
                key={style.id}
                value={style.id}
                aria-label={`Toggle ${style.description}`}
                className="relative h-64 w-40 md:h-80 md:w-48"
              >
                <Image
                  src={style.coverPhotoUrl}
                  alt={style.description}
                  fill
                  className="size-full rounded-md object-cover p-0.5"
                />
              </ToggleGroupItem>
            ))
          : femaleStyles.map((style) => (
              <ToggleGroupItem
                key={style.id}
                value={style.id}
                aria-label={`Toggle ${style.description}`}
                className="relative h-64 w-40 md:h-80 md:w-48"
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
      <Button
        variant="custom"
        size="lg"
        className="flex w-36 rounded-md"
        disabled={!selectedStyles.length}
        onClick={() => setCurrentStep(3)}
      >
        Siguiente
      </Button>
    </>
  );
}
