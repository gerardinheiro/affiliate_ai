import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Fetch user profile
export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as { id: string }).id
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                bio: true,
                website: true,
                instagram: true,
                tiktok: true,
                youtube: true,
                twitter: true,
                hasCompletedOnboarding: true,
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("[PROFILE_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// PATCH - Update user profile
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userId = (session.user as { id: string }).id
        const body = await req.json()
        const { name, bio, website, instagram, tiktok, youtube, twitter, image } = body

        const user = await db.user.update({
            where: { id: userId },
            data: {
                name,
                bio,
                website,
                instagram,
                tiktok,
                youtube,
                twitter,
                image,
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("[PROFILE_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
