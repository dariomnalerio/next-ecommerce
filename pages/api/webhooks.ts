import Stripe from "stripe";
import { buffer } from "micro"; // buffer is used to parse the body of the request into a buffer, stripe webhooks events are sent as raw bytes
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/util/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buf = await buffer(req);
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).send("Missing the stripe signature");
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send("Webhook error: " + err);
  }

  // Handle different events
  switch (event?.type) {
    case "payment_intent.created":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was created");
      break;
    case "charge.succeeded":
      const charge = event.data.object as Stripe.Charge;
      if (typeof charge.payment_intent === "string") {
        const order = await prisma.order.update({
          where: { paymentIntentID: charge.payment_intent },
          data: { status: "complete" },
        });
      }
      break;
    default:
      console.log("Unhandled event type:" + event.type);
  }
  res.json({ received: true });
}
