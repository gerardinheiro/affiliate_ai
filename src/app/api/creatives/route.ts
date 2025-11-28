import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { addXp } from "@/lib/gamification"

// GET - List all creatives
export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as any).id
        const creatives = await db.creative.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(creatives)
    } catch (error) {
        console.error("[CREATIVES_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// POST - Create a new creative
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as any).id
        const body = await req.json()
        const { headline, description, cta, imageUrl, format, type, script, templateId } = body

        const creative = await db.creative.create({
            data: {
                headline,
                description,
                cta,
                imageUrl,
                format,
                type: type || "image",
                script,
                templateId,
                userId,
            },
        })

        // Add XP for creating a creative
        await addXp(userId, 30)

        return NextResponse.json(creative, { status: 201 })
    } catch (error) {
        console.error("[CREATIVES_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE - Delete a creative
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as any).id
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) return new NextResponse("ID required", { status: 400 })

        const creative = await db.creative.findUnique({ where: { id } })
        if (!creative || creative.userId !== userId) {
            return new NextResponse("Creative not found", { status: 404 })
        }

        await db.creative.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[CREATIVES_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
