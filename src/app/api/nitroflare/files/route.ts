import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// PATCH - Update creative (rename, move to folder, add tags)
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
        const { id, headline, folderId, tagIds } = body

        const updateData: {
            headline?: string
            folderId?: string
            tags?: { set: { id: string }[] }
        } = {}
        if (headline !== undefined) updateData.headline = headline
        if (folderId !== undefined) updateData.folderId = folderId

        if (tagIds !== undefined) {
            updateData.tags = {
                set: tagIds.map((tagId: string) => ({ id: tagId }))
            }
        }

        const creative = await db.creative.update({
            where: { id, userId: user.id },
            data: updateData,
            include: {
                folder: true,
                tags: true
            }
        })

        return NextResponse.json(creative)
    } catch (error) {
        console.error("Error updating creative:", error)
        return NextResponse.json({ error: "Failed to update creative" }, { status: 500 })
    }
}

// DELETE - Delete creative
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
            return NextResponse.json({ error: "Creative ID required" }, { status: 400 })
        }

        await db.creative.delete({
            where: { id, userId: user.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting creative:", error)
        return NextResponse.json({ error: "Failed to delete creative" }, { status: 500 })
    }
}
