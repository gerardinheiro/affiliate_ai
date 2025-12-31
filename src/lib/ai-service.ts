import OpenAI from "openai"

import { load } from "cheerio"

export async function scrapeProduct(url: string) {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        })
        const html = await response.text()
        const $ = load(html)

        // Title Strategy
        const title =
            $('meta[property="og:title"]').attr('content') ||
            $('meta[name="twitter:title"]').attr('content') ||
            $('title').text() ||
            "Produto sem título"

        // Description Strategy
        const description =
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="twitter:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            "Sem descrição disponível"

        // Image Strategy
        const imageUrl =
            $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            $('link[rel="image_src"]').attr('href') ||
            null

        // Price Strategy (Best Effort)
        let price = "R$ 0,00"

        // Try OpenGraph Price
        const ogPrice = $('meta[property="product:price:amount"]').attr('content')
        const ogCurrency = $('meta[property="product:price:currency"]').attr('content') || "BRL"

        if (ogPrice) {
            price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: ogCurrency }).format(parseFloat(ogPrice))
        } else {
            // Try JSON-LD
            try {
                $('script[type="application/ld+json"]').each((_, el) => {
                    const json = JSON.parse($(el).html() || '{}')
                    if (json['@type'] === 'Product' || json['@type'] === 'Offer') {
                        const offer = json.offers || json
                        const p = offer.price || offer.lowPrice || offer.highPrice
                        const c = offer.priceCurrency || "BRL"
                        if (p) {
                            price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: c }).format(parseFloat(p))
                            return false // break loop
                        }
                    }
                })
            } catch (e) {
                // ignore json parse errors
            }
        }

        return {
            title: title.trim(),
            description: description.trim(),
            images: imageUrl ? [imageUrl] : [],
            imageUrl,
            price,
            platform: new URL(url).hostname.replace('www.', '')
        }
    } catch (error) {
        console.error("Error scraping product:", error)
        return {
            title: "Erro ao ler produto",
            description: "Não foi possível acessar a URL fornecida.",
            images: [],
            imageUrl: null,
            price: "R$ 0,00",
            platform: "Generic"
        }
    }
}

export async function generateAdCopy(productName: string, productDescription: string, apiKey?: string, brandContext?: { name?: string, tone?: string, description?: string }) {
    const token = apiKey || process.env.OPENAI_API_KEY

    if (!token) {
        // Fallback for demo without key
        await new Promise(resolve => setTimeout(resolve, 1000))
        return `[DEMO] Descubra o novo ${productName}! ${productDescription.slice(0, 50)}... Compre agora!`
    }

    const openai = new OpenAI({ apiKey: token })

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Você é um especialista em marketing digital. Crie uma copy curta e persuasiva para um anúncio.
                    ${brandContext?.name ? `Nome da Marca: ${brandContext.name}` : ""}
                    ${brandContext?.tone ? `Tom de Voz: ${brandContext.tone}` : ""}
                    ${brandContext?.description ? `Sobre a Marca: ${brandContext.description}` : ""}
                    `,
                },
                {
                    role: "user",
                    content: `Produto: ${productName}\nDescrição: ${productDescription}\n\nCrie um texto para anúncio de Facebook:`,
                },
            ],
            model: "gpt-3.5-turbo",
        })

        return completion.choices[0].message.content
    } catch (error: unknown) {
        console.error("OpenAI Error:", error)

        const err = error as { status?: number; code?: string }
        if (err?.status === 429 || err?.code === 'insufficient_quota') {
            throw new Error("Saldo insuficiente na OpenAI. Verifique seus créditos em platform.openai.com")
        }
        if (err?.status === 401) {
            throw new Error("Chave de API inválida. Verifique em Configurações.")
        }

        throw new Error("Falha ao gerar copy. Tente novamente.")
    }
}

export async function generateImage(prompt: string, apiKey?: string) {
    const token = apiKey || process.env.OPENAI_API_KEY

    if (!token) {
        // Fallback for demo without key
        await new Promise(resolve => setTimeout(resolve, 1000))
        return "https://placehold.co/1024x1024/png?text=AI+Image+Demo"
    }

    const openai = new OpenAI({ apiKey: token })

    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Foto profissional de alta qualidade para publicidade: ${prompt}`,
            n: 1,
            size: "1024x1024",
        })

        return response.data?.[0]?.url || null
    } catch (error: unknown) {
        console.error("OpenAI Error:", error)

        const err = error as { status?: number; code?: string }
        if (err?.status === 429 || err?.code === 'insufficient_quota') {
            throw new Error("Saldo insuficiente na OpenAI. Verifique seus créditos em platform.openai.com")
        }
        if (err?.status === 401) {
            throw new Error("Chave de API inválida. Verifique em Configurações.")
        }

        throw new Error("Falha ao gerar imagem. Tente novamente.")
    }
}

export async function generateVideoScript(productName: string, description: string, apiKey?: string, brandContext?: { name?: string, tone?: string, description?: string }) {
    const token = apiKey || process.env.OPENAI_API_KEY

    if (!token) {
        // Fallback for demo without key
        await new Promise(resolve => setTimeout(resolve, 1000))
        return [
            { scene_number: 1, visual_description: "[DEMO] Close-up do produto", audio_script: "Conheça a revolução em tecnologia.", duration: 5 },
            { scene_number: 2, visual_description: "[DEMO] Pessoa usando o produto feliz", audio_script: "Transforme seu dia a dia com facilidade.", duration: 10 },
            { scene_number: 3, visual_description: "[DEMO] Logo e Call to Action", audio_script: "Clique no link e garanta o seu!", duration: 5 }
        ]
    }

    const openai = new OpenAI({ apiKey: token })

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert video marketing scriptwriter. Create a 30-second video script for TikTok/Reels based on the product. Format the output as a JSON array of scenes, where each scene has: 'scene_number', 'visual_description' (what happens on screen), 'audio_script' (what is said/voiceover), and 'duration' (in seconds). Return ONLY the JSON array.
                    ${brandContext?.name ? `Brand Name: ${brandContext.name}` : ""}
                    ${brandContext?.tone ? `Tone of Voice: ${brandContext.tone}` : ""}
                    ${brandContext?.description ? `Brand Context: ${brandContext.description}` : ""}
                    `
                },
                {
                    role: "user",
                    content: `Product: ${productName}\nDescription: ${description}\n\nGenerate the script.`
                }
            ],
            model: "gpt-3.5-turbo",
        })

        const content = completion.choices[0].message.content || "[]"
        try {
            return JSON.parse(content)
        } catch (e) {
            // Fallback if JSON parsing fails
            return [{ scene_number: 1, visual_description: "Script generated as text", audio_script: content, duration: 30 }]
        }
    } catch (error: unknown) {
        console.error("OpenAI Error:", error)

        const err = error as { status?: number; code?: string }
        if (err?.status === 429 || err?.code === 'insufficient_quota') {
            throw new Error("Saldo insuficiente na OpenAI. Verifique seus créditos em platform.openai.com")
        }
        if (err?.status === 401) {
            throw new Error("Chave de API inválida. Verifique em Configurações.")
        }

        throw new Error("Falha ao gerar roteiro de vídeo.")
    }
}
