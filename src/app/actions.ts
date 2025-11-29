"use server"

import { generateAdCopy, generateImage, scrapeProduct, generateVideoScript } from "@/lib/ai-service"
import { uploadImageFromUrl } from "@/lib/nitroflare"
import { XP_REWARDS } from "@/lib/gamification"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

async function getUserContext() {
    const session = await getServerSession(authOptions)
    if (!session?.user) return undefined

    const user = await db.user.findUnique({
        where: { id: (session.user as any).id },
        select: {
            openaiApiKey: true,
            brandName: true,
            brandTone: true,
            brandDescription: true
        }
    })

    return user
}

export async function generateCopyAction(productName: string) {
    const user = await getUserContext()
    const description = "Produto incrível de alta qualidade com garantia de satisfação."

    const brandContext = user ? {
        name: user.brandName || undefined,
        tone: user.brandTone || undefined,
        description: user.brandDescription || undefined
    } : undefined

    const copy = await generateAdCopy(productName, description, user?.openaiApiKey || undefined, brandContext)

    if (copy && user) {
        try {
            const session = await getServerSession(authOptions)
            if (session?.user) {
                await db.creative.create({
                    data: {
                        userId: (session.user as any).id,
                        type: 'copy',
                        headline: `Ad Copy: ${productName}`,
                        description: copy,
                        cta: 'Learn More',
                        prompt: `Product: ${productName}, Desc: ${description}`
                    }
                })

                await db.user.update({
                    where: { id: (session.user as any).id },
                    data: { xp: { increment: XP_REWARDS.CREATE_CREATIVE } }
                })
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
                        userId: (session.user as any).id,
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
                    where: { id: (session.user as any).id },
                    data: { xp: { increment: XP_REWARDS.CREATE_CREATIVE } }
                })
            } catch (error) {
                console.error('Error saving creative to database:', error)
            }
        }
    }

    return imageUrl
}

export async function scrapeProductAction(url: string) {
    return await scrapeProduct(url)
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
                        userId: (session.user as any).id,
                        type: 'video_script',
                        headline: `Video Script: ${productName}`,
                        description: JSON.stringify(script),
                        cta: 'Watch Now',
                        script: JSON.stringify(script),
                        prompt: `Product: ${productName}, Desc: ${description}`
                    }
                })

                await db.user.update({
                    where: { id: (session.user as any).id },
                    data: { xp: { increment: XP_REWARDS.CREATE_CREATIVE } }
                })
            }
        } catch (error) {
            console.error('Error saving script to DB:', error)
        }
    }

    return script
}
