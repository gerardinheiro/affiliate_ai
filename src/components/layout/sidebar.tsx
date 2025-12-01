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
    Shield,
    Cloud,
    FileText,
    Trophy,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { LevelProgress } from "@/components/gamification/level-progress"

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
        label: "AI Studio",
        icon: FileText,
        href: "/ai-studio",
        color: "text-purple-500",
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
        label: "Conquistas",
        icon: Trophy,
        href: "/achievements",
        color: "text-yellow-500",
    },
    {
        label: "Integrações",
        icon: Globe,
        href: "/integrations",
        color: "text-blue-500",
    },
    {
        label: "Galeria",
        icon: Cloud,
        href: "/nitroflare-gallery",
        color: "text-cyan-500",
    },
    {
        label: "Configurações",
        icon: Settings,
        href: "/settings",
        color: "text-gray-500",
    },
]

const adminRoute = {
    label: "Admin",
    icon: Shield,
    href: "/admin",
    color: "text-red-500",
}

export function Sidebar({ showMobile = false, onClose }: { showMobile?: boolean, onClose?: () => void }) {
    const { data: session } = useSession() || { data: null }
    const [isAdmin, setIsAdmin] = useState(false)
    const [userXp, setUserXp] = useState(0)
    const pathname = usePathname()

    useEffect(() => {
        const checkAdminAndXp = async () => {
            try {
                const res = await fetch("/api/profile")
                if (res.ok) {
                    const user = await res.json()
                    setIsAdmin(user.role === "ADMIN")
                    setUserXp(user.xp || 0)
                }
            } catch (error) {
                console.error("Error checking admin or fetching XP:", error)
            }
        }
        checkAdminAndXp()
    }, [])

    return (
        <>
            {/* Mobile Overlay */}
            {showMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "space-y-4 py-4 flex flex-col h-full glass border-r border-white/10 text-white overflow-y-auto",
                "fixed inset-y-0 left-0 z-[50] w-72 transform transition-transform duration-300 ease-in-out",
                showMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
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
                                onClick={() => onClose?.()}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                    {route.label}
                                </div>
                            </Link>
                        ))}

                        {isAdmin && (
                            <Link
                                key={adminRoute.href}
                                href={adminRoute.href}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                    pathname === adminRoute.href ? "text-white bg-white/10" : "text-zinc-400"
                                )}
                                onClick={() => onClose?.()}
                            >
                                <div className="flex items-center flex-1">
                                    <adminRoute.icon className={cn("h-5 w-5 mr-3", adminRoute.color)} />
                                    {adminRoute.label}
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Gamification Widget */}
                <div className="px-3 mt-auto mb-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <LevelProgress xp={userXp} />
                    </div>
                </div>
            </div>
        </>
    )
}
