import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// POST - Publish post to social networks
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as any).id
        const body = await req.json()
        const { postId } = body

        if (!postId) {
            return new NextResponse("Post ID required", { status: 400 })
        }

        // Get post
        const post = await db.post.findUnique({ where: { id: postId } })
        if (!post || post.userId !== userId) {
            return new NextResponse("Post not found", { status: 404 })
        }

        // Get user's social integrations
        const integrations = await db.integration.findMany({
            where: {
                userId,
                platform: { in: post.platforms }
            }
        })

        if (integrations.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Nenhuma integração encontrada para as plataformas selecionadas"
            })
        }

        // In a real app, this would call the actual social media APIs
        // For now, we'll just simulate the publishing
        const results = post.platforms.map(platform => ({
            platform,
            success: true,
            message: `Post publicado com sucesso no ${platform}!`
        }))

        // Update post status
        await db.post.update({
            where: { id: postId },
            data: {
                status: "published",
                publishedAt: new Date()
            }
        })

        // Create notification
        await db.notification.create({
            data: {
                title: "Post Publicado!",
                message: `Seu post foi publicado em ${post.platforms.length} rede(s) social(is).`,
                type: "post",
                userId
            }
        })

        return NextResponse.json({ success: true, results })
    } catch (error) {
        console.error("[SOCIAL_PUBLISH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
