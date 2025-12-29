"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal, Crown, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

interface LeaderboardUser {
    rank: number
    id: string
    name: string
    image: string | null
    xp: number
    level: number
    badgesCount: number
}

export function Leaderboard() {
    const { data: session } = useSession()
    const [users, setUsers] = useState<LeaderboardUser[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch("/api/gamification/leaderboard")
                if (res.ok) {
                    const data = await res.json()
                    setUsers(data)
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLeaderboard()
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {users.map((user) => {
                const isCurrentUser = session?.user?.email === user.id || (session?.user as { id?: string })?.id === user.id

                return (
                    <Card
                        key={user.id}
                        className={`border-white/10 transition-all hover:scale-[1.01] ${isCurrentUser
                            ? "bg-indigo-500/10 border-indigo-500/50"
                            : "bg-gray-900/50"
                            }`}
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex-shrink-0 w-8 text-center font-bold text-xl text-gray-400">
                                {user.rank === 1 && <Crown className="w-6 h-6 text-yellow-500 mx-auto" />}
                                {user.rank === 2 && <Medal className="w-6 h-6 text-gray-300 mx-auto" />}
                                {user.rank === 3 && <Medal className="w-6 h-6 text-amber-600 mx-auto" />}
                                {user.rank > 3 && `#${user.rank}`}
                            </div>

                            <Avatar className="w-10 h-10 border-2 border-white/10">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="bg-indigo-600 text-white">
                                    {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <p className={`font-semibold truncate ${isCurrentUser ? "text-indigo-400" : "text-white"}`}>
                                    {user.name} {isCurrentUser && "(Você)"}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Nível {user.level} • {user.badgesCount} Conquistas
                                </p>
                            </div>

                            <div className="text-right">
                                <span className="font-bold text-indigo-400 block">{user.xp.toLocaleString()} XP</span>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
