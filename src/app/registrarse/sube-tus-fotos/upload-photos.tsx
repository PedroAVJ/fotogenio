"use client";

import { Work_Sans } from "next/font/google";
import { Button } from "@/components/ui/button";
import { X, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { FileUploader } from "@/components/ui/file-uploader";
import { ScrollArea } from "@/components/ui/scroll-area";
import JSZip from "jszip";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useUploadFile } from "@/hooks/use-upload-file";
import { Route } from "next";
import { useMutation } from "@tanstack/react-query";
import { uploadFiles } from "@/lib/uploadthing";
import { useState } from "react";

const workSans = Work_Sans({ subsets: ["latin"] });

import malo1 from "./ejemplos/malo-1.jpeg";
import malo2 from "./ejemplos/malo-2.jpeg";
import malo3 from "./ejemplos/malo-3.jpeg";
import bueno1 from "./ejemplos/bueno-1.jpeg";
import bueno2 from "./ejemplos/bueno-2.jpeg";
import bueno3 from "./ejemplos/bueno-3.jpeg";

const placeholderImages = [
  { foto: malo1, status: "rejected" },
  { foto: malo2, status: "rejected" },
  { foto: malo3, status: "rejected" },
  { foto: bueno1, status: "accepted" },
  { foto: bueno2, status: "accepted" },
  { foto: bueno3, status: "accepted" },
];

const schema = z.object({
  photos: z
    .array(z.instanceof(File))
    .max(20, { message: "Debes subir como máximo 20 fotos" })
    .refine(
      (files) => files.length >= 12,
      (files) => ({
        message:
          files.length === 0
            ? "No has agregado ninguna foto. Debes subir al menos 12 fotos."
            : `Debes subir al menos 12 fotos. Te ${12 - files.length === 1 ? "falta 1 foto" : `faltan ${(12 - files.length).toString()} fotos`}.`,
      }),
    ),
});

type Schema = z.infer<typeof schema>;

export function UploadPhotosComponent() {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      photos: [],
    },
    mode: "onChange",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const subirFotos = useUploadFile("subirFotos", { defaultUploadedFiles: [] });
  const [progress, setProgress] = useState<number | null>(null);
  function handleSubmit() {
    mutation.mutate();
  }
  const mutation = useMutation({
    mutationFn: handleUpload,
  });
  function loadingText() {
    if (!progress) {
      return "Comprimiendo...";
    }
    return `Subiendo... ${progress.toString()}%`;
  }
  async function handleUpload() {
    const photos = form.getValues("photos");
    const txtFiles = subirFotos.uploadedFiles.map((file, index) => {
      const photoName = photos[index]?.name;
      if (photoName !== file.name) {
        Sentry.captureMessage("Photo name mismatch", {
          extra: {
            photoName,
            fileName: file.name,
            formPhotosLength: photos.length,
            uploadedFilesLength: subirFotos.uploadedFiles.length,
          },
        });
        toast.error("Hubo un error al subir tus fotos");
      }
      const txtFile = new File([file.serverData.caption], `${file.name}.txt`, {
        type: "text/plain",
      });
      return txtFile;
    });
    const zip = new JSZip();
    for (const file of form.getValues("photos")) {
      zip.file(file.name, file);
    }
    for (const file of txtFiles) {
      zip.file(file.name, file);
    }
    const content = await zip.generateAsync({ type: "arraybuffer" });
    const zippedPhotos = new File([content], "uploaded_photos.zip", {
      type: "application/zip",
    });
    const uploadedFiles = await uploadFiles("subirZip", {
      files: [zippedPhotos],
      onUploadProgress: ({ progress }) => {
        setProgress(progress);
      },
    });
    const uploadedZip = uploadedFiles[0];
    if (!uploadedZip) {
      Sentry.captureMessage("No zip file uploaded", "error");
      toast.error("Las fotos no se pudieron subir");
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("zippedPhotosUrl", uploadedZip.appUrl);
      const url: Route = "/registrarse/crear-cuenta";
      router.push(`${url}?${params.toString()}`);
    }
  }
  return (
    <ScrollArea>
      <main
        className={` ${workSans.className} flex min-h-dvh flex-col items-center justify-between space-y-4 bg-gradient-to-b from-[#534E4E] to-[#171717] p-4 text-[#F5F5F5]`}
      >
        <Form {...form}>
          <div className="flex w-full space-x-2">
            <h1 className="flex size-16 scroll-m-20 items-center justify-center rounded-lg border-x-4 border-l-[#4776E6] border-r-[#8E54E9] bg-no-repeat text-3xl font-semibold tracking-tight text-[#8E54E9] [background-image:linear-gradient(90deg,#4776E6,#8E54E9),linear-gradient(90deg,#4776E6,#8E54E9)] [background-position:0_0,0_100%] [background-size:100%_4px] lg:text-5xl">
              3
            </h1>
            <h3 className="flex grow scroll-m-20 justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 text-xl font-semibold tracking-tight [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-position:0_0,0_100%] [background-size:100%_4px]">
              Sube Tus Fotos
            </h3>
          </div>
          <div className="flex w-full max-w-md flex-col items-center justify-center space-y-4 px-4 md:max-w-4xl">
            <div className="grid w-full grid-cols-3 gap-4 gap-y-8 md:grid-cols-6">
              {placeholderImages.map((placeholderImage, index) => (
                <div
                  key={index}
                  className="relative aspect-square h-32 w-24 overflow-visible"
                >
                  <Image
                    src={placeholderImage.foto}
                    priority
                    alt={`Ejemplo ${(index + 1).toString()}`}
                    className="h-32 w-24 rounded-md object-cover"
                  />
                  {placeholderImage.status === "rejected" ? (
                    <div className="absolute -right-4 -top-4 flex size-8 items-center justify-center rounded-full border border-red-500">
                      <X className="text-red-500" size={20} />
                    </div>
                  ) : (
                    <div className="absolute -right-4 -top-4 flex size-8 items-center justify-center rounded-full border border-green-500">
                      <Check className="text-green-500" size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <FormField
              control={form.control}
              name="photos"
              render={({ field: { onChange, onBlur, value, disabled } }) => (
                <FormItem>
                  <FormControl>
                    <FileUploader
                      onValueChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      disabled={
                        disabled ??
                        (subirFotos.isUploading || mutation.isPending)
                      }
                      accept={{
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/png": [".png"],
                      }}
                      progresses={subirFotos.progresses}
                      onUpload={subirFotos.onUpload}
                      maxFileCount={20}
                      maxSize={8 * 1024 * 1024}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            size="lg"
            className="flex w-36 rounded-md bg-gradient-to-r from-[#4776E6] to-[#8E54E9] font-semibold text-[#F5F5F5] hover:from-[#4776E6]/90 hover:to-[#8E54E9]/90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={
              !form.formState.isValid ||
              subirFotos.isUploading ||
              mutation.isPending
            }
            onClick={() => {
              void form.handleSubmit(handleSubmit)();
            }}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {loadingText()}
              </>
            ) : (
              "Subir fotos"
            )}
          </Button>
        </Form>
      </main>
    </ScrollArea>
  );
}
