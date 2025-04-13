import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "../../../../../prisma"; // adjust the import path based on your setup

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const subscription = event.data.object as Stripe.Subscription;

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const customerId = subscription.customer as string;
      const isActive = subscription.status === "active";

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { isPremium: isActive },
      });

      console.log(`✅ Updated user ${customerId} premium: ${isActive}`);
      break;
    }

    case "customer.subscription.deleted": {
      const customerId = subscription.customer as string;

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { isPremium: false },
      });

      console.log(`⚠️ Subscription canceled for ${customerId}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
