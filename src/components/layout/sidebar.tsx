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
    const pathname = usePathname()
    const { data: session } = useSession()
    const [mounted, setMounted] = useState(false)
    const t = useTranslations("Sidebar")
    const routes = getRoutes(t)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <>
            {/* Mobile Overlay */}
            {showMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-[#111827] text-white transition-transform duration-300 ease-in-out md:translate-x-0",
                showMobile ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center pl-2 mb-14">
                            <div className="relative w-8 h-8 mr-4">
                                <Logo3D />
                            </div>
                            <h1 className="text-2xl font-bold">
                                Affiliate<span className="text-blue-500">AI</span>
                            </h1>
                        </Link>
                        {/* Mobile Close Button */}
                        {showMobile && (
                            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                onClick={onClose}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                    pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                    {route.label}
                                </div>
                            </Link>
                        ))}

                        {session?.user?.email === "admin@affiliateai.com" && (
                            <Link
                                href={adminRoute.href}
                                onClick={onClose}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                    pathname === adminRoute.href ? "text-white bg-white/10" : "text-zinc-400"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <adminRoute.icon className={cn("h-5 w-5 mr-3", adminRoute.color)} />
                                    {adminRoute.label}
                                </div>
                            </Link>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-800 space-y-4">
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </>
    )
}
