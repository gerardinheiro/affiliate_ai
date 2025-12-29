import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - List all campaigns for the user
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = (session.user as any).id
        const campaigns = await db.campaign.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(campaigns)
    } catch (error) {
        console.error("Error fetching campaigns:", error)
        return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
    }
}

// POST - Create a new campaign
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = (session.user as any).id
        const body = await req.json()
        const { name, platform, status, productId } = body

        const campaign = await db.campaign.create({
            data: {
                name,
                platform,
                status: status || "paused",
                userId,
                productId: productId || "", // Fallback for old API calls
            },
        })

        return NextResponse.json(campaign, { status: 201 })
    } catch (error) {
        console.error("Error creating campaign:", error)
        return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
    }
}

// PATCH - Update campaign status or metrics
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = (session.user as any).id
        const body = await req.json()
        const { id, status, clicks, conversions, spent, revenue } = body

        // Verify ownership
        const campaign = await db.campaign.findUnique({ where: { id } })
        if (!campaign || campaign.userId !== userId) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
        }

        const updated = await db.campaign.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(clicks !== undefined && { clicks }),
                ...(conversions !== undefined && { conversions }),
                ...(spent !== undefined && { spent }),
                ...(revenue !== undefined && { revenue }),
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Error updating campaign:", error)
        return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 })
    }
}

// DELETE - Delete a campaign
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = (session.user as any).id
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Campaign ID required" }, { status: 400 })
        }

        // Verify ownership
        const campaign = await db.campaign.findUnique({ where: { id } })
        if (!campaign || campaign.userId !== userId) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
        }

        await db.campaign.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting campaign:", error)
        return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 })
    }
}
