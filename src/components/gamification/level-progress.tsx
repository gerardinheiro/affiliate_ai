"use client"

import { Progress } from "@/components/ui/progress"
import { Trophy } from "lucide-react"
import { calculateLevel } from "@/lib/gamification"
import { cn } from "@/lib/utils"

interface LevelProgressProps {
    xp: number
    className?: string
    showTitle?: boolean
}

export function LevelProgress({ xp, className, showTitle = true }: LevelProgressProps) {
    const { currentLevel, title, progress, xpForNextLevel } = calculateLevel(xp)

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                    <div className="bg-yellow-500/20 p-1.5 rounded-lg">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Nível {currentLevel}</div>
                        {showTitle && <div className="text-sm font-bold text-white">{title}</div>}
                    </div>
                </div>
                <div className="text-xs text-gray-500">
                    {Math.floor(xpForNextLevel)} XP para o próximo
                </div>
            </div>

            <div className="relative h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}
