import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Fetch user's bio page
export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as { id: string }).id

        let bioPage = await db.bioPage.findUnique({
            where: { userId },
            include: { links: { orderBy: { order: 'asc' } } }
        })

        // Create if doesn't exist
        if (!bioPage) {
            // Generate username from email or random
            const email = session.user.email || ""
            const baseUsername = email.split('@')[0] || `user${Math.floor(Math.random() * 10000)}`
            let username = baseUsername

            // Ensure uniqueness
            let counter = 1
            while (await db.bioPage.findUnique({ where: { username } })) {
                username = `${baseUsername}${counter}`
                counter++
            }

            bioPage = await db.bioPage.create({
                data: {
                    userId,
                    username,
                    displayName: session.user.name || "Affiliate User",
                    avatarUrl: session.user.image,
                },
                include: { links: true }
            })
        }

        return NextResponse.json(bioPage)
    } catch (error) {
        console.error("[BIO_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// PATCH - Update bio page details
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as { id: string }).id
        const body = await req.json()
        const { username, displayName, bio, theme, avatarUrl } = body

        // Check username uniqueness if changing
        if (username) {
            const existing = await db.bioPage.findUnique({ where: { username } })
            if (existing && existing.userId !== userId) {
                return new NextResponse("Username already taken", { status: 400 })
            }
        }

        const bioPage = await db.bioPage.update({
            where: { userId },
            data: {
                username,
                displayName,
                bio,
                theme,
                avatarUrl
            }
        })

        return NextResponse.json(bioPage)
    } catch (error) {
        console.error("[BIO_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
