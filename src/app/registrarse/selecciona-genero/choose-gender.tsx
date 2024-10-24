"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Image from "next/image";
import hombre from "./hombre.png";
import mujer from "@/app/mujer.png";
import { useQueryState, parseAsStringEnum } from "nuqs";
import { useSearchParams } from "next/navigation";
import { Gender } from "@prisma/client";

export function ChooseGender() {
  const searchParams = useSearchParams();
  const [selectedGender, setSelectedGender] = useQueryState(
    "gender",
    parseAsStringEnum<Gender>(Object.values(Gender)),
  );
  async function handleGenderChange(value: string) {
    if (value === "") {
      await setSelectedGender(null);
    } else if (value === Gender.male || value === Gender.female) {
      await setSelectedGender(value);
    }
  }
  return (
    <main className="flex size-full h-dvh w-dvw flex-col items-center justify-between bg-gradient-to-b from-[#534E4E] to-[#171717] px-2 pb-8 pt-4 text-[#F5F5F5]">
      <div className="flex w-full space-x-2">
        <h1 className="flex size-16 scroll-m-20 items-center justify-center rounded-lg border-x-4 border-l-[#4776E6] border-r-[#8E54E9] bg-no-repeat text-3xl font-semibold tracking-tight text-[#8E54E9] [background-image:linear-gradient(90deg,#4776E6,#8E54E9),linear-gradient(90deg,#4776E6,#8E54E9)] [background-position:0_0,0_100%] [background-size:100%_4px] lg:text-5xl">
          1
        </h1>
        <h3 className="flex grow scroll-m-20 justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 text-xl font-semibold tracking-tight [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-position:0_0,0_100%] [background-size:100%_4px]">
          Escoge Tu Género
        </h3>
      </div>
      <ToggleGroup
        type="single"
        value={selectedGender ?? ""}
        onValueChange={function (value: string) {
          void handleGenderChange(value);
        }}
        className="flex w-full flex-col items-center justify-evenly space-y-4 md:flex-row"
      >
        <ToggleGroupItem
          value={Gender.male}
          aria-label="Toggle male"
          className="relative h-56 w-72 p-0 hover:bg-[#8CF486] data-[state=on]:bg-[#8CF486] md:h-72 md:w-96"
        >
          <Image
            src={hombre}
            priority
            alt="Personaje masculino - Hombre asiático con abrigo negro"
            className="size-full rounded-md object-cover p-0.5"
          />
        </ToggleGroupItem>
        <ToggleGroupItem
          value={Gender.female}
          aria-label="Toggle female"
          className="relative h-56 w-72 p-0 hover:bg-[#8CF486] data-[state=on]:bg-[#8CF486] md:h-72 md:w-96"
        >
          <Image
            src={mujer}
            priority
            alt="Personaje femenino - Mujer asiática con vestido blanco"
            className="size-full rounded-md object-cover p-0.5"
          />
        </ToggleGroupItem>
      </ToggleGroup>
      <Button
        size="lg"
        className="flex w-36 rounded-md bg-gradient-to-r from-[#4776E6] to-[#8E54E9] font-semibold text-[#F5F5F5] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!selectedGender}
      >
        <Link
          href={`/registrarse/selecciona-estilos?${searchParams.toString()}`}
        >
          Siguiente
        </Link>
      </Button>
    </main>
  );
}
