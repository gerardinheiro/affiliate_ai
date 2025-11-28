import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        await db.user.update({
            where: {
                id: (session.user as any).id,
            },
            data: {
                hasCompletedOnboarding: true,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[ONBOARDING_COMPLETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
