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
                brandName: true,
                brandTone: true,
                brandDescription: true,
            },
        })

        // Never return the actual key to the client for security
        return NextResponse.json({
            hasKey: !!user?.openaiApiKey,
            brandName: user?.brandName,
            brandTone: user?.brandTone,
            brandDescription: user?.brandDescription,
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
        const { openaiApiKey, brandName, brandTone, brandDescription } = body

        // If only updating brand info, skip API key check
        if (!openaiApiKey && !brandName && !brandTone && !brandDescription) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        const updateData: any = {}
        if (openaiApiKey) updateData.openaiApiKey = openaiApiKey
        if (brandName !== undefined) updateData.brandName = brandName
        if (brandTone !== undefined) updateData.brandTone = brandTone
        if (brandDescription !== undefined) updateData.brandDescription = brandDescription

        await db.user.update({
            where: {
                id: (session.user as any).id,
            },
            data: updateData,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[SETTINGS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
