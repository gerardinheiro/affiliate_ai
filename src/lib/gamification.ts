import { db } from "@/lib/db"

// Helper to calculate level based on XP
// Level 1: 0-99 XP
// Level 2: 100-299 XP
// Level 3: 300-599 XP
// etc.
export function calculateLevel(xp: number) {
    return Math.floor(Math.sqrt(xp / 100)) + 1
}

// Internal helper to add XP (can be called from other routes)
export async function addXp(userId: string, amount: number) {
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) return

    const newXp = user.xp + amount
    const newLevel = calculateLevel(newXp)

    await db.user.update({
        where: { id: userId },
        data: {
            xp: newXp,
            level: newLevel
        }
    })

    return { newXp, newLevel, leveledUp: newLevel > user.level }
}
