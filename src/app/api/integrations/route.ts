import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const integrations = await db.integration.findMany({
            where: {
                userId: (session.user as { id: string }).id,
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

        // Optional: Validate credentials for specific platforms
        if (platform === "hotmart" && apiKey) {
            try {
                const hotmartRes = await fetch("https://developers.hotmart.com/payments/api/v1/users/me", {
                    headers: { "Authorization": `Bearer ${apiKey}` }
                })
                if (!hotmartRes.ok) {
                    return new NextResponse("Token Hotmart inválido", { status: 400 })
                }
            } catch (e) {
                console.error("Hotmart validation error", e)
            }
        }

        if (platform === "eduzz" && apiKey) {
            try {
                const eduzzRes = await fetch("https://api2.eduzz.com/credential/v1/me", {
                    headers: { "token": apiKey }
                })
                if (!eduzzRes.ok) {
                    return new NextResponse("API Key Eduzz inválida", { status: 400 })
                }
            } catch (e) {
                console.error("Eduzz validation error", e)
            }
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
    } catch {
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
                userId: (session.user as { id: string }).id,
            },
        })

        return NextResponse.json(integration)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
