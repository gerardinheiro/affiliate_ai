import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get global settings
export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as { id: string }).id
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { role: true },
        })

        if (user?.role !== "ADMIN") {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const settings = await db.globalSettings.findUnique({
            where: { key: "public_stats" },
        })

        return NextResponse.json(settings?.value || {})
    } catch (error) {
        console.error("[SETTINGS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// PATCH - Update global settings
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as { id: string }).id
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { role: true },
        })

        if (user?.role !== "ADMIN") {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const body = await req.json()

        // Upsert settings
        const settings = await db.globalSettings.upsert({
            where: { key: "public_stats" },
            update: { value: body },
            create: {
                key: "public_stats",
                value: body,
            },
        })

        return NextResponse.json(settings.value)
    } catch (error) {
        console.error("[SETTINGS_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
