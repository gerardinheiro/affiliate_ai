"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Copy, Video, Image as ImageIcon, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Creative {
    id: string
    headline: string
    description: string
    type: "image" | "video"
    createdAt: string
    imageUrl?: string
    script?: string
}

export function CreativeGallery() {
    const [creatives, setCreatives] = useState<Creative[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchCreatives = async () => {
        try {
            const res = await fetch("/api/creatives")
            if (res.ok) {
                const data = await res.json()
                setCreatives(data)
            }
        } catch (error) {
            console.error("Failed to fetch creatives", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCreatives()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir?")) return

        try {
            const res = await fetch(`/api/creatives?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setCreatives(creatives.filter(c => c.id !== id))
            }
        } catch (error) {
            console.error("Failed to delete", error)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert("Copiado!")
    }

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    if (creatives.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500">
                <p>Nenhum criativo salvo ainda.</p>
            </div>
        )
    }

    return (
        <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
                {creatives.map((creative) => (
                    <Card key={creative.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                {creative.type === "video" ? (
                                    <div className="bg-indigo-100 p-1 rounded">
                                        <Video className="w-4 h-4 text-indigo-600" />
                                    </div>
                                ) : (
                                    <div className="bg-pink-100 p-1 rounded">
                                        <ImageIcon className="w-4 h-4 text-pink-600" />
                                    </div>
                                )}
                                <span className="font-semibold text-sm truncate max-w-[200px]">
                                    {creative.headline}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(creative.createdAt), { addSuffix: true, locale: ptBR })}
                            </span>
                        </div>

                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                            {creative.description}
                        </p>

                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => copyToClipboard(creative.description)}>
                                <Copy className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" onClick={() => handleDelete(creative.id)}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    )
}
