"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Trash2, Download, CheckSquare, Square } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface GalleryToolbarProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    filter: string
    onFilterChange: (value: string) => void
    selectedCount: number
    totalCount: number
    onSelectAll: () => void
    onDeleteSelected: () => void
    isAllSelected: boolean
}

export function GalleryToolbar({
    searchTerm,
    onSearchChange,
    filter,
    onFilterChange,
    selectedCount,
    totalCount,
    onSelectAll,
    onDeleteSelected,
    isAllSelected
}: GalleryToolbarProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Buscar criativos..."
                        className="pl-8 bg-black/20 border-white/10 text-white placeholder:text-gray-500"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <Select value={filter} onValueChange={onFilterChange}>
                    <SelectTrigger className="w-[140px] bg-black/20 border-white/10 text-white">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="image">Imagens</SelectItem>
                        <SelectItem value="video">Vídeos</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                {selectedCount > 0 ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5">
                        <span className="text-sm text-gray-400 mr-2">
                            {selectedCount} selecionado(s)
                        </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={onDeleteSelected}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onSelectAll}
                        className="text-gray-400 hover:text-white"
                    >
                        {isAllSelected ? (
                            <CheckSquare className="w-4 h-4 mr-2 text-indigo-400" />
                        ) : (
                            <Square className="w-4 h-4 mr-2" />
                        )}
                        Selecionar Todos
                    </Button>
                )}
            </div>
        </div>
    )
}
