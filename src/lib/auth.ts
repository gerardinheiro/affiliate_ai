import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as any,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                // Simple admin check for demo
                if (credentials.email === "admin@admin.com" && credentials.password === "admin") {
                    const user = await db.user.upsert({
                        where: { email: "admin@admin.com" },
                        update: {},
                        create: {
                            email: "admin@admin.com",
                            name: "Admin",
                            role: "ADMIN",
                        },
                    })
                    return user
                }

                return null
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id as string
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
    },
}
