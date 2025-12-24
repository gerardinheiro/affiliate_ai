"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        category: "Geral",
        questions: [
            {
                question: "Como funciona o período de teste?",
                answer: "Você tem 7 dias para testar todos os recursos do plano PRO gratuitamente. Não é necessário cartão de crédito para começar. Após o período de teste, você pode escolher continuar com o plano pago ou voltar para o plano gratuito.",
            },
            {
                question: "Quais plataformas são suportadas?",
                answer: "Atualmente suportamos integração com Amazon Associates, Hotmart, Monetizze, Eduzz, Instagram, TikTok, YouTube e Pinterest. Estamos constantemente adicionando novas integrações baseadas no feedback dos usuários.",
            },
            {
                question: "Como funciona a IA?",
                answer: "Nossa IA utiliza modelos avançados de linguagem (GPT-4) para gerar copys persuasivas, criar scripts de vídeo e otimizar suas campanhas. Você pode personalizar o tom de voz e a abordagem da IA nas configurações de marca.",
            },
        ],
    },
    {
        category: "Preços",
        questions: [
            {
                question: "Posso cancelar a qualquer momento?",
                answer: "Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas ou penalidades. Seu acesso continuará até o final do período pago.",
            },
            {
                question: "Preciso de cartão de crédito para testar?",
                answer: "Não! O plano FREE é completamente gratuito e não requer cartão de crédito. Para testar o plano PRO por 7 dias, também não é necessário cartão de crédito.",
            },
            {
                question: "Qual a diferença entre os planos?",
                answer: "O plano FREE é ideal para começar e testar a plataforma. O PRO remove todas as limitações e adiciona recursos avançados como automação social e analytics completo. O BUSINESS é voltado para agências e equipes, incluindo API access e suporte dedicado.",
            },
        ],
    },
    {
        category: "Recursos",
        questions: [
            {
                question: "Posso usar minha própria chave de API da OpenAI?",
                answer: "Sim! Você pode configurar sua própria chave de API da OpenAI nas configurações. Isso permite que você use seus próprios créditos e tenha controle total sobre o uso da IA.",
            },
            {
                question: "Os dados são seguros?",
                answer: "Absolutamente! Utilizamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança. Seus dados nunca são compartilhados com terceiros e você tem controle total sobre suas informações.",
            },
        ],
    },
    {
        category: "Suporte",
        questions: [
            {
                question: "Que tipo de suporte vocês oferecem?",
                answer: "Plano FREE: Suporte por email com resposta em até 48h. Plano PRO: Suporte prioritário com resposta em até 24h. Plano BUSINESS: Suporte dedicado com resposta em até 4h e gerente de conta.",
            },
            {
                question: "Vocês oferecem treinamento?",
                answer: "Sim! Temos uma base de conhecimento completa com tutoriais em vídeo e documentação. Clientes do plano BUSINESS recebem onboarding personalizado com nossa equipe.",
            },
        ],
    },
]

export function FAQSection() {
    return (
        <section id="faq" className="py-20 px-4 bg-black/20">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Perguntas Frequentes
                    </h2>
                    <p className="text-xl text-gray-400">
                        Tire suas dúvidas sobre a plataforma
                    </p>
                </div>

                <div className="space-y-8">
                    {faqs.map((category) => (
                        <div key={category.category}>
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                {category.category}
                            </h3>
                            <Accordion type="single" collapsible className="space-y-2">
                                {category.questions.map((faq, index) => (
                                    <AccordionItem
                                        key={index}
                                        value={`${category.category}-${index}`}
                                        className="bg-gray-900 border border-white/10 rounded-lg px-6 data-[state=open]:border-indigo-500/30"
                                    >
                                        <AccordionTrigger className="text-white hover:text-indigo-400 text-left">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-400">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-400 mb-4">Ainda tem dúvidas?</p>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        Falar com Suporte
                    </Button>
                </div>
            </div>
        </section>
    )
}
