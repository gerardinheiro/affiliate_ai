import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Admin stats
export async function GET(req: Request) {
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

        // Get all stats
        const [
            totalUsers,
            freeUsers,
            paidUsers,
            totalProducts,
            totalPosts,
        ] = await Promise.all([
            db.user.count(),
            db.user.count({ where: { subscription: "FREE" } }),
            db.user.count({ where: { subscription: "PAID" } }),
            db.product.count(),
            db.post.count(),
        ])

        return NextResponse.json({
            totalUsers,
            freeUsers,
            paidUsers,
            totalProducts,
            totalPosts,
        })
    } catch (error) {
        console.error("[ADMIN_STATS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
