import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ platform: string }> }
) {
    const session = await getServerSession(authOptions)
    const { platform } = await params

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // This would normally redirect to the platform's OAuth page
    // For now, we'll return the config for the frontend to handle
    const config: Record<string, Record<string, string>> = {
        google_ads: {
            authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
            clientId: process.env.GOOGLE_ADS_CLIENT_ID || "",
            scope: "https://www.googleapis.com/auth/adwords",
        },
        meta_ads: {
            authUrl: "https://www.facebook.com/v12.0/dialog/oauth",
            clientId: process.env.META_ADS_CLIENT_ID || "",
            scope: "ads_management,ads_read",
        },
        tiktok_ads: {
            authUrl: "https://business-api.tiktok.com/portal/auth",
            clientId: process.env.TIKTOK_ADS_CLIENT_ID || "",
            scope: "ads.manage",
        },
        instagram: {
            authUrl: "https://api.instagram.com/oauth/authorize",
            clientId: process.env.INSTAGRAM_CLIENT_ID || "",
            scope: "instagram_basic,instagram_content_publish",
        },
    }

    const platformConfig = config[platform]

    if (!platformConfig) {
        return new NextResponse("Platform not supported for OAuth", { status: 400 })
    }

    return NextResponse.json(platformConfig)
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ platform: string }> }
) {
    const session = await getServerSession(authOptions)
    const { platform } = await params

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { code } = await req.json()

        if (!code) {
            return new NextResponse("Missing code", { status: 400 })
        }

        // In a real scenario, we would exchange the code for tokens here
        // For now, we'll mock the token exchange
        console.log(`Exchanging code for ${platform} tokens...`)

        const mockTokens = {
            accessToken: `mock_access_token_${Math.random().toString(36).substring(7)}`,
            refreshToken: `mock_refresh_token_${Math.random().toString(36).substring(7)}`,
            expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
        }

        return NextResponse.json(mockTokens)
    } catch (error) {
        console.error(`[OAUTH_CALLBACK_${platform.toUpperCase()}]`, error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
