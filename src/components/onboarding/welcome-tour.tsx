"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Rocket, Package, Megaphone, Palette, CheckCircle2, ArrowRight } from "lucide-react"

type Step = {
    title: string
    description: string
    icon: React.ReactNode
    image?: string
}

const steps: Step[] = [
    {
        title: "Bem-vindo ao AffiliateAI! 🚀",
        description: "Sua jornada para automatizar vendas e escalar seus resultados começa agora. Vamos fazer um tour rápido?",
        icon: <Rocket className="w-12 h-12 text-indigo-500" />,
    },
    {
        title: "1. Cadastre seus Produtos 📦",
        description: "Vá em 'Produtos' para adicionar o que você vende. Nossa IA analisará cada detalhe para criar conteúdos incríveis.",
        icon: <Package className="w-12 h-12 text-blue-500" />,
    },
    {
        title: "2. Crie Campanhas e Copys 📢",
        description: "Em 'Campanhas', gere textos persuasivos para anúncios, e-mails e redes sociais com um clique.",
        icon: <Megaphone className="w-12 h-12 text-green-500" />,
    },
    {
        title: "3. Creative Studio 🎨",
        description: "Use nossa IA para gerar imagens e roteiros de vídeo profissionais para seus anúncios no TikTok e Instagram.",
        icon: <Palette className="w-12 h-12 text-pink-500" />,
    },
    {
        title: "Tudo Pronto! ✨",
        description: "Você já sabe o básico. Explore o menu lateral e comece a criar. Boa sorte!",
        icon: <CheckCircle2 className="w-12 h-12 text-emerald-500" />,
    }
]

export function WelcomeTour({ hasCompletedOnboarding }: { hasCompletedOnboarding: boolean }) {
    const [open, setOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        if (!hasCompletedOnboarding) {
            setOpen(true)
        }
    }, [hasCompletedOnboarding])

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            // Complete onboarding
            try {
                await fetch("/api/onboarding/complete", { method: "POST" })
                setOpen(false)
            } catch (error) {
                console.error("Error completing onboarding:", error)
                setOpen(false)
            }
        }
    }

    if (!open) return null

    const step = steps[currentStep]

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[500px] bg-gray-900 border-white/10 text-white">
                <DialogHeader>
                    <div className="mx-auto mb-4 bg-white/5 p-4 rounded-full border border-white/10">
                        {step.icon}
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold">{step.title}</DialogTitle>
                    <DialogDescription className="text-center text-gray-400 text-lg pt-2">
                        {step.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center gap-1 mt-4 mb-4">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? "w-8 bg-indigo-500" : "w-2 bg-gray-700"
                                }`}
                        />
                    ))}
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button
                        onClick={handleNext}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px]"
                    >
                        {currentStep === steps.length - 1 ? "Começar" : (
                            <span className="flex items-center">
                                Próximo <ArrowRight className="w-4 h-4 ml-2" />
                            </span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
