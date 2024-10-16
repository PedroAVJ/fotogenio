import { expect, test } from 'vitest'
import { addWatermark } from './watermark'
import fs from 'fs/promises'
import path from 'path'

const TEN_SECONDS = 10000

test('addWatermark function', async function () {
  const expectedImagePath = path.join(__dirname, 'watermarked-image.test.webp')
  const expectedImageBuffer = await fs.readFile(expectedImagePath)
  const expectedImageFile = new File([expectedImageBuffer], 'watermarked-image.test.webp', { type: 'image/webp' })

  const testImageUrl = 'https://utfs.io/f/wB1nfjdKLAC8CRRQGby5DeCAr32pMbqflQZJ9jHdoO8st74V'
  const result = await addWatermark(testImageUrl)

  expect(result).toEqual(expectedImageFile)
}, TEN_SECONDS)
