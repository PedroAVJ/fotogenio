import { stripe } from "@/lib/clients";
import { env } from "@/lib/env";
import { baseUrl } from "@/lib/urls";
import { ChoosePaymentComponent } from "@/app/choose-payment";
import * as Sentry from "@sentry/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Route } from "next";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();
  if (!user) {
    const url: Route = "/";
    redirect(url);
  }
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
        userId: user.id,
        operation: "buy-credits",
      },
    },
    locale: "es",
  });
  if (!client_secret) {
    Sentry.captureMessage("No client secret", "error");
  }
  return <ChoosePaymentComponent clientSecret={client_secret} />;
}
