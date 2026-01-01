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
    const { data: session } = useSession()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        // Fetch notifications
        fetch("/api/notifications")
            .then(res => res.json())
            .then(data => {
                setNotifications(data)
                setUnreadCount(data.filter((n: Notification) => !n.read).length)
            })
            .catch(err => console.error("Error fetching notifications:", err))
    }, [])

    const handleMarkAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: "POST" })
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error("Error marking notification as read:", error)
        }
    }

    return (
        <header className="h-16 border-b border-gray-800 bg-[#111827] flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="md:hidden text-gray-400 hover:text-white">
                    <Menu className="w-6 h-6" />
                </button>
                {/* <h2 className="text-xl font-semibold text-white hidden md:block">Dashboard</h2> */}
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-gray-400 hover:text-white"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                    </Button>

                    {showNotifications && (
                        <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 bg-[#1f2937] border-gray-700 text-white shadow-xl">
                            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                                <h3 className="font-semibold">Notificações</h3>
                                {unreadCount > 0 && (
                                    <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 h-auto p-0">
                                        Marcar todas como lidas
                                    </Button>
                                )}
                            </div>
                            <div className="divide-y divide-gray-700">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-gray-400 text-sm">
                                        Nenhuma notificação.
                                    </div>
                                ) : (
                                    notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-white/5 transition-colors ${!notification.read ? 'bg-blue-500/10' : ''}`}
                                            onClick={() => handleMarkAsRead(notification.id)}
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="text-sm font-medium">{notification.title}</h4>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">{session?.user?.name}</p>
                        <p className="text-xs text-gray-400">{session?.user?.email}</p>
                    </div>
                    <Avatar className="w-8 h-8 border border-gray-700">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback className="bg-gray-800 text-gray-400">
                            <User className="w-4 h-4" />
                        </AvatarFallback>
                    </Avatar>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                        onClick={() => signOut()}
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
