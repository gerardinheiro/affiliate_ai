import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - List all folders for user
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

        const folders = await db.nitroflareFolder.findMany({
            where: { userId: user.id },
            include: {
                _count: {
                    select: { creatives: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(folders)
    } catch (error) {
        console.error("Error fetching folders:", error)
        return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 })
    }
}

// POST - Create new folder
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
        const { name, description, color, icon } = body

        const folder = await db.nitroflareFolder.create({
            data: {
                name,
                description,
                color,
                icon,
                userId: user.id
            }
        })

        return NextResponse.json(folder)
    } catch (error) {
        console.error("Error creating folder:", error)
        return NextResponse.json({ error: "Failed to create folder" }, { status: 500 })
    }
}

// PATCH - Update folder
export async function PATCH(req: NextRequest) {
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
        const { id, name, description, color, icon } = body

        const folder = await db.nitroflareFolder.update({
            where: { id, userId: user.id },
            data: { name, description, color, icon }
        })

        return NextResponse.json(folder)
    } catch (error) {
        console.error("Error updating folder:", error)
        return NextResponse.json({ error: "Failed to update folder" }, { status: 500 })
    }
}

// DELETE - Delete folder
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
            return NextResponse.json({ error: "Folder ID required" }, { status: 400 })
        }

        await db.nitroflareFolder.delete({
            where: { id, userId: user.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting folder:", error)
        return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 })
    }
}
