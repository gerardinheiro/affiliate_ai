"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Image as ImageIcon, Type, Layout, Wand2, Loader2 } from "lucide-react"
import { generateImageAction } from "@/app/actions"

interface AdCanvasProps {
    onUpdate: (data: any) => void
}

export function AdCanvas({ onUpdate }: AdCanvasProps) {
    const [headline, setHeadline] = useState("Seu Título Incrível Aqui")
    const [description, setDescription] = useState("Descrição persuasiva do seu produto vai aqui.")
    const [cta, setCta] = useState("Saiba Mais")
    const [image, setImage] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    const handleUpdate = (key: string, value: string) => {
        if (key === "headline") setHeadline(value)
        if (key === "description") setDescription(value)
        if (key === "cta") setCta(value)

        onUpdate({ headline, description, cta, image, [key]: value })
    }

    const handleGenerateImage = async () => {
        setIsGenerating(true)
        try {
            const newImageUrl = await generateImageAction(headline)
            if (newImageUrl) {
                setImage(newImageUrl)
                onUpdate({ headline, description, cta, image: newImageUrl })
            }
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Erro ao gerar imagem.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Editor de Criativo</h3>
                        <Button variant="outline" size="sm" onClick={handleGenerateImage} disabled={isGenerating}>
                            {isGenerating ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Wand2 className="w-4 h-4 mr-2" />
                            )}
                            {isGenerating ? "Gerando..." : "Gerar Imagem com IA"}
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="headline">Título Principal</Label>
                            <Input
                                id="headline"
                                value={headline}
                                onChange={(e) => handleUpdate("headline", e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Texto do Anúncio</Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => handleUpdate("description", e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cta">Botão (Call to Action)</Label>
                            <Input
                                id="cta"
                                value={cta}
                                onChange={(e) => handleUpdate("cta", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Trocar Imagem
                </Button>
                <Button variant="outline" className="flex-1">
                    <Type className="w-4 h-4 mr-2" />
                    Editar Fonte
                </Button>
                <Button variant="outline" className="flex-1">
                    <Layout className="w-4 h-4 mr-2" />
                    Layout
                </Button>
            </div>
        </div>
    )
}
