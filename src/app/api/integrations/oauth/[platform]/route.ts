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
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const redirectUri = `${baseUrl}/api/integrations/oauth/callback`

    const config: Record<string, Record<string, string>> = {
        google_ads: {
            authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
            clientId: process.env.GOOGLE_ADS_CLIENT_ID || "",
            scope: "https://www.googleapis.com/auth/adwords",
            redirectUri,
        },
        meta_ads: {
            authUrl: "https://www.facebook.com/v12.0/dialog/oauth",
            clientId: process.env.META_ADS_CLIENT_ID || "",
            scope: "ads_management,ads_read",
            redirectUri,
        },
        tiktok_ads: {
            authUrl: "https://business-api.tiktok.com/portal/auth",
            clientId: process.env.TIKTOK_ADS_CLIENT_ID || "",
            scope: "ads.manage",
            redirectUri,
        },
        tiktok: {
            authUrl: "https://www.tiktok.com/auth/authorize/",
            clientId: process.env.TIKTOK_CLIENT_ID || "",
            scope: "user.info.basic,video.list,video.upload",
            redirectUri,
        },
        youtube: {
            authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            scope: "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload",
            redirectUri,
        },
        pinterest: {
            authUrl: "https://www.pinterest.com/oauth/",
            clientId: process.env.PINTEREST_CLIENT_ID || "",
            scope: "boards:read,pins:read,pins:write",
            redirectUri,
        },
        instagram: {
            authUrl: "https://www.facebook.com/v12.0/dialog/oauth",
            clientId: process.env.INSTAGRAM_CLIENT_ID || process.env.META_ADS_CLIENT_ID || "",
            scope: "instagram_basic,instagram_content_publish,pages_read_engagement",
            redirectUri,
        },
    }

    const platformConfig = config[platform]

    if (!platformConfig) {
        return new NextResponse("Platform not supported for OAuth", { status: 400 })
    }

    if (!platformConfig.clientId) {
        return new NextResponse(`Configuração ausente para ${platform}. Verifique as variáveis de ambiente.`, { status: 400 })
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

        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
        const redirectUri = `${baseUrl}/api/integrations/oauth/callback`

        let tokenUrl = ""
        let body: Record<string, string | undefined> = {}

        if (platform === "google_ads") {
            tokenUrl = "https://oauth2.googleapis.com/token"
            body = {
                code,
                client_id: process.env.GOOGLE_ADS_CLIENT_ID,
                client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }
        } else if (platform === "meta_ads") {
            tokenUrl = "https://graph.facebook.com/v12.0/oauth/access_token"
            body = {
                client_id: process.env.META_ADS_CLIENT_ID,
                client_secret: process.env.META_ADS_CLIENT_SECRET,
                redirect_uri: redirectUri,
                code,
            }
        } else if (platform === "tiktok_ads") {
            tokenUrl = "https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/"
            body = {
                app_id: process.env.TIKTOK_ADS_CLIENT_ID,
                secret: process.env.TIKTOK_ADS_CLIENT_SECRET,
                auth_code: code,
            }
        } else if (platform === "tiktok") {
            tokenUrl = "https://open-api.tiktok.com/oauth/access_token/"
            body = {
                client_key: process.env.TIKTOK_CLIENT_ID,
                client_secret: process.env.TIKTOK_CLIENT_SECRET,
                code,
                grant_type: "authorization_code",
            }
        } else if (platform === "youtube") {
            tokenUrl = "https://oauth2.googleapis.com/token"
            body = {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }
        } else if (platform === "pinterest") {
            tokenUrl = "https://api.pinterest.com/v5/oauth/token"
            const auth = Buffer.from(`${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`).toString("base64")
            const response = await fetch(tokenUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${auth}`
                },
                body: new URLSearchParams({
                    code,
                    redirect_uri: redirectUri,
                    grant_type: "authorization_code",
                })
            })
            // Pinterest needs special handling for the response
            if (!response.ok) {
                const errorData = await response.json()
                console.error(`[OAUTH_TOKEN_ERROR_PINTEREST]`, errorData)
                return new NextResponse("Failed to exchange token", { status: 500 })
            }
            const data = await response.json()
            return NextResponse.json({
                accessToken: data.access_token,
                refreshToken: data.refresh_token || null,
                expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : null,
            })
        } else if (platform === "instagram") {
            tokenUrl = "https://api.instagram.com/oauth/access_token"
            body = {
                client_id: process.env.INSTAGRAM_CLIENT_ID,
                client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
                grant_type: "authorization_code",
                redirect_uri: redirectUri,
                code,
            }
        }

        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error(`[OAUTH_TOKEN_ERROR_${platform.toUpperCase()}]`, errorData)
            return new NextResponse("Failed to exchange token", { status: 500 })
        }

        const data = await response.json()

        return NextResponse.json({
            accessToken: data.access_token,
            refreshToken: data.refresh_token || null,
            expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : null,
        })
    } catch (error: unknown) {
        console.error(`[OAUTH_CALLBACK_${platform.toUpperCase()}]`, error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
