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
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { saveFeedback, saveDownload } from "./api";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";
import { useMutation } from "@tanstack/react-query";
import { usePostHog } from "posthog-js/react";

const workSans = Work_Sans({
  subsets: ["latin"],
});

interface HomeProps {
  credits: number;
  generatedPhotos: GeneratedPhoto[];
}

export function HomeComponent({ credits, generatedPhotos }: HomeProps) {
  const posthog = usePostHog();
  const [optimisticGeneratedPhotos, setOptimisticGeneratedPhotos] =
    useOptimistic(generatedPhotos);
  const [, startTransition] = useTransition();
  function handleFeedbackClick(
    feedback: Feedback,
    generatedPhotoId: string,
    index: number,
  ) {
    posthog.capture("feedback_photo", {
      feedback,
      generatedPhotoId,
    });
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

  const downloadMutation = useMutation({
    mutationFn: saveDownload,
    onError: (error, generatedPhotoId) => {
      Sentry.captureException(error, {
        extra: {
          generatedPhotoId,
        },
      });
    },
  });
  function handleDownload(url: string, generatedPhotoId: string) {
    posthog.capture("download_photo", {
      generatedPhotoId,
    });
    downloadMutation.mutate(generatedPhotoId);
    try {
      saveAs(url);
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          generatedPhotoId,
          url,
        },
      });
      toast.error(
        "Ocurrió un error al descargar la foto. Por favor, intenta de nuevo.",
      );
      return;
    }
  }

  const handleTouchStart = (id: string) => {
    setTouchedId(id);
  };

  const handleTouchEnd = () => {
    setTouchedId(null);
  };

  return (
    <main
      className={` ${workSans.className} h-screen w-full bg-gradient-to-b from-[#534E4E] to-[#171717] text-[#F5F5F5]`}
    >
      <ScrollArea className="h-full">
        <div className="flex flex-col items-center px-2 pb-8 pt-4">
          <h3 className="flex scroll-m-20 items-center justify-center p-4 text-center text-[20px] font-semibold leading-normal tracking-[0.02em]">
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
            className="mb-8 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4776E6] to-[#8E54E9] px-4 py-2 text-[14px] font-semibold leading-[12px] tracking-[0.02em] text-[#F5F5F5] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90"
          >
            <Link href="/nuevo-estilo">
              Generar Nuevas Fotos
              <Camera className="ml-2 size-5" />
            </Link>
          </Button>
          <div className="flex flex-col items-center gap-4">
            {optimisticGeneratedPhotos.map(
              ({ photoUrl, feedback, id }, index) => (
                <div
                  key={id}
                  className="group relative h-[420px] w-[303px] cursor-pointer overflow-hidden rounded-[10px]"
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
                    className="rounded-[10px] object-cover"
                    priority={index < 2}
                  />
                  {/* Add the thumbs up and down icons */}
                  <div className="absolute bottom-2 right-2 z-10 flex space-x-2">
                    <Button
                      size="icon"
                      type="button"
                      variant="secondary"
                      className="bg-white/50 hover:bg-white/75"
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
                      className="bg-white/50 hover:bg-white/75"
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
                    className={`absolute inset-0 flex flex-col items-center justify-center bg-black/50 transition-opacity duration-300 ${
                      touchedId === id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <p className="mb-4 text-lg font-semibold text-white">
                      ¡Descarga tus fotos!
                    </p>
                    <div
                      onClick={function () {
                        handleDownload(photoUrl ?? "", id);
                      }}
                      className="flex size-12 items-center justify-center rounded-full border-2 border-white"
                    >
                      <ArrowDown className="size-6 text-white" />
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
