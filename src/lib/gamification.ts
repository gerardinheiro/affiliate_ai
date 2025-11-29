import { db } from "@/lib/db"

export const LEVELS = [
    { level: 1, minXp: 0, maxXp: 100, title: "Iniciante" },
    { level: 2, minXp: 101, maxXp: 300, title: "Aprendiz" },
    { level: 3, minXp: 301, maxXp: 600, title: "Criador" },
    { level: 4, minXp: 601, maxXp: 1000, title: "Estrategista" },
    { level: 5, minXp: 1001, maxXp: 1500, title: "Mestre" },
    { level: 6, minXp: 1501, maxXp: 2500, title: "Visionário" },
    { level: 7, minXp: 2501, maxXp: 4000, title: "Lenda" },
    { level: 8, minXp: 4001, maxXp: 6000, title: "Titã" },
    { level: 9, minXp: 6001, maxXp: 9000, title: "Divindade" },
    { level: 10, minXp: 9001, maxXp: 999999, title: "Supremo" },
]

export const XP_REWARDS = {
    CREATE_PRODUCT: 50,
    CREATE_CAMPAIGN: 30,
    CREATE_CREATIVE: 30,
    POST_SOCIAL: 20,
    SETUP_BIO: 100,
    FIRST_SALE: 500,
    DAILY_LOGIN: 10
}

export function calculateLevel(xp: number) {
    const level = LEVELS.find(l => xp >= l.minXp && xp <= l.maxXp) || LEVELS[LEVELS.length - 1]

    const nextLevel = LEVELS.find(l => l.level === level.level + 1)
    const xpForNextLevel = nextLevel ? nextLevel.minXp - xp : 0
    const progress = nextLevel
        ? ((xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100
        : 100

    return {
        currentLevel: level.level,
        title: level.title,
        progress: Math.min(100, Math.max(0, progress)),
        xpForNextLevel,
        nextLevelXp: nextLevel?.minXp || level.maxXp
    }
}

export async function addXp(userId: string, amount: number) {
    try {
        await db.user.update({
            where: { id: userId },
            data: { xp: { increment: amount } }
        })
    } catch (error) {
        console.error("Error adding XP:", error)
    }
}
