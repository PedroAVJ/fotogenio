import { NextResponse, NextRequest } from "next/server";
import { env } from "@/lib/env";
import { db } from "@/lib/clients";
import { Training } from "replicate";
import { validateWebhook } from "replicate";
import { generateImages } from "@/app/generate-images";
import { createModel } from "@/app/api/webhooks/create-model";

export async function POST(request: NextRequest) {
  const requestClone = request.clone();
  const isValid = await validateWebhook(
    requestClone,
    env.REPLICATE_WEBHOOK_SECRET,
  );
  if (!isValid) {
    const errorMessage = "Invalid webhook secret";
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    const errorMessage = "Missing userId";
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const userSettings = await db.userSettings.findUnique({
    where: { userId },
  });
  if (!userSettings) {
    const errorMessage = `User settings for user id ${userId} not found`;
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  if (userSettings.modelStatus !== "training") {
    const errorMessage = `Expected model status: training, found: ${userSettings.modelStatus} for user id ${userId}`;
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const { status } = (await request.json()) as Training;
  if (status === "failed") {
    const errorMessage = `Fine-tuning failed for user id: ${userId}`;
    console.error(errorMessage);
    await createModel(userId, userSettings.zippedPhotosUrl, true);
    return NextResponse.json({ message: errorMessage });
  }
  if (status !== "succeeded") {
    const errorMessage = `Fine-tuning failed: Unexpected status '${status}' for user id: ${userId}`;
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage });
  }
  const prompts = await db.prompt.findMany({
    where: {
      style: {
        chosenStyles: {
          some: {
            userId,
          },
        },
      },
    },
  });
  await db.userSettings.update({
    where: { userId },
    data: { modelStatus: "ready" },
  });
  await generateImages({
    userId,
    prompts,
  });
  return NextResponse.json({ message: "Webhook received" });
}
