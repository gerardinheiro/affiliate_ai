"use client"

import { ExternalLink } from "lucide-react"
import { THEMES } from "@/lib/themes"

type BioLink = {
    id: string
    title: string
    url: string
    icon: string
    order: number
}

type ThemeKey = keyof typeof THEMES

interface BioLinkItemProps {
    link: BioLink
    bioPageId: string
    theme: ThemeKey
}

export function BioLinkItem({ link, bioPageId, theme }: BioLinkItemProps) {
    const themeStyles = THEMES[theme] || THEMES.default

    const handleClick = () => {
        fetch("/api/bio/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "click", bioPageId, linkId: link.id })
        }).catch(err => console.error("Failed to track click", err))
    }

    return (
        <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className={`block w-full p-4 rounded-xl transition-all transform hover:scale-[1.02] border ${themeStyles.card}`}
        >
            <div className="flex items-center justify-center relative">
                <span className="font-medium">{link.title}</span>
                <ExternalLink className={`w-4 h-4 absolute right-0 opacity-50 ${themeStyles.text}`} />
            </div>
        </a>
    )
}
