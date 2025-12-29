"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"
import {
    ArrowUpRight,
    ArrowDownRight,
    MousePointerClick,
    DollarSign,
    Target,
    TrendingUp,
    Activity
} from "lucide-react"
import { StatsData } from "@/lib/stats-service"
import { Skeleton } from "@/components/ui/skeleton"

export function StatsDashboard() {
    const [data, setData] = useState<StatsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch("/api/stats")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.error("Failed to load stats", err))
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return <DashboardSkeleton />
    }

    if (!data) return null

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total de Cliques"
                    value={data.summary.clicks.toLocaleString()}
                    icon={MousePointerClick}
                    trend="+12.5%"
                    trendUp={true}
                    description="vs. últimos 30 dias"
                />
                <StatCard
                    title="Conversões"
                    value={data.summary.conversions.toLocaleString()}
                    icon={Target}
                    trend="+4.3%"
                    trendUp={true}
                    description="vs. últimos 30 dias"
                />
                <StatCard
                    title="Taxa de Conversão (CTR)"
                    value={`${data.summary.ctr}%`}
                    icon={TrendingUp}
                    trend="-1.2%"
                    trendUp={false}
                    description="vs. últimos 30 dias"
                />
                <StatCard
                    title="Ganhos Estimados"
                    value={`R$ ${data.summary.earnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    icon={DollarSign}
                    trend="+24.5%"
                    trendUp={true}
                    description="vs. últimos 30 dias"
                />
            </div>

            {/* Main Chart */}
            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4 glass border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Performance de Vendas</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.chartData}>
                                    <defs>
                                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `R$${value}`}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Ganhos']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="earnings"
                                        stroke="#818cf8"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorEarnings)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="col-span-3 glass border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-400" />
                            Atividade Recente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {data.recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center">
                                    <div className={`
                                        w-9 h-9 rounded-full flex items-center justify-center border
                                        ${activity.type === 'conversion' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}
                                        ${activity.type === 'click' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : ''}
                                        ${activity.type === 'payout' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : ''}
                                    `}>
                                        {activity.type === 'conversion' && <DollarSign className="w-4 h-4" />}
                                        {activity.type === 'click' && <MousePointerClick className="w-4 h-4" />}
                                        {activity.type === 'payout' && <ArrowUpRight className="w-4 h-4" />}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none text-white">{activity.description}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(activity.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            {' • '}
                                            {new Date(activity.date).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    {activity.amount && (
                                        <div className={`ml-auto font-medium ${activity.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                                            {activity.amount > 0 ? '+' : ''}R$ {Math.abs(activity.amount).toFixed(2)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon: Icon, trend, trendUp, description }: any) {
    return (
        <Card className="glass border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value}</div>
                <p className="text-xs text-gray-400 mt-1 flex items-center">
                    <span className={trendUp ? "text-emerald-400 flex items-center" : "text-red-400 flex items-center"}>
                        {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {trend}
                    </span>
                    <span className="ml-1 opacity-70">{description}</span>
                </p>
            </CardContent>
        </Card>
    )
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="glass border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px] bg-white/10" />
                            <Skeleton className="h-4 w-4 bg-white/10" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[60px] bg-white/10 mb-2" />
                            <Skeleton className="h-3 w-[120px] bg-white/10" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4 glass border-white/10 h-[370px]">
                    <CardHeader>
                        <Skeleton className="h-6 w-[200px] bg-white/10" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full bg-white/10" />
                    </CardContent>
                </Card>
                <Card className="col-span-3 glass border-white/10 h-[370px]">
                    <CardHeader>
                        <Skeleton className="h-6 w-[150px] bg-white/10" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center">
                                <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
                                <div className="ml-4 space-y-2">
                                    <Skeleton className="h-4 w-[150px] bg-white/10" />
                                    <Skeleton className="h-3 w-[100px] bg-white/10" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
