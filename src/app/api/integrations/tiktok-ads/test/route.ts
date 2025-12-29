import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { tiktokAdsService } from "@/lib/tiktok-ads"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { integrationId } = await req.json()

        if (!integrationId) {
            return new NextResponse("Integration ID required", { status: 400 })
        }

        const integration = await db.integration.findUnique({
            where: {
                id: integrationId,
                userId: (session.user as any).id,
            },
        })

        if (!integration || !integration.accessToken) {
            return new NextResponse("Integration not found or missing access token", { status: 404 })
        }

        // Test Connection (List Advertisers)
        const advertisers = await tiktokAdsService.getAdvertisers(integration.accessToken)

        return NextResponse.json({
            success: true,
            message: "Conexão verificada com sucesso!",
            advertisersCount: advertisers.length,
            advertisers: advertisers
        })

    } catch (error: any) {
        console.error("[TIKTOK_ADS_TEST]", error)
        return NextResponse.json({
            success: false,
            message: error.message || "Falha ao testar conexão"
        }, { status: 500 })
    }
}
