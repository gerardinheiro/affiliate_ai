"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"

type StatConfig = {
    mode: "REAL" | "EDITED" | "HIDDEN"
    value: number
}

type GlobalSettings = {
    users: StatConfig
    products: StatConfig
    publishedProducts: StatConfig
    ads: StatConfig
}

const DEFAULT_CONFIG: StatConfig = { mode: "REAL", value: 0 }

export function StatsConfig() {
    const [settings, setSettings] = useState<GlobalSettings>({
        users: { ...DEFAULT_CONFIG },
        products: { ...DEFAULT_CONFIG },
        publishedProducts: { ...DEFAULT_CONFIG },
        ads: { ...DEFAULT_CONFIG },
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(res => res.json())
            .then(data => {
                if (data && Object.keys(data).length > 0) {
                    setSettings(data)
                }
            })
            .catch(err => console.error("Failed to load settings", err))
            .finally(() => setIsLoading(false))
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            })

            if (res.ok) {
                alert("Configurações salvas com sucesso!")
            } else {
                alert("Erro ao salvar configurações")
            }
        } catch (error) {
            console.error("Error saving settings:", error)
            alert("Erro ao salvar configurações")
        } finally {
            setIsSaving(false)
        }
    }

    const updateSetting = (key: keyof GlobalSettings, field: keyof StatConfig, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }))
    }

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Configuração da Landing Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Users Config */}
                    <ConfigItem
                        label="Usuários Cadastrados"
                        config={settings.users}
                        onChange={(field, value) => updateSetting("users", field, value)}
                    />

                    {/* Products Config */}
                    <ConfigItem
                        label="Produtos Adicionados"
                        config={settings.products}
                        onChange={(field, value) => updateSetting("products", field, value)}
                    />

                    {/* Published Products Config */}
                    <ConfigItem
                        label="Produtos Publicados"
                        config={settings.publishedProducts}
                        onChange={(field, value) => updateSetting("publishedProducts", field, value)}
                    />

                    {/* Ads Config */}
                    <ConfigItem
                        label="Propagandas Publicadas"
                        config={settings.ads}
                        onChange={(field, value) => updateSetting("ads", field, value)}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Salvar Alterações
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function ConfigItem({ label, config, onChange }: {
    label: string,
    config: StatConfig,
    onChange: (field: keyof StatConfig, value: any) => void
}) {
    return (
        <div className="space-y-2 p-4 border border-white/10 rounded-lg bg-white/5">
            <Label className="text-base font-medium text-white">{label}</Label>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label className="text-xs text-gray-400">Modo de Exibição</Label>
                    <Select
                        value={config.mode}
                        onValueChange={(val) => onChange("mode", val)}
                    >
                        <SelectTrigger className="bg-gray-900 border-white/10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="REAL">Valor Real (Banco de Dados)</SelectItem>
                            <SelectItem value="EDITED">Valor Editado (Manual)</SelectItem>
                            <SelectItem value="HIDDEN">Não Mostrar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <Label className="text-xs text-gray-400">Valor Manual</Label>
                    <Input
                        type="number"
                        value={config.value}
                        onChange={(e) => onChange("value", parseInt(e.target.value) || 0)}
                        disabled={config.mode !== "EDITED"}
                        className="bg-gray-900 border-white/10"
                    />
                </div>
            </div>
        </div>
    )
}
