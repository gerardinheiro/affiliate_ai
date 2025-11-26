"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts"
import { ArrowUpRight, DollarSign, MousePointer, ShoppingBag, Loader2 } from "lucide-react"

type Analytics = {
    totalRevenue: number
    totalClicks: number
    totalConversions: number
    roi: number
    channelData: { name: string; value: number }[]
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const res = await fetch("/api/analytics")
            if (res.ok) {
                const data = await res.json()
                setAnalytics(data)
            }
        } catch (error) {
            console.error("Error fetching analytics:", error)
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

    if (!analytics) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <p className="text-muted-foreground">Erro ao carregar analytics</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-muted-foreground mt-2">
                        Visão detalhada do desempenho do seu negócio.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R$ {analytics.totalRevenue.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {analytics.totalRevenue > 0 ? "Baseado nas suas campanhas" : "Crie campanhas para ver dados"}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cliques</CardTitle>
                            <MousePointer className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{analytics.totalClicks}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total de cliques nas campanhas
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.totalConversions}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total de vendas realizadas
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.roi.toFixed(0)}%</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                {analytics.roi > 0 && <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />}
                                Retorno sobre investimento
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Receita nos últimos 6 meses</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                                Gráfico de Receita (Em Breve)
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Canais de Aquisição</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {analytics.channelData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={analytics.channelData}>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                                    Nenhum dado disponível
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
