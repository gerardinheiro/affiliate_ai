"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { IntegrationCard } from "@/components/integrations/integration-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ShoppingCart,
    Megaphone,
    Share2,
    Globe,
    Search,
    CreditCard,
    Plus,
    Loader2,
    Trash2,
    ShoppingBag,
    Instagram,
    Youtube,
    Video
} from "lucide-react"
import { ConnectionDialog } from "@/components/integrations/connection-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
        id: "shein",
        name: "Shein Afiliados",
        description: "Moda e acessórios com altas comissões e popularidade global.",
        icon: ShoppingBag,
        color: "text-black",
        signupUrl: "https://br.shein.com/campaign/affiliate-program",
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

const socialPlatforms = [
    {
        id: "instagram",
        name: "Instagram",
        description: "Conecte sua conta para publicar stories e reels automaticamente.",
        icon: Instagram,
        color: "text-pink-600",
        signupUrl: "https://instagram.com",
    },
    {
        id: "tiktok",
        name: "TikTok",
        description: "Publique vídeos curtos e virais diretamente da plataforma.",
        icon: Video,
        color: "text-black",
        signupUrl: "https://tiktok.com",
    },
    {
        id: "youtube",
        name: "YouTube",
        description: "Gerencie seu canal e publique vídeos longos ou Shorts.",
        icon: Youtube,
        color: "text-red-600",
        signupUrl: "https://youtube.com",
    },
    {
        id: "pinterest",
        name: "Pinterest",
        description: "Crie pins para seus produtos e aumente o tráfego orgânico.",
        icon: Share2,
        color: "text-red-500",
        signupUrl: "https://pinterest.com",
    },
]

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedPlatform, setSelectedPlatform] = useState<any>(null)

    useEffect(() => {
        fetchIntegrations()
    }, [])

    const fetchIntegrations = async () => {
        try {
            const res = await fetch("/api/integrations")
            if (res.ok) {
                const data = await res.json()
                setIntegrations(data)
            }
        } catch (error) {
            console.error("Error fetching integrations:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleConnectClick = (platform: any) => {
        setSelectedPlatform(platform)
        setDialogOpen(true)
    }

    const handleConnectSubmit = async (data: any) => {
        try {
            const res = await fetch("/api/integrations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    platform: selectedPlatform.id,
                    ...data
                }),
            })

            if (res.ok) {
                fetchIntegrations()
                setDialogOpen(false)
            }
        } catch (error) {
            console.error("Error connecting:", error)
        }
    }

    const handleDeleteIntegration = async (id: string) => {
        if (!confirm("Tem certeza que deseja remover esta conexão?")) return

        try {
            await fetch(`/api/integrations?id=${id}`, { method: "DELETE" })
            setIntegrations(integrations.filter(i => i.id !== id))
        } catch (error) {
            console.error("Error deleting integration:", error)
        }
    }

    const connectedPlatformIds = integrations.map(i => i.platform)

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white">Conexões</h2>
                        <p className="text-gray-400 mt-2">
                            Gerencie suas integrações com redes de afiliados e plataformas de anúncios.
                        </p>
                    </div>
                </div>

                {/* Active Connections */}
                {integrations.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Minhas Conexões Ativas</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {integrations.map((integration) => {
                                const platformInfo = [...affiliatePlatforms, ...adPlatforms, ...socialPlatforms].find(p => p.id === integration.platform)
                                const Icon = platformInfo?.icon || Globe

                                return (
                                    <Card key={integration.id} className="glass border-white/10 hover:border-indigo-500/50 transition-all">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-md bg-white/5 ${platformInfo?.color || "text-gray-400"}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <CardTitle className="text-sm font-medium text-white">
                                                    {integration.name}
                                                </CardTitle>
                                            </div>
                                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                                                Ativo
                                            </Badge>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-xl font-bold text-white capitalize mb-2">
                                                {platformInfo?.name || integration.platform}
                                            </div>
                                            <div className="text-xs text-gray-400 space-y-1">
                                                <p className="flex items-center gap-1">
                                                    <Globe className="w-3 h-3" />
                                                    Região: {integration.targetCountry === "BR" ? "Brasil 🇧🇷" : integration.targetCountry === "US" ? "EUA 🇺🇸" : integration.targetCountry || "Global"}
                                                </p>
                                                {integration.targetState && <p>Estado: {integration.targetState}</p>}
                                                {integration.accountId && (
                                                    <p className="font-mono bg-white/5 px-1.5 py-0.5 rounded inline-block">
                                                        ID: {integration.accountId}
                                                    </p>
                                                )}
                                                {integration.expiresAt && (
                                                    <p className="text-amber-400/80">
                                                        Expira em: {new Date(integration.expiresAt).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-4 w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                onClick={() => handleDeleteIntegration(integration.id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Desconectar
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                )}

                <Tabs defaultValue="affiliates" className="space-y-6">
                    <TabsList className="bg-white/5 border border-white/10">
                        <TabsTrigger value="affiliates" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400">Redes de Afiliados</TabsTrigger>
                        <TabsTrigger value="ads" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400">Plataformas de Anúncios</TabsTrigger>
                        <TabsTrigger value="social" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400">Redes Sociais</TabsTrigger>
                    </TabsList>

                    <TabsContent value="affiliates" className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {affiliatePlatforms.map((platform) => (
                                <IntegrationCard
                                    key={platform.id}
                                    {...platform}
                                    isConnected={connectedPlatformIds.includes(platform.id)}
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
                                    isConnected={connectedPlatformIds.includes(platform.id)}
                                    onConnect={() => handleConnectClick(platform)}
                                    onConfigure={() => handleConnectClick(platform)}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="social" className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {socialPlatforms.map((platform) => (
                                <IntegrationCard
                                    key={platform.id}
                                    {...platform}
                                    isConnected={connectedPlatformIds.includes(platform.id)}
                                    onConnect={() => handleConnectClick(platform)}
                                    onConfigure={() => handleConnectClick(platform)}
                                />
                            ))}
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
