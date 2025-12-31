import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get all creatives (both with and without Nitroflare URLs) for this user
        const creatives = await db.creative.findMany({
            where: {
                userId: (session.user as { id: string }).id,
                type: "image" // Only show images
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                imageUrl: true,
                nitroflareUrl: true,
                prompt: true,
                headline: true,
                createdAt: true
            }
        })

        return NextResponse.json(creatives)
    } catch (error) {
        console.error("Error fetching Nitroflare gallery:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
