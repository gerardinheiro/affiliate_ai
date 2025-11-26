import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface IntegrationCardProps {
    name: string
    description: string
    icon: React.ElementType
    isConnected: boolean
    onConnect: () => void
    onConfigure: () => void
    signupUrl?: string
    color?: string
}

export function IntegrationCard({
    name,
    description,
    icon: Icon,
    isConnected,
    onConnect,
    onConfigure,
    signupUrl,
    color = "text-gray-500",
}: IntegrationCardProps) {
    return (
        <Card className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
                        <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                    <CardTitle className="text-lg font-semibold">{name}</CardTitle>
                </div>
                {isConnected && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Conectado
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="mt-2">
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-0">
                {isConnected ? (
                    <Button variant="outline" className="w-full" onClick={onConfigure}>
                        Configurar
                    </Button>
                ) : (
                    <Button className="w-full" onClick={onConnect}>
                        Conectar
                    </Button>
                )}
                {signupUrl && !isConnected && (
                    <a
                        href={signupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary flex items-center justify-center gap-1 w-full text-center py-1"
                    >
                        Não tem conta? Cadastre-se <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </CardFooter>
        </Card>
    )
}
