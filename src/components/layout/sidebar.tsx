"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    ShoppingCart,
    Link as LinkIcon,
    Megaphone,
    Settings,
    BarChart3,
    Globe,
    Palette,
    Share2,
} from "lucide-react"

const routes = [
    {
        label: "Visão Geral",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Produtos",
        icon: ShoppingCart,
        href: "/products",
        color: "text-violet-500",
    },
    {
        label: "Link na Bio",
        icon: LinkIcon,
        href: "/bio-builder",
        color: "text-pink-700",
    },
    {
        label: "Automação Social",
        icon: Share2,
        href: "/social",
        color: "text-emerald-500",
    },
    {
        label: "Creative Studio",
        icon: Palette,
        href: "/creatives",
        color: "text-pink-500",
    },
    {
        label: "Campanhas",
        icon: Megaphone,
        href: "/campaigns",
        color: "text-orange-700",
    },
    {
        label: "Analytics",
        icon: BarChart3,
        href: "/analytics",
        color: "text-emerald-500",
    },
    {
        label: "Configurações",
        icon: Settings,
        href: "/settings",
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full glass border-r border-white/10 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Globe className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        Affiliate<span className="text-indigo-500">AI</span>
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href
                                    ? "text-white bg-white/10"
                                    : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
