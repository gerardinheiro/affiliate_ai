import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        // 1. Get configuration
        const settings = await db.globalSettings.findUnique({
            where: { key: "public_stats" },
        })

        const config = (settings?.value as any) || {}

        // 2. Get real counts
        const [
            realUsersCount,
            realProductsCount,
            realPostsCount, // Using Posts as "Propagandas" for now, or maybe Creatives?
            realCreativesCount
        ] = await Promise.all([
            db.user.count(),
            db.product.count(),
            db.post.count({ where: { status: "published" } }),
            db.creative.count() // Maybe use this for "Propagandas"?
        ])

        // 3. Calculate final stats based on config
        const stats = {
            users: getStatValue(config.users, realUsersCount),
            products: getStatValue(config.products, realProductsCount),
            publishedProducts: getStatValue(config.publishedProducts, realProductsCount), // Assuming added = published for now
            ads: getStatValue(config.ads, realCreativesCount), // Using Creatives as "Propagandas"
        }

        return NextResponse.json(stats)
    } catch (error) {
        console.error("[PUBLIC_STATS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

function getStatValue(config: any, realValue: number) {
    if (!config) return { value: realValue, visible: true }

    if (config.mode === "HIDDEN") {
        return { value: 0, visible: false }
    }

    if (config.mode === "EDITED") {
        return { value: parseInt(config.value) || 0, visible: true }
    }

    // Default to REAL
    return { value: realValue, visible: true }
}
