import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Metadata } from "next"

// Force dynamic rendering for public profile
export const dynamic = 'force-dynamic'

type Props = {
    params: { username: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const bioPage = await db.bioPage.findUnique({
        where: { username: params.username }
    })

    return {
        title: bioPage?.displayName || "Link na Bio",
        description: bioPage?.bio || "Confira meus links!",
    }
}

export default async function PublicBioPage({ params }: Props) {
    const bioPage = await db.bioPage.findUnique({
        where: { username: params.username },
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
            <div className="max-w-md mx-auto pt-12 text-center space-y-8">
                {/* Profile Header */}
                <div className="space-y-4">
                    <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto overflow-hidden border-4 border-white/10">
                        {bioPage.avatarUrl ? (
                            <img src={bioPage.avatarUrl} alt={bioPage.displayName || ""} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-indigo-600">
                                {bioPage.displayName?.[0] || "U"}
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{bioPage.displayName}</h1>
                        <p className="text-gray-400 mt-2">{bioPage.bio}</p>
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
                            className="block w-full p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all transform hover:scale-[1.02] border border-white/5 backdrop-blur-sm"
                        >
                            <div className="flex items-center justify-center relative">
                                <span className="font-medium">{link.title}</span>
                                <ExternalLink className="w-4 h-4 absolute right-0 text-gray-400" />
                            </div>
                        </a>
                    ))}

                    {bioPage.links.length === 0 && (
                        <p className="text-gray-500 italic">Nenhum link adicionado ainda.</p>
                    )}
                </div>

                {/* Footer */}
                <div className="pt-12 pb-6">
                    <p className="text-xs text-gray-600">
                        Powered by <span className="font-bold text-indigo-500">AffiliateAI</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
