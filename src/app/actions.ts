"use server"

import { generateAdCopy, generateImage, scrapeProduct, generateVideoScript } from "@/lib/ai-service"
import { uploadImageFromUrl } from "@/lib/nitroflare"
import { XP_REWARDS } from "@/lib/gamification"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { trackEvent } from "@/lib/analytics"

async function getUserContext() {
    const session = await getServerSession(authOptions)
    if (!session?.user) return undefined

    const user = await db.user.findUnique({
        where: { id: (session.user as { id: string }).id },
        select: {
            openaiApiKey: true,
            brandName: true,
            brandTone: true,
            brandDescription: true
        }
    })

    return user
}

export async function generateCopyAction(productName: string, description?: string) {
    const user = await getUserContext()
    const productDescription = description || "Produto incrível de alta qualidade com garantia de satisfação."

    const brandContext = user ? {
        name: user.brandName || undefined,
        tone: user.brandTone || undefined,
        description: user.brandDescription || undefined
    } : undefined

    const copy = await generateAdCopy(productName, productDescription, user?.openaiApiKey || undefined, brandContext)

    if (copy && user) {
        try {
            const session = await getServerSession(authOptions)
            if (session?.user) {
                await db.creative.create({
                    data: {
                        userId: (session.user as { id: string }).id,
                        type: 'copy',
                        headline: `Ad Copy: ${productName}`,
                        description: copy,
                        cta: 'Learn More',
                        prompt: `Product: ${productName}, Desc: ${productDescription}`
                    }
                })

                await db.user.update({
                    where: { id: (session.user as { id: string }).id },
                    data: { xp: { increment: XP_REWARDS.CREATE_CREATIVE } }
                })

                await trackEvent(
                    (session.user as { id: string }).id,
                    "creative_view",
                    `Gerou Copy: ${productName}`,
                    { productName }
                )
            }
        } catch (error) {
            console.error('Error saving copy to DB:', error)
        }
    }

    return copy
}

export async function generateImageAction(prompt: string) {
    const session = await getServerSession(authOptions)
    const user = await getUserContext()
    const imageUrl = await generateImage(prompt, user?.openaiApiKey || undefined)

    // Upload to Nitroflare for backup/storage
    if (imageUrl && session?.user) {
        const fileName = `ai-generated-${Date.now()}.png`
        const uploadResult = await uploadImageFromUrl(imageUrl, fileName)

        if (uploadResult.success && uploadResult.url) {
            console.log('Image backed up to Nitroflare:', uploadResult.url)

            // Save to database
            try {
                await db.creative.create({
                    data: {
                        userId: (session.user as { id: string }).id,
                        type: 'image',
                        headline: 'AI Generated Image',
                        description: prompt,
                        cta: '',
                        imageUrl: imageUrl,
                        nitroflareUrl: uploadResult.url,
                        prompt: prompt
                    }
                })

                // Award XP
                await db.user.update({
                    where: { id: (session.user as { id: string }).id },
                    data: { xp: { increment: XP_REWARDS.CREATE_CREATIVE } }
                })

                await trackEvent(
                    (session.user as { id: string }).id,
                    "creative_view",
                    "Gerou Imagem com IA",
                    { prompt }
                )
            } catch (error) {
                console.error('Error saving creative to database:', error)
            }
        }
    }

    return imageUrl
}

export async function scrapeProductAction(url: string) {
    const session = await getServerSession(authOptions)
    const product = await scrapeProduct(url)

    if (session?.user && product) {
        await trackEvent(
            (session.user as { id: string }).id,
            "product_view",
            `Analisou Produto: ${product.title}`,
            { url, platform: product.platform }
        )
    }

    return product
}

export async function generateVideoScriptAction(productName: string, description: string) {
    const user = await getUserContext()

    const brandContext = user ? {
        name: user.brandName || undefined,
        tone: user.brandTone || undefined,
        description: user.brandDescription || undefined
    } : undefined

    const script = await generateVideoScript(productName, description, user?.openaiApiKey || undefined, brandContext)

    if (script && user) {
        try {
            const session = await getServerSession(authOptions)
            if (session?.user) {
                await db.creative.create({
                    data: {
                        userId: (session.user as { id: string }).id,
                        type: 'video_script',
                        headline: `Video Script: ${productName}`,
                        description: JSON.stringify(script),
                        cta: 'Watch Now',
                        script: JSON.stringify(script),
                        prompt: `Product: ${productName}, Desc: ${description}`
                    }
                })

                await db.user.update({
                    where: { id: (session.user as { id: string }).id },
                    data: { xp: { increment: XP_REWARDS.CREATE_CREATIVE } }
                })

                await trackEvent(
                    (session.user as { id: string }).id,
                    "creative_view",
                    `Gerou Roteiro de Vídeo: ${productName}`,
                    { productName }
                )
            }
        } catch (error) {
            console.error('Error saving script to DB:', error)
        }
    }

    return script
}
export interface Scene {
    scene_number: number
    duration: number
    visual_description: string
    audio_script: string
}

export async function generateStoryboardAction(scenes: Scene[]) {
    const session = await getServerSession(authOptions)
    const user = await getUserContext()

    if (!session?.user) return []

    const storyboard = []

    for (const scene of scenes) {
        try {
            const imageUrl = await generateImage(scene.visual_description, user?.openaiApiKey || undefined)

            if (imageUrl) {
                const fileName = `storyboard-scene-${scene.scene_number}-${Date.now()}.png`
                const uploadResult = await uploadImageFromUrl(imageUrl, fileName)

                storyboard.push({
                    scene_number: scene.scene_number,
                    imageUrl: uploadResult.success ? uploadResult.url : imageUrl
                })

                // Save to creative gallery as well
                await db.creative.create({
                    data: {
                        userId: (session.user as { id: string }).id,
                        type: 'image',
                        headline: `Storyboard Scene ${scene.scene_number}`,
                        description: scene.visual_description,
                        cta: '',
                        imageUrl: imageUrl,
                        nitroflareUrl: uploadResult.success ? uploadResult.url : undefined,
                        prompt: scene.visual_description
                    }
                })
            }
        } catch (error) {
            console.error(`Error generating storyboard for scene ${scene.scene_number}:`, error)
        }
    }

    if (storyboard.length > 0) {
        await trackEvent(
            (session.user as { id: string }).id,
            "creative_view",
            "Gerou Storyboard de Vídeo",
            { sceneCount: scenes.length, generatedCount: storyboard.length }
        )
    }

    return storyboard
}
