import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"

const settingsUrl = process.env.NEXTAUTH_URL + "/settings"

export async function POST() {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            return new NextResponse("Stripe not configured", { status: 503 })
        }

        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const userId = (session.user as { id: string }).id

        const stripeCustomer = await db.stripeCustomer.findUnique({
            where: { userId },
        })

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: session.user.email!,
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

        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            return_url: settingsUrl,
        })

        return NextResponse.json({ url: stripeSession.url })
    } catch (error) {
        console.error("[STRIPE_CUSTOMER_PORTAL]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
