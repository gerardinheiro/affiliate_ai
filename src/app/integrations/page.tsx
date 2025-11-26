"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { IntegrationCard } from "@/components/integrations/integration-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ShoppingCart,
    Megaphone,
    Share2,
    Globe,
    Search,
    CreditCard
} from "lucide-react"
import { ConnectionDialog } from "@/components/integrations/connection-dialog"

// Mock data for platforms
const affiliatePlatforms = [
    {
        id: "amazon",
        name: "Amazon Associates",
        description: "Maior programa de afiliados do mundo. Venda livros, eletrônicos e mais.",
        icon: ShoppingCart,
        color: "text-orange-500",
        signupUrl: "https://affiliate-program.amazon.com/",
    },
    {
        id: "hotmart",
        name: "Hotmart",
        description: "Líder em produtos digitais na América Latina. Cursos, ebooks e mais.",
        icon: Globe,
        color: "text-red-500",
        signupUrl: "https://www.hotmart.com/pt-br/affiliates",
    },
    {
        id: "magalu",
        name: "Parceiro Magalu",
        description: "Divulgue produtos do Magazine Luiza e ganhe comissões.",
        icon: ShoppingCart,
        color: "text-blue-600",
        signupUrl: "https://especiais.magazineluiza.com.br/parceiromagalu/",
    },
    {
        id: "shopee",
        name: "Shopee Afiliados",
        description: "Programa de afiliados da Shopee com altas taxas de conversão.",
        icon: ShoppingCart,
        color: "text-orange-600",
        signupUrl: "https://shopee.com.br/m/afiliados",
    },
    {
        id: "eduzz",
        name: "Eduzz",
        description: "Plataforma focada em infoprodutos e serviços digitais.",
        icon: Globe,
        color: "text-yellow-500",
        signupUrl: "https://www.eduzz.com/",
    },
]

const adPlatforms = [
    {
        id: "google_ads",
        name: "Google Ads",
        description: "Anuncie na pesquisa do Google, YouTube e sites parceiros.",
        icon: Search,
        color: "text-blue-500",
        signupUrl: "https://ads.google.com/",
    },
    {
        id: "meta_ads",
        name: "Meta Ads",
        description: "Alcance bilhões de pessoas no Facebook e Instagram.",
        icon: Share2,
        color: "text-blue-700",
        signupUrl: "https://www.facebook.com/business/ads",
    },
    {
        id: "tiktok_ads",
        name: "TikTok Ads",
        description: "Crie anúncios virais na plataforma de vídeos curtos.",
        icon: Megaphone,
        color: "text-black",
        signupUrl: "https://ads.tiktok.com/",
    },
]

export default function IntegrationsPage() {
    const [connected, setConnected] = useState<string[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedPlatform, setSelectedPlatform] = useState<any>(null)

    const handleConnectClick = (platform: any) => {
        setSelectedPlatform(platform)
        setDialogOpen(true)
    }

    const handleConnectSubmit = (data: any) => {
        console.log("Connecting to", selectedPlatform?.name, "with data", data)
        // Simulate API call
        setTimeout(() => {
            if (selectedPlatform) {
                setConnected((prev) => [...prev, selectedPlatform.id])
            }
            setDialogOpen(false)
        }, 500)
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Conexões</h2>
                    <p className="text-muted-foreground mt-2">
                        Gerencie suas integrações com redes de afiliados e plataformas de anúncios.
                    </p>
                </div>

                <Tabs defaultValue="affiliates" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="affiliates">Redes de Afiliados</TabsTrigger>
                        <TabsTrigger value="ads">Plataformas de Anúncios</TabsTrigger>
                        <TabsTrigger value="social">Redes Sociais (Orgânico)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="affiliates" className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {affiliatePlatforms.map((platform) => (
                                <IntegrationCard
                                    key={platform.id}
                                    {...platform}
                                    isConnected={connected.includes(platform.id)}
                                    onConnect={() => handleConnectClick(platform)}
                                    onConfigure={() => handleConnectClick(platform)}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="ads" className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {adPlatforms.map((platform) => (
                                <IntegrationCard
                                    key={platform.id}
                                    {...platform}
                                    isConnected={connected.includes(platform.id)}
                                    onConnect={() => handleConnectClick(platform)}
                                    onConfigure={() => handleConnectClick(platform)}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="social">
                        <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">Em breve: Conexão com Instagram, Pinterest e YouTube.</p>
                        </div>
                    </TabsContent>
                </Tabs>

                <ConnectionDialog
                    isOpen={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onConnect={handleConnectSubmit}
                    platformName={selectedPlatform?.name || ""}
                />
            </div>
        </DashboardLayout>
    )
}
