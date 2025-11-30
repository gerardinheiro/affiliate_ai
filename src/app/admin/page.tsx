"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Package, MessageSquare, Loader2, Calendar, Clock } from "lucide-react"
import { UserEditModal } from "@/components/admin/user-edit-modal"

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
    creativesCount: number
}

export default function AdminDashboard() {
    const { data: session } = useSession() || { data: null }
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [users, setUsers] = useState<UserData[]>([])
    const [editingUser, setEditingUser] = useState<UserData | null>(null)
    const [accessCount, setAccessCount] = useState(0)
    const [editingAccessCount, setEditingAccessCount] = useState(false)
    const [newAccessCount, setNewAccessCount] = useState("0")

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [statsRes, usersRes, accessRes] = await Promise.all([
                fetch("/api/admin/stats"),
                fetch("/api/admin/users"),
                fetch("/api/page-views?page=/")
            ])

            if (statsRes.ok) {
                const data = await statsRes.json()
                setStats(data)
            }

            if (usersRes.ok) {
                const data = await usersRes.json()
                setUsers(data)
            }

            if (accessRes.ok) {
                const data = await accessRes.json()
                setAccessCount(data.count)
                setNewAccessCount(data.count.toString())
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

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Contador de Acessos</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {editingAccessCount ? (
                                <div className="space-y-2">
                                    <Input
                                        type="number"
                                        value={newAccessCount}
                                        onChange={(e) => setNewAccessCount(e.target.value)}
                                        className="text-2xl font-bold h-12"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch("/api/admin/access-count", {
                                                        method: "PATCH",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ count: parseInt(newAccessCount) })
                                                    })
                                                    if (res.ok) {
                                                        setAccessCount(parseInt(newAccessCount))
                                                        setEditingAccessCount(false)
                                                        alert("Contador atualizado!")
                                                    }
                                                } catch (error) {
                                                    alert("Erro ao atualizar contador")
                                                }
                                            }}
                                        >
                                            Salvar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setNewAccessCount(accessCount.toString())
                                                setEditingAccessCount(false)
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="cursor-pointer"
                                    onClick={() => setEditingAccessCount(true)}
                                >
                                    <div className="text-2xl font-bold">{accessCount.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Clique para editar
                                    </p>
                                </div>
                            )}
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
                                    className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-200 cursor-pointer"
                                    onClick={() => setEditingUser(user)}
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <Avatar className="h-12 w-12 ring-2 ring-white/10">
                                            <AvatarImage src={user.image || undefined} />
                                            <AvatarFallback className="bg-indigo-500/20 text-indigo-400">
                                                {user.name?.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-white">{user.name || "Sem nome"}</h4>
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
                                            <p className="text-sm text-gray-400">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-6 gap-4 text-center">
                                        <div className="px-3 py-2 rounded-lg bg-indigo-500/10">
                                            <p className="text-xs text-gray-400">Nível</p>
                                            <p className="font-semibold text-indigo-400">{user.level}</p>
                                        </div>
                                        <div className="px-3 py-2 rounded-lg bg-purple-500/10">
                                            <p className="text-xs text-gray-400">Produtos</p>
                                            <p className="font-semibold text-purple-400">{user.productsCount}</p>
                                        </div>
                                        <div className="px-3 py-2 rounded-lg bg-pink-500/10">
                                            <p className="text-xs text-gray-400">Posts</p>
                                            <p className="font-semibold text-pink-400">{user.postsCount}</p>
                                        </div>
                                        <div className="px-3 py-2 rounded-lg bg-green-500/10">
                                            <p className="text-xs text-gray-400">Uploads</p>
                                            <p className="font-semibold text-green-400">{user.creativesCount}</p>
                                        </div>
                                        <div className="px-3 py-2 rounded-lg bg-blue-500/10">
                                            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Cadastro
                                            </p>
                                            <p className="font-semibold text-blue-400">{user.daysSinceRegistration}d</p>
                                        </div>
                                        <div className="px-3 py-2 rounded-lg bg-orange-500/10">
                                            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Offline
                                            </p>
                                            <p className="font-semibold text-orange-400">{user.daysOffline}d</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Edit User Modal */}
                {editingUser && (
                    <UserEditModal
                        user={editingUser}
                        open={!!editingUser}
                        onClose={() => setEditingUser(null)}
                        onSuccess={fetchData}
                    />
                )}
            </div>
        </DashboardLayout>
    )
}
