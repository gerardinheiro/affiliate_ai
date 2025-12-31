import { db } from "@/lib/db"

interface TikTokAdsConfig {
    appId: string
    secret: string
}

export class TikTokAdsService {
    private config: TikTokAdsConfig

    constructor() {
        this.config = {
            appId: process.env.TIKTOK_ADS_CLIENT_ID || "",
            secret: process.env.TIKTOK_ADS_CLIENT_SECRET || "",
        }
    }

    async getAdvertisers(accessToken: string) {
        const response = await fetch(
            `https://business-api.tiktok.com/open_api/v1.3/oauth2/advertiser/get/`,
            {
                method: "GET",
                headers: {
                    "Access-Token": accessToken,
                    "Content-Type": "application/json",
                },
                // TikTok API often requires app_id and secret even for some GET requests or it's just good practice to have them ready
                // But for this specific endpoint, Access-Token is the key.
            }
        )

        if (!response.ok) {
            const error = await response.json()
            console.error("TikTok Ads API Error:", error)
            throw new Error(error.message || "Failed to list advertisers")
        }

        const data = await response.json()

        if (data.code !== 0) {
            throw new Error(data.message || "TikTok API returned error code")
        }

        return data.data?.list || []
    }

    async publishVideo(accessToken: string, data: { videoUrl: string, title: string }) {
        // TikTok Content Posting API
        // This is a simplified version. TikTok often requires a multi-step upload process.
        const response = await fetch("https://business-api.tiktok.com/open_api/v1.3/content/video/publish/", {
            method: "POST",
            headers: {
                "Access-Token": accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                video_url: data.videoUrl,
                title: data.title,
                // Other required fields like advertiser_id might be needed depending on the app type
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            console.error("TikTok Publish Video Error:", error)
            throw new Error(error.message || "Failed to publish TikTok video")
        }

        const result = await response.json()
        if (result.code !== 0) {
            throw new Error(result.message || "TikTok API returned error code during publishing")
        }

        return result.data
    }
}

export const tiktokAdsService = new TikTokAdsService()
