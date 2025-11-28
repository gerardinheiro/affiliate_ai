"use server"

import { generateAdCopy, generateImage, generateVideoScript } from "@/lib/ai-service"
import { scrapeProduct } from "@/lib/scraper"
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
    // In a real app, we would fetch the product description from DB
    const description = "Produto incrível de alta qualidade com garantia de satisfação."

    const brandContext = user ? {
        name: user.brandName || undefined,
        tone: user.brandTone || undefined,
        description: user.brandDescription || undefined
    } : undefined

    return await generateAdCopy(productName, description, user?.openaiApiKey || undefined, brandContext)
}

export async function generateImageAction(prompt: string) {
    const user = await getUserContext()
    return await generateImage(prompt, user?.openaiApiKey || undefined)
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

    return await generateVideoScript(productName, description, user?.openaiApiKey || undefined, brandContext)
}
