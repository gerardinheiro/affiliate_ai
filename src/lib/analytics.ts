import { db } from "./db"

export type EventType =
    | "product_view"
    | "product_click"
    | "link_click"
    | "creative_view"
    | "creative_download"
    | "bio_view"
    | "post_published"
    | "campaign_created"

export async function trackEvent(
    userId: string,
    eventType: EventType,
    eventName: string,
    metadata?: Record<string, any>
) {
    try {
        await db.analyticsEvent.create({
            data: {
                userId,
                eventType,
                eventName,
                metadata: metadata || {},
            },
        })
    } catch (error) {
        console.error("[ANALYTICS_TRACK]", error)
    }
}

export async function getEventsByType(userId: string, eventType: EventType, days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return await db.analyticsEvent.findMany({
        where: {
            userId,
            eventType,
            createdAt: {
                gte: startDate,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function getEventsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
) {
    return await db.analyticsEvent.findMany({
        where: {
            userId,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    })
}

export async function getEventStats(userId: string, days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const events = await db.analyticsEvent.findMany({
        where: {
            userId,
            createdAt: {
                gte: startDate,
            },
        },
        select: {
            eventType: true,
            createdAt: true,
        },
    })

    // Group by event type
    const eventCounts: Record<string, number> = {}
    events.forEach((event) => {
        eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1
    })

    // Group by date
    const dailyEvents: Record<string, number> = {}
    events.forEach((event) => {
        const date = event.createdAt.toISOString().split("T")[0]
        dailyEvents[date] = (dailyEvents[date] || 0) + 1
    })

    return {
        totalEvents: events.length,
        eventCounts,
        dailyEvents,
    }
}
