import { NextResponse } from "next/server"
import OpenAI from "openai"

// Demo responses when API key is not available
const demoResponses = {
    default: "Olá! Sou o assistente do AffiliateAI 😊\n\nNossa plataforma ajuda afiliados a:\n✅ Gerenciar produtos de várias plataformas\n✅ Criar campanhas automaticamente\n✅ Gerar conteúdo com IA\n\nQuer saber mais sobre alguma funcionalidade específica?",
    funciona: "O AffiliateAI funciona em 3 passos simples:\n\n1️⃣ Conecte suas contas de afiliados (Amazon, Hotmart, Shein, etc)\n2️⃣ Importe seus produtos\n3️⃣ Nossa IA gera copys e criativos automaticamente!\n\nTudo em um só lugar. Quer começar agora?",
    preco: "Temos planos para todos os perfis! 💰\n\nDesde iniciantes até profissionais. O melhor é que você pode começar gratuitamente e testar todas as funcionalidades.\n\nQuer que eu te mostre como se cadastrar?",
    cadastro: "Super fácil! 🚀\n\n1. Clique em 'Começar Agora' no topo\n2. Faça login com Google\n3. Pronto! Já pode começar a usar\n\nLeva menos de 1 minuto. Vamos lá?",
    recursos: "Principais recursos do AffiliateAI:\n\n🎯 Gestão centralizada de produtos\n📊 Analytics em tempo real\n🤖 Geração de conteúdo com IA\n🔗 Integração com múltiplas plataformas\n📱 Publicação automática em redes sociais\n\nQual te interessa mais?",
}

function getDemoResponse(userMessage: string): string {
    // Normalizar mensagem: lowercase e remover acentos
    const msg = userMessage
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

    console.log("[CUSTOMER_CHAT] Analyzing message:", msg)

    // Detectar perguntas sobre preço PRIMEIRO (mais específico)
    if (msg.includes("preco") ||
        msg.includes("valor") ||
        msg.includes("custa") ||
        msg.includes("pagar") ||
        msg.includes("plano") ||
        msg.includes("quanto")) {
        console.log("[CUSTOMER_CHAT] Detected: PRECO")
        return demoResponses.preco
    }

    // Detectar perguntas sobre cadastro
    if (msg.includes("cadastr") ||
        msg.includes("registr") ||
        msg.includes("criar conta") ||
        msg.includes("comecar") ||
        msg.includes("entrar") ||
        msg.includes("login")) {
        console.log("[CUSTOMER_CHAT] Detected: CADASTRO")
        return demoResponses.cadastro
    }

    // Detectar perguntas sobre funcionamento
    if (msg.includes("funciona") ||
        msg.includes("como faz") ||
        msg.includes("como usa") ||
        msg.includes("o que faz") ||
        msg.includes("explique")) {
        console.log("[CUSTOMER_CHAT] Detected: FUNCIONA")
        return demoResponses.funciona
    }

    // Detectar perguntas sobre recursos
    if (msg.includes("recurso") ||
        msg.includes("funcionalidade") ||
        msg.includes("pode fazer")) {
        console.log("[CUSTOMER_CHAT] Detected: RECURSOS")
        return demoResponses.recursos
    }

    console.log("[CUSTOMER_CHAT] Using default response")
    return demoResponses.default
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { messages } = body

        const lastUserMessage = messages[messages.length - 1]?.content || ""
        console.log("[CUSTOMER_CHAT] Received message:", lastUserMessage)

        // Use system OpenAI key for public bot
        const apiKey = process.env.OPENAI_API_KEY

        // If no API key, use demo mode
        if (!apiKey) {
            console.log("[CUSTOMER_CHAT] No API key, using demo mode")
            await new Promise(resolve => setTimeout(resolve, 800))
            const response = getDemoResponse(lastUserMessage)
            return NextResponse.json({ message: response })
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
        console.error("[CUSTOMER_CHAT] Error:", error)
        return NextResponse.json({
            message: demoResponses.default
        })
    }
}
