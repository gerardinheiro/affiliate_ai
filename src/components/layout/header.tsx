"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, User, LogOut, X } from "lucide-react"
import { signOut } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

type Notification = {
    id: string
    title: string
    message: string
    type: string
    read: boolean
    createdAt: string
}

export function Header() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        fetchNotifications()
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

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
        <div className="flex items-center justify-end p-4 border-b border-white/10 h-16 glass relative">
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
                        <Card className="absolute right-0 top-12 w-96 max-h-[500px] overflow-y-auto glass border-white/10 bg-black/90 backdrop-blur-xl z-50 shadow-2xl">
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

                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                    <User className="h-5 w-5 text-gray-300" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-500/10 hover:text-red-400 text-gray-300"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    title="Sair"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
