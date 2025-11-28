"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Package, MessageSquare, Loader2, Calendar, Clock } from "lucide-react"

type AdminStats = {
    totalUsers: number
    freeUsers: number
    paidUsers: number
    totalProducts: number
    totalPosts: number
}

type UserData = {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: string
    subscription: string
    createdAt: string
    lastLoginAt: string | null
    xp: number
    level: number
    daysSinceRegistration: number
    daysOffline: number
    productsCount: number
    postsCount: number
}

export default function AdminDashboard() {
    const { data: session } = useSession() || { data: null }
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [users, setUsers] = useState<UserData[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                fetch("/api/admin/stats"),
                fetch("/api/admin/users"),
            ])

            if (statsRes.status === 403 || usersRes.status === 403) {
                router.push("/")
                return
            }

            if (statsRes.ok && usersRes.ok) {
                const statsData = await statsRes.json()
                const usersData = await usersRes.json()
                setStats(statsData)
                setUsers(usersData)
            }
        } catch (error) {
            console.error("Error fetching admin data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            </DashboardLayout>
        )
    }

    if (!stats) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <p className="text-muted-foreground">Erro ao carregar dados</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Painel de Administração</h2>
                    <p className="text-muted-foreground mt-2">
                        Visão geral de todos os usuários e estatísticas da plataforma.
                    </p>
                </div>

                {/* Global Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.freeUsers} free · {stats.paidUsers} pagos
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Usuários Pagos</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.paidUsers}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {((stats.paidUsers / stats.totalUsers) * 100).toFixed(1)}% do total
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalProducts}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Média de {(stats.totalProducts / stats.totalUsers).toFixed(1)} por usuário
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Posts</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalPosts}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Média de {(stats.totalPosts / stats.totalUsers).toFixed(1)} por usuário
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Todos os Usuários</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user.image || undefined} />
                                            <AvatarFallback className="bg-indigo-500/20 text-indigo-400">
                                                {user.name?.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold">{user.name || "Sem nome"}</h4>
                                                {user.role === "ADMIN" && (
                                                    <Badge variant="destructive" className="text-xs">ADMIN</Badge>
                                                )}
                                                <Badge
                                                    variant={user.subscription === "PAID" ? "default" : "secondary"}
                                                    className="text-xs"
                                                >
                                                    {user.subscription}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-5 gap-4 text-center">
                                        <div>
                                            <p className="text-xs text-gray-500">Nível</p>
                                            <p className="font-semibold">{user.level}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Produtos</p>
                                            <p className="font-semibold">{user.productsCount}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Posts</p>
                                            <p className="font-semibold">{user.postsCount}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Cadastro
                                            </p>
                                            <p className="font-semibold">{user.daysSinceRegistration}d</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Offline
                                            </p>
                                            <p className="font-semibold text-orange-600">{user.daysOffline}d</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
