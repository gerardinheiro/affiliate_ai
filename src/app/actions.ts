"use server"

import { generateAdCopy, generateImage } from "@/lib/ai-service"
import { scrapeProduct } from "@/lib/scraper"

export async function generateCopyAction(productName: string) {
    // In a real app, we would fetch the product description from DB
    const description = "Produto incrível de alta qualidade com garantia de satisfação."
    return await generateAdCopy(productName, description)
}

export async function generateImageAction(prompt: string) {
    return await generateImage(prompt)
}

export async function scrapeProductAction(url: string) {
    return await scrapeProduct(url)
}
