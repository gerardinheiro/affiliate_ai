import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { calendarService } from "@/lib/calendar-service"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const dateParam = searchParams.get("date")
        const date = dateParam ? new Date(dateParam) : new Date()

        const events = await calendarService.getCalendarData(
            (session.user as { id: string }).id,
            date
        )

        return NextResponse.json(events)
    } catch (error) {
        console.error("[CALENDAR_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { date } = await req.json()
        const suggestion = await calendarService.generateAISuggestion(
            (session.user as { id: string }).id,
            new Date(date)
        )

        return NextResponse.json(suggestion)
    } catch (error) {
        console.error("[CALENDAR_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
