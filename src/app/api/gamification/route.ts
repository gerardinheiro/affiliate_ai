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
        const user = await db.user.findUnique({
            where: { id: (session.user as { id: string }).id },
            select: {
                xp: true,
                level: true,
                badges: true,
            }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        // Calculate progress to next level
        const currentLevel = user.level
        const nextLevel = currentLevel + 1
        const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100
        const xpForNextLevel = Math.pow(nextLevel - 1, 2) * 100
        const progress = Math.min(100, Math.max(0,
            ((user.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
        ))

        return NextResponse.json({
            ...user,
            progress,
            nextLevelXp: xpForNextLevel
        })
    } catch (error) {
        console.error("[GAMIFICATION_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
