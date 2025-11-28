"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Loader2, Zap, Shield, Star } from "lucide-react"
import { useSession } from "next-auth/react"
import { LoginModal } from "@/components/auth/login-modal"
import { Badge } from "@/components/ui/badge"

export default function PricingPage() {
    const { data: session } = useSession()
    const [isLoading, setIsLoading] = useState<string | null>(null)

    const handleSubscribe = async (priceId: string) => {
        if (!session) return // Should be handled by LoginModal wrapper

        setIsLoading(priceId)
        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId }),
            })

            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                alert("Erro ao iniciar checkout.")
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Erro ao iniciar checkout.")
        } finally {
            setIsLoading(null)
        }
    }

    const plans = [
        {
            id: "free",
            name: "Gratuito",
            price: "R$ 0",
            period: "/mês",
            description: "Para quem está começando.",
            features: [
                "3 Produtos",
                "5 Campanhas",
                "Geração de Copy Limitada",
                "Sem acesso ao Creative Studio",
                "Suporte da Comunidade"
            ],
            buttonText: "Começar Grátis",
            popular: false,
            priceId: null // Free plan
        },
        {
            id: "pro",
            name: "Pro",
            price: "R$ 49,90",
            period: "/mês",
            description: "Para afiliados profissionais.",
            features: [
                "Produtos Ilimitados",
                "Campanhas Ilimitadas",
                "Geração de Copy Ilimitada",
                "Acesso ao Creative Studio (IA)",
                "Página na Bio Personalizada",
                "Suporte Prioritário"
            ],
            buttonText: "Assinar Pro",
            popular: true,
            priceId: "price_1234567890" // Replace with real Stripe Price ID
        },
        {
            id: "lifetime",
            name: "Lifetime",
            price: "R$ 497",
            period: "/único",
            description: "Acesso vitalício com desconto.",
            features: [
                "Tudo do plano Pro",
                "Pagamento Único",
                "Acesso Vitalício",
                "Badge Exclusiva 'Founder'",
                "Acesso Antecipado a Novas Features",
                "Mentoria Mensal em Grupo"
            ],
            buttonText: "Comprar Lifetime",
            popular: false,
            priceId: "price_0987654321" // Replace with real Stripe Price ID
        }
    ]

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Escolha o plano ideal para <span className="text-indigo-500">escalar</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Comece gratuitamente e faça upgrade quando precisar de mais poder.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl p-8 border ${plan.popular
                                    ? "bg-white/5 border-indigo-500 shadow-2xl shadow-indigo-500/20"
                                    : "bg-white/5 border-white/10"
                                } flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-indigo-500 hover:bg-indigo-600 px-4 py-1">
                                        Mais Popular
                                    </Badge>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-gray-400 text-sm">{plan.period}</span>
                                </div>
                                <p className="text-gray-400 mt-4 text-sm">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {session ? (
                                <Button
                                    className={`w-full ${plan.popular
                                            ? "bg-indigo-600 hover:bg-indigo-700"
                                            : "bg-white/10 hover:bg-white/20"
                                        }`}
                                    onClick={() => plan.priceId && handleSubscribe(plan.priceId)}
                                    disabled={!plan.priceId || !!isLoading}
                                >
                                    {isLoading === plan.priceId ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        plan.buttonText
                                    )}
                                </Button>
                            ) : (
                                <LoginModal>
                                    <Button
                                        className={`w-full ${plan.popular
                                                ? "bg-indigo-600 hover:bg-indigo-700"
                                                : "bg-white/10 hover:bg-white/20"
                                            }`}
                                    >
                                        {plan.buttonText}
                                    </Button>
                                </LoginModal>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-gray-500 text-sm">
                        Pagamentos processados com segurança pelo Stripe. Cancele quando quiser.
                    </p>
                </div>
            </div>
        </div>
    )
}
