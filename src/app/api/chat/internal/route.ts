import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import OpenAI from "openai"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await req.json()
        const { messages } = body

        // Get user's OpenAI API key
        const user = await db.user.findUnique({
            where: { id: (session.user as { id: string }).id },
            select: { openaiApiKey: true, name: true }
        })

        const apiKey = user?.openaiApiKey || process.env.OPENAI_API_KEY

        if (!apiKey) {
            return NextResponse.json({
                message: "Por favor, configure sua chave OpenAI em Configurações para usar o assistente."
            })
        }

        // Get user's products for context
        const products = await db.product.findMany({
            where: { userId: (session.user as { id: string }).id },
            select: { title: true, platform: true, price: true },
            take: 10
        })

        const openai = new OpenAI({ apiKey })

        const systemPrompt = `Você é um assistente especializado em marketing de afiliados.
Você está ajudando ${user?.name || "o usuário"} a ter sucesso com suas campanhas.

Produtos cadastrados:
${products.map(p => `- ${p.title} (${p.platform}) - ${p.price}`).join('\n') || "Nenhum produto cadastrado ainda."}

Suas responsabilidades:
- Ajudar a criar estratégias de marketing
- Sugerir ideias de conteúdo para redes sociais
- Analisar métricas e dar insights
- Responder dúvidas sobre marketing digital
- Ser prestativo, objetivo e motivador

Seja conciso e prático nas respostas.`

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 500
        })

        return NextResponse.json({
            message: completion.choices[0].message.content
        })
    } catch (error) {
        console.error("[INTERNAL_CHAT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
