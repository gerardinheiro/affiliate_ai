"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
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
    DollarSign,
    Target,
    TrendingUp,
    Activity,
    Layout,
    Save,
    X,
    RotateCcw
} from "lucide-react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy
} from "@dnd-kit/sortable"
import { StatsData } from "@/lib/stats-service"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from "@/lib/mock-intl"
import { toast } from "sonner"
import { DashboardWidget } from "./dashboard-widget"

const DEFAULT_WIDGETS = [
    { id: "clicks", title: "Total de Cliques", visible: true },
    { id: "conversions", title: "Conversões", visible: true },
    { id: "ctr", title: "Taxa de Conversão (CTR)", visible: true },
    { id: "earnings", title: "Ganhos Estimados", visible: true },
    { id: "chart", title: "Performance de Vendas", visible: true },
    { id: "activity", title: "Atividade Recente", visible: true }
]

export function StatsDashboard() {
    const t = useTranslations("Dashboard")
    const [data, setData] = useState<StatsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [widgets, setWidgets] = useState(DEFAULT_WIDGETS)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsRes, configRes] = await Promise.all([
                    fetch("/api/stats"),
                    fetch("/api/profile/dashboard-config")
                ])

                const statsData = await statsRes.json()
                const configData = await configRes.json()

                setData(statsData)
                if (configData && Array.isArray(configData)) {
                    setWidgets(configData)
                }
            } catch (err) {
                console.error("Failed to load dashboard", err)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setWidgets((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const toggleWidget = (id: string) => {
        setWidgets(prev => prev.map(w =>
            w.id === id ? { ...w, visible: !w.visible } : w
        ))
    }

    const saveConfig = async () => {
        try {
            const res = await fetch("/api/profile/dashboard-config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(widgets)
            })
            if (res.ok) {
                toast.success("Layout do dashboard salvo!")
                setIsEditing(false)
            }
        } catch (error) {
            toast.error("Erro ao salvar layout.")
        }
    }

    const resetLayout = () => {
        setWidgets(DEFAULT_WIDGETS)
        toast.success("Layout restaurado para o padrão.")
    }

    if (isLoading) {
        return <DashboardSkeleton />
    }

    if (!data) return null


    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{t("title")}</h2>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="outline" size="sm" onClick={resetLayout} className="text-gray-400">
                                <RotateCcw className="w-4 h-4 mr-2" /> {t("restore")}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="text-gray-400">
                                <X className="w-4 h-4 mr-2" /> {t("cancel")}
                            </Button>
                            <Button size="sm" onClick={saveConfig} className="bg-indigo-600 hover:bg-indigo-700">
                                <Save className="w-4 h-4 mr-2" /> {t("saveLayout")}
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="text-gray-400 border-white/10 hover:bg-white/5">
                            <Layout className="w-4 h-4 mr-2" /> {t("personalize")}
                        </Button>
                    )}
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={widgets.map(w => w.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid gap-6">
                        {/* Summary Cards Grid */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {widgets.filter((w: { id: string, visible: boolean }) => ["clicks", "conversions", "ctr", "earnings"].includes(w.id)).map((w) => (
                                (w.visible || isEditing) && (
                                    <DashboardWidget
                                        key={w.id}
                                        id={w.id}
                                        isEditing={isEditing}
                                        onHide={() => toggleWidget(w.id)}
                                        className={!w.visible ? "opacity-40 grayscale" : ""}
                                    >
                                        {w.id === "clicks" && (
                                            <StatCard
                                                title={t("clicks")}
                                                value={data.summary.clicks.toLocaleString()}
                                                icon={Activity}
                                                trend="+12.5%"
                                                trendUp={true}
                                                description={t("vsLast30Days")}
                                            />
                                        )}
                                        {w.id === "conversions" && (
                                            <StatCard
                                                title={t("conversions")}
                                                value={data.summary.conversions.toLocaleString()}
                                                icon={Target}
                                                trend="+4.3%"
                                                trendUp={true}
                                                description={t("vsLast30Days")}
                                            />
                                        )}
                                        {w.id === "ctr" && (
                                            <StatCard
                                                title={t("ctr")}
                                                value={`${data.summary.ctr}%`}
                                                icon={TrendingUp}
                                                trend="-1.2%"
                                                trendUp={false}
                                                description={t("vsLast30Days")}
                                            />
                                        )}
                                        {w.id === "earnings" && (
                                            <StatCard
                                                title={t("earnings")}
                                                value={`R$ ${data.summary.earnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                                icon={DollarSign}
                                                trend="+24.5%"
                                                trendUp={true}
                                                description={t("vsLast30Days")}
                                            />
                                        )}
                                    </DashboardWidget>
                                )
                            ))}
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid gap-4 md:grid-cols-7">
                            {widgets.filter((w: { id: string, visible: boolean }) => ["chart", "activity"].includes(w.id)).map((w) => (
                                (w.visible || isEditing) && (
                                    <DashboardWidget
                                        key={w.id}
                                        id={w.id}
                                        isEditing={isEditing}
                                        onHide={() => toggleWidget(w.id)}
                                        className={cn(
                                            w.id === "chart" ? "md:col-span-4" : "md:col-span-3",
                                            !w.visible && "opacity-40 grayscale"
                                        )}
                                    >
                                        {w.id === "chart" && (
                                            <Card className="glass border-white/10 h-full">
                                                <CardHeader>
                                                    <CardTitle className="text-white">{t("performance")}</CardTitle>
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
                                        )}
                                        {w.id === "activity" && (
                                            <Card className="glass border-white/10 h-full">
                                                <CardHeader>
                                                    <CardTitle className="text-white flex items-center gap-2">
                                                        <Activity className="w-5 h-5 text-indigo-400" />
                                                        {t("recentActivity")}
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
                                                                    ${activity.type === 'view' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : ''}
                                                                `}>
                                                                    {activity.type === 'conversion' && <DollarSign className="w-4 h-4" />}
                                                                    {activity.type === 'click' && <Activity className="w-4 h-4" />}
                                                                    {activity.type === 'payout' && <ArrowUpRight className="w-4 h-4" />}
                                                                    {activity.type === 'view' && <Activity className="w-4 h-4" />}
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
                                                        {data.recentActivity.length === 0 && (
                                                            <div className="text-center py-8 text-gray-500">
                                                                {t("noActivity")}
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </DashboardWidget>
                                )
                            ))}
                        </div>
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

function StatCard({ title, value, icon: Icon, trend, trendUp, description }: {
    title: string,
    value: string,
    icon: any,
    trend: string,
    trendUp: boolean,
    description: string
}) {
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
