"use client";

import React, { useState, useEffect } from "react";
import { Work_Sans } from "next/font/google";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Camera, Loader2, Plus } from "lucide-react";
import { createImages } from "./api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Prisma } from "@prisma/client";
import Link from "next/link";

const workSans = Work_Sans({ subsets: ["latin"] });

type StyleWithCount = Prisma.StyleGetPayload<{
  include: {
    _count: {
      select: {
        prompts: true;
      };
    };
  };
}>;

interface NewStyleProps {
  credits: number;
  styles: StyleWithCount[];
}

export function NewStyleComponent({ credits, styles }: NewStyleProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [remainingCredits, setRemainingCredits] = useState(credits);

  const handleStyleChange = (value: string[]) => {
    setSelectedStyles(value);
  };

  useEffect(() => {
    const usedCredits = selectedStyles.reduce((total, styleId) => {
      const style = styles.find((s) => s.id === styleId);
      return total + (style ? style._count.prompts : 0);
    }, 0);
    setRemainingCredits(Math.max(0, credits - usedCredits));
  }, [selectedStyles, styles, credits]);

  const mutation = useMutation({
    mutationFn: createImages,
    onSuccess: ({ message }) => {
      toast.error(message);
    },
  });
  return (
    <main
      className={` ${workSans.className} relative flex h-dvh w-dvw flex-col bg-gradient-to-b from-[#534E4E] to-[#171717] text-[#F5F5F5]`}
    >
      <ScrollArea className="h-full w-full">
        <div className="px-2 pb-24 pt-4">
          <div className="mb-8 flex w-full flex-col items-center space-y-8">
            <h3 className="flex w-11/12 scroll-m-20 justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 text-[20px] font-semibold leading-[102%] tracking-[0px] [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-position:0_0,0_100%] [background-size:100%_4px]">
              Escoge un Nuevo Estilo
            </h3>
            <h3 className="inline-flex scroll-m-20 items-center justify-center space-x-4 rounded-lg border-x-4 border-l-white border-r-[#4776E6] bg-no-repeat px-6 py-4 text-[20px] font-semibold leading-[102%] tracking-[0px] [background-image:linear-gradient(90deg,white,#4776E6),linear-gradient(90deg,white,#4776E6)] [background-position:0_0,0_100%] [background-size:100%_4px]">
              <Camera />
              <span className="bg-gradient-to-b from-[#4776E6] to-white bg-clip-text text-[24px] font-semibold leading-[102%] tracking-[0px] text-transparent">
                x {remainingCredits}
              </span>
              <Link
                href="/comprar-creditos"
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-[2px] border-white p-0.5"
              >
                <Plus size={12} strokeWidth={3} />
              </Link>
            </h3>
          </div>
          <div className="flex justify-center">
            <ToggleGroup
              type="multiple"
              value={selectedStyles}
              onValueChange={handleStyleChange}
              className="mb-20 grid w-full max-w-[320px] grid-cols-2 gap-x-2 gap-y-4"
            >
              {styles.map((style, index) => (
                <ToggleGroupItem
                  key={style.id}
                  value={style.id}
                  aria-label={`Toggle ${style.description}`}
                  className="group relative h-[215px] w-[149px] overflow-hidden rounded-md p-0 data-[state=on]:ring-2 data-[state=on]:ring-[#8CF486]"
                  disabled={
                    !selectedStyles.includes(style.id) &&
                    remainingCredits < style._count.prompts
                  }
                >
                  <Image
                    src={style.coverPhotoUrl}
                    alt={style.description}
                    fill
                    sizes="(min-width: 768px) 16.67vw, 50vw"
                    priority={index < 6}
                    className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="px-2 text-center font-semibold text-white">
                      {style.description}
                    </p>
                  </div>
                  <div className="absolute bottom-2 right-2 text-xs font-semibold text-white">
                    x {style._count.prompts}
                  </div>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </ScrollArea>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4">
        <Button
          size="lg"
          className="w-48 rounded-[12px] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-[14px] font-semibold leading-[102%] tracking-[0px] text-[#F5F5F5] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={selectedStyles.length === 0 || mutation.isPending}
          onClick={function () {
            mutation.mutate({ styleIds: selectedStyles });
          }}
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Generar imágenes"
          )}
        </Button>
      </div>
    </main>
  );
}
