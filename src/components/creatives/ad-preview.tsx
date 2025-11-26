import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"

interface AdPreviewProps {
    platform: "instagram_feed" | "instagram_story" | "google_search"
    data: {
        headline: string
        description: string
        cta: string
        image: string | null
    }
}

export function AdPreview({ platform, data }: AdPreviewProps) {
    if (platform === "instagram_feed") {
        return (
            <Card className="max-w-[375px] mx-auto overflow-hidden border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">sua_loja_oficial</span>
                            <span className="text-xs text-muted-foreground">Patrocinado</span>
                        </div>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </div>

                {/* Image */}
                <div className="aspect-square bg-gray-100 relative flex items-center justify-center overflow-hidden">
                    {data.image ? (
                        <img src={data.image} alt="Ad Creative" className="object-cover w-full h-full" />
                    ) : (
                        <span className="text-gray-400">Imagem do Anúncio</span>
                    )}
                </div>

                {/* Action Bar */}
                <div className="p-3 pb-0">
                    <div className="flex items-center justify-between bg-blue-50 p-2 rounded mb-3">
                        <span className="text-sm font-medium text-blue-900">{data.cta}</span>
                        <span className="text-xs text-blue-700 font-bold"> &gt; </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-4">
                            <Heart className="w-6 h-6" />
                            <MessageCircle className="w-6 h-6" />
                            <Send className="w-6 h-6" />
                        </div>
                        <Bookmark className="w-6 h-6" />
                    </div>
                    <div className="text-sm">
                        <span className="font-semibold mr-2">sua_loja_oficial</span>
                        {data.headline} {data.description}
                    </div>
                </div>
            </Card>
        )
    }

    if (platform === "google_search") {
        return (
            <Card className="max-w-[600px] mx-auto p-4 border-none shadow-none bg-white">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-black text-sm">Anúncio</span>
                    <span className="text-xs text-gray-500">· www.sualoja.com.br/oferta</span>
                </div>
                <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer mb-1">
                    {data.headline} | Melhor Preço Garantido
                </h3>
                <p className="text-sm text-[#4d5156] mb-4">
                    {data.description} Compre agora com frete grátis e parcelamento em até 12x.
                </p>
                <div className="flex gap-2">
                    <span className="text-xs text-blue-700 hover:underline cursor-pointer">Promoções</span>
                    <span className="text-xs text-blue-700 hover:underline cursor-pointer">Novidades</span>
                    <span className="text-xs text-blue-700 hover:underline cursor-pointer">Contato</span>
                </div>
            </Card>
        )
    }

    return <div>Preview não disponível</div>
}
