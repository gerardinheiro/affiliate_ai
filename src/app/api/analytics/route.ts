import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = (session.user as any).id
        const campaigns = await db.campaign.findMany({
            where: { userId },
        })

        const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0)
        const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0)
        const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
        const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)
        const roi = totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent) * 100 : 0

        // Group by platform for channel data
        const channelData = campaigns.reduce((acc: any[], campaign) => {
            const existing = acc.find(item => item.name === campaign.platform)
            if (existing) {
                existing.value += campaign.clicks
            } else {
                acc.push({ name: campaign.platform, value: campaign.clicks })
            }
            return acc
        }, [])

        return NextResponse.json({
            totalRevenue,
            totalClicks,
            totalConversions,
            roi,
            channelData,
        })
    } catch (error) {
        console.error("Error fetching analytics:", error)
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
    }
}
