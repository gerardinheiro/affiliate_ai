import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

        // Check if Cloudinary is configured
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        console.log("Cloudinary Config Debug:", {
            hasCloudName: !!cloudName,
            hasApiKey: !!apiKey,
            hasApiSecret: !!apiSecret,
            envKeys: Object.keys(process.env).filter(k => k.startsWith('CLOUDINARY'))
        });

        if (!cloudName || !apiKey || !apiSecret) {
            const missing = [];
            if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
            if (!apiKey) missing.push('CLOUDINARY_API_KEY');
            if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');

            const errorMessage = `Cloudinary Config Error: Missing variables: ${missing.join(', ')}`;
            console.error(errorMessage);

            return NextResponse.json(
                {
                    error: errorMessage,
                    details: "Environment variables are not accessible.",
                    debug: {
                        hasCloudName: !!cloudName,
                        hasApiKey: !!apiKey,
                        hasApiSecret: !!apiSecret
                    }
                },
                { status: 500 }
            )
        }

        // Convert file to base64 for Cloudinary upload
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')
        const dataURI = `data:${file.type};base64,${base64}`

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: 'affiliate-ai-uploads',
            resource_type: 'auto',
        })

        // Create creative entry
        const creative = await db.creative.create({
            data: {
                headline: file.name || "Uploaded Image",
                description: nitroflareUrl ? "Uploaded via Nitroflare Gallery" : "Uploaded to Cloudinary",
                cta: "",
                imageUrl: uploadResponse.secure_url, // Cloudinary URL
                nitroflareUrl: nitroflareUrl || null,
                fileSize: file.size,
                folderId: null,
                userId: user.id,
                type: "image"
            }
        })

        return NextResponse.json(creative)
    } catch (error) {
        // Comprehensive error logging
        console.error("Upload error details:", error)
        console.error("Error message:", error instanceof Error ? error.message : 'Unknown error')
        console.error("Error stack:", error instanceof Error ? error.stack : 'No stack')

        // Serialize the full error object for debugging
        const errorDetails: any = {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack',
        }

        // Capture Cloudinary-specific error properties
        if (error && typeof error === 'object') {
            const err = error as any
            if (err.http_code) errorDetails.http_code = err.http_code
            if (err.error) errorDetails.cloudinaryError = err.error
            if (err.name) errorDetails.name = err.name
            // Capture all enumerable properties
            Object.keys(err).forEach(key => {
                if (!errorDetails[key]) {
                    errorDetails[key] = err[key]
                }
            })
        }

        console.error("Full error details:", JSON.stringify(errorDetails, null, 2))

        return NextResponse.json(
            {
                error: "Failed to save upload",
                details: errorDetails
            },
            { status: 500 }
        )
    }
}
