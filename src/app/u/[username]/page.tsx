import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Metadata } from "next"

// Force dynamic rendering for public profile
export const dynamic = 'force-dynamic'

type Props = {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params
    const bioPage = await db.bioPage.findUnique({
        where: { username }
    })

    return {
        title: bioPage?.displayName || "Link na Bio",
        description: bioPage?.bio || "Confira meus links!",
    }
}

export default async function PublicBioPage({ params }: Props) {
    const { username } = await params
    const bioPage = await db.bioPage.findUnique({
        where: { username },
        include: { links: { orderBy: { order: 'asc' } } }
    })

    if (!bioPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-gray-400">Página não encontrada.</p>
                </div>
            </div>
        )
    }

    // Increment views (fire and forget)
    // In a real app, use a separate API route or server action to avoid blocking
    // await db.bioPage.update({ where: { id: bioPage.id }, data: { views: { increment: 1 } } })

    const THEMES = {
        default: {
            bg: "bg-gradient-to-br from-gray-900 to-black",
            text: "text-white",
            card: "bg-white/10 text-white hover:bg-white/20 border-white/5",
            button: "bg-white text-black hover:bg-gray-200"
        },
        light: {
            bg: "bg-gray-50",
            text: "text-gray-900",
            card: "bg-white border-gray-200 text-gray-900 shadow-sm hover:shadow-md",
            button: "bg-black text-white hover:bg-gray-800"
        },
        gradient: {
            bg: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500",
            text: "text-white",
            card: "bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30",
            button: "bg-white text-purple-600 hover:bg-gray-100"
        },
        neon: {
            bg: "bg-black",
            text: "text-green-400 font-mono",
            card: "bg-black border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400",
            button: "bg-green-500 text-black hover:bg-green-400 font-bold"
        }
    }

    const theme = THEMES[bioPage.theme as keyof typeof THEMES] || THEMES.default

    return (
        <div className={`min-h-screen p-6 ${theme.bg} ${theme.text}`}>
            <div className="max-w-md mx-auto pt-12 text-center space-y-8">
                {/* Profile Header */}
                <div className="space-y-4">
                    <div className={`w-24 h-24 rounded-full mx-auto overflow-hidden border-4 shadow-xl ${bioPage.theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
                        {bioPage.avatarUrl ? (
                            <img src={bioPage.avatarUrl} alt={bioPage.displayName || ""} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-gray-700">
                                {bioPage.displayName?.[0] || "U"}
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{bioPage.displayName}</h1>
                        <p className={`mt-2 opacity-80 ${theme.text}`}>{bioPage.bio}</p>
                    </div>
                </div>

                {/* Links */}
                <div className="space-y-4">
                    {bioPage.links.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block w-full p-4 rounded-xl transition-all transform hover:scale-[1.02] border ${theme.card}`}
                        >
                            <div className="flex items-center justify-center relative">
                                <span className="font-medium">{link.title}</span>
                                <ExternalLink className={`w-4 h-4 absolute right-0 opacity-50 ${theme.text}`} />
                            </div>
                        </a>
                    ))}

                    {bioPage.links.length === 0 && (
                        <p className="opacity-50 italic">Nenhum link adicionado ainda.</p>
                    )}
                </div>

                {/* Footer */}
                <div className="pt-12 pb-6">
                    <p className="text-xs opacity-60">
                        Powered by <span className="font-bold">AffiliateAI</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
