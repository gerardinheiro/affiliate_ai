"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { generateCopyAction } from "@/app/actions"
import { Megaphone, Sparkles, Loader2, Copy, Check, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { ImagePicker } from "@/components/creatives/image-picker"

interface CreateCampaignModalProps {
    isOpen: boolean
    onClose: () => void
    product: {
        id: string
        title: string
        description?: string
        url: string
        imageUrl?: string
    }
}

export function CreateCampaignModal({ isOpen, onClose, product }: CreateCampaignModalProps) {
    const [platform, setPlatform] = useState("google_ads")
    const [campaignName, setCampaignName] = useState(`Campanha - ${product.title}`)
    const [dailyBudget, setDailyBudget] = useState("20.00")

    const [adHeadlines, setAdHeadlines] = useState<string[]>([])
    const [adDescriptions, setAdDescriptions] = useState<string[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string>(product.imageUrl || "")

    const handleGenerateCopy = async () => {
        setIsGenerating(true)
        try {
            // We'll use the existing action but might need to parse the result if it returns a single string
            // For now, let's assume the action returns a string and we split it manually or ask for JSON
            // To keep it simple and robust, we'll just generate a block of text and let the user edit

            const copy = await generateCopyAction(product.title, product.description || "")

            // Simple heuristic to split into headlines and descriptions if possible
            // Or just put everything in description for now
            setAdDescriptions([copy || ""])
            setAdHeadlines([`Compre ${product.title}`, "Oferta Imperdível", "Melhor Preço Garantido"])

        } catch (error) {
            console.error("Failed to generate copy", error)
            toast.error("Falha ao gerar copy com IA")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleCreateCampaign = async () => {
        setIsSaving(true)
        try {
            const res = await fetch("/api/campaigns/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product.id,
                    platform,
                    name: campaignName,
                    budget: parseFloat(dailyBudget),
                    headlines: adHeadlines,
                    descriptions: adDescriptions,
                    imageUrl: selectedImage
                })
            })

            if (res.ok) {
                toast.success("Campanha criada com sucesso!")
                onClose()
            } else {
                const data = await res.json()
                toast.error(data.message || "Erro ao criar campanha")
            }
        } catch (error) {
            console.error("Error creating campaign", error)
            toast.error("Erro ao conectar com o servidor")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-[#0f172a] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Megaphone className="w-5 h-5 text-indigo-400" />
                        Promover Produto
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Crie uma campanha de anúncios para <strong>{product.title}</strong> em segundos.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Plataforma</Label>
                            <Select value={platform} onValueChange={setPlatform}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="google_ads">Google Ads</SelectItem>
                                    <SelectItem value="tiktok_ads">TikTok Ads</SelectItem>
                                    <SelectItem value="meta_ads">Meta Ads</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Orçamento Diário (R$)</Label>
                            <Input
                                type="number"
                                value={dailyBudget}
                                onChange={(e) => setDailyBudget(e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Nome da Campanha</Label>
                        <Input
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Imagem do Anúncio</Label>
                        <ImagePicker
                            value={selectedImage}
                            onChange={setSelectedImage}
                            label="Selecionar Criativo da Galeria"
                        />
                    </div>

                    <div className="space-y-4 border-t border-white/10 pt-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold text-indigo-300">Criativo do Anúncio (IA)</Label>
                            <Button
                                size="sm"
                                onClick={handleGenerateCopy}
                                disabled={isGenerating}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4 mr-2" />
                                )}
                                Gerar Copy
                            </Button>
                        </div>

                        {adHeadlines.length > 0 && (
                            <div className="space-y-3 animate-fade-in">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500">Títulos Sugeridos</Label>
                                    <div className="grid gap-2">
                                        {adHeadlines.map((headline, i) => (
                                            <div key={i} className="flex gap-2">
                                                <Input value={headline} readOnly className="bg-white/5 border-white/10 text-sm h-9" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500">Descrição do Anúncio</Label>
                                    <Textarea
                                        value={adDescriptions[0]}
                                        onChange={(e) => {
                                            const newDesc = [...adDescriptions]
                                            newDesc[0] = e.target.value
                                            setAdDescriptions(newDesc)
                                        }}
                                        className="bg-white/5 border-white/10 text-sm min-h-[100px]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">Cancelar</Button>
                    <Button onClick={handleCreateCampaign} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Criar Campanha
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
