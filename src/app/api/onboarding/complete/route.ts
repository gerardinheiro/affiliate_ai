import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        await db.user.update({
            where: {
                id: (session.user as { id: string }).id,
            },
            data: {
                hasCompletedOnboarding: true,
            },
        })

        // Send welcome email
        if (session.user.email) {
            await sendWelcomeEmail(session.user.email, session.user.name || "Afiliado")
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[ONBOARDING_COMPLETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
