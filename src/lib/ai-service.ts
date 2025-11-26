import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "mock-key",
})

export async function generateAdCopy(productName: string, productDescription: string) {
    if (!process.env.OPENAI_API_KEY) {
        // Fallback for demo without key
        await new Promise(resolve => setTimeout(resolve, 1000))
        return `[DEMO] Descubra o novo ${productName}! ${productDescription.slice(0, 50)}... Compre agora!`
    }

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
    } catch (error) {
        console.error("OpenAI Error:", error)
        throw new Error("Falha ao gerar copy.")
    }
}

export async function generateImage(prompt: string) {
    if (!process.env.OPENAI_API_KEY) {
        // Fallback for demo without key
        await new Promise(resolve => setTimeout(resolve, 1000))
        return "https://placehold.co/1024x1024/png?text=AI+Image+Demo"
    }

    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Foto profissional de alta qualidade para publicidade: ${prompt}`,
            n: 1,
            size: "1024x1024",
        })

        return response.data?.[0]?.url || null
    } catch (error) {
        console.error("OpenAI Error:", error)
        throw new Error("Falha ao gerar imagem.")
    }
}
