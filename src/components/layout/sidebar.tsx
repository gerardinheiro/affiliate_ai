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
import { Logo3D } from "@/components/ui/logo-3d"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations } from "next-intl"

const getRoutes = (t: any) => [
    {
        label: t("overview"),
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: t("products"),
        icon: ShoppingCart,
        href: "/products",
        color: "text-violet-500",
    },
    {
        label: t("bioLink"),
        icon: LinkIcon,
        href: "/bio-builder",
        color: "text-pink-700",
    },
    {
        label: t("social"),
        icon: Share2,
        href: "/social",
        color: "text-emerald-500",
    },
    {
        label: t("creativeStudio"),
        icon: Palette,
        href: "/creatives",
        color: "text-pink-500",
    },
    {
        label: t("aiStudio"),
        icon: FileText,
        href: "/ai-studio",
        color: "text-purple-500",
    },
    {
        label: t("campaigns"),
        icon: Megaphone,
        href: "/campaigns",
        color: "text-orange-700",
    },
    {
        label: t("analytics"),
        icon: BarChart3,
        href: "/analytics",
        color: "text-emerald-500",
    },
    {
        label: t("achievements"),
        icon: Trophy,
        href: "/achievements",
        color: "text-yellow-500",
    },
    {
        label: t("integrations"),
        icon: Globe,
        href: "/integrations",
        color: "text-blue-500",
    },
    {
        label: t("gallery"),
        icon: Cloud,
        href: "/nitroflare-gallery",
        color: "text-cyan-500",
    },
    {
        label: t("settings"),
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
    const t = useTranslations("Sidebar")
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
                        <Logo3D className="w-10 h-10 mr-3" />
                        <h1 className="text-2xl font-bold">
                            Affiliate<span className="text-yellow-500">AI</span>
                        </h1>
                    </Link>
                    <div className="space-y-1">
                        {getRoutes(t).map((route) => (
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
                                    {t("admin")}
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-3 mt-auto mb-4 space-y-4">
                    <div className="flex justify-center">
                        <LanguageSwitcher />
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <LevelProgress xp={userXp} />
                    </div>
                </div>
            </div>
        </>
    )
}
