"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Download, Calendar, Image as ImageIcon, Upload, Trash2, Edit2, MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { UploadDialog } from "@/components/nitroflare/upload-dialog"
import { Lightbox } from "@/components/nitroflare/lightbox"
import DashboardLayout from "@/components/layout/dashboard-layout"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type GalleryImage = {
    id: string
    imageUrl: string | null
    nitroflareUrl: string | null
    prompt: string | null
    headline: string
    createdAt: string
}

export default function NitroflareGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [renameDialogOpen, setRenameDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
    const [newName, setNewName] = useState("")

    useEffect(() => {
        fetchGallery()
    }, [])

    const fetchGallery = async () => {
        try {
            const response = await fetch("/api/nitroflare/gallery")
            if (response.ok) {
                const data = await response.json()
                setImages(data)
            }
        } catch (error) {
            console.error("Error fetching gallery:", error)
        } finally {
            setLoading(false)
        }
    }

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index)
        setLightboxOpen(true)
    }

    const handleRename = async () => {
        if (!selectedImage || !newName) return

        try {
            const response = await fetch("/api/nitroflare/files", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedImage.id,
                    headline: newName
                })
            })

            if (response.ok) {
                fetchGallery()
                setRenameDialogOpen(false)
                setNewName("")
            }
        } catch (error) {
            console.error("Error renaming file:", error)
        }
    }

    const handleDelete = async () => {
        if (!selectedImage) return

        try {
            const response = await fetch(`/api/nitroflare/files?id=${selectedImage.id}`, {
                method: "DELETE"
            })

            if (response.ok) {
                fetchGallery()
                setDeleteDialogOpen(false)
            }
        } catch (error) {
            console.error("Error deleting file:", error)
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-white">Carregando galeria...</div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto p-8">
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Galeria ☁️
                        </h1>
                        <p className="text-gray-400">
                            Todas as suas imagens geradas por IA, armazenadas em nuvem
                        </p>
                        <Badge variant="outline" className="mt-2">
                            {images.length} {images.length === 1 ? 'imagem' : 'imagens'} armazenadas
                        </Badge>
                    </div>
                    <Button
                        onClick={() => setUploadDialogOpen(true)}
                        className="bg-indigo-500 hover:bg-indigo-600"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                    </Button>
                </div>

                {images.length === 0 ? (
                    <Card className="glass border-white/10">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <ImageIcon className="w-16 h-16 text-gray-500 mb-4" />
                            <p className="text-gray-400 text-center">
                                Nenhuma imagem encontrada.<br />
                                Gere imagens no Creative Studio ou faça upload!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((image, index) => (
                            <Card key={image.id} className="glass border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all group">
                                <div
                                    className="relative aspect-square bg-gray-900 cursor-pointer"
                                    onClick={() => openLightbox(index)}
                                >
                                    {image.imageUrl && (
                                        <img
                                            src={image.imageUrl}
                                            alt={image.headline}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    )}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-8 w-8 bg-black/50 hover:bg-black/70"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-black border-white/10">
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedImage(image)
                                                        setNewName(image.headline)
                                                        setRenameDialogOpen(true)
                                                    }}
                                                >
                                                    <Edit2 className="w-4 h-4 mr-2" />
                                                    Renomear
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedImage(image)
                                                        setDeleteDialogOpen(true)
                                                    }}
                                                    className="text-red-400"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Deletar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-white text-lg line-clamp-1">
                                        {image.headline}
                                    </CardTitle>
                                    {image.prompt && (
                                        <CardDescription className="line-clamp-2">
                                            {image.prompt}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-400">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {new Date(image.createdAt).toLocaleDateString('pt-BR')}
                                    </div>

                                    <div className="flex gap-2">
                                        {image.nitroflareUrl && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => window.open(image.nitroflareUrl!, '_blank')}
                                                >
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    Ver Original
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => {
                                                        const link = document.createElement('a')
                                                        link.href = image.imageUrl || ''
                                                        link.download = `${image.headline}.png`
                                                        link.click()
                                                    }}
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Baixar
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Dialog */}
            <UploadDialog
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
                onUploadComplete={fetchGallery}
            />

            {/* Lightbox */}
            {lightboxOpen && (
                <Lightbox
                    images={images}
                    currentIndex={currentImageIndex}
                    onClose={() => setLightboxOpen(false)}
                    onNavigate={setCurrentImageIndex}
                />
            )}

            {/* Rename Dialog */}
            <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
                <DialogContent className="bg-black border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white">Renomear Arquivo</DialogTitle>
                        <DialogDescription>
                            Digite o novo nome para o arquivo
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Novo nome"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleRename} disabled={!newName}>
                            Renomear
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="bg-black border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white">Deletar Arquivo</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja deletar "{selectedImage?.headline}"? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Deletar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}
