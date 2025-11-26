import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Sparkles, Copy } from "lucide-react"

interface ProductCardProps {
    title: string
    price: string
    commission: string
    platform: string
    imageUrl?: string
    onGenerateCopy: () => void
    onViewLink: () => void
}

export function ProductCard({
    title,
    price,
    commission,
    platform,
    imageUrl,
    onGenerateCopy,
    onViewLink,
}: ProductCardProps) {
    return (
        <Card className="overflow-hidden flex flex-col justify-between">
            <div className="aspect-video w-full bg-gray-100 relative flex items-center justify-center">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
                ) : (
                    <div className="text-muted-foreground text-sm">Sem Imagem</div>
                )}
                <Badge className="absolute top-2 right-2 bg-black/70 hover:bg-black/80">
                    {platform}
                </Badge>
            </div>
            <CardHeader className="p-4">
                <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
                <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-lg">{price}</span>
                    <span className="text-sm text-emerald-600 font-medium">
                        Comissão: {commission}
                    </span>
                </div>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={onViewLink}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Link
                </Button>
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={onGenerateCopy}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar Copy
                </Button>
            </CardFooter>
        </Card>
    )
}
