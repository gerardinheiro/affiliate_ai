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
        const integrations = await db.integration.findMany({
            where: {
                userId: (session.user as any).id,
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json(integrations)
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
        const {
            platform,
            name,
            apiKey,
            accountId,
            accessToken,
            refreshToken,
            expiresAt,
            targetCountry,
            targetState,
            targetCity
        } = body

        if (!platform || !name) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const integration = await db.integration.create({
            data: {
                userId: (session.user as any).id,
                platform,
                name,
                apiKey,
                accountId,
                accessToken,
                refreshToken,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                targetCountry,
                targetState,
                targetCity,
            },
        })

        return NextResponse.json(integration)
    } catch (error) {
        console.error("[INTEGRATIONS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
        return new NextResponse("Missing id", { status: 400 })
    }

    try {
        const integration = await db.integration.deleteMany({
            where: {
                id,
                userId: (session.user as any).id,
            },
        })

        return NextResponse.json(integration)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
