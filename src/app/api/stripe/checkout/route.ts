import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"

const settingsUrl = process.env.NEXTAUTH_URL + "/settings"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { priceId } = await req.json()
        const userId = (session.user as any).id
        const userEmail = session.user.email

        // 1. Check if user already has a Stripe Customer ID
        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: { userId },
        })

        // 2. If not, create one in Stripe and save to DB
        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: userEmail!,
                metadata: {
                    userId,
                },
            })

            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId,
                    stripeCustomerId: customer.id,
                },
            })
        }

        // 3. Create Checkout Session
        const sessionStripe = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription", // or 'payment' for lifetime
            success_url: `${settingsUrl}?success=true`,
            cancel_url: `${settingsUrl}?canceled=true`,
            metadata: {
                userId,
            },
        })

        return NextResponse.json({ url: sessionStripe.url })
    } catch (error) {
        console.error("[STRIPE_CHECKOUT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
