"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, User, LogOut, X, Share2, Eye, EyeOff, UserCircle, Menu } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

type Notification = {
    id: string
    title: string
    message: string
    type: string
    read: boolean
    createdAt: string
}

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
    const { data: session } = useSession() || { data: null }
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [xpData, setXpData] = useState<any>(null)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showValues, setShowValues] = useState(true)

    useEffect(() => {
        fetchNotifications()
        fetchGamification()

        const interval = setInterval(() => {
            fetchNotifications()
            fetchGamification()
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    const fetchGamification = async () => {
        try {
            const res = await fetch("/api/gamification")
            if (res.ok) {
                const data = await res.json()
                setXpData(data)
            }
        } catch (error) {
            console.error("Error fetching gamification:", error)
        }
    }

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications")
            if (res.ok) {
                const data = await res.json()
                setNotifications(data)
                setUnreadCount(data.filter((n: Notification) => !n.read).length)
            }
        } catch (error) {
            console.error("Error fetching notifications:", error)
        }
    }

    const handleMarkAsRead = async (id: string) => {
        try {
            const res = await fetch(`/api/notifications?id=${id}`, { method: "PATCH" })
            if (res.ok) {
                fetchNotifications()
            }
        } catch (error) {
            console.error("Error marking notification as read:", error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/notifications?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                fetchNotifications()
            }
        } catch (error) {
            console.error("Error deleting notification:", error)
        }
    }

    const getNotificationIcon = (type: string) => {
        const icons: Record<string, string> = {
            sale: "💰",
            product: "📦",
            post: "📱",
            error: "⚠️",
            info: "ℹ️",
        }
        return icons[type] || "🔔"
    }

    return (
        <div className="flex items-center justify-between p-4 border-b border-white/10 h-16 glass relative">
            {/* Mobile Menu Button */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-white/10"
                onClick={() => onMenuClick?.()}
            >
                <Menu className="h-6 w-6 text-gray-300" />
            </Button>

            <div className="flex items-center gap-x-4">
                {/* Notifications Bell */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-white/10 relative"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell className="h-5 w-5 text-gray-300" />
                        {unreadCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                                {unreadCount}
                            </Badge>
                        )}
                    </Button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <Card className="absolute right-0 top-12 w-[90vw] sm:w-96 max-h-[500px] overflow-y-auto glass border-white/10 bg-black/90 backdrop-blur-xl z-[9999] shadow-2xl">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h3 className="font-semibold text-white">Notificações</h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowNotifications(false)}
                                    className="hover:bg-white/10"
                                >
                                    <X className="h-4 w-4 text-gray-400" />
                                </Button>
                            </div>

                            <div className="divide-y divide-white/10">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        Nenhuma notificação
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-white/5 transition-colors ${!notification.read ? "bg-indigo-500/10" : ""
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                                                        {!notification.read && (
                                                            <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(notification.createdAt).toLocaleString("pt-BR")}
                                                        </span>
                                                        {!notification.read && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleMarkAsRead(notification.id)}
                                                                className="text-xs h-6 px-2 text-indigo-400 hover:text-indigo-300"
                                                            >
                                                                Marcar como lida
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(notification.id)}
                                                            className="text-xs h-6 px-2 text-red-400 hover:text-red-300"
                                                        >
                                                            Excluir
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* User Menu with Gamification */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-white/10 relative p-0"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={session?.user?.image || undefined} />
                            <AvatarFallback className="bg-indigo-500/20 text-indigo-400">
                                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        {xpData && (
                            <Badge className="absolute -bottom-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-indigo-500 text-white text-[10px]">
                                {xpData.level}
                            </Badge>
                        )}
                    </Button>

                    {showUserMenu && xpData && (
                        <Card className="absolute right-0 top-12 w-[90vw] sm:w-80 glass border-white/10 bg-black/90 backdrop-blur-xl z-[9999] shadow-2xl p-4 space-y-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                                <div className="relative h-12 w-12 rounded-full border-2 border-indigo-500/50">
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src={session?.user?.image || undefined} />
                                        <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-lg font-bold">
                                            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Badge className="absolute -bottom-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-indigo-500 text-white text-xs">
                                        {xpData.level}
                                    </Badge>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-sm">{session?.user?.name || "Usuário"}</h3>
                                    <p className="text-xs text-indigo-400">Nível {xpData.level}</p>
                                    {showValues && <p className="text-xs text-gray-400">{xpData.xp} XP Total</p>}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-white/10"
                                    onClick={() => setShowValues(!showValues)}
                                >
                                    {showValues ? <Eye className="h-4 w-4 text-gray-400" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Progresso para Nível {xpData.level + 1}</span>
                                    {showValues && <span>{Math.round(xpData.progress)}%</span>}
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                        style={{ width: `${xpData.progress}%` }}
                                    />
                                </div>
                                {showValues && (
                                    <p className="text-xs text-center text-gray-500 mt-1">
                                        Faltam {Math.round(xpData.nextLevelXp - xpData.xp)} XP para o próximo nível
                                    </p>
                                )}
                            </div>

                            <Button
                                variant="outline"
                                className="w-full justify-center gap-2 bg-indigo-500/10 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300"
                                onClick={() => {
                                    const text = `🎮 Alcancei o Nível ${xpData.level} com ${xpData.xp} XP no AffiliateAI! 🚀`
                                    if (navigator.share) {
                                        navigator.share({ text })
                                    } else {
                                        navigator.clipboard.writeText(text)
                                        alert("Conquista copiada!")
                                    }
                                }}
                            >
                                <Share2 className="h-4 w-4" />
                                Compartilhar Conquista
                            </Button>

                            <div className="pt-2 border-t border-white/10 space-y-2">
                                <Link href="/profile">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <UserCircle className="h-4 w-4 mr-2" />
                                        Ver Perfil
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sair da conta
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
