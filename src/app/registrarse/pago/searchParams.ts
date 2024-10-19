import "server-only";

import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsString,
  parseAsStringEnum
} from 'nuqs/server'
import { Gender } from '@prisma/client'
 
export const searchParamsCache = createSearchParamsCache({
  gender: parseAsStringEnum<Gender>(Object.values(Gender)),
  styles: parseAsArrayOf(parseAsString).withDefault([]),
  zippedPhotosUrl: parseAsString,
})
