import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - List all users with stats
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

        const users = await db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                subscription: true,
                createdAt: true,
                lastLoginAt: true,
                xp: true,
                level: true,
                _count: {
                    select: {
                        products: true,
                        posts: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        // Calculate days since registration and days offline
        const usersWithStats = users.map(user => {
            const daysSinceRegistration = Math.floor(
                (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
            )
            const daysOffline = user.lastLoginAt
                ? Math.floor(
                    (Date.now() - new Date(user.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24)
                )
                : daysSinceRegistration

            return {
                ...user,
                daysSinceRegistration,
                daysOffline,
                productsCount: user._count.products,
                postsCount: user._count.posts,
            }
        })

        return NextResponse.json(usersWithStats)
    } catch (error) {
        console.error("[ADMIN_USERS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
