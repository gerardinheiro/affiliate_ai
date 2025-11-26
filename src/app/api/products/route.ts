import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - List all products for the user
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = (session.user as any).id
        const products = await db.product.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(products)
    } catch (error) {
        console.error("Error fetching products:", error)
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
}

// POST - Create a new product
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = (session.user as any).id
        const body = await req.json()
        const { title, price, commission, platform, imageUrl, affiliateLink } = body

        const product = await db.product.create({
            data: {
                title,
                price,
                commission,
                platform,
                imageUrl,
                affiliateLink,
                userId,
            },
        })

        return NextResponse.json(product, { status: 201 })
    } catch (error) {
        console.error("Error creating product:", error)
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }
}

// DELETE - Delete a product
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = (session.user as any).id
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 })
        }

        // Verify ownership
        const product = await db.product.findUnique({ where: { id } })
        if (!product || product.userId !== userId) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        await db.product.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting product:", error)
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }
}
