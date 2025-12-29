"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { CampaignCard } from "@/components/campaigns/campaign-card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Campaign = {
    id: string
    name: string
    platform: string
    status: "active" | "paused"
    clicks: number
    conversions: number
    spent: number
    revenue: number
}

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newCampaign, setNewCampaign] = useState({
        name: "",
        platform: "Google Ads",
    })

    useEffect(() => {
        fetchCampaigns()
    }, [])

    const fetchCampaigns = async () => {
        try {
            const res = await fetch("/api/campaigns")
            if (res.ok) {
                const data = await res.json()
                setCampaigns(data)
            }
        } catch (error) {
            console.error("Error fetching campaigns:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateCampaign = async () => {
        if (!newCampaign.name) return

        try {
            const res = await fetch("/api/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCampaign),
            })

            if (res.ok) {
                const campaign = await res.json()
                setCampaigns([campaign, ...campaigns])
                setNewCampaign({ name: "", platform: "Google Ads" })
                setIsDialogOpen(false)
            }
        } catch (error) {
            alert("Erro ao criar campanha.")
        }
    }

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "active" ? "paused" : "active"

        try {
            const res = await fetch("/api/campaigns", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            })

            if (res.ok) {
                setCampaigns(campaigns.map(c =>
                    c.id === id ? { ...c, status: newStatus as "active" | "paused" } : c
                ))
            }
        } catch (error) {
            alert("Erro ao atualizar status.")
        }
    }

    const handleDeleteCampaign = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta campanha?")) return

        try {
            const res = await fetch(`/api/campaigns?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setCampaigns(campaigns.filter(c => c.id !== id))
            }
        } catch (error) {
            alert("Erro ao excluir campanha.")
        }
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Campanhas</h2>
                        <p className="text-muted-foreground mt-2">
                            Acompanhe o desempenho dos seus anúncios em tempo real.
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Nova Campanha
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Criar Nova Campanha</DialogTitle>
                                <DialogDescription>
                                    Crie uma nova campanha para promover seus produtos.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nome da Campanha</Label>
                                    <Input
                                        id="name"
                                        placeholder="Ex: Fone Bluetooth - Google Ads"
                                        value={newCampaign.name}
                                        onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="platform">Plataforma</Label>
                                    <Select
                                        value={newCampaign.platform}
                                        onValueChange={(value) => setNewCampaign({ ...newCampaign, platform: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Google Ads">Google Ads</SelectItem>
                                            <SelectItem value="Meta Ads">Meta Ads</SelectItem>
                                            <SelectItem value="Pinterest Ads">Pinterest Ads</SelectItem>
                                            <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateCampaign} disabled={!newCampaign.name}>
                                    Criar Campanha
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {campaigns.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">Nenhuma campanha criada ainda.</p>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Criar Primeira Campanha
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {campaigns.map((campaign) => (
                            <CampaignCard
                                key={campaign.id}
                                id={campaign.id}
                                name={campaign.name}
                                platform={campaign.platform}
                                status={campaign.status}
                                clicks={campaign.clicks}
                                conversions={campaign.conversions}
                                spent={`R$ ${campaign.spent.toFixed(2)}`}
                                revenue={`R$ ${campaign.revenue.toFixed(2)}`}
                                onToggleStatus={() => toggleStatus(campaign.id, campaign.status)}
                                onDelete={() => handleDeleteCampaign(campaign.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
