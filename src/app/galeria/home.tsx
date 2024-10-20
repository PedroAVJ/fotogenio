"use client";

import { useState, useOptimistic, useTransition } from "react";
import { Work_Sans } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera, ArrowDown } from "lucide-react";
import Image from "next/image";
import { Feedback, GeneratedPhoto } from "@prisma/client";
import { saveAs } from "file-saver";
import { v4 as uuidv4 } from "uuid";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { saveFeedback, saveDownload } from "./api";

const workSans = Work_Sans({
  subsets: ["latin"],
});

interface HomeProps {
  credits: number;
  generatedPhotos: GeneratedPhoto[];
}

export function HomeComponent({ credits, generatedPhotos }: HomeProps) {
  const [optimisticGeneratedPhotos, setOptimisticGeneratedPhotos] =
    useOptimistic(generatedPhotos);
  const [, startTransition] = useTransition();
  function handleFeedbackClick(
    feedback: Feedback,
    generatedPhotoId: string,
    index: number,
  ) {
    const newGeneratedPhotos = optimisticGeneratedPhotos.map((photo, i) =>
      i === index ? { ...photo, feedback } : photo,
    );
    startTransition(async function () {
      setOptimisticGeneratedPhotos(newGeneratedPhotos);
      await saveFeedback({
        feedback,
        generatedPhotoId,
      });
    });
  }
  const [touchedId, setTouchedId] = useState<string | null>(null);

  async function handleDownload(url: string, generatedPhotoId: string) {
    void saveDownload(generatedPhotoId);
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = `${uuidv4()}.png`;
    saveAs(blob, fileName);
  }

  const handleTouchStart = (id: string) => {
    setTouchedId(id);
  };

  const handleTouchEnd = () => {
    setTouchedId(null);
  };

  return (
    <main
      className={`
      ${workSans.className}
      h-screen w-full
      text-[#F5F5F5]
      bg-gradient-to-b from-[#534E4E] to-[#171717]
    `}
    >
      <ScrollArea className="h-full">
        <div className="flex flex-col items-center px-2 pb-8 pt-4">
          <h3 className="scroll-m-20 text-[20px] leading-normal tracking-[0.02em] text-center flex items-center justify-center p-4 font-semibold">
            <span className="inline-block">
              ¡Puedes generar{" "}
              <span className="inline-block bg-gradient-to-b from-[#8E54E9] to-white bg-clip-text text-transparent">
                {credits}
              </span>{" "}
              fotos más!
            </span>
          </h3>
          <Button
            asChild
            size="lg"
            className="flex items-center justify-center gap-2 px-4 py-2 mb-8 rounded-xl text-[#F5F5F5] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 text-[14px] leading-[12px] tracking-[0.02em] font-semibold"
          >
            <Link href="/nuevo-estilo">
              Generar Nuevas Fotos
              <Camera className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <div className="flex flex-col items-center gap-4">
            {optimisticGeneratedPhotos.map(
              ({ photoUrl, feedback, id }, index) => (
                <div
                  key={id}
                  className="relative w-[303px] h-[420px] rounded-[10px] overflow-hidden group cursor-pointer"
                  onTouchStart={function () {
                    handleTouchStart(id);
                  }}
                  onTouchEnd={handleTouchEnd}
                >
                  <Image
                    src={photoUrl ?? ""}
                    alt={`Generated image ${id}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover rounded-[10px]"
                    priority={index < 2}
                  />
                  {/* Add the thumbs up and down icons */}
                  <div className="absolute bottom-2 right-2 flex space-x-2 z-10">
                    <Button
                      size="icon"
                      type="button"
                      variant="secondary"
                      className="bg-white bg-opacity-50 hover:bg-opacity-75"
                      onClick={function () {
                        handleFeedbackClick(
                          feedback === "positive" ? "neutral" : "positive",
                          id,
                          index,
                        );
                      }}
                    >
                      <ThumbsUp
                        className={`size-4 ${feedback === "positive" ? "text-blue-600" : ""}`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      type="button"
                      variant="secondary"
                      className="bg-white bg-opacity-50 hover:bg-opacity-75"
                      onClick={function () {
                        handleFeedbackClick(
                          feedback === "negative" ? "neutral" : "negative",
                          id,
                          index,
                        );
                      }}
                    >
                      <ThumbsDown
                        className={`size-4 ${feedback === "negative" ? "text-red-500" : ""}`}
                      />
                    </Button>
                  </div>
                  <div
                    className={`absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center transition-opacity duration-300 ${
                      touchedId === id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <p className="text-white text-lg font-semibold mb-4">
                      ¡Descarga tus fotos!
                    </p>
                    <div
                      onClick={function () {
                        void handleDownload(photoUrl ?? "", id);
                      }}
                      className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center"
                    >
                      <ArrowDown className="text-white w-6 h-6" />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}
