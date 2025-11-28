"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

type UserEditModalProps = {
    user: {
        id: string
        name: string | null
        email: string | null
        level: number
        subscription: string
        subscriptionExpiresAt?: string | null
    }
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export function UserEditModal({ user, open, onClose, onSuccess }: UserEditModalProps) {
    const [level, setLevel] = useState(user.level.toString())
    const [subscription, setSubscription] = useState(user.subscription)
    const [expiryType, setExpiryType] = useState<"date" | "days">("days")
    const [expiryDate, setExpiryDate] = useState("")
    const [expiryDays, setExpiryDays] = useState("30")
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const body: any = {
                level: parseInt(level),
                subscription,
            }

            if (subscription === "PAID") {
                if (expiryType === "date") {
                    body.subscriptionExpiresAt = expiryDate
                } else {
                    body.subscriptionDays = parseInt(expiryDays)
                }
            }

            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                alert("Usuário atualizado com sucesso!")
                onSuccess()
                onClose()
            } else {
                alert("Erro ao atualizar usuário.")
            }
        } catch (error) {
            console.error("Error updating user:", error)
            alert("Erro ao atualizar usuário.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-gray-900 border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white">Editar Usuário</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {user.name} ({user.email})
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Level */}
                    <div className="space-y-2">
                        <Label htmlFor="level" className="text-gray-300">Nível</Label>
                        <Input
                            id="level"
                            type="number"
                            min="1"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>

                    {/* Subscription Type */}
                    <div className="space-y-2">
                        <Label htmlFor="subscription" className="text-gray-300">Tipo de Assinatura</Label>
                        <Select value={subscription} onValueChange={setSubscription}>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-white/10">
                                <SelectItem value="FREE">FREE</SelectItem>
                                <SelectItem value="PAID">PAID</SelectItem>
                                <SelectItem value="LIFETIME">LIFETIME</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Expiry Configuration (only for PAID) */}
                    {subscription === "PAID" && (
                        <>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Configurar Vencimento</Label>
                                <Select value={expiryType} onValueChange={(v: "date" | "days") => setExpiryType(v)}>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-white/10">
                                        <SelectItem value="days">Por Quantidade de Dias</SelectItem>
                                        <SelectItem value="date">Por Data Específica</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {expiryType === "days" ? (
                                <div className="space-y-2">
                                    <Label htmlFor="expiryDays" className="text-gray-300">Quantidade de Dias</Label>
                                    <Input
                                        id="expiryDays"
                                        type="number"
                                        min="1"
                                        value={expiryDays}
                                        onChange={(e) => setExpiryDays(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white"
                                        placeholder="30"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Vencerá em {expiryDays} dias a partir de agora
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label htmlFor="expiryDate" className="text-gray-300">Data de Vencimento</Label>
                                    <Input
                                        id="expiryDate"
                                        type="datetime-local"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSaving}
                        className="text-gray-300 hover:bg-white/10"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            "Salvar Alterações"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
