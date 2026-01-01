"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Copy, Video, FileText, ImageIcon, Link as LinkIcon } from "lucide-react"
import { generateCopyAction, generateVideoScriptAction, scrapeProductAction } from "@/app/actions"
import { ImageGenerator } from "@/components/creatives/image-generator"
import { useTranslations } from "@/lib/mock-intl"

interface VideoScriptScene {
    scene_number: number
    duration: number
    visual_description: string
    audio_script: string
}

export default function AIStudioPage() {
    const t = useTranslations("AIStudio")
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
    const [generatedScript, setGeneratedScript] = useState<VideoScriptScene[]>([])

    const handleImportUrl = async () => {
        if (!importUrl) return
        setIsImporting(true)
        try {
            const data = await scrapeProductAction(importUrl)
            if (data) {
                setProductName(data.title)
                setProductDesc(data.description + (data.price ? `\nPreço: ${data.price}` : ""))
                alert(t("copy.importSuccess"))
            }
        } catch (error) {
            console.error(error)
            alert(t("copy.importError"))
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
            if (result) alert(t("copy.generateSuccess"))
        } catch (error) {
            console.error(error)
            alert(t("copy.generateError"))
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
            if (result) alert(t("video.generateSuccess"))
        } catch (error) {
            console.error(error)
            alert(t("video.generateError"))
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert(t("copy.copied"))
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">{t("title")}</h2>
                    <p className="text-gray-400">{t("description")}</p>
                </div>

                <Tabs defaultValue="copy" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5">
                        <TabsTrigger value="copy" className="gap-2"><FileText className="w-4 h-4" /> {t("tabs.copy")}</TabsTrigger>
                        <TabsTrigger value="video" className="gap-2"><Video className="w-4 h-4" /> {t("tabs.video")}</TabsTrigger>
                        <TabsTrigger value="image" className="gap-2"><ImageIcon className="w-4 h-4" /> {t("tabs.image")}</TabsTrigger>
                    </TabsList>

                    {/* AD COPY TAB */}
                    <TabsContent value="copy" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="glass border-white/10 h-fit">
                            <CardHeader>
                                <CardTitle className="text-white">{t("copy.title")}</CardTitle>
                                <CardDescription>{t("copy.subtitle")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">{t("copy.importUrl")}</Label>
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
                                            <span className="ml-2 hidden sm:inline">{t("copy.importButton")}</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">{t("copy.productName")}</Label>
                                    <Input
                                        placeholder={t("copy.productNamePlaceholder")}
                                        value={productName}
                                        onChange={e => setProductName(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">{t("copy.description")}</Label>
                                    <Textarea
                                        placeholder={t("copy.descriptionPlaceholder")}
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
                                    {t("copy.generateButton")}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="glass border-white/10 min-h-[400px]">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-white">{t("copy.resultTitle")}</CardTitle>
                                {generatedCopy && (
                                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedCopy)}>
                                        <Copy className="w-4 h-4 mr-2" /> {t("copy.copyButton")}
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
                                        <p>{t("copy.emptyState")}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* VIDEO SCRIPT TAB */}
                    <TabsContent value="video" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="glass border-white/10 h-fit">
                            <CardHeader>
                                <CardTitle className="text-white">{t("video.title")}</CardTitle>
                                <CardDescription>{t("video.subtitle")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">{t("video.product")}</Label>
                                    <Input
                                        placeholder={t("video.productPlaceholder")}
                                        value={scriptProduct}
                                        onChange={e => setScriptProduct(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">{t("video.keyPoints")}</Label>
                                    <Textarea
                                        placeholder={t("video.keyPointsPlaceholder")}
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
                                    {t("video.generateButton")}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="glass border-white/10 min-h-[400px]">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-white">{t("video.resultTitle")}</CardTitle>
                                {generatedScript.length > 0 && (
                                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(JSON.stringify(generatedScript, null, 2))}>
                                        <Copy className="w-4 h-4 mr-2" /> {t("video.copyJson")}
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
                                                        <span className="text-xs font-medium text-pink-400 uppercase">{t("video.visual")}</span>
                                                        <span className="text-xs text-gray-500">{scene.duration}s</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm">{scene.visual_description}</p>

                                                    <div className="h-px bg-white/5 my-2" />

                                                    <span className="text-xs font-medium text-blue-400 uppercase">{t("video.audio")}</span>
                                                    <p className="text-white text-sm italic">&quot;{scene.audio_script}&quot;</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                                        <Video className="w-12 h-12 mb-4 opacity-20" />
                                        <p>{t("video.emptyState")}</p>
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
