import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { pinterestAdsService } from "@/lib/pinterest-ads"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { integrationId } = await req.json()

        const integration = await db.integration.findUnique({
            where: {
                id: integrationId,
                userId: (session.user as { id: string }).id
            }
        })

        if (!integration || !integration.refreshToken) {
            return NextResponse.json({ success: false, message: "Integração não encontrada ou sem token de atualização." }, { status: 404 })
        }

        // 1. Refresh token
        const accessToken = await pinterestAdsService.getAccessToken(integration.refreshToken)

        // 2. List ad accounts to verify connection
        const adAccounts = await pinterestAdsService.listAdAccounts(accessToken)

        return NextResponse.json({
            success: true,
            adAccountsCount: adAccounts.length,
            message: `Conexão bem-sucedida! ${adAccounts.length} contas de anúncios encontradas.`
        })

    } catch (error: any) {
        console.error("[PINTEREST_ADS_TEST_ERROR]", error)
        return NextResponse.json({
            success: false,
            message: error.message || "Erro interno ao testar conexão com Pinterest Ads."
        }, { status: 500 })
    }
}
