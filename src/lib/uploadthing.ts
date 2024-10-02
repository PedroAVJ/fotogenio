import { generateReactHelpers } from "@uploadthing/react"

import type { FileRouter } from "@/app/api/uploadthing/core"

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<FileRouter>()