"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Share2, ExternalLink, Sparkles, Megaphone, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
    onPromotePaid?: () => void
    onPromoteOrganic?: () => void
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
    onPromotePaid,
    onPromoteOrganic,
}: ProductCardProps) {
    return (
        <Card className="overflow-hidden flex flex-col justify-between hover-lift animate-fade-in group border-white/10 hover:border-indigo-500/50 transition-all duration-300 glass">
            <div className="aspect-video w-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 relative flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="text-gray-400 text-sm">Sem Imagem</div>
                )}
                <Badge className="absolute top-3 right-3 bg-black/70 hover:bg-black/80 backdrop-blur-sm border-0 shadow-lg text-white">
                    {platform}
                </Badge>
            </div>
            <CardHeader className="p-4 pb-3">
                <CardTitle className="text-lg line-clamp-2 font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {title}
                </CardTitle>
                <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        {price}
                    </span>
                    <span className="text-sm text-emerald-400 font-semibold px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        +{commission}
                    </span>
                </div>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                    <Button
                        variant="outline"
                        className="flex-1 border-white/10 hover:bg-white/10 hover:text-white transition-all text-gray-300"
                        onClick={onViewLink}
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Link
                    </Button>
                    <Button
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all border-0"
                        onClick={onGenerateCopy}
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        IA
                    </Button>
                </div>

                {(onPromotePaid || onPromoteOrganic) && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30">
                                <Megaphone className="w-4 h-4 mr-2" />
                                Promover
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-black/90 border-white/10 backdrop-blur-xl">
                            {onPromotePaid && (
                                <DropdownMenuItem onClick={onPromotePaid} className="text-white hover:bg-white/10 cursor-pointer">
                                    <Megaphone className="w-4 h-4 mr-2 text-indigo-400" />
                                    Campanha Paga
                                </DropdownMenuItem>
                            )}
                            {onPromoteOrganic && (
                                <DropdownMenuItem onClick={onPromoteOrganic} className="text-white hover:bg-white/10 cursor-pointer">
                                    <Share2 className="w-4 h-4 mr-2 text-emerald-400" />
                                    Divulgação Orgânica
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {onDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className="w-full hover:bg-red-500/10 hover:text-red-400 text-gray-400 transition-all mt-1"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
