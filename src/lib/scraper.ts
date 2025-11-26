import axios from "axios"
import * as cheerio from "cheerio"

export interface ScrapedProduct {
    title: string
    price: string
    imageUrl: string
    platform: string
}

export async function scrapeProduct(url: string): Promise<ScrapedProduct> {
    try {
        // Basic validation
        if (!url.startsWith("http")) {
            throw new Error("URL inválida")
        }

        // Identify platform
        let platform = "Desconhecido"
        if (url.includes("amazon")) platform = "Amazon"
        if (url.includes("hotmart")) platform = "Hotmart"
        if (url.includes("magalu")) platform = "Magalu"

        // Fetch HTML (User-Agent is important to avoid some blocks)
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        })

        const $ = cheerio.load(data)
        let title = ""
        let price = ""
        let imageUrl = ""

        // Strategy Pattern for different sites
        if (platform === "Amazon") {
            title = $("#productTitle").text().trim()
            price = $(".a-price .a-offscreen").first().text().trim()
            imageUrl = $("#landingImage").attr("src") || ""
        } else {
            // Generic fallback (Open Graph tags)
            title = $('meta[property="og:title"]').attr("content") || $("title").text().trim()
            price = $('meta[property="product:price:amount"]').attr("content") || "R$ 0,00"
            imageUrl = $('meta[property="og:image"]').attr("content") || ""
        }

        // Fallbacks if empty
        if (!title) title = "Produto sem título detectado"
        if (!price) price = "Preço não detectado"
        if (!imageUrl) imageUrl = "https://placehold.co/600x400/png?text=No+Image"

        return {
            title,
            price,
            imageUrl,
            platform,
        }
    } catch (error) {
        console.error("Scraping Error:", error)
        // Return a mock/fallback instead of crashing, for better UX in demo
        return {
            title: "Produto Exemplo (Falha no Scraping)",
            price: "R$ 99,90",
            imageUrl: "https://placehold.co/600x400/png?text=Scraping+Failed",
            platform: "Erro",
        }
    }
}
