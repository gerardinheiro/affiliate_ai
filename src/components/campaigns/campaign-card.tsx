import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, PauseCircle, PlayCircle, Trash2 } from "lucide-react"

interface CampaignCardProps {
    id: string
    title: string
    platform: string
    status: "active" | "paused" | "ended"
    clicks: number
    conversions: number
    spent: string
    revenue: string
    onToggleStatus: () => void
    onDelete?: () => void
}

export function CampaignCard({
    id,
    title,
    platform,
    status,
    clicks,
    conversions,
    spent,
    revenue,
    onToggleStatus,
    onDelete,
}: CampaignCardProps) {
    const isActive = status === "active"

    return (
        <Card className="hover-lift animate-fade-in border-white/10 hover:border-indigo-500/50 transition-all duration-300 glass">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 bg-white/5 border-b border-white/5">
                <div className="space-y-2 flex-1">
                    <CardTitle className="text-base font-semibold text-white line-clamp-1">
                        {title}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="border-white/20 text-gray-300 font-medium">
                            {platform}
                        </Badge>
                        <Badge
                            className={`${isActive
                                    ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 border-0 shadow-sm text-white"
                                    : "bg-white/10 text-gray-400 border-0"
                                } font-medium`}
                        >
                            {isActive ? "● Ativo" : "○ Pausado"}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-gray-400 text-xs font-medium">Cliques</p>
                        <p className="font-bold text-lg text-white">{clicks.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-400 text-xs font-medium">Conversões</p>
                        <p className="font-bold text-lg text-indigo-400">{conversions}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-400 text-xs font-medium">Gasto</p>
                        <p className="font-semibold text-gray-200">{spent}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-400 text-xs font-medium">Receita</p>
                        <p className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                            {revenue}
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-white/10 p-4 bg-white/5">
                {onDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        onClick={onDelete}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleStatus}
                    className={`ml-auto ${isActive
                            ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border-amber-500/20"
                            : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border-emerald-500/20"
                        } transition-all font-medium bg-transparent`}
                >
                    {isActive ? (
                        <>
                            <PauseCircle className="w-4 h-4 mr-2" />
                            Pausar
                        </>
                    ) : (
                        <>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Ativar
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
