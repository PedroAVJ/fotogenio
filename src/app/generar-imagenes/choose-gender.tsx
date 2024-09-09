'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';

export function ChooseGender() {
  return (
    <div className="flex w-full flex-col items-center space-y-12 px-6 py-3">
      <div className="flex w-full space-x-2">
        <div className="border-gradient-step size-10 rounded-lg border-x-4 border-l-secondary border-r-primary bg-no-repeat p-2">
          1
        </div>
        <div className="flex grow items-center justify-center rounded-md border-2 border-[#8E54E9] px-2 py-1 text-lg font-semibold text-white">
          Escoge Tu Género
        </div>
      </div>
      <div className="space-y-8">
        <div className="relative cursor-pointer overflow-hidden rounded-lg">
          <Image
            src="https://uxsi5qpvaazgwqzm.public.blob.vercel-storage.com/gender-male-k92XCfMROnzg0OlAT39xsiJC1xfm4S.png"
            alt="Male character"
            width={400}
            height={500}
            className="h-[200px] w-full object-cover"
          />
        </div>
        <div className="relative cursor-pointer overflow-hidden rounded-lg">
          <Image
            src="https://uxsi5qpvaazgwqzm.public.blob.vercel-storage.com/gender-female-tpgFLyrunZe1K0FK4m0JeEO2Y6evh3.png"
            alt="Female character"
            width={400}
            height={500}
            className="h-[200px] w-full object-cover"
          />
        </div>
      </div>
      <Button variant="custom" className="flex w-36 rounded-md">
        Siguiente
      </Button>
    </div>
  );
}
