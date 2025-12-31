import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await db.user.findUnique({
        where: { id: (session.user as { id: string }).id },
        select: { dashboardConfig: true }
    })

    return NextResponse.json(user?.dashboardConfig || null)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const config = await req.json()

        await db.user.update({
            where: { id: (session.user as { id: string }).id },
            data: { dashboardConfig: config }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to update dashboard config:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
