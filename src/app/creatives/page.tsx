"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { AdCanvas } from "@/components/creatives/ad-canvas"
import { AdPreview } from "@/components/creatives/ad-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Save, UploadCloud, History } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CreativeGallery } from "@/components/creatives/creative-gallery"

export default function CreativeStudioPage() {
    const [adData, setAdData] = useState({
        headline: "Seu Título Incrível Aqui",
        description: "Descrição persuasiva do seu produto vai aqui.",
        cta: "Saiba Mais",
        image: null as string | null,
        script: null as string | null,
        type: "image"
    })

    const [activeTab, setActiveTab] = useState("instagram_feed")
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch("/api/creatives", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    headline: adData.headline,
                    description: adData.description,
                    cta: adData.cta,
                    imageUrl: adData.image,
                    format: activeTab,
                    type: adData.type,
                    script: adData.script
                })
            })

            if (res.ok) {
                alert("Criativo salvo com sucesso! (+30 XP)")
            } else {
                alert("Erro ao salvar criativo.")
            }
        } catch (error) {
            console.error(error)
            alert("Erro ao salvar.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8 h-[calc(100vh-100px)]">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Creative Studio</h2>
                        <p className="text-muted-foreground mt-2">
                            Crie, edite e visualize seus anúncios com ajuda da IA.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline">
                                    <History className="w-4 h-4 mr-2" />
                                    Meus Criativos
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[400px] sm:w-[540px]">
                                <SheetHeader>
                                    <SheetTitle>Meus Criativos Salvos</SheetTitle>
                                    <SheetDescription>
                                        Histórico de anúncios e roteiros gerados.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6">
                                    <CreativeGallery />
                                </div>
                            </SheetContent>
                        </Sheet>

                        <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? "Salvando..." : "Salvar Criativo"}
                        </Button>
                        <Button>
                            <UploadCloud className="w-4 h-4 mr-2" />
                            Publicar Anúncio
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                    {/* Left Column: Editor */}
                    <div className="flex flex-col gap-4">
                        <AdCanvas onUpdate={(newData) => setAdData({ ...adData, ...newData })} />
                    </div>

                    {/* Right Column: Preview */}
                    <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed flex flex-col items-center overflow-y-auto">
                        <Tabs defaultValue="instagram_feed" className="w-full max-w-md flex flex-col items-center" onValueChange={setActiveTab}>
                            <TabsList className="mb-8">
                                <TabsTrigger value="instagram_feed">Instagram Feed</TabsTrigger>
                                <TabsTrigger value="google_search">Google Search</TabsTrigger>
                            </TabsList>

                            <TabsContent value="instagram_feed" className="w-full">
                                <AdPreview platform="instagram_feed" data={adData} />
                            </TabsContent>

                            <TabsContent value="google_search" className="w-full">
                                <AdPreview platform="google_search" data={adData} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
