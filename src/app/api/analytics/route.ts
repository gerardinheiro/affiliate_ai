import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { subDays, format, eachDayOfInterval } from "date-fns"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as { id: string }).id
        const { searchParams } = new URL(req.url)
        const days = parseInt(searchParams.get("days") || "30")

        const startDate = subDays(new Date(), days)
        const endDate = new Date()

        // Get all user data
        const [user, products, posts, creatives, bioPage, events] = await Promise.all([
            db.user.findUnique({
                where: { id: userId },
                select: {
                    xp: true,
                    level: true,
                    createdAt: true,
                },
            }),
            db.product.findMany({
                where: { userId },
                select: { createdAt: true },
            }),
            db.post.findMany({
                where: { userId, status: "published" },
                select: { createdAt: true },
            }),
            db.creative.findMany({
                where: { userId },
                select: { views: true, downloads: true, createdAt: true },
            }),
            db.bioPage.findUnique({
                where: { userId },
                select: {
                    views: true,
                    links: {
                        select: { clicks: true },
                    },
                },
            }),
            db.analyticsEvent.findMany({
                where: {
                    userId,
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                select: {
                    eventType: true,
                    createdAt: true,
                },
            }),
        ])

        // Calculate metrics
        const totalProducts = products.length
        const totalPosts = posts.length
        const totalCreatives = creatives.length
        const totalCreativeViews = creatives.reduce((sum, c) => sum + c.views, 0)
        const totalCreativeDownloads = creatives.reduce((sum, c) => sum + c.downloads, 0)
        const totalBioViews = bioPage?.views || 0
        const totalBioClicks = bioPage?.links.reduce((sum, l) => sum + l.clicks, 0) || 0

        // Group events by date
        const dateRange = eachDayOfInterval({ start: startDate, end: endDate })
        const dailyData = dateRange.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd")
            const dayEvents = events.filter(
                (e) => format(e.createdAt, "yyyy-MM-dd") === dateStr
            )

            return {
                date: dateStr,
                events: dayEvents.length,
                productViews: dayEvents.filter((e) => e.eventType === "product_view").length,
                linkClicks: dayEvents.filter((e) => e.eventType === "link_click").length,
                creativeViews: dayEvents.filter((e) => e.eventType === "creative_view").length,
            }
        })

        // Group events by type
        const eventsByType: Record<string, number> = {}
        events.forEach((event) => {
            eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1
        })

        // Calculate growth
        const previousPeriodStart = subDays(startDate, days)
        const previousEvents = await db.analyticsEvent.count({
            where: {
                userId,
                createdAt: {
                    gte: previousPeriodStart,
                    lt: startDate,
                },
            },
        })

        const currentEvents = events.length
        const growth = previousEvents > 0
            ? ((currentEvents - previousEvents) / previousEvents) * 100
            : 0

        return NextResponse.json({
            overview: {
                totalProducts,
                totalPosts,
                totalCreatives,
                totalCreativeViews,
                totalCreativeDownloads,
                totalBioViews,
                totalBioClicks,
                totalEvents: currentEvents,
                growth: Math.round(growth * 10) / 10,
                xp: user?.xp || 0,
                level: user?.level || 1,
            },
            dailyData,
            eventsByType,
            period: {
                days,
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
            },
        })
    } catch (error) {
        console.error("[ANALYTICS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
