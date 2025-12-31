import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - List all tags for user
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const tags = await db.nitroflareTag.findMany({
            where: { userId: user.id },
            include: {
                _count: {
                    select: { creatives: true }
                }
            },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(tags)
    } catch (error) {
        console.error("Error fetching tags:", error)
        return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
    }
}

// POST - Create new tag
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const body = await req.json()
        const { name, color } = body

        const tag = await db.nitroflareTag.create({
            data: {
                name,
                color,
                userId: user.id
            }
        })

        return NextResponse.json(tag)
    } catch (error) {
        console.error("Error creating tag:", error)
        return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
    }
}

// DELETE - Delete tag
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: "Tag ID required" }, { status: 400 })
        }

        await db.nitroflareTag.delete({
            where: { id, userId: user.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting tag:", error)
        return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 })
    }
}
