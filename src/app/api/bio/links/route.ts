import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// POST - Add a new link
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as any).id
        const body = await req.json()
        const { title, url, icon } = body

        const bioPage = await db.bioPage.findUnique({ where: { userId } })
        if (!bioPage) return new NextResponse("Bio Page not found", { status: 404 })

        const link = await db.bioLink.create({
            data: {
                bioPageId: bioPage.id,
                title,
                url,
                icon,
                order: 0 // TODO: Implement ordering logic
            }
        })

        return NextResponse.json(link)
    } catch (error) {
        console.error("[BIO_LINK_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE - Remove a link
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as any).id
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) return new NextResponse("ID required", { status: 400 })

        // Verify ownership
        const link = await db.bioLink.findUnique({
            where: { id },
            include: { bioPage: true }
        })

        if (!link || link.bioPage.userId !== userId) {
            return new NextResponse("Link not found", { status: 404 })
        }

        await db.bioLink.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[BIO_LINK_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// PATCH - Reorder links
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as any).id
        const body = await req.json()
        const { links } = body // Expects array of { id, order }

        if (!Array.isArray(links)) {
            return new NextResponse("Invalid data", { status: 400 })
        }

        // Verify ownership of the bio page
        const bioPage = await db.bioPage.findUnique({ where: { userId } })
        if (!bioPage) return new NextResponse("Bio Page not found", { status: 404 })

        // Update each link's order
        // Using transaction to ensure all updates succeed or fail together
        await db.$transaction(
            links.map((link: { id: string, order: number }) =>
                db.bioLink.update({
                    where: { id: link.id, bioPageId: bioPage.id }, // Ensure link belongs to user's bio page
                    data: { order: link.order }
                })
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[BIO_LINK_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
