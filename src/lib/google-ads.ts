import { db } from "@/lib/db"

interface GoogleAdsConfig {
    clientId: string
    clientSecret: string
    developerToken: string
}

export class GoogleAdsService {
    private config: GoogleAdsConfig

    constructor() {
        this.config = {
            clientId: process.env.GOOGLE_ADS_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET || "",
            developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "",
        }
    }

    async getAccessToken(refreshToken: string): Promise<string> {
        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                refresh_token: refreshToken,
                grant_type: "refresh_token",
            }),
        })

        if (!response.ok) {
            throw new Error("Failed to refresh access token")
        }

        const data = await response.json()
        return data.access_token
    }

    async listAccessibleCustomers(accessToken: string) {
        const response = await fetch(
            `https://googleads.googleapis.com/v14/customers:listAccessibleCustomers`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "developer-token": this.config.developerToken,
                },
            }
        )

        if (!response.ok) {
            const error = await response.json()
            console.error("Google Ads API Error:", error)
            throw new Error(error.error?.message || "Failed to list customers")
        }

        const data = await response.json()
        return data.resourceNames || []
    }

    async getCustomer(customerId: string, accessToken: string) {
        // This is a placeholder. In a real scenario, we would query the customer resource.
        // For validation purposes, listAccessibleCustomers is often enough to prove connection.
        return { resourceName: `customers/${customerId}` }
    }
}

export const googleAdsService = new GoogleAdsService()
