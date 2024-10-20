import { NextResponse, NextRequest } from "next/server";
import { stripe, db } from "@/lib/clients";
import { env } from "@/lib/env";
import { headers } from "next/headers";
import { createModel } from "@/app/api/webhooks/create-model";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");
  if (!signature) {
    throw new Error("Stripe signature not found");
  }
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    env.STRIPE_WEBHOOK_SECRET,
  );
  if (event.type !== "payment_intent.succeeded") {
    throw new Error("Invalid event type");
  }
  const { userId = "", operation } = event.data.object.metadata;
  if (operation === "create-model") {
    const userSettings = await db.userSettings.findUnique({
      where: {
        userId,
        modelStatus: "pending",
      },
    });
    if (!userSettings) {
      return NextResponse.json({ message: "Webhook retry catched" });
    }
    await db.userSettings.update({
      where: { userId },
      data: { credits: { increment: 25 }, modelStatus: "training" },
    });
    await createModel(userId, userSettings.zippedPhotosUrl);
  } else if (operation === "buy-credits") {
    await db.userSettings.update({
      where: { userId },
      data: { credits: { increment: 25 } },
    });
  }
  return NextResponse.json({ message: "Webhook received" });
}
