import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { writeFile } from "fs/promises"
import path from "path"

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

        const formData = await req.formData()
        const file = formData.get('file') as File
        const nitroflareUrl = formData.get('nitroflareUrl') as string | null

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const timestamp = Date.now()
        const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

        // Save file to public/uploads
        await writeFile(filepath, buffer)

        // Create URL path for the image
        const imageUrl = `/uploads/${filename}`

        // Create creative entry
        const creative = await db.creative.create({
            data: {
                headline: file.name || "Uploaded Image",
                description: nitroflareUrl ? "Uploaded via Nitroflare Gallery" : "Uploaded to local storage",
                cta: "",
                imageUrl: imageUrl, // Save file path instead of base64
                nitroflareUrl: nitroflareUrl || null,
                fileSize: file.size,
                folderId: null,
                userId: user.id,
                type: "image"
            }
        })

        return NextResponse.json(creative)
    } catch (error) {
        console.error("Upload error details:", error)
        console.error("Error message:", error instanceof Error ? error.message : 'Unknown error')
        console.error("Error stack:", error instanceof Error ? error.stack : 'No stack')
        return NextResponse.json(
            {
                error: "Failed to save upload",
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
