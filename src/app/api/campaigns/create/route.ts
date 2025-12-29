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
        const { productId, platform, name, budget, headlines, descriptions, imageUrl } = await req.json()

        if (!productId || !platform || !name) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const userId = (session.user as any).id

        // 1. Create Campaign in DB
        const campaign = await db.campaign.create({
            data: {
                userId,
                productId,
                platform,
                name,
                budget: Number(budget),
                imageUrl,
                status: "active", // In a real app, this might be "pending" until confirmed by ad platform
                clicks: 0,
                conversions: 0,
                revenue: 0,
            }
        })

        // 2. (Optional) Integrate with Ad Platform API
        // Here we would call GoogleAdsService or TikTokAdsService to actually create the campaign.
        // For now, we'll just log it as a success simulation.
        console.log(`[CAMPAIGN_CREATE] Created campaign ${campaign.id} on ${platform} for product ${productId}`)

        return NextResponse.json(campaign)

    } catch (error: any) {
        console.error("[CAMPAIGN_CREATE_ERROR]", error)
        return new NextResponse(error.message || "Internal Error", { status: 500 })
    }
}
