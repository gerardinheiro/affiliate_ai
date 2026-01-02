import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { sendSubscriptionSuccessEmail } from "@/lib/email"
import Stripe from "stripe"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get("Stripe-Signature") as string

    let event: Stripe.Event

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.error("STRIPE_WEBHOOK_SECRET not set")
            return new NextResponse("Webhook Secret Missing", { status: 500 })
        }

        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error: any) {
        console.error(`Webhook Error: ${error.message}`)
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === "checkout.session.completed") {
        // Retrieve the subscription details
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        // Retrieve customer email
        const customerEmail = session.customer_details?.email
        const customerName = session.customer_details?.name

        // Identify the plan (you might want to map price IDs to plan names)
        // For now, we'll try to get it from metadata or product info
        // This is a simplified example
        const planName = "Premium" // You'd fetch this from the product/price ID

        if (customerEmail) {
            console.log(`Payment successful for ${customerEmail}. Sending email...`)

            // Send the success email
            await sendSubscriptionSuccessEmail(customerEmail, planName)

            // TODO: Update user in database
            // const userId = session.metadata?.userId
            // await prisma.user.update(...)
        }
    }

    return new NextResponse(null, { status: 200 })
}
