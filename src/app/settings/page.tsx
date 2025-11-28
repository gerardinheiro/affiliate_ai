"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Save, Key, ShieldCheck } from "lucide-react"

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [hasKey, setHasKey] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings")
            if (res.ok) {
                const data = await res.json()
                if (data.hasKey) {
                    setHasKey(true)
                    setApiKey("********************")
                }
            }
        } catch (error) {
            console.error("Error fetching settings:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ openaiApiKey: apiKey }),
            })

            if (res.ok) {
                setHasKey(true)
                alert("Configurações salvas com sucesso!")
            } else {
                alert("Erro ao salvar configurações.")
            }
        } catch (error) {
            console.error("Error saving settings:", error)
            alert("Erro ao salvar configurações.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Configurações</h2>
                    <p className="text-gray-400 mt-2">
                        Gerencie suas preferências e chaves de API.
                    </p>
                </div>

                <Card className="glass border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Key className="w-5 h-5 text-indigo-400" />
                            Configuração de IA
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Configure sua chave da OpenAI para gerar copys e criativos ilimitados.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="apiKey" className="text-gray-300">OpenAI API Key</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="apiKey"
                                    type="password"
                                    placeholder="sk-..."
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving || !apiKey}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span className="ml-2">Salvar</span>
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                                Sua chave é armazenada de forma segura e usada apenas para suas requisições.
                            </p>
                        </div>

                        {hasKey && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Chave de API configurada e ativa.</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Admin Panel Link */}
                <Card className="glass border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <ShieldCheck className="w-5 h-5 text-red-400" />
                            Painel de Administração
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Acesse o painel administrativo para gerenciar usuários e visualizar estatísticas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => window.location.href = '/admin'}
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Acessar Painel Admin
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
