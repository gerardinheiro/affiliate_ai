import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// PATCH - Update access count (admin only)
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as any).id
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { role: true },
        })

        if (user?.role !== "ADMIN") {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const body = await req.json()
        const { count } = body

        if (typeof count !== "number" || count < 0) {
            return new NextResponse("Invalid count", { status: 400 })
        }

        // Get current count
        const currentCount = await db.pageView.count({
            where: { page: "/" },
        })

        // If new count is higher, add records
        if (count > currentCount) {
            const toAdd = count - currentCount
            const records = Array.from({ length: toAdd }, () => ({
                page: "/",
                ipAddress: "admin-adjusted",
                userAgent: "admin-panel",
            }))

            await db.pageView.createMany({
                data: records,
            })
        }
        // If new count is lower, delete records
        else if (count < currentCount) {
            const toDelete = currentCount - count
            const recordsToDelete = await db.pageView.findMany({
                where: { page: "/" },
                take: toDelete,
                orderBy: { createdAt: "desc" },
            })

            await db.pageView.deleteMany({
                where: {
                    id: {
                        in: recordsToDelete.map((r) => r.id),
                    },
                },
            })
        }

        return NextResponse.json({ success: true, count })
    } catch (error) {
        console.error("[ACCESS_COUNT_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
