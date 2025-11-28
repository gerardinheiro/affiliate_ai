import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { addXp } from "@/lib/gamification"

// GET - List all posts for the user
export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as any).id
        const posts = await db.post.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(posts)
    } catch (error) {
        console.error("[POSTS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// POST - Create a new post
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as any).id
        const body = await req.json()
        const { content, imageUrl, platforms, scheduledFor } = body

        const post = await db.post.create({
            data: {
                content,
                imageUrl,
                platforms,
                scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
                userId,
            },
        })

        // Add XP for creating post
        await addXp(userId, 20)

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error("[POSTS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE - Delete a post
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as any).id
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return new NextResponse("Post ID required", { status: 400 })
        }

        // Verify ownership
        const post = await db.post.findUnique({ where: { id } })
        if (!post || post.userId !== userId) {
            return new NextResponse("Post not found", { status: 404 })
        }

        await db.post.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[POSTS_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
