import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { put } from '@vercel/blob'

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

        // Check if BLOB_READ_WRITE_TOKEN is configured
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            console.error("BLOB_READ_WRITE_TOKEN not configured")
            return NextResponse.json(
                { error: "Blob storage not configured. Please add BLOB_READ_WRITE_TOKEN to environment variables." },
                { status: 500 }
            )
        }

        // Upload to Vercel Blob Storage
        const blob = await put(file.name, file, {
            access: 'public',
        })

        // Create creative entry
        const creative = await db.creative.create({
            data: {
                headline: file.name || "Uploaded Image",
                description: nitroflareUrl ? "Uploaded via Nitroflare Gallery" : "Uploaded to Vercel Blob Storage",
                cta: "",
                imageUrl: blob.url, // Save Blob URL
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
