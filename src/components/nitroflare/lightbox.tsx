"use client"

import { useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LightboxProps {
    images: Array<{
        id: string
        imageUrl: string | null
        nitroflareUrl: string | null
        headline: string
    }>
    currentIndex: number
    onClose: () => void
    onNavigate: (index: number) => void
}

export function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
    const currentImage = images[currentIndex]

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1)
            if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNavigate(currentIndex + 1)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [currentIndex, images.length, onClose, onNavigate])

    if (!currentImage) return null

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
            {/* Close Button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/10"
                onClick={onClose}
            >
                <X className="w-6 h-6" />
            </Button>

            {/* Navigation Buttons */}
            {currentIndex > 0 && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                    onClick={() => onNavigate(currentIndex - 1)}
                >
                    <ChevronLeft className="w-8 h-8" />
                </Button>
            )}

            {currentIndex < images.length - 1 && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                    onClick={() => onNavigate(currentIndex + 1)}
                >
                    <ChevronRight className="w-8 h-8" />
                </Button>
            )}

            {/* Image */}
            <div className="max-w-7xl max-h-[90vh] flex flex-col items-center">
                <img
                    src={currentImage.imageUrl || ''}
                    alt={currentImage.headline}
                    className="max-w-full max-h-[80vh] object-contain"
                />

                {/* Image Info */}
                <div className="mt-4 flex items-center gap-4">
                    <p className="text-white text-lg">{currentImage.headline}</p>
                    <div className="flex gap-2">
                        {currentImage.nitroflareUrl && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(currentImage.nitroflareUrl!, '_blank')}
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Ver Original
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const link = document.createElement('a')
                                link.href = currentImage.imageUrl || ''
                                link.download = `${currentImage.headline}.png`
                                link.click()
                            }}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar
                        </Button>
                    </div>
                </div>

                {/* Counter */}
                <p className="text-gray-400 text-sm mt-2">
                    {currentIndex + 1} / {images.length}
                </p>
            </div>
        </div>
    )
}
