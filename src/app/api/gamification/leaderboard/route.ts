import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        // Fetch top 10 users by XP
        const users = await db.user.findMany({
            take: 10,
            orderBy: {
                xp: 'desc'
            },
            select: {
                id: true,
                name: true,
                image: true,
                xp: true,
                level: true,
                badges: true
            }
        })

        // Add rank to each user
        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            id: user.id,
            name: user.name || "Usuário Anônimo",
            image: user.image,
            xp: user.xp || 0,
            level: user.level || 1,
            badgesCount: user.badges.length
        }))

        return NextResponse.json(leaderboard)

    } catch (error: unknown) {
        console.error("[LEADERBOARD_ERROR]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
