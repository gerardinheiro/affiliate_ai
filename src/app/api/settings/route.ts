import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const user = await db.user.findUnique({
            where: {
                id: (session.user as any).id,
            },
            select: {
                openaiApiKey: true,
            },
        })

        // Never return the actual key to the client for security
        return NextResponse.json({
            hasKey: !!user?.openaiApiKey
        })
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await req.json()
        const { openaiApiKey } = body

        if (!openaiApiKey) {
            return new NextResponse("Missing API Key", { status: 400 })
        }

        await db.user.update({
            where: {
                id: (session.user as any).id,
            },
            data: {
                openaiApiKey,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[SETTINGS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
