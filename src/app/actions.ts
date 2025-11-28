"use server"

import { generateAdCopy, generateImage, generateVideoScript } from "@/lib/ai-service"
import { scrapeProduct } from "@/lib/scraper"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

async function getUserApiKey() {
    const session = await getServerSession(authOptions)
    if (!session?.user) return undefined

    const user = await db.user.findUnique({
        where: { id: (session.user as any).id },
        select: { openaiApiKey: true }
    })

    return user?.openaiApiKey || undefined
}

export async function generateCopyAction(productName: string) {
    const apiKey = await getUserApiKey()
    // In a real app, we would fetch the product description from DB
    const description = "Produto incrível de alta qualidade com garantia de satisfação."
    return await generateAdCopy(productName, description, apiKey)
}

export async function generateImageAction(prompt: string) {
    const apiKey = await getUserApiKey()
    return await generateImage(prompt, apiKey)
}

export async function scrapeProductAction(url: string) {
    return await scrapeProduct(url)
}

export async function generateVideoScriptAction(productName: string, description: string) {
    const apiKey = await getUserApiKey()
    return await generateVideoScript(productName, description, apiKey)
}
