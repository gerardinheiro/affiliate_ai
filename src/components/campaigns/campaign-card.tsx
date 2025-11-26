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
        <Card className="hover-lift animate-fade-in border-gray-200 hover:border-indigo-300 transition-all duration-300">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 bg-gradient-to-br from-gray-50 to-white">
                <div className="space-y-2 flex-1">
                    <CardTitle className="text-base font-semibold text-gray-900 line-clamp-1">
                        {title}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="border-gray-300 text-gray-700 font-medium">
                            {platform}
                        </Badge>
                        <Badge
                            className={`${isActive
                                    ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 border-0 shadow-sm"
                                    : "bg-gray-200 text-gray-700 border-0"
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
                        <p className="text-gray-500 text-xs font-medium">Cliques</p>
                        <p className="font-bold text-lg text-gray-900">{clicks.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-500 text-xs font-medium">Conversões</p>
                        <p className="font-bold text-lg text-indigo-600">{conversions}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-500 text-xs font-medium">Gasto</p>
                        <p className="font-semibold text-gray-700">{spent}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-500 text-xs font-medium">Receita</p>
                        <p className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            {revenue}
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-100 p-4 bg-gray-50/50">
                {onDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
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
                            ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200"
                            : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                        } transition-all font-medium`}
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
