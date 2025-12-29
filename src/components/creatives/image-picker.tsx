"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { CreativeGallery } from "./creative-gallery"
import Image from "next/image"

interface ImagePickerProps {
    value?: string
    onChange: (url: string) => void
    label?: string
}

export function ImagePicker({ value, onChange, label = "Selecionar Imagem" }: ImagePickerProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleSelect = (url: string) => {
        onChange(url)
        setIsOpen(false)
    }

    return (
        <div className="space-y-2">
            {value ? (
                <div className="relative group aspect-video rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" size="sm">
                                    Alterar
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col glass border-white/10">
                                <DialogHeader>
                                    <DialogTitle className="text-white">Minha Galeria</DialogTitle>
                                </DialogHeader>
                                <div className="flex-1 overflow-y-auto p-1">
                                    <CreativeGallery onSelect={handleSelect} />
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onChange("")}
                        >
                            Remover
                        </Button>
                    </div>
                </div>
            ) : (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full h-32 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 flex flex-col gap-2"
                        >
                            <div className="bg-indigo-500/20 p-2 rounded-full">
                                <Plus className="w-6 h-6 text-indigo-400" />
                            </div>
                            <span className="text-gray-400 text-sm">{label}</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col glass border-white/10">
                        <DialogHeader>
                            <DialogTitle className="text-white">Minha Galeria</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto p-1">
                            <CreativeGallery onSelect={handleSelect} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
