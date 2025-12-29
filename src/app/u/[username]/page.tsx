import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Metadata } from "next"
import { THEMES, ThemeKey } from "@/lib/themes"
import { BioTracker } from "@/components/bio/bio-tracker"
import { BioLinkItem } from "@/components/bio/bio-link-item"

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

    const theme = THEMES[bioPage.theme as ThemeKey] || THEMES.default

    return (
        <div className={`min-h-screen p-6 ${theme.bg} ${theme.text}`}>
            <BioTracker bioPageId={bioPage.id} />
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
                        <BioLinkItem
                            key={link.id}
                            link={{
                                ...link,
                                icon: link.icon || ""
                            }}
                            bioPageId={bioPage.id}
                            theme={bioPage.theme as ThemeKey}
                        />
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
