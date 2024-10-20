"use client";

import { Work_Sans } from "next/font/google";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Style } from "@prisma/client";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import Link from "next/link";

const workSans = Work_Sans({ subsets: ["latin"] });

export function ChooseStyles({ styles }: { styles: Style[] }) {
  const [selectedStyles, setSelectedStyles] = useQueryState(
    "styles",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  async function handleStyleChange(value: string[]) {
    await setSelectedStyles(value);
  }
  const searchParams = useSearchParams();
  return (
    <main
      className={` ${workSans.className} flex min-h-dvh w-full flex-col items-center justify-between bg-gradient-to-b from-[#534E4E] to-[#171717] px-2 pb-8 pt-4 text-[#F5F5F5]`}
    >
      <div className="flex w-full space-x-2">
        <h1 className="flex size-16 scroll-m-20 items-center justify-center rounded-lg border-x-4 border-l-[#4776E6] border-r-[#8E54E9] bg-no-repeat text-3xl font-semibold tracking-tight text-[#8E54E9] [background-image:linear-gradient(90deg,#4776E6,#8E54E9),linear-gradient(90deg,#4776E6,#8E54E9)] [background-position:0_0,0_100%] [background-size:100%_4px] lg:text-5xl">
          2
        </h1>
        <h3 className="flex grow scroll-m-20 justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 text-xl font-semibold tracking-tight [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-position:0_0,0_100%] [background-size:100%_4px]">
          Escoge Tus Estilos
        </h3>
      </div>
      <div className="flex w-full justify-center">
        <ToggleGroup
          type="multiple"
          value={selectedStyles}
          onValueChange={function (value: string[]) {
            void handleStyleChange(value);
          }}
          className="grid w-full max-w-[320px] grid-cols-2 justify-items-center gap-4 md:max-w-4xl md:grid-cols-4"
        >
          {styles.map((style) => (
            <ToggleGroupItem
              key={style.id}
              value={style.id}
              aria-label={`Toggle ${style.description}`}
              className="relative h-48 w-36 p-0 hover:bg-[#8CF486] data-[state=on]:bg-[#8CF486] md:h-64 md:w-48"
            >
              <Image
                src={style.coverPhotoUrl}
                alt={style.description}
                fill
                priority
                sizes="(max-width: 768px) 50vw, 25vw"
                className="size-full rounded-md object-cover p-0.5"
              />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <Button
        size="lg"
        className="flex w-36 rounded-md bg-gradient-to-r from-[#4776E6] to-[#8E54E9] font-semibold text-[#F5F5F5] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!selectedStyles}
      >
        <Link href={`/registrarse/sube-tus-fotos?${searchParams.toString()}`}>
          Siguiente
        </Link>
      </Button>
    </main>
  );
}
