"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Clapperboard, Copy, ExternalLink, Wand2, Image as ImageIcon, Sparkles } from "lucide-react"
import { generateVideoScriptAction, generateStoryboardAction, type Scene } from "@/app/actions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

interface VideoGeneratorProps {
    productName: string
    productDescription: string
    onScriptGenerated: (script: string) => void
}


export function VideoGenerator({ productName, productDescription, onScriptGenerated }: VideoGeneratorProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState(false)
    const [script, setScript] = useState<Scene[] | null>(null)
    const [storyboard, setStoryboard] = useState<Record<number, string>>({})

    const handleGenerate = async () => {
        setIsGenerating(true)
        setStoryboard({}) // Reset storyboard
        try {
            const generatedScript = await generateVideoScriptAction(productName, productDescription)
            setScript(generatedScript)
            onScriptGenerated(JSON.stringify(generatedScript, null, 2))
        } catch (error) {
            console.error(error)
            toast.error("Erro ao gerar roteiro.")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleGenerateStoryboard = async () => {
        if (!script) return
        setIsGeneratingStoryboard(true)
        try {
            const result = await generateStoryboardAction(script)
            const newStoryboard: Record<number, string> = {}
            result.forEach(item => {
                newStoryboard[item.scene_number] = item.imageUrl
            })
            setStoryboard(newStoryboard)
            toast.success("Storyboard gerado com sucesso!")
        } catch (error) {
            console.error(error)
            toast.error("Erro ao gerar storyboard.")
        } finally {
            setIsGeneratingStoryboard(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert("Copiado para a área de transferência!")
    }

    const getInVideoPrompt = () => {
        if (!script) return ""
        return `Create a 30s video for ${productName}. Script: ${script.map((s) => s.audio_script).join(" ")}`
    }

    const getHeyGenPrompt = () => {
        if (!script) return ""
        return script.map((s) => s.audio_script).join(" ")
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Clapperboard className="w-5 h-5 text-indigo-500" />
                    Gerador de Roteiro de Vídeo
                </h3>
                <div className="flex gap-2">
                    {script && (
                        <Button
                            variant="outline"
                            onClick={handleGenerateStoryboard}
                            disabled={isGeneratingStoryboard}
                            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        >
                            {isGeneratingStoryboard ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            Gerar Storyboard
                        </Button>
                    )}
                    <Button onClick={handleGenerate} disabled={isGenerating || !productName}>
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                        {script ? "Regerar Roteiro" : "Gerar Roteiro"}
                    </Button>
                </div>
            </div>

            {script && (
                <div className="space-y-6">
                    <ScrollArea className="h-[400px] rounded-md border p-4 bg-gray-50">
                        <div className="space-y-4">
                            {script.map((scene, index) => (
                                <Card key={index} className="p-4 border-l-4 border-l-indigo-500 overflow-hidden">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-sm text-gray-500">Cena {scene.scene_number}</span>
                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{scene.duration}s</span>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="md:col-span-1">
                                            <Label className="text-xs text-gray-500 uppercase mb-2 block">Visual (Storyboard)</Label>
                                            {storyboard[scene.scene_number] ? (
                                                <div className="relative aspect-video rounded-md overflow-hidden border border-white/10 group">
                                                    <img
                                                        src={storyboard[scene.scene_number]}
                                                        alt={`Cena ${scene.scene_number}`}
                                                        className="object-cover w-full h-full transition-transform group-hover:scale-110"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="aspect-video rounded-md bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                                                    <ImageIcon className="w-8 h-8 mb-1 opacity-20" />
                                                    <span className="text-[10px]">Sem imagem</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <div>
                                                <Label className="text-xs text-gray-500 uppercase">Descrição Visual</Label>
                                                <p className="text-sm mt-1">{scene.visual_description}</p>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-500 uppercase">Áudio / Locução</Label>
                                                <p className="text-sm mt-1 font-medium text-indigo-700">&quot;{scene.audio_script}&quot;</p>
                                            </div>
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
