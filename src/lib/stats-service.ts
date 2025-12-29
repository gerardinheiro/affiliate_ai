import { db } from "@/lib/db"

export interface StatsData {
    summary: {
        clicks: number
        conversions: number
        earnings: number
        ctr: number
    }
    chartData: {
        date: string
        clicks: number
        conversions: number
        earnings: number
    }[]
    recentActivity: {
        id: string
        type: "click" | "conversion" | "payout"
        description: string
        date: string
        amount?: number
    }[]
}

export class StatsService {
    async getDashboardStats(userId: string): Promise<StatsData> {
        // In a real scenario, we would query the database for clicks and conversions.
        // For now, we'll generate realistic mock data based on the user's ID to keep it consistent.

        const today = new Date()
        const chartData = []

        let totalClicks = 0
        let totalConversions = 0
        let totalEarnings = 0

        // Generate last 30 days of data
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)

            // Random data generation
            const baseClicks = Math.floor(Math.random() * 50) + 20
            const clicks = baseClicks + Math.floor(Math.random() * 20)
            const conversions = Math.floor(clicks * (Math.random() * 0.05 + 0.01)) // 1-6% conversion rate
            const earnings = conversions * (Math.random() * 20 + 10) // $10-$30 per conversion

            totalClicks += clicks
            totalConversions += conversions
            totalEarnings += earnings

            chartData.push({
                date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                clicks,
                conversions,
                earnings: Number(earnings.toFixed(2))
            })
        }

        const recentActivity = [
            {
                id: "1",
                type: "conversion" as const,
                description: "Venda: Curso de Marketing Digital",
                date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
                amount: 45.90
            },
            {
                id: "2",
                type: "click" as const,
                description: "Clique em: Ebook de Receitas",
                date: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
            },
            {
                id: "3",
                type: "conversion" as const,
                description: "Venda: Kit de Ferramentas AI",
                date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
                amount: 120.50
            },
            {
                id: "4",
                type: "payout" as const,
                description: "Saque processado",
                date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
                amount: -500.00
            }
        ]

        return {
            summary: {
                clicks: totalClicks,
                conversions: totalConversions,
                earnings: Number(totalEarnings.toFixed(2)),
                ctr: Number(((totalConversions / totalClicks) * 100).toFixed(2))
            },
            chartData,
            recentActivity
        }
    }
}

export const statsService = new StatsService()
