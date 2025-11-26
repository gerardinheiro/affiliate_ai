"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { CampaignCard } from "@/components/campaigns/campaign-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

// Mock data
const initialCampaigns = [
    {
        id: 1,
        title: "Fone Bluetooth - Google Search",
        platform: "Google Ads",
        status: "active" as const,
        clicks: 1240,
        conversions: 45,
        spent: "R$ 350,00",
        revenue: "R$ 1.250,00",
    },
    {
        id: 2,
        title: "Curso Marketing - Instagram Stories",
        platform: "Meta Ads",
        status: "paused" as const,
        clicks: 850,
        conversions: 12,
        spent: "R$ 200,00",
        revenue: "R$ 450,00",
    },
    {
        id: 3,
        title: "Ebook Receitas - Pinterest",
        platform: "Pinterest Ads",
        status: "active" as const,
        clicks: 3200,
        conversions: 89,
        spent: "R$ 150,00",
        revenue: "R$ 890,00",
    },
]

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState(initialCampaigns)

    const toggleStatus = (id: number) => {
        setCampaigns(campaigns.map(c => {
            if (c.id === id) {
                return { ...c, status: c.status === "active" ? "paused" : "active" }
            }
            return c
        }))
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
                    <Link href="/products">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Campanha
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            {...campaign}
                            onToggleStatus={() => toggleStatus(campaign.id)}
                        />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
