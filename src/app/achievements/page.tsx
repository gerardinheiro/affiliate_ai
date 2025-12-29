"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Lock, Trophy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaderboard } from "@/components/gamification/leaderboard"

interface BadgeData {
    id: string
    name: string
    description: string
    icon: string
    rarity: "common" | "rare" | "epic" | "legendary"
    xpReward: number
}

interface BadgesData {
    badges: BadgeData[]
    groupedBadges: Record<string, BadgeData[]>
    lockedBadges: BadgeData[]
    totalBadges: number
    totalAvailable: number
    xp: number
    level: number
}

const rarityColors = {
    common: "bg-gray-500",
    rare: "bg-blue-500",
    epic: "bg-purple-500",
    legendary: "bg-yellow-500",
}

const rarityBorders = {
    common: "border-gray-500/30",
    rare: "border-blue-500/30",
    epic: "border-purple-500/30",
    legendary: "border-yellow-500/30",
}

export default function AchievementsPage() {
    const [data, setData] = useState<BadgesData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch("/api/badges")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch badges")
                return res.json()
            })
            .then((data) => setData(data))
            .catch((err) => console.error("Failed to load badges", err))
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-400">Erro ao carregar conquistas</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <h1 className="text-3xl font-bold text-white">Conquistas</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-900 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-400">Total Desbloqueadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-white">
                            {data.totalBadges}/{data.totalAvailable}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-400">Nível Atual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-white">{data.level}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-400">XP Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-white">{data.xp.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="unlocked" className="w-full">
                <TabsList className="bg-gray-900 border border-white/10">
                    <TabsTrigger value="unlocked">Desbloqueadas ({data.totalBadges})</TabsTrigger>
                    <TabsTrigger value="locked">Bloqueadas ({data.lockedBadges.length})</TabsTrigger>
                    <TabsTrigger value="rarity">Por Raridade</TabsTrigger>
                    <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
                </TabsList>

                <TabsContent value="unlocked" className="space-y-4">
                    {data.badges.length === 0 ? (
                        <Card className="bg-gray-900 border-white/10">
                            <CardContent className="py-12 text-center">
                                <Lock className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                                <p className="text-gray-400">Nenhuma conquista desbloqueada ainda</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Continue usando a plataforma para desbloquear conquistas!
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.badges.map((badge) => (
                                <BadgeCard key={badge.id} badge={badge} locked={false} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="locked" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.lockedBadges.map((badge) => (
                            <BadgeCard key={badge.id} badge={badge} locked={true} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="rarity" className="space-y-6">
                    {(["legendary", "epic", "rare", "common"] as const).map((rarity) => {
                        const badges = data.groupedBadges[rarity] || []
                        if (badges.length === 0) return null

                        return (
                            <div key={rarity} className="space-y-3">
                                <h3 className="text-lg font-semibold text-white capitalize flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${rarityColors[rarity]}`} />
                                    {rarity === "legendary" && "Lendário"}
                                    {rarity === "epic" && "Épico"}
                                    {rarity === "rare" && "Raro"}
                                    {rarity === "common" && "Comum"}
                                    <span className="text-sm text-gray-500">({badges.length})</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {badges.map((badge) => (
                                        <BadgeCard key={badge.id} badge={badge} locked={false} />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </TabsContent>

                <TabsContent value="leaderboard">
                    <Leaderboard />
                </TabsContent>
            </Tabs>
        </div >
    )
}

function BadgeCard({ badge, locked }: { badge: BadgeData; locked: boolean }) {
    return (
        <Card
            className={`bg-gray-900 border ${locked ? "border-white/10 opacity-60" : rarityBorders[badge.rarity]
                } hover:scale-105 transition-transform`}
        >
            <CardContent className="p-6 text-center space-y-3">
                <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${locked ? "bg-gray-800" : `bg-gradient-to-br ${rarityColors[badge.rarity]}/20`
                        }`}
                >
                    {locked ? (
                        <Lock className="w-8 h-8 text-gray-600" />
                    ) : (
                        <span className="text-4xl">{badge.icon}</span>
                    )}
                </div>
                <div>
                    <h4 className="font-semibold text-white">{badge.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">{badge.description}</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <Badge
                        variant="outline"
                        className={`${locked ? "border-gray-700 text-gray-500" : `border-${badge.rarity}-500/30 text-${badge.rarity}-400`
                            } capitalize`}
                    >
                        {badge.rarity === "legendary" && "Lendário"}
                        {badge.rarity === "epic" && "Épico"}
                        {badge.rarity === "rare" && "Raro"}
                        {badge.rarity === "common" && "Comum"}
                    </Badge>
                    {!locked && badge.xpReward > 0 && (
                        <Badge variant="outline" className="border-indigo-500/30 text-indigo-400">
                            +{badge.xpReward} XP
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
