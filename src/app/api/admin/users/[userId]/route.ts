import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// PATCH - Update user (admin only)
export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const adminId = (session.user as { id: string }).id
        const admin = await db.user.findUnique({
            where: { id: adminId },
            select: { role: true },
        })

        if (admin?.role !== "ADMIN") {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const body = await req.json()
        const { level, subscription, subscriptionExpiresAt, subscriptionDays } = body

        // Calculate expiry date if days provided
        let expiryDate = subscriptionExpiresAt
        if (subscriptionDays && subscription === "PAID") {
            const now = new Date()
            expiryDate = new Date(now.getTime() + subscriptionDays * 24 * 60 * 60 * 1000)
        }

        const user = await db.user.update({
            where: { id: userId },
            data: {
                level: level !== undefined ? parseInt(level) : undefined,
                subscription,
                subscriptionExpiresAt: subscription === "PAID" ? expiryDate : null,
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("[ADMIN_USER_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
