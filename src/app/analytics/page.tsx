"use client"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts"
import { ArrowUpRight, ArrowDownRight, DollarSign, MousePointer, ShoppingBag } from "lucide-react"

// Mock Data
const revenueData = [
    { name: "Jan", total: 1500 },
    { name: "Fev", total: 2300 },
    { name: "Mar", total: 3200 },
    { name: "Abr", total: 2800 },
    { name: "Mai", total: 4500 },
    { name: "Jun", total: 5200 },
]

const channelData = [
    { name: "Google Ads", value: 45 },
    { name: "Instagram", value: 30 },
    { name: "TikTok", value: 15 },
    { name: "Pinterest", value: 10 },
]

export default function AnalyticsPage() {
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
                            <div className="text-2xl font-bold">R$ 19.500,00</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                                +20.1% em relação ao mês passado
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cliques</CardTitle>
                            <MousePointer className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12.234</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                                +15% em relação ao mês passado
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">573</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                                -4% em relação ao mês passado
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">340%</div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                                +12% em relação ao mês passado
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
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={revenueData}>
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
                                        tickFormatter={(value) => `R$${value}`}
                                    />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Canais de Aquisição</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={channelData}>
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
                                    <Bar dataKey="value" fill="#adfa1d" radius={[4, 4, 0, 0]} className="fill-primary" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
