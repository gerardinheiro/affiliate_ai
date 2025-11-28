"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Clapperboard, Copy, ExternalLink, Wand2 } from "lucide-react"
import { generateVideoScriptAction } from "@/app/actions"
import { ScrollArea } from "@/components/ui/scroll-area"

interface VideoGeneratorProps {
    productName: string
    productDescription: string
    onScriptGenerated: (script: string) => void
}

export function VideoGenerator({ productName, productDescription, onScriptGenerated }: VideoGeneratorProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [script, setScript] = useState<any[] | null>(null)

    const handleGenerate = async () => {
        setIsGenerating(true)
        try {
            const generatedScript = await generateVideoScriptAction(productName, productDescription)
            setScript(generatedScript)
            onScriptGenerated(JSON.stringify(generatedScript, null, 2))
        } catch (error) {
            console.error(error)
            alert("Erro ao gerar roteiro.")
        } finally {
            setIsGenerating(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert("Copiado para a área de transferência!")
    }

    const getInVideoPrompt = () => {
        if (!script) return ""
        return `Create a 30s video for ${productName}. Script: ${script.map((s: any) => s.audio_script).join(" ")}`
    }

    const getHeyGenPrompt = () => {
        if (!script) return ""
        return script.map((s: any) => s.audio_script).join(" ")
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Clapperboard className="w-5 h-5 text-indigo-500" />
                    Gerador de Roteiro de Vídeo
                </h3>
                <Button onClick={handleGenerate} disabled={isGenerating || !productName}>
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                    Gerar Roteiro
                </Button>
            </div>

            {script && (
                <div className="space-y-6">
                    <ScrollArea className="h-[400px] rounded-md border p-4 bg-gray-50">
                        <div className="space-y-4">
                            {script.map((scene: any, index: number) => (
                                <Card key={index} className="p-4 border-l-4 border-l-indigo-500">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-sm text-gray-500">Cena {scene.scene_number}</span>
                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{scene.duration}s</span>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label className="text-xs text-gray-500 uppercase">Visual</Label>
                                            <p className="text-sm mt-1">{scene.visual_description}</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-500 uppercase">Áudio / Locução</Label>
                                            <p className="text-sm mt-1 font-medium text-indigo-700">"{scene.audio_script}"</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="space-y-4">
                        <h4 className="font-medium text-sm text-gray-500 uppercase">Exportar para Ferramentas de IA</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="p-4 space-y-3 hover:border-indigo-500 transition-colors">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">InVideo AI</span>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-500">Melhor para vídeos com banco de imagens e legendas dinâmicas.</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => copyToClipboard(getInVideoPrompt())}>
                                        <Copy className="w-3 h-3 mr-2" /> Copiar Prompt
                                    </Button>
                                    <Button size="sm" className="w-full" asChild>
                                        <a href="https://invideo.io" target="_blank" rel="noopener noreferrer">Abrir InVideo</a>
                                    </Button>
                                </div>
                            </Card>

                            <Card className="p-4 space-y-3 hover:border-indigo-500 transition-colors">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">HeyGen / ElevenLabs</span>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-500">Melhor para avatares falantes e narração ultra-realista.</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => copyToClipboard(getHeyGenPrompt())}>
                                        <Copy className="w-3 h-3 mr-2" /> Copiar Texto
                                    </Button>
                                    <Button size="sm" className="w-full" asChild>
                                        <a href="https://app.heygen.com" target="_blank" rel="noopener noreferrer">Abrir HeyGen</a>
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
