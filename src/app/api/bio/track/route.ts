import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { type, bioPageId, linkId } = body

        if (!bioPageId) {
            return new NextResponse("Bio Page ID required", { status: 400 })
        }

        if (type === "view") {
            // Increment page views
            await db.bioPage.update({
                where: { id: bioPageId },
                data: { views: { increment: 1 } }
            })

            // Log event (optional, for detailed history)
            // await db.analyticsEvent.create({ ... })
        } else if (type === "click" && linkId) {
            // Increment link clicks
            await db.bioLink.update({
                where: { id: linkId },
                data: { clicks: { increment: 1 } }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[BIO_TRACK]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
