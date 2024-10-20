import { NextResponse, NextRequest } from "next/server";
import { env } from "@/lib/env";
import { db, utapi } from "@/lib/clients";
import { validateWebhook } from "replicate";
import { Prediction } from "replicate";
import { addWatermark } from "./watermark";

export async function POST(request: NextRequest) {
  const requestClone = request.clone();
  const isValid = await validateWebhook(
    requestClone,
    env.REPLICATE_WEBHOOK_SECRET,
  );
  if (!isValid) {
    throw new Error("Invalid webhook secret");
  }
  const { searchParams } = new URL(request.url);
  const generatedPhotoId = searchParams.get("generatedPhotoId");
  if (!generatedPhotoId) {
    throw new Error("Generated photo ID not found");
  }
  const result = (await request.json()) as Prediction;
  if (!Array.isArray(result.output) || typeof result.output[0] !== "string") {
    throw new Error("Invalid output");
  }
  const generatedPhotoUrl = result.output[0];
  const file = await addWatermark(generatedPhotoUrl);
  const uploadedFiles = await utapi.uploadFiles([file]);
  const photoUrlWithWatermark = uploadedFiles[0]?.data?.appUrl;
  if (!photoUrlWithWatermark) {
    throw new Error("Photo URL with watermark not found");
  }
  const { id, userId, photoUrl } = await db.generatedPhoto.findUniqueOrThrow({
    where: {
      id: generatedPhotoId,
    },
  });
  if (photoUrl) {
    return NextResponse.json({ message: "Webhook retry catched" });
  }
  await db.generatedPhoto.update({
    where: { id },
    data: { photoUrl: photoUrlWithWatermark },
  });
  await db.userSettings.update({
    where: { userId },
    data: {
      credits: {
        decrement: 1,
      },
    },
  });
  return NextResponse.json({ message: "Webhook received" });
}
