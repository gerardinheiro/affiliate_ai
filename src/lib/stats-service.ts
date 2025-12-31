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
        type: "click" | "conversion" | "payout" | "view"
        description: string
        date: string
        amount?: number
    }[]
}

export class StatsService {
    async getDashboardStats(userId: string): Promise<StatsData> {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // 1. Fetch Summary from Campaigns
        const campaigns = await db.campaign.findMany({
            where: { userId }
        })

        const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0)
        const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0)
        const totalEarnings = campaigns.reduce((acc, c) => acc + c.revenue, 0)

        // 2. Fetch Events for Chart & Activity
        const events = await db.analyticsEvent.findMany({
            where: {
                userId,
                createdAt: { gte: thirtyDaysAgo }
            },
            orderBy: { createdAt: 'asc' }
        })

        // Group events by date for the chart
        const dailyData: Record<string, { clicks: number, conversions: number, earnings: number }> = {}

        // Initialize last 30 days to ensure no gaps in the chart
        for (let i = 29; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            dailyData[dateStr] = { clicks: 0, conversions: 0, earnings: 0 }
        }

        events.forEach(event => {
            const dateStr = new Date(event.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            if (dailyData[dateStr]) {
                if (event.eventType === 'link_click' || event.eventType === 'product_click') {
                    dailyData[dateStr].clicks++
                }
                // If we have conversion events tracked in AnalyticsEvent
                if (event.eventType === 'conversion') {
                    dailyData[dateStr].conversions++
                    const amount = (event.metadata as any)?.amount || 0
                    dailyData[dateStr].earnings += amount
                }
            }
        })

        const chartData = Object.entries(dailyData).map(([date, data]) => ({
            date,
            clicks: data.clicks,
            conversions: data.conversions,
            earnings: Number(data.earnings.toFixed(2))
        }))

        // 3. Recent Activity (Latest 10 events)
        const recentEvents = await db.analyticsEvent.findMany({
            where: { userId },
            take: 10,
            orderBy: { createdAt: 'desc' }
        })

        const recentActivity = recentEvents.map(event => ({
            id: event.id,
            type: this.mapEventType(event.eventType),
            description: event.eventName,
            date: event.createdAt.toISOString(),
            amount: (event.metadata as any)?.amount
        }))

        return {
            summary: {
                clicks: totalClicks,
                conversions: totalConversions,
                earnings: Number(totalEarnings.toFixed(2)),
                ctr: totalClicks > 0 ? Number(((totalConversions / totalClicks) * 100).toFixed(2)) : 0
            },
            chartData,
            recentActivity
        }
    }

    private mapEventType(type: string): "click" | "conversion" | "payout" | "view" {
        if (type.includes('click')) return 'click'
        if (type.includes('conversion')) return 'conversion'
        if (type.includes('payout')) return 'payout'
        return 'view'
    }
}

export const statsService = new StatsService()
