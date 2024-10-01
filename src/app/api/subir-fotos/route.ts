import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
 
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => {
      auth().protect();
      return {};
    },
    onUploadCompleted: async () => {
      // We get a type error if we omit this
      // function, so we leave it empty.
    },
  });
  return NextResponse.json(jsonResponse);
}
