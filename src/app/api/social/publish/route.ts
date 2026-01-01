import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { pinterestAdsService } from "@/lib/pinterest-ads"
import { tiktokAdsService } from "@/lib/tiktok-ads"

// POST - Publish post to social networks
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as { id: string }).id
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

        // Real publishing logic
        const results = await Promise.all(post.platforms.map(async (platform) => {
            try {
                const integration = integrations.find(i => i.platform === platform)
                if (!integration || !integration.refreshToken) {
                    return { platform, success: false, message: "Integração não configurada corretamente" }
                }

                if (platform === "pinterest") {
                    const accessToken = integration.apiKey
                    if (!accessToken) {
                        return { platform, success: false, message: "Token de acesso não encontrado" }
                    }

                    // Create Pin
                    await pinterestAdsService.createPin(accessToken, integration.accountId || "default", {
                        title: post.content.substring(0, 100),
                        description: post.content,
                        imageUrl: post.imageUrl || ""
                    })

                    return { platform, success: true, message: "Pin criado com sucesso no Pinterest!" }
                }

                if (platform === "tiktok") {
                    const accessToken = integration.apiKey
                    if (!accessToken) {
                        return { platform, success: false, message: "Token de acesso não encontrado" }
                    }

                    // Publish Video
                    await tiktokAdsService.publishVideo(accessToken, {
                        videoUrl: post.imageUrl || "", // Assuming imageUrl is the video URL for TikTok
                        title: post.content.substring(0, 80)
                    })

                    return { platform, success: true, message: "Vídeo publicado com sucesso no TikTok!" }
                }

                // Fallback for other platforms (still simulated for now)
                return { platform, success: true, message: `Post publicado (simulado) no ${platform}!` }
            } catch (error: any) {
                console.error(`Error publishing to ${platform}:`, error)
                return { platform, success: false, message: error.message || `Erro ao publicar no ${platform}` }
            }
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
