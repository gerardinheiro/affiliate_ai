import { db } from "@/lib/db"

interface PinterestAdsConfig {
    clientId: string
    clientSecret: string
}

export class PinterestAdsService {
    private config: PinterestAdsConfig

    constructor() {
        this.config = {
            clientId: process.env.PINTEREST_CLIENT_ID || "",
            clientSecret: process.env.PINTEREST_CLIENT_SECRET || "",
        }
    }

    async getAccessToken(refreshToken: string): Promise<string> {
        // Pinterest OAuth2 token endpoint
        const response = await fetch("https://api.pinterest.com/v5/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            console.error("Pinterest Token Refresh Error:", error)
            throw new Error("Failed to refresh Pinterest access token")
        }

        const data = await response.json()
        return data.access_token
    }

    async listAdAccounts(accessToken: string) {
        const response = await fetch(
            `https://api.pinterest.com/v5/ad_accounts`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )

        if (!response.ok) {
            const error = await response.json()
            console.error("Pinterest API Error:", error)
            throw new Error(error.message || "Failed to list Pinterest ad accounts")
        }

        const data = await response.json()
        return data.items || []
    }

    async createPin(accessToken: string, adAccountId: string, data: { title: string, description: string, imageUrl: string, boardId?: string }) {
        // Pinterest API to create a pin
        // Note: In a real app, we'd need a board_id. If not provided, we might need to fetch or create one.
        const response = await fetch("https://api.pinterest.com/v5/pins", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: data.title,
                description: data.description,
                media_source: {
                    source_type: "image_url",
                    url: data.imageUrl,
                },
                board_id: data.boardId || "default", // Placeholder
                ad_account_id: adAccountId,
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            console.error("Pinterest Create Pin Error:", error)
            throw new Error(error.message || "Failed to create Pinterest pin")
        }

        return await response.json()
    }
}

export const pinterestAdsService = new PinterestAdsService()
