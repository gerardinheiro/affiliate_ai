import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const body = await req.json()
        const { fileName, nitroflareUrl, fileSize, folderId } = body

        // Create creative entry (nitroflareUrl is optional)
        const creative = await db.creative.create({
            data: {
                headline: fileName || "Uploaded Image",
                description: nitroflareUrl ? "Uploaded via Nitroflare Gallery" : "Uploaded to local storage",
                cta: "",
                nitroflareUrl: nitroflareUrl || null,
                fileSize,
                folderId: folderId || null,
                userId: user.id,
                type: "image"
            }
        })

        return NextResponse.json(creative)
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json(
            { error: "Failed to save upload" },
            { status: 500 }
        )
    }
}
