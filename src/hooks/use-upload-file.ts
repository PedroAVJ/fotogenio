import * as React from "react";
import { toast } from "sonner";
import type { UploadFilesOptions } from "uploadthing/types";

import { getErrorMessage } from "@/lib/handle-error";
import { uploadFiles } from "@/lib/uploadthing";
import { type FileRouter } from "@/app/api/uploadthing/core";

import { type ClientUploadedFileData } from "uploadthing/types";

export type UploadedFile<T> = ClientUploadedFileData<T>;

interface Caption {
  caption: string;
}

interface UseUploadFileProps
  extends Pick<
    UploadFilesOptions<FileRouter, keyof FileRouter>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  defaultUploadedFiles?: UploadedFile<Caption>[];
}

export function useUploadFile(
  endpoint: keyof FileRouter,
  { defaultUploadedFiles = [], ...props }: UseUploadFileProps = {},
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadedFile<Caption>[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {},
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(files: File[]) {
    setIsUploading(true);
    try {
      const res = await uploadFiles(endpoint, {
        ...props,
        files,
        onUploadProgress: ({ file, progress }) => {
          setProgresses((prev) => {
            return {
              ...prev,
              [file.name]: progress,
            };
          });
        },
      });

      setUploadedFiles((prev) => [
        ...prev,
        ...(res as UploadedFile<Caption>[]),
      ]);
      return uploadedFiles;
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
    return [];
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  };
}
