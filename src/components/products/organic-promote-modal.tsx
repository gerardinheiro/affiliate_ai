"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Share2, Twitter, Facebook, Linkedin, MessageCircle } from "lucide-react"
import { toast } from "sonner"

interface OrganicPromoteModalProps {
    isOpen: boolean
    onClose: () => void
    product: {
        id: string
        title: string
        url: string
        imageUrl?: string | null
    }
}

export function OrganicPromoteModal({ isOpen, onClose, product }: OrganicPromoteModalProps) {
    const [isCopied, setIsCopied] = useState(false)

    const handleCopyLink = () => {
        navigator.clipboard.writeText(product.url)
        setIsCopied(true)
        toast.success("Link copiado para a área de transferência!")
        setTimeout(() => setIsCopied(false), 2000)
    }

    const handleShare = (platform: string) => {
        const text = encodeURIComponent(`Confira este produto incrível: ${product.title}`)
        const url = encodeURIComponent(product.url)
        let shareUrl = ""

        switch (platform) {
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
                break
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
                break
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
                break
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${text}%20${url}`
                break
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass border-white/10 bg-black/80 backdrop-blur-xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-emerald-400" />
                        Divulgação Orgânica
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Compartilhe seu link de afiliado diretamente nas redes sociais ou copie para enviar manualmente.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Product Preview */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.title} className="w-16 h-16 object-cover rounded-md" />
                        ) : (
                            <div className="w-16 h-16 bg-white/10 rounded-md flex items-center justify-center text-xs text-gray-500">
                                Sem img
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate">{product.title}</h4>
                            <p className="text-xs text-gray-500 truncate">{product.url}</p>
                        </div>
                    </div>

                    {/* Link Copy Section */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Seu Link de Afiliado</Label>
                        <div className="flex gap-2">
                            <Input
                                value={product.url}
                                readOnly
                                className="bg-white/5 border-white/10 text-white font-mono text-xs"
                            />
                            <Button onClick={handleCopyLink} className="bg-white/10 hover:bg-white/20 text-white">
                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* Social Share Buttons */}
                    <div className="space-y-3">
                        <Label className="text-gray-300">Compartilhar em</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="border-white/10 hover:bg-[#25D366]/20 hover:text-[#25D366] hover:border-[#25D366]/50 text-gray-300 justify-start"
                                onClick={() => handleShare("whatsapp")}
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                WhatsApp
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white/10 hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 text-gray-300 justify-start"
                                onClick={() => handleShare("twitter")}
                            >
                                <Twitter className="w-4 h-4 mr-2" />
                                Twitter
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white/10 hover:bg-[#1877F2]/20 hover:text-[#1877F2] hover:border-[#1877F2]/50 text-gray-300 justify-start"
                                onClick={() => handleShare("facebook")}
                            >
                                <Facebook className="w-4 h-4 mr-2" />
                                Facebook
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white/10 hover:bg-[#0A66C2]/20 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 text-gray-300 justify-start"
                                onClick={() => handleShare("linkedin")}
                            >
                                <Linkedin className="w-4 h-4 mr-2" />
                                LinkedIn
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
