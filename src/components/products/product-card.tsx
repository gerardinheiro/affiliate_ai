import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Sparkles, Trash2 } from "lucide-react"

interface ProductCardProps {
    id: string
    title: string
    price: string
    commission: string
    platform: string
    imageUrl?: string
    onGenerateCopy: () => void
    onViewLink: () => void
    onDelete?: () => void
}

export function ProductCard({
    id,
    title,
    price,
    commission,
    platform,
    imageUrl,
    onGenerateCopy,
    onViewLink,
    onDelete,
}: ProductCardProps) {
    return (
        <Card className="overflow-hidden flex flex-col justify-between hover-lift animate-fade-in group border-gray-200 hover:border-indigo-300 transition-all duration-300">
            <div className="aspect-video w-full bg-gradient-to-br from-indigo-50 to-purple-50 relative flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="text-gray-400 text-sm">Sem Imagem</div>
                )}
                <Badge className="absolute top-3 right-3 bg-black/70 hover:bg-black/80 backdrop-blur-sm border-0 shadow-lg">
                    {platform}
                </Badge>
            </div>
            <CardHeader className="p-4 pb-3">
                <CardTitle className="text-lg line-clamp-2 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {title}
                </CardTitle>
                <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {price}
                    </span>
                    <span className="text-sm text-emerald-600 font-semibold px-3 py-1 bg-emerald-50 rounded-full">
                        +{commission}
                    </span>
                </div>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1 hover:bg-gray-50 hover:border-gray-300 transition-all"
                    onClick={onViewLink}
                >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Link
                </Button>
                <Button
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                    onClick={onGenerateCopy}
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    IA
                </Button>
                {onDelete && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        className="hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
