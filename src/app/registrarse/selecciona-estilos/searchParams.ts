import "server-only";

import {
  createSearchParamsCache,
  parseAsStringEnum
} from 'nuqs/server'
import { Gender } from '@prisma/client'
 
export const searchParamsCache = createSearchParamsCache({
  gender: parseAsStringEnum<Gender>(Object.values(Gender)),
})
