import { db } from "./db"

export type BadgeId =
    | "first_product"
    | "product_collector_10"
    | "product_collector_50"
    | "first_post"
    | "content_creator_10"
    | "first_creative"
    | "creative_master_25"
    | "early_adopter"
    | "week_streak"
    | "month_streak"
    | "bio_page_created"
    | "social_butterfly"
    | "level_5"
    | "level_10"
    | "level_25"
    | "level_50"

export interface Badge {
    id: BadgeId
    name: string
    description: string
    icon: string
    rarity: "common" | "rare" | "epic" | "legendary"
    xpReward: number
}

export const BADGES: Record<BadgeId, Badge> = {
    // Product Badges
    first_product: {
        id: "first_product",
        name: "Primeiro Produto",
        description: "Adicione seu primeiro produto",
        icon: "🎯",
        rarity: "common",
        xpReward: 50,
    },
    product_collector_10: {
        id: "product_collector_10",
        name: "Colecionador",
        description: "Adicione 10 produtos",
        icon: "📦",
        rarity: "rare",
        xpReward: 100,
    },
    product_collector_50: {
        id: "product_collector_50",
        name: "Catálogo Completo",
        description: "Adicione 50 produtos",
        icon: "🏆",
        rarity: "epic",
        xpReward: 500,
    },

    // Content Badges
    first_post: {
        id: "first_post",
        name: "Primeira Publicação",
        description: "Publique seu primeiro post",
        icon: "📝",
        rarity: "common",
        xpReward: 50,
    },
    content_creator_10: {
        id: "content_creator_10",
        name: "Criador de Conteúdo",
        description: "Publique 10 posts",
        icon: "✍️",
        rarity: "rare",
        xpReward: 150,
    },

    // Creative Badges
    first_creative: {
        id: "first_creative",
        name: "Primeiro Criativo",
        description: "Crie seu primeiro criativo",
        icon: "🎨",
        rarity: "common",
        xpReward: 50,
    },
    creative_master_25: {
        id: "creative_master_25",
        name: "Mestre Criativo",
        description: "Crie 25 criativos",
        icon: "🎭",
        rarity: "epic",
        xpReward: 300,
    },

    // Engagement Badges
    early_adopter: {
        id: "early_adopter",
        name: "Pioneiro",
        description: "Um dos primeiros 100 usuários",
        icon: "🌟",
        rarity: "legendary",
        xpReward: 1000,
    },
    week_streak: {
        id: "week_streak",
        name: "Dedicado",
        description: "Acesse a plataforma por 7 dias seguidos",
        icon: "🔥",
        rarity: "rare",
        xpReward: 200,
    },
    month_streak: {
        id: "month_streak",
        name: "Comprometido",
        description: "Acesse a plataforma por 30 dias seguidos",
        icon: "💎",
        rarity: "legendary",
        xpReward: 1000,
    },

    // Bio Page Badges
    bio_page_created: {
        id: "bio_page_created",
        name: "Link na Bio",
        description: "Crie sua página de bio",
        icon: "🔗",
        rarity: "common",
        xpReward: 50,
    },
    social_butterfly: {
        id: "social_butterfly",
        name: "Borboleta Social",
        description: "Adicione 5 links na sua bio page",
        icon: "🦋",
        rarity: "rare",
        xpReward: 100,
    },

    // Level Badges
    level_5: {
        id: "level_5",
        name: "Nível 5",
        description: "Alcance o nível 5",
        icon: "⭐",
        rarity: "common",
        xpReward: 0,
    },
    level_10: {
        id: "level_10",
        name: "Nível 10",
        description: "Alcance o nível 10",
        icon: "⭐⭐",
        rarity: "rare",
        xpReward: 0,
    },
    level_25: {
        id: "level_25",
        name: "Nível 25",
        description: "Alcance o nível 25",
        icon: "⭐⭐⭐",
        rarity: "epic",
        xpReward: 0,
    },
    level_50: {
        id: "level_50",
        name: "Lenda",
        description: "Alcance o nível 50",
        icon: "👑",
        rarity: "legendary",
        xpReward: 0,
    },
}

export async function checkAndAwardBadges(userId: string): Promise<BadgeId[]> {
    const user = await db.user.findUnique({
        where: { id: userId },
        include: {
            products: true,
            posts: { where: { status: "published" } },
            creatives: true,
            bioPage: { include: { links: true } },
        },
    })

    if (!user) return []

    const currentBadges = user.badges as string[]
    const newBadges: BadgeId[] = []

    // Check product badges
    if (user.products.length >= 1 && !currentBadges.includes("first_product")) {
        newBadges.push("first_product")
    }
    if (user.products.length >= 10 && !currentBadges.includes("product_collector_10")) {
        newBadges.push("product_collector_10")
    }
    if (user.products.length >= 50 && !currentBadges.includes("product_collector_50")) {
        newBadges.push("product_collector_50")
    }

    // Check post badges
    if (user.posts.length >= 1 && !currentBadges.includes("first_post")) {
        newBadges.push("first_post")
    }
    if (user.posts.length >= 10 && !currentBadges.includes("content_creator_10")) {
        newBadges.push("content_creator_10")
    }

    // Check creative badges
    if (user.creatives.length >= 1 && !currentBadges.includes("first_creative")) {
        newBadges.push("first_creative")
    }
    if (user.creatives.length >= 25 && !currentBadges.includes("creative_master_25")) {
        newBadges.push("creative_master_25")
    }

    // Check bio page badges
    if (user.bioPage && !currentBadges.includes("bio_page_created")) {
        newBadges.push("bio_page_created")
    }
    if (user.bioPage && user.bioPage.links.length >= 5 && !currentBadges.includes("social_butterfly")) {
        newBadges.push("social_butterfly")
    }

    // Check level badges
    if (user.level >= 5 && !currentBadges.includes("level_5")) {
        newBadges.push("level_5")
    }
    if (user.level >= 10 && !currentBadges.includes("level_10")) {
        newBadges.push("level_10")
    }
    if (user.level >= 25 && !currentBadges.includes("level_25")) {
        newBadges.push("level_25")
    }
    if (user.level >= 50 && !currentBadges.includes("level_50")) {
        newBadges.push("level_50")
    }

    // Award new badges
    if (newBadges.length > 0) {
        const updatedBadges = [...currentBadges, ...newBadges]

        // Calculate total XP from new badges
        const xpReward = newBadges.reduce((total, badgeId) => {
            return total + BADGES[badgeId].xpReward
        }, 0)

        await db.user.update({
            where: { id: userId },
            data: {
                badges: updatedBadges,
                xp: { increment: xpReward },
            },
        })
    }

    return newBadges
}

export function getBadgesByRarity(badges: string[]) {
    const grouped: Record<string, Badge[]> = {
        legendary: [],
        epic: [],
        rare: [],
        common: [],
    }

    badges.forEach((badgeId) => {
        const badge = BADGES[badgeId as BadgeId]
        if (badge) {
            grouped[badge.rarity].push(badge)
        }
    })

    return grouped
}
