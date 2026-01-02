"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Copy, Video, Image as ImageIcon, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { GalleryToolbar } from "@/components/gallery/gallery-toolbar"
import { Checkbox } from "@/components/ui/checkbox"

interface Creative {
    id: string
    headline: string
    description: string
    type: "image" | "video"
    createdAt: string
    imageUrl?: string
    script?: string
}

interface CreativeGalleryProps {
    onSelect?: (url: string) => void
}

export function CreativeGallery({ onSelect }: CreativeGalleryProps) {
    const [creatives, setCreatives] = useState<Creative[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState("all")
    const [selectedIds, setSelectedIds] = useState<string[]>([])

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
                setSelectedIds(selectedIds.filter(sid => sid !== id))
            }
        } catch (error) {
            console.error("Failed to delete", error)
        }
    }

    const handleDeleteSelected = async () => {
        if (!confirm(`Tem certeza que deseja excluir ${selectedIds.length} itens?`)) return

        try {
            // In a real app, we might want a bulk delete endpoint
            // For now, we'll just loop (not ideal for many items but works for MVP)
            await Promise.all(selectedIds.map(id =>
                fetch(`/api/creatives?id=${id}`, { method: "DELETE" })
            ))

            setCreatives(creatives.filter(c => !selectedIds.includes(c.id)))
            setSelectedIds([])
        } catch (error) {
            console.error("Failed to delete selected", error)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert("Copiado!")
    }

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    const handleSelectAll = () => {
        if (selectedIds.length === filteredCreatives.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredCreatives.map(c => c.id))
        }
    }

    const filteredCreatives = creatives.filter(creative => {
        const matchesSearch = creative.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
            creative.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filter === "all" || creative.type === filter
        return matchesSearch && matchesFilter
    })

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-4">
            <GalleryToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filter={filter}
                onFilterChange={setFilter}
                selectedCount={selectedIds.length}
                totalCount={filteredCreatives.length}
                onSelectAll={handleSelectAll}
                onDeleteSelected={handleDeleteSelected}
                isAllSelected={filteredCreatives.length > 0 && selectedIds.length === filteredCreatives.length}
            />

            {filteredCreatives.length === 0 ? (
                <div className="text-center p-8 text-gray-500 bg-white/5 rounded-lg border border-white/10">
                    <p>Nenhum criativo encontrado.</p>
                </div>
            ) : (
                <ScrollArea className="h-[600px] pr-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCreatives.map((creative) => (
                            <Card
                                key={creative.id}
                                className={`
                                    p-4 transition-all duration-200 relative group
                                    ${selectedIds.includes(creative.id) ? 'border-indigo-500 bg-indigo-500/5' : 'hover:bg-white/5 border-white/10 glass'}
                                `}
                            >
                                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Checkbox
                                        checked={selectedIds.includes(creative.id)}
                                        onCheckedChange={() => toggleSelect(creative.id)}
                                        className="bg-black/50 border-white/50 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                    />
                                </div>
                                {selectedIds.includes(creative.id) && (
                                    <div className="absolute top-3 right-3 z-10">
                                        <Checkbox
                                            checked={true}
                                            onCheckedChange={() => toggleSelect(creative.id)}
                                            className="bg-indigo-600 border-indigo-600"
                                        />
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        {creative.type === "video" ? (
                                            <div className="bg-indigo-500/20 p-1.5 rounded-md">
                                                <Video className="w-4 h-4 text-indigo-400" />
                                            </div>
                                        ) : (
                                            <div className="bg-pink-500/20 p-1.5 rounded-md">
                                                <ImageIcon className="w-4 h-4 text-pink-400" />
                                            </div>
                                        )}
                                        <span className="font-semibold text-sm truncate max-w-[150px] text-white">
                                            {creative.headline}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-400 line-clamp-3 mb-4 min-h-[3rem]">
                                    {creative.description}
                                </p>

                                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                    <span className="text-[10px] text-gray-500">
                                        {formatDistanceToNow(new Date(creative.createdAt), { addSuffix: true, locale: ptBR })}
                                    </span>
                                    <div className="flex gap-1">
                                        {onSelect && creative.imageUrl && (
                                            <Button
                                                size="sm"
                                                className="h-7 bg-indigo-600 hover:bg-indigo-700 text-xs px-2"
                                                onClick={() => onSelect(creative.imageUrl!)}
                                            >
                                                Selecionar
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-white" onClick={() => copyToClipboard(creative.description)}>
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(creative.id)}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    )
}
