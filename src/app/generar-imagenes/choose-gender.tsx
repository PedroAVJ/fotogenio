'use client';

import Image from 'next/image';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { H1, H3 } from '@/components/ui/typography';

export function ChooseGender() {
  return (
    <div className="flex size-full flex-col items-center space-y-20 px-3 pb-12 pt-3">
      <div className="flex w-full space-x-2">
        <H1 className="border-gradient-step flex size-16 items-center justify-center rounded-lg border-x-4 border-l-secondary border-r-primary bg-no-repeat font-medium text-primary">
          1
        </H1>
        <H3 className="border-gradient-main flex grow justify-center rounded-lg border-x-4 border-l-primary border-r-secondary bg-no-repeat p-4 font-medium">
          Escoge Tu Género
        </H3>
      </div>
      <div className="flex w-full grow flex-col items-center justify-between space-y-4">
        <div className="h-60 w-72">
          <AspectRatio ratio={5 / 4}>
            <Image
              src="https://uxsi5qpvaazgwqzm.public.blob.vercel-storage.com/gender-male-k92XCfMROnzg0OlAT39xsiJC1xfm4S.png"
              alt="Male character"
              fill
              className="size-full rounded-md object-cover"
            />
          </AspectRatio>
        </div>
        <div className="h-60 w-72">
          <AspectRatio ratio={5 / 4}>
            <Image
              src="https://uxsi5qpvaazgwqzm.public.blob.vercel-storage.com/gender-female-tpgFLyrunZe1K0FK4m0JeEO2Y6evh3.png"
              alt="Female character"
              fill
              className="size-full rounded-md object-cover"
            />
          </AspectRatio>
        </div>
      </div>
      <Button variant="custom" size="lg" className="flex w-36 rounded-md">
        Siguiente
      </Button>
    </div>
  );
}
