import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET - Get page view count
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const page = searchParams.get("page") || "/"

        const count = await db.pageView.count({
            where: { page },
        })

        return NextResponse.json({ count })
    } catch (error) {
        console.error("[PAGE_VIEWS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// POST - Track page view
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { page } = body

        // Get IP and User Agent from headers
        const forwarded = req.headers.get("x-forwarded-for")
        const ipAddress = forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip") || "unknown"
        const userAgent = req.headers.get("user-agent") || "unknown"

        await db.pageView.create({
            data: {
                page: page || "/",
                ipAddress,
                userAgent,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[PAGE_VIEWS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
