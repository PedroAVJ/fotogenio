import { expect, test } from 'vitest'
import { addWatermark } from './watermark'
import fs from 'fs/promises'
import path from 'path'

const TEN_SECONDS = 10000

test('addWatermark function', async function () {
  // Use a real image URL for testing
  const testImageUrl = 'https://utfs.io/f/wB1nfjdKLAC8CRRQGby5DeCAr32pMbqflQZJ9jHdoO8st74V'

  // Load the expected result from the current folder
  const expectedImagePath = path.join(__dirname, 'watermarked-image-example.webp')
  const expectedImageBuffer = await fs.readFile(expectedImagePath)
  
  // Convert the buffer to a Blob
  const expectedImageBlob = new Blob([expectedImageBuffer], { type: 'image/webp' })

  // If you need a File object instead, you can create one from the Blob
  const expectedImageFile = new File([expectedImageBlob], 'watermarked-image-example.webp', { type: 'image/webp' })

  // Call the function with the test URL
  const result = await addWatermark(testImageUrl)

  expect(result).toEqual(expectedImageFile)
}, TEN_SECONDS)
