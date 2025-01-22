import { stripe } from "@/lib/clients";
import { env } from "@/lib/env";
import { baseUrl } from "@/lib/urls";
import { auth } from "@clerk/nextjs/server";
import { ChoosePaymentComponent } from "@/app/choose-payment";
import { clerkClient } from "@clerk/nextjs/server";
import { Route } from "next";

export default async function Page() {
  const { userId } = auth().protect();
  const user = await clerkClient().users.getUser(userId);
  const returnUrl: Route = "/nuevo-estilo?session_id={CHECKOUT_SESSION_ID}";
  const { client_secret } = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    customer_email: user.emailAddresses[0]?.emailAddress ?? "",
    line_items: [
      {
        price: env.CREDITS_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${baseUrl}${returnUrl}`,
    payment_intent_data: {
      metadata: {
        userId,
        operation: "buy-credits",
      },
    },
    locale: "es",
  });
  if (!client_secret) {
    console.error("No client secret");
  }
  return <ChoosePaymentComponent clientSecret={client_secret} />;
}
