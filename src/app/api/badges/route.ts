import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { checkAndAwardBadges, BADGES, getBadgesByRarity } from "@/lib/badges"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'

// GET - Get user's badges and achievements
export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as any).id

        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                badges: true,
                xp: true,
                level: true,
            },
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        const userBadges = user.badges as string[]
        const badgeDetails = userBadges.map((badgeId) => BADGES[badgeId as keyof typeof BADGES])
        const groupedBadges = getBadgesByRarity(userBadges)

        // Get all available badges
        const allBadges = Object.values(BADGES)
        const unlockedBadgeIds = new Set(userBadges)
        const lockedBadges = allBadges.filter((badge) => !unlockedBadgeIds.has(badge.id))

        return NextResponse.json({
            badges: badgeDetails,
            groupedBadges,
            lockedBadges,
            totalBadges: userBadges.length,
            totalAvailable: allBadges.length,
            xp: user.xp,
            level: user.level,
        })
    } catch (error) {
        console.error("[BADGES_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// POST - Check and award new badges
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as any).id

        const newBadges = await checkAndAwardBadges(userId)

        if (newBadges.length > 0) {
            const badgeDetails = newBadges.map((badgeId) => BADGES[badgeId])

            return NextResponse.json({
                success: true,
                newBadges: badgeDetails,
                count: newBadges.length,
            })
        }

        return NextResponse.json({
            success: true,
            newBadges: [],
            count: 0,
        })
    } catch (error) {
        console.error("[BADGES_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
