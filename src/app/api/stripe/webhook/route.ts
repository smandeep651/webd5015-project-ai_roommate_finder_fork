// webhook

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "../../../../../prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const requestHeaders = await headers();
  const sig = requestHeaders.get("stripe-signature") as string;

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

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const userId = session.metadata?.userId;
      
        let isActive = false;
        const subscriptionId = session.subscription as string;
      
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          isActive = ["active", "trialing"].includes(subscription.status);
        }
      
        if (userId && customerId) {
          await prisma.user.update({
            where: { id: userId },
            data: { 
              stripeCustomerId: customerId,
              isPremium: isActive 
            },
          });
        } else {
          console.warn("⚠️ Missing userId or customerId in session metadata");
        }
      
        break;
      }      

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { isPremium: false },
        });

        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Error handling Stripe event:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
