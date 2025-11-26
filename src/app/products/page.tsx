"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/products/product-card"
import { Plus, Search, Sparkles, Loader2 } from "lucide-react"
import { generateCopyAction, scrapeProductAction } from "@/app/actions"
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

// Mock data
const initialProducts = [
    {
        id: 1,
        title: "Curso de Marketing Digital 2.0",
        price: "R$ 497,00",
        commission: "R$ 250,00",
        platform: "Hotmart",
        imageUrl: "https://placehold.co/600x400/png?text=Curso+Marketing",
    },
    {
        id: 2,
        title: "Fone de Ouvido Bluetooth Pro",
        price: "R$ 129,90",
        commission: "R$ 15,00",
        platform: "Amazon",
        imageUrl: "https://placehold.co/600x400/png?text=Fone+Bluetooth",
    },
]

export default function ProductsPage() {
    const [products, setProducts] = useState(initialProducts)
    const [isGenerating, setIsGenerating] = useState(false)
    const [newProductUrl, setNewProductUrl] = useState("")
    const [isAdding, setIsAdding] = useState(false)

    const handleAddProduct = async () => {
        setIsAdding(true)
        try {
            const scrapedData = await scrapeProductAction(newProductUrl)

            const newProduct = {
                id: products.length + 1,
                title: scrapedData.title,
                price: scrapedData.price,
                commission: "Calculando...", // Placeholder logic
                platform: scrapedData.platform,
                imageUrl: scrapedData.imageUrl,
            }

            setProducts([newProduct, ...products])
            setNewProductUrl("")
        } catch (error) {
            alert("Erro ao importar produto. Verifique o link.")
        } finally {
            setIsAdding(false)
        }
    }

    const handleGenerateCopy = async (productTitle: string) => {
        setIsGenerating(true)
        try {
            const copy = await generateCopyAction(productTitle)
            alert(`Copy gerada para "${productTitle}":\n\n"${copy}"`)
        } catch (error) {
            alert("Erro ao gerar copy. Verifique sua chave de API.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
                        <p className="text-muted-foreground mt-2">
                            Gerencie seus produtos afiliados e crie campanhas com IA.
                        </p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Produto
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Adicionar Novo Produto</DialogTitle>
                                <DialogDescription>
                                    Cole o link do produto (Amazon, Hotmart, etc) e nossa IA irá extrair os dados.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="url" className="text-right">
                                        Link do Produto
                                    </Label>
                                    <Input
                                        id="url"
                                        placeholder="https://..."
                                        className="col-span-3"
                                        value={newProductUrl}
                                        onChange={(e) => setNewProductUrl(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddProduct} disabled={isAdding || !newProductUrl}>
                                    {isAdding ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Analisando...
                                        </>
                                    ) : (
                                        "Importar Produto"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar produtos..."
                            className="pl-8"
                        />
                    </div>
                    <Button variant="secondary">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Encontrar Melhores Produtos
                    </Button>
                </div>

                {isGenerating && (
                    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                            <p className="font-medium">A IA está escrevendo sua copy...</p>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            {...product}
                            onGenerateCopy={() => handleGenerateCopy(product.title)}
                            onViewLink={() => window.open("#", "_blank")}
                        />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
