export type BioLink = {
    id: string
    title: string
    url: string
    icon: string
    order: number
    clicks: number
}

export type BioPage = {
    id: string
    userId: string
    username: string
    displayName: string
    bio: string
    theme: string
    avatarUrl: string
    views: number
    links: BioLink[]
    createdAt: Date
    updatedAt: Date
}
