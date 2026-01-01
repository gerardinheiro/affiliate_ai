"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/products/product-card"
import { Plus, Search, Sparkles, Loader2 } from "lucide-react"
import { generateCopyAction, scrapeProductAction } from "@/app/actions"
import { useTranslations } from "@/lib/mock-intl"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Product = {
    id: string
    title: string
    price: string
    commission: string
    platform: string
    imageUrl: string | null
    affiliateLink: string | null
    targetCountry?: string
    targetState?: string
    targetCity?: string
}

import { CreateCampaignModal } from "@/components/campaigns/create-campaign-modal"
import { ImagePicker } from "@/components/creatives/image-picker"

export default function ProductsPage() {
    const t = useTranslations("Products")
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false)
    const [newProductUrl, setNewProductUrl] = useState("")
    const [targetCountry, setTargetCountry] = useState("")
    const [targetState, setTargetState] = useState("")
    const [targetCity, setTargetCity] = useState("")
    const [isAdding, setIsAdding] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [manualImageUrl, setManualImageUrl] = useState("")

    // Campaign Modal State
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products")
            if (res.ok) {
                const data = await res.json()
                setProducts(data)
            }
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddProduct = async () => {
        setIsAdding(true)
        try {
            const scrapedData = await scrapeProductAction(newProductUrl)

            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: scrapedData.title,
                    price: scrapedData.price,
                    commission: "R$ 0,00", // Placeholder
                    platform: scrapedData.platform,
                    imageUrl: manualImageUrl || scrapedData.imageUrl,
                    affiliateLink: newProductUrl,
                    targetCountry,
                    targetState,
                    targetCity,
                }),
            })

            if (res.ok) {
                const newProduct = await res.json()
                setProducts([newProduct, ...products])
                setNewProductUrl("")
                setTargetCountry("")
                setTargetState("")
                setTargetCity("")
                setIsDialogOpen(false)
            }
        } catch (error) {
            alert(t("importError"))
        } finally {
            setIsAdding(false)
        }
    }

    const handleDeleteProduct = async (id: string) => {
        if (!confirm(t("deleteConfirm"))) return

        try {
            const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setProducts(products.filter((p) => p.id !== id))
            }
        } catch (error) {
            alert(t("deleteError"))
        }
    }

    const handleGenerateCopy = async (productTitle: string) => {
        setIsGenerating(true)
        try {
            const copy = await generateCopyAction(productTitle)
            alert(`Copy gerada para "${productTitle}":\n\n"${copy}"`)
        } catch (error: any) {
            alert(error.message || t("copyError"))
        } finally {
            setIsGenerating(false)
        }
    }

    const handlePromote = (product: Product) => {
        setSelectedProduct(product)
        setIsCampaignModalOpen(true)
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white">{t("title")}</h2>
                        <p className="text-gray-400 mt-2">
                            {t("description")}
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                {t("addProduct")}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass border-white/10 bg-black/80 backdrop-blur-xl">
                            <DialogHeader>
                                <DialogTitle className="text-white">{t("dialogTitle")}</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    {t("dialogDescription")}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="url" className="text-right text-gray-300">
                                        Link do Produto
                                    </Label>
                                    <Input
                                        id="url"
                                        placeholder="https://..."
                                        className="col-span-3 bg-white/5 border-white/10 text-white"
                                        value={newProductUrl}
                                        onChange={(e) => setNewProductUrl(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right text-gray-300">
                                        Imagem (Opcional)
                                    </Label>
                                    <div className="col-span-3">
                                        <ImagePicker
                                            value={manualImageUrl}
                                            onChange={setManualImageUrl}
                                            label={t("imagePickerLabel")}
                                        />
                                        <p className="text-[10px] text-gray-500 mt-1">
                                            {t("imagePickerHint")}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right text-gray-300">{t("targetCountry")}</Label>
                                    <Select onValueChange={setTargetCountry}>
                                        <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder={t("selectCountry")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BR">Brasil 🇧🇷</SelectItem>
                                            <SelectItem value="US">Estados Unidos 🇺🇸</SelectItem>
                                            <SelectItem value="PT">Portugal 🇵🇹</SelectItem>
                                            <SelectItem value="ES">Espanha 🇪🇸</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="state" className="text-right text-gray-300">
                                        {t("state")}
                                    </Label>
                                    <Input
                                        id="state"
                                        placeholder="Ex: SP, California"
                                        className="col-span-3 bg-white/5 border-white/10 text-white"
                                        value={targetState}
                                        onChange={(e) => setTargetState(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="city" className="text-right text-gray-300">
                                        {t("city")}
                                    </Label>
                                    <Input
                                        id="city"
                                        placeholder="Ex: São Paulo, Los Angeles"
                                        className="col-span-3 bg-white/5 border-white/10 text-white"
                                        value={targetCity}
                                        onChange={(e) => setTargetCity(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddProduct} disabled={isAdding || !newProductUrl} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    {isAdding ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {t("analyzing")}
                                        </>
                                    ) : (
                                        t("importProduct")
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder={t("searchPlaceholder")}
                            className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                        <Sparkles className="w-4 h-4 mr-2" />
                        {t("findBestProducts")}
                    </Button>
                </div>

                {isGenerating && (
                    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                            <p className="font-medium text-gray-900">{t("aiWritingCopy")}</p>
                        </div>
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 mb-4">{t("noProducts")}</p>
                        <Button onClick={() => setIsDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            {t("addFirstProduct")}
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                title={product.title}
                                price={product.price}
                                commission={product.commission}
                                platform={product.platform}
                                imageUrl={product.imageUrl || "https://placehold.co/600x400/png?text=Produto"}
                                onGenerateCopy={() => handleGenerateCopy(product.title)}
                                onViewLink={() => window.open(product.affiliateLink || "#", "_blank")}
                                onDelete={() => handleDeleteProduct(product.id)}
                                onPromote={() => handlePromote(product)}
                            />
                        ))}
                    </div>
                )}

                {selectedProduct && (
                    <CreateCampaignModal
                        isOpen={isCampaignModalOpen}
                        onClose={() => setIsCampaignModalOpen(false)}
                        product={{
                            id: selectedProduct.id,
                            title: selectedProduct.title,
                            description: "", // We might want to store description in DB later
                            url: selectedProduct.affiliateLink || ""
                        }}
                    />
                )}
            </div>
        </DashboardLayout>
    )
}
