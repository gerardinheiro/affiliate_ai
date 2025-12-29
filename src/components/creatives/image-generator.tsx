"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Image as ImageIcon, Download, ExternalLink, Wand2 } from "lucide-react"
import { generateImageAction } from "@/app/actions"

export function ImageGenerator() {
    const [prompt, setPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)

    const handleGenerate = async () => {
        if (!prompt) return
        setIsGenerating(true)
        try {
            const imageUrl = await generateImageAction(prompt)
            if (imageUrl) {
                setGeneratedImage(imageUrl)
                alert("Imagem gerada e salva com sucesso! (+30 XP)")
            } else {
                alert("Falha ao gerar imagem.")
            }
        } catch (error) {
            console.error(error)
            alert("Erro ao gerar imagem.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-purple-500" />
                    Gerador de Imagens (DALL-E 3)
                </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Area */}
                <Card className="glass border-white/10 h-fit">
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300">Prompt da Imagem</Label>
                            <Textarea
                                placeholder="Ex: Um tênis de corrida futurista flutuando em um fundo neon, iluminação cinematográfica, 8k..."
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                className="bg-white/5 border-white/10 text-white min-h-[150px]"
                            />
                            <p className="text-xs text-gray-500">
                                Dica: Seja detalhado sobre luz, estilo e composição para melhores resultados.
                            </p>
                        </div>
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                            Gerar Imagem
                        </Button>
                    </div>
                </Card>

                {/* Result Area */}
                <Card className="glass border-white/10 min-h-[400px] flex flex-col">
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-white">Resultado</h4>
                            {generatedImage && (
                                <Button variant="outline" size="sm" asChild>
                                    <a href={generatedImage} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4 mr-2" /> Abrir Original
                                    </a>
                                </Button>
                            )}
                        </div>

                        <div className="flex-1 flex items-center justify-center bg-black/20 rounded-lg border border-white/5 overflow-hidden relative group">
                            {generatedImage ? (
                                <img
                                    src={generatedImage}
                                    alt="Generated"
                                    className="max-w-full max-h-[400px] object-contain rounded-md shadow-2xl"
                                />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>Sua imagem aparecerá aqui.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
