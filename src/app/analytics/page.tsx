"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import {
    TrendingUp,
    TrendingDown,
    Eye,
    MousePointerClick,
    Package,
    FileText,
    Palette,
    Link as LinkIcon,
    Activity,
    Loader2,
} from "lucide-react"

interface AnalyticsData {
    overview: {
        totalProducts: number
        totalPosts: number
        totalCreatives: number
        totalCreativeViews: number
        totalCreativeDownloads: number
        totalBioViews: number
        totalBioClicks: number
        totalEvents: number
        growth: number
        xp: number
        level: number
    }
    dailyData: Array<{
        date: string
        events: number
        productViews: number
        linkClicks: number
        creativeViews: number
    }>
    eventsByType: Record<string, number>
    period: {
        days: number
        startDate: string
        endDate: string
    }
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"]

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [period, setPeriod] = useState("30")

    const fetchAnalytics = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/analytics?days=${period}`)
            const json = await res.json()
            setData(json)
        } catch (error) {
            console.error("Failed to load analytics", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, [period])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-400">Erro ao carregar analytics</p>
            </div>
        )
    }

    const { overview, dailyData, eventsByType } = data

    // Prepare pie chart data
    const pieData = Object.entries(eventsByType).map(([name, value]) => ({
        name: name.replace(/_/g, " "),
        value,
    }))

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Analytics</h1>
                    <p className="text-gray-400 mt-1">
                        Acompanhe o desempenho da sua conta
                    </p>
                </div>
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[180px] bg-gray-900 border-white/10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">Últimos 7 dias</SelectItem>
                        <SelectItem value="30">Últimos 30 dias</SelectItem>
                        <SelectItem value="90">Últimos 90 dias</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total de Eventos"
                    value={overview.totalEvents}
                    icon={Activity}
                    growth={overview.growth}
                    color="text-indigo-500"
                />
                <MetricCard
                    title="Produtos"
                    value={overview.totalProducts}
                    icon={Package}
                    color="text-violet-500"
                />
                <MetricCard
                    title="Posts Publicados"
                    value={overview.totalPosts}
                    icon={FileText}
                    color="text-emerald-500"
                />
                <MetricCard
                    title="Criativos"
                    value={overview.totalCreatives}
                    icon={Palette}
                    color="text-pink-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Visualizações de Criativos"
                    value={overview.totalCreativeViews}
                    icon={Eye}
                    color="text-blue-500"
                />
                <MetricCard
                    title="Downloads de Criativos"
                    value={overview.totalCreativeDownloads}
                    icon={MousePointerClick}
                    color="text-cyan-500"
                />
                <MetricCard
                    title="Visualizações da Bio"
                    value={overview.totalBioViews}
                    icon={Eye}
                    color="text-purple-500"
                />
                <MetricCard
                    title="Cliques em Links"
                    value={overview.totalBioClicks}
                    icon={LinkIcon}
                    color="text-orange-500"
                />
            </div>

            {/* Charts */}
            <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="bg-gray-900 border border-white/10">
                    <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
                    <TabsTrigger value="comparison">Comparação</TabsTrigger>
                    <TabsTrigger value="distribution">Distribuição</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="space-y-4">
                    <Card className="bg-gray-900 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Atividade ao Longo do Tempo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#9ca3af"
                                        tick={{ fill: "#9ca3af" }}
                                    />
                                    <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1f2937",
                                            border: "1px solid #374151",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="events"
                                        stroke="#6366f1"
                                        strokeWidth={2}
                                        name="Total de Eventos"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="productViews"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        name="Visualizações de Produtos"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="linkClicks"
                                        stroke="#ec4899"
                                        strokeWidth={2}
                                        name="Cliques em Links"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="creativeViews"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        name="Visualizações de Criativos"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="comparison" className="space-y-4">
                    <Card className="bg-gray-900 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Comparação de Métricas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#9ca3af"
                                        tick={{ fill: "#9ca3af" }}
                                    />
                                    <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1f2937",
                                            border: "1px solid #374151",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="productViews" fill="#8b5cf6" name="Produtos" />
                                    <Bar dataKey="linkClicks" fill="#ec4899" name="Links" />
                                    <Bar dataKey="creativeViews" fill="#10b981" name="Criativos" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="distribution" className="space-y-4">
                    <Card className="bg-gray-900 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Distribuição de Eventos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                                        }
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1f2937",
                                            border: "1px solid #374151",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function MetricCard({
    title,
    value,
    icon: Icon,
    growth,
    color,
}: {
    title: string
    value: number
    icon: React.ElementType
    growth?: number
    color: string
}) {
    return (
        <Card className="bg-gray-900 border-white/10">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm text-gray-400">{title}</p>
                        <p className="text-2xl font-bold text-white">
                            {value.toLocaleString()}
                        </p>
                        {growth !== undefined && (
                            <div className="flex items-center gap-1 text-sm">
                                {growth >= 0 ? (
                                    <>
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                        <span className="text-green-500">+{growth}%</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                        <span className="text-red-500">{growth}%</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <Icon className={`w-8 h-8 ${color}`} />
                </div>
            </CardContent>
        </Card>
    )
}
