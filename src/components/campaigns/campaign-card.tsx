import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, PauseCircle, PlayCircle, Trash2 } from "lucide-react"

interface CampaignCardProps {
    title: string
    platform: string
    status: "active" | "paused" | "ended"
    clicks: number
    conversions: number
    spent: string
    revenue: string
    onToggleStatus: () => void
}

export function CampaignCard({
    title,
    platform,
    status,
    clicks,
    conversions,
    spent,
    revenue,
    onToggleStatus,
}: CampaignCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">{title}</CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{platform}</Badge>
                        <Badge
                            variant={status === "active" ? "default" : "secondary"}
                            className={status === "active" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                        >
                            {status === "active" ? "Ativo" : "Pausado"}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Cliques</p>
                        <p className="font-medium">{clicks}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Conversões</p>
                        <p className="font-medium">{conversions}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Gasto</p>
                        <p className="font-medium">{spent}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Receita</p>
                        <p className="font-medium text-emerald-600">{revenue}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4 bg-muted/20">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleStatus}
                    className={status === "active" ? "text-yellow-600 hover:text-yellow-700" : "text-emerald-600 hover:text-emerald-700"}
                >
                    {status === "active" ? (
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
