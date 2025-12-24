"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { LoginModal } from "@/components/auth/login-modal"
import { cn } from "@/lib/utils"

const plans = [
    {
        name: "FREE",
        price: "R$ 0",
        period: "/mês",
        description: "Perfeito para começar",
        features: [
            "Até 5 produtos",
            "10 posts por mês",
            "1 criativo por dia",
            "Analytics básico",
            "Bio Page básica",
            "Suporte por email",
        ],
        limitations: [
            "Sem automação social",
            "Sem API access",
            "Sem suporte prioritário",
        ],
        cta: "Começar Grátis",
        highlighted: false,
    },
    {
        name: "PRO",
        price: "R$ 29",
        period: "/mês",
        description: "Para profissionais sérios",
        features: [
            "Produtos ilimitados",
            "Posts ilimitados",
            "Criativos ilimitados",
            "Analytics avançado",
            "Bio Page premium",
            "Automação social",
            "Todos os temas",
            "Suporte prioritário",
            "Sem marca d'água",
        ],
        limitations: [],
        cta: "Começar Teste Grátis",
        highlighted: true,
        badge: "Mais Popular",
    },
    {
        name: "BUSINESS",
        price: "R$ 99",
        period: "/mês",
        description: "Para equipes e agências",
        features: [
            "Tudo do PRO",
            "API access completo",
            "White label",
            "Suporte dedicado",
            "Onboarding personalizado",
            "Múltiplas contas",
            "Relatórios customizados",
            "SLA garantido",
        ],
        limitations: [],
        cta: "Falar com Vendas",
        highlighted: false,
    },
]

export function PricingSection() {
    const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly")

    return (
        <section id="pricing" className="py-20 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Planos e Preços
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Escolha o plano perfeito para o seu negócio. Todos os planos incluem 7 dias de teste grátis.
                    </p>

                    {/* Billing Period Toggle */}
                    <div className="inline-flex items-center gap-4 p-1 rounded-full bg-white/5 border border-white/10">
                        <button
                            onClick={() => setBillingPeriod("monthly")}
                            className={cn(
                                "px-6 py-2 rounded-full transition-all",
                                billingPeriod === "monthly"
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-400 hover:text-white"
                            )}
                        >
                            Mensal
                        </button>
                        <button
                            onClick={() => setBillingPeriod("annual")}
                            className={cn(
                                "px-6 py-2 rounded-full transition-all relative",
                                billingPeriod === "annual"
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-400 hover:text-white"
                            )}
                        >
                            Anual
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                -20%
                            </span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={cn(
                                "relative bg-gray-900 border-white/10 hover:border-indigo-500/30 transition-all",
                                plan.highlighted && "border-indigo-500/50 scale-105 shadow-2xl shadow-indigo-500/20"
                            )}
                        >
                            {plan.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                                        {plan.badge}
                                    </span>
                                </div>
                            )}

                            <CardHeader className="text-center pb-8">
                                <CardTitle className="text-2xl font-bold text-white mb-2">
                                    {plan.name}
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    {plan.description}
                                </CardDescription>
                                <div className="mt-4">
                                    <span className="text-5xl font-bold text-white">
                                        {billingPeriod === "annual" && plan.price !== "R$ 0"
                                            ? `R$ ${Math.round(parseInt(plan.price.replace("R$ ", "")) * 0.8)}`
                                            : plan.price}
                                    </span>
                                    <span className="text-gray-400">{plan.period}</span>
                                    {billingPeriod === "annual" && plan.price !== "R$ 0" && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            Economize R$ {Math.round(parseInt(plan.price.replace("R$ ", "")) * 0.2 * 12)} por ano
                                        </p>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                    {plan.limitations.map((limitation) => (
                                        <div key={limitation} className="flex items-start gap-3">
                                            <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-500 text-sm line-through">{limitation}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter>
                                {plan.name === "FREE" ? (
                                    <LoginModal>
                                        <Button
                                            className={cn(
                                                "w-full h-12",
                                                plan.highlighted
                                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                                    : "bg-white/10 hover:bg-white/20 text-white"
                                            )}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </LoginModal>
                                ) : (
                                    <Button
                                        className={cn(
                                            "w-full h-12",
                                            plan.highlighted
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                                : "bg-white/10 hover:bg-white/20 text-white"
                                        )}
                                    >
                                        {plan.cta}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <p className="text-center text-gray-500 mt-12">
                    Todos os planos incluem 7 dias de teste grátis. Sem necessidade de cartão de crédito.
                </p>
            </div>
        </section>
    )
}
