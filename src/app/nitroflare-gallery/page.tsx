"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Download, Calendar, Image as ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white">Carregando galeria...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Galeria Nitroflare ☁️
                </h1>
                <p className="text-gray-400">
                    Todas as suas imagens geradas por IA, armazenadas em nuvem
                </p>
                <Badge variant="outline" className="mt-2">
                    {images.length} {images.length === 1 ? 'imagem' : 'imagens'} armazenadas
                </Badge>
            </div>

            {images.length === 0 ? (
                <Card className="glass border-white/10">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <ImageIcon className="w-16 h-16 text-gray-500 mb-4" />
                        <p className="text-gray-400 text-center">
                            Nenhuma imagem encontrada.<br />
                            Gere imagens no Creative Studio para vê-las aqui!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image) => (
                        <Card key={image.id} className="glass border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all">
                            <div className="relative aspect-square bg-gray-900">
                                {image.imageUrl && (
                                    <img
                                        src={image.imageUrl}
                                        alt={image.headline}
                                        className="w-full h-full object-cover"
                                    />
                                )}
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
                                                Nitroflare
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
    )
}
