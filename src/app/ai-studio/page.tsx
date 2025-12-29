"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Copy, Video, FileText, Check, Image as ImageIcon, Link as LinkIcon } from "lucide-react"
import { generateCopyAction, generateVideoScriptAction, scrapeProductAction } from "@/app/actions"
import { ImageGenerator } from "@/components/creatives/image-generator"

export default function AIStudioPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("copy")

    // Copy State
    const [importUrl, setImportUrl] = useState("")
    const [isImporting, setIsImporting] = useState(false)
    const [productName, setProductName] = useState("")
    const [productDesc, setProductDesc] = useState("")
    const [generatedCopy, setGeneratedCopy] = useState("")

    // Script State
    const [scriptProduct, setScriptProduct] = useState("")
    const [scriptDesc, setScriptDesc] = useState("")
    const [generatedScript, setGeneratedScript] = useState<any[]>([])

    const handleImportUrl = async () => {
        if (!importUrl) return
        setIsImporting(true)
        try {
            const data = await scrapeProductAction(importUrl)
            if (data) {
                setProductName(data.title)
                setProductDesc(data.description + (data.price ? `\nPreço: ${data.price}` : ""))
                alert("Dados importados com sucesso!")
            }
        } catch (error) {
            console.error(error)
            alert("Erro ao importar dados da URL")
        } finally {
            setIsImporting(false)
        }
    }

    const handleGenerateCopy = async () => {
        if (!productName || !productDesc) return
        setIsLoading(true)
        try {
            const result = await generateCopyAction(productName)
            setGeneratedCopy(result || "")
            if (result) alert("Copy gerada e salva com sucesso! (+30 XP)")
        } catch (error) {
            console.error(error)
            alert("Erro ao gerar copy")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGenerateScript = async () => {
        if (!scriptProduct || !scriptDesc) return
        setIsLoading(true)
        try {
            const result = await generateVideoScriptAction(scriptProduct, scriptDesc)
            setGeneratedScript(Array.isArray(result) ? result : [])
            if (result) alert("Roteiro gerado e salvo com sucesso! (+30 XP)")
        } catch (error) {
            console.error(error)
            alert("Erro ao gerar roteiro")
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert("Copiado para a área de transferência")
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">AI Studio ✍️</h2>
                    <p className="text-gray-400">Crie textos persuasivos e roteiros de vídeo com Inteligência Artificial.</p>
                </div>

                <Tabs defaultValue="copy" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5">
                        <TabsTrigger value="copy" className="gap-2"><FileText className="w-4 h-4" /> Ad Copy Generator</TabsTrigger>
                        <TabsTrigger value="video" className="gap-2"><Video className="w-4 h-4" /> Video Script Writer</TabsTrigger>
                        <TabsTrigger value="image" className="gap-2"><ImageIcon className="w-4 h-4" /> Image Generator</TabsTrigger>
                    </TabsList>

                    {/* AD COPY TAB */}
                    <TabsContent value="copy" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="glass border-white/10 h-fit">
                            <CardHeader>
                                <CardTitle className="text-white">Detalhes do Produto</CardTitle>
                                <CardDescription>Descreva o que você quer vender.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Importar de URL (Opcional)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="https://loja.com/produto"
                                            value={importUrl}
                                            onChange={e => setImportUrl(e.target.value)}
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={handleImportUrl}
                                            disabled={isImporting || !importUrl}
                                            className="whitespace-nowrap"
                                        >
                                            {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                                            <span className="ml-2 hidden sm:inline">Importar</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Nome do Produto</Label>
                                    <Input
                                        placeholder="Ex: Tênis Runner Pro"
                                        value={productName}
                                        onChange={e => setProductName(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Descrição / Benefícios</Label>
                                    <Textarea
                                        placeholder="Ex: Tênis leve, ortopédico, ideal para corridas longas..."
                                        value={productDesc}
                                        onChange={e => setProductDesc(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white min-h-[150px]"
                                    />
                                </div>
                                <Button
                                    onClick={handleGenerateCopy}
                                    disabled={isLoading || !productName || !productDesc}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                                    Gerar Copy
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="glass border-white/10 min-h-[400px]">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-white">Resultado</CardTitle>
                                {generatedCopy && (
                                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedCopy)}>
                                        <Copy className="w-4 h-4 mr-2" /> Copiar
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                {generatedCopy ? (
                                    <div className="whitespace-pre-wrap text-gray-300 leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5">
                                        {generatedCopy}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                                        <FileText className="w-12 h-12 mb-4 opacity-20" />
                                        <p>Seu texto gerado aparecerá aqui.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* VIDEO SCRIPT TAB */}
                    <TabsContent value="video" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="glass border-white/10 h-fit">
                            <CardHeader>
                                <CardTitle className="text-white">Briefing do Vídeo</CardTitle>
                                <CardDescription>Para TikTok, Reels ou Shorts.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Produto / Tópico</Label>
                                    <Input
                                        placeholder="Ex: Curso de Inglês Online"
                                        value={scriptProduct}
                                        onChange={e => setScriptProduct(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Pontos Chave</Label>
                                    <Textarea
                                        placeholder="Ex: Aprenda rápido, professores nativos, certificado incluso..."
                                        value={scriptDesc}
                                        onChange={e => setScriptDesc(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white min-h-[150px]"
                                    />
                                </div>
                                <Button
                                    onClick={handleGenerateScript}
                                    disabled={isLoading || !scriptProduct || !scriptDesc}
                                    className="w-full bg-pink-600 hover:bg-pink-700"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Video className="w-4 h-4 mr-2" />}
                                    Gerar Roteiro
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="glass border-white/10 min-h-[400px]">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-white">Roteiro (Storyboard)</CardTitle>
                                {generatedScript.length > 0 && (
                                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(JSON.stringify(generatedScript, null, 2))}>
                                        <Copy className="w-4 h-4 mr-2" /> Copiar JSON
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                {generatedScript.length > 0 ? (
                                    <div className="space-y-4">
                                        {generatedScript.map((scene, idx) => (
                                            <div key={idx} className="bg-black/20 p-4 rounded-lg border border-white/5 flex gap-4">
                                                <div className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-white">
                                                    {scene.scene_number}
                                                </div>
                                                <div className="space-y-2 flex-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-xs font-medium text-pink-400 uppercase">Visual</span>
                                                        <span className="text-xs text-gray-500">{scene.duration}s</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm">{scene.visual_description}</p>

                                                    <div className="h-px bg-white/5 my-2" />

                                                    <span className="text-xs font-medium text-blue-400 uppercase">Áudio / Locução</span>
                                                    <p className="text-white text-sm italic">"{scene.audio_script}"</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                                        <Video className="w-12 h-12 mb-4 opacity-20" />
                                        <p>Seu roteiro aparecerá aqui.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>


                    {/* IMAGE GENERATOR TAB */}
                    <TabsContent value="image" className="mt-6">
                        <ImageGenerator />
                    </TabsContent>
                </Tabs>
            </div >
        </DashboardLayout >
    )
}
