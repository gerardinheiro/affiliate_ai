import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import Stripe from "stripe"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        if (!session?.metadata?.userId) {
            return new NextResponse("User id is required", { status: 400 })
        }

        await db.stripeCustomer.update({
            where: {
                userId: session.metadata.userId,
            },
            data: {
                stripeSubscriptionId: subscription.id,
                planId: subscription.items.data[0].price.id,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                status: "active",
            },
        })

        // Update User subscription status
        await db.user.update({
            where: { id: session.metadata.userId },
            data: {
                subscription: "PAID",
                subscriptionExpiresAt: new Date(subscription.current_period_end * 1000)
            }
        })
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        await db.stripeCustomer.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                status: "active",
            },
        })

        // Find user by stripe customer id to update expiry
        // This part requires a reverse lookup or storing user ID in subscription metadata
    }

    return new NextResponse(null, { status: 200 })
}
