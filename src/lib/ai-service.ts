import OpenAI from "openai"

export async function generateAdCopy(productName: string, productDescription: string, apiKey?: string) {
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
                    content: "Você é um especialista em marketing digital. Crie uma copy curta e persuasiva para um anúncio.",
                },
                {
                    role: "user",
                    content: `Produto: ${productName}\nDescrição: ${productDescription}\n\nCrie um texto para anúncio de Facebook:`,
                },
            ],
            model: "gpt-3.5-turbo",
        })

        return completion.choices[0].message.content
    } catch (error: any) {
        console.error("OpenAI Error:", error)

        if (error?.status === 429 || error?.code === 'insufficient_quota') {
            throw new Error("Saldo insuficiente na OpenAI. Verifique seus créditos em platform.openai.com")
        }
        if (error?.status === 401) {
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
    } catch (error: any) {
        console.error("OpenAI Error:", error)

        if (error?.status === 429 || error?.code === 'insufficient_quota') {
            throw new Error("Saldo insuficiente na OpenAI. Verifique seus créditos em platform.openai.com")
        }
        if (error?.status === 401) {
            throw new Error("Chave de API inválida. Verifique em Configurações.")
        }

        throw new Error("Falha ao gerar imagem. Tente novamente.")
    }
}
