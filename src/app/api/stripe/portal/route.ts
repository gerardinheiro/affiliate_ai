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

        const userId = (session.user as any).id

        const stripeCustomer = await db.stripeCustomer.findUnique({
            where: { userId },
        })

        if (!stripeCustomer) {
            return new NextResponse("Not found", { status: 404 })
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
