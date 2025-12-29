import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { statsService } from "@/lib/stats-service"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const stats = await statsService.getDashboardStats((session.user as any).id)
        return NextResponse.json(stats)
    } catch (error) {
        console.error("[STATS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
