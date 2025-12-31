import { db } from "@/lib/db"
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from "date-fns"
import { generateAdCopy } from "@/lib/ai-service"

export interface CalendarEvent {
    id: string
    type: "post" | "suggestion"
    date: Date
    content: string
    platforms: string[]
    status?: string
}

export class CalendarService {
    async getCalendarData(userId: string, date: Date): Promise<CalendarEvent[]> {
        const start = startOfMonth(date)
        const end = endOfMonth(date)

        // 1. Fetch real posts from DB
        const posts = await db.post.findMany({
            where: {
                userId,
                OR: [
                    { scheduledFor: { gte: start, lte: end } },
                    { publishedAt: { gte: start, lte: end } },
                    { createdAt: { gte: start, lte: end } }
                ]
            }
        })

        const events: CalendarEvent[] = posts.map(post => ({
            id: post.id,
            type: "post",
            date: post.scheduledFor || post.publishedAt || post.createdAt,
            content: post.content,
            platforms: post.platforms,
            status: post.status
        }))

        // 2. Add some mock suggestions if the month is current or future
        // In a real scenario, we might call an AI service to generate these
        const today = new Date()
        if (date >= startOfMonth(today)) {
            const suggestions = this.getMockSuggestions(date)
            events.push(...suggestions)
        }

        return events
    }

    private getMockSuggestions(date: Date): CalendarEvent[] {
        const suggestions: CalendarEvent[] = []
        const start = startOfMonth(date)
        const end = endOfMonth(date)

        // Add 3-4 suggestions per month on specific days (e.g., Tuesdays and Thursdays)
        const days = eachDayOfInterval({ start, end })

        days.forEach(day => {
            const dayOfWeek = day.getDay()
            if (dayOfWeek === 2 || dayOfWeek === 4) { // Tuesday or Thursday
                // Only add if it's in the future
                if (day > new Date()) {
                    suggestions.push({
                        id: `suggestion-${day.getTime()}`,
                        type: "suggestion",
                        date: day,
                        content: "Sugestão de IA: Crie um post sobre as tendências do seu nicho hoje.",
                        platforms: ["instagram", "tiktok"]
                    })
                }
            }
        })

        return suggestions
    }

    async generateAISuggestion(userId: string, date: Date) {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                brandName: true,
                brandTone: true,
                brandDescription: true,
                openaiApiKey: true
            }
        })

        const brandContext = {
            name: user?.brandName || undefined,
            tone: user?.brandTone || undefined,
            description: user?.brandDescription || undefined
        }

        const prompt = `Sugira um post curto e engajador para redes sociais para o dia ${format(date, 'dd/MM/yyyy')}. 
        Foque em atrair novos seguidores e mostrar autoridade no nicho.`

        const suggestion = await generateAdCopy(
            "Sugestão de Conteúdo",
            prompt,
            user?.openaiApiKey || undefined,
            brandContext
        )

        return {
            date,
            content: suggestion,
            platforms: ["instagram", "pinterest"]
        }
    }
}

export const calendarService = new CalendarService()
