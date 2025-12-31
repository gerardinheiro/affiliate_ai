import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - List all notifications for the user
export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as { id: string }).id
        const notifications = await db.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 20, // Limit to 20 most recent
        })

        return NextResponse.json(notifications)
    } catch (error) {
        console.error("[NOTIFICATIONS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// PATCH - Mark notification as read
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as { id: string }).id
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return new NextResponse("Notification ID required", { status: 400 })
        }

        // Verify ownership
        const notification = await db.notification.findUnique({ where: { id } })
        if (!notification || notification.userId !== userId) {
            return new NextResponse("Notification not found", { status: 404 })
        }

        const updated = await db.notification.update({
            where: { id },
            data: { read: true },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("[NOTIFICATIONS_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE - Delete a notification
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as { id: string }).id
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return new NextResponse("Notification ID required", { status: 400 })
        }

        // Verify ownership
        const notification = await db.notification.findUnique({ where: { id } })
        if (!notification || notification.userId !== userId) {
            return new NextResponse("Notification not found", { status: 404 })
        }

        await db.notification.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[NOTIFICATIONS_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
