"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Eye, MousePointerClick, TrendingUp } from "lucide-react"

import { BioPage, BioLink } from "@/types/bio"

export function BioAnalytics({ bioPage }: { bioPage: BioPage }) {
    const totalClicks = bioPage.links.reduce((acc, link) => acc + link.clicks, 0)
    const ctr = bioPage.views > 0 ? ((totalClicks / bioPage.views) * 100).toFixed(1) : "0.0"

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Visualizações Totais</CardTitle>
                        <Eye className="w-4 h-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{bioPage.views}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Cliques Totais</CardTitle>
                        <MousePointerClick className="w-4 h-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{totalClicks}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">CTR (Taxa de Clique)</CardTitle>
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{ctr}%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Link Performance */}
            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Desempenho dos Links</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {bioPage.links.map((link) => (
                            <div key={link.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex-1 min-w-0 mr-4">
                                    <h4 className="font-medium text-white truncate">{link.title}</h4>
                                    <p className="text-sm text-gray-400 truncate">{link.url}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-white">{link.clicks} cliques</div>
                                        <div className="text-xs text-gray-500">
                                            {bioPage.views > 0 ? ((link.clicks / bioPage.views) * 100).toFixed(1) : "0.0"}% CTR
                                        </div>
                                    </div>
                                    {/* Simple Bar Visualization */}
                                    <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500"
                                            style={{ width: `${bioPage.views > 0 ? Math.min((link.clicks / bioPage.views) * 100, 100) : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {bioPage.links.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                Nenhum link para mostrar dados.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
