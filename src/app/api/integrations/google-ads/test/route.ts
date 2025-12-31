import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { googleAdsService } from "@/lib/google-ads"

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
                userId: (session.user as { id: string }).id,
            },
        })

        if (!integration || !integration.refreshToken) {
            return new NextResponse("Integration not found or missing refresh token", { status: 404 })
        }

        // 1. Refresh Token
        const accessToken = await googleAdsService.getAccessToken(integration.refreshToken)

        // 2. Test Connection (List Customers)
        const customers = await googleAdsService.listAccessibleCustomers(accessToken)

        // 3. Update Integration with new Access Token (optional but good practice)
        await db.integration.update({
            where: { id: integrationId },
            data: {
                accessToken: accessToken,
                expiresAt: new Date(Date.now() + 3500 * 1000) // ~1 hour
            }
        })

        return NextResponse.json({
            success: true,
            message: "Conexão verificada com sucesso!",
            customersCount: customers.length,
            customers: customers
        })

    } catch (error: unknown) {
        console.error("[GOOGLE_ADS_TEST]", error)
        const errorMessage = error instanceof Error ? error.message : "Falha ao testar conexão"
        return NextResponse.json({
            success: false,
            message: errorMessage
        }, { status: 500 })
    }
}
