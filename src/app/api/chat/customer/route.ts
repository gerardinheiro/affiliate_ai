import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { messages } = body

        // Use system OpenAI key for public bot (with rate limiting in production)
        const apiKey = process.env.OPENAI_API_KEY

        if (!apiKey) {
            return NextResponse.json({
                message: "Desculpe, o chat está temporariamente indisponível. Por favor, entre em contato por email."
            })
        }

        const openai = new OpenAI({ apiKey })

        const systemPrompt = `Você é um assistente de vendas prestativo e amigável.
Você trabalha para uma plataforma de marketing de afiliados chamada AffiliateAI.

Sua missão:
- Ajudar visitantes a entender como a plataforma funciona
- Responder dúvidas sobre produtos e serviços
- Ser educado, simpático e persuasivo
- Incentivar o cadastro na plataforma
- Usar emojis ocasionalmente para ser mais amigável

Informações sobre a plataforma:
- AffiliateAI ajuda afiliados a gerenciar produtos, criar campanhas e gerar conteúdo com IA
- Possui integração com Amazon, Hotmart, Shein e outras plataformas
- Gera copys e criativos automaticamente
- Tem analytics em tempo real

Seja breve e direto nas respostas (máximo 3 parágrafos).`

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            temperature: 0.8,
            max_tokens: 300
        })

        return NextResponse.json({
            message: completion.choices[0].message.content
        })
    } catch (error) {
        console.error("[CUSTOMER_CHAT]", error)
        return NextResponse.json({
            message: "Desculpe, tive um problema técnico. Pode tentar novamente em alguns segundos?"
        })
    }
}
