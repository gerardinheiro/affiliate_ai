"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, GripVertical, ExternalLink, Save, Loader2, Layout, Link as LinkIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

type BioLink = {
    id: string
    title: string
    url: string
    icon: string
    order: number
}

type BioPage = {
    username: string
    displayName: string
    bio: string
    theme: string
    avatarUrl: string
    links: BioLink[]
}

const THEMES = {
    default: {
        name: "Simple Dark",
        bg: "bg-gradient-to-br from-gray-900 to-black",
        text: "text-white",
        card: "bg-white/10 text-white hover:bg-white/20",
        button: "bg-white text-black hover:bg-gray-200"
    },
    light: {
        name: "Clean Light",
        bg: "bg-gray-50",
        text: "text-gray-900",
        card: "bg-white border border-gray-200 text-gray-900 shadow-sm hover:shadow-md",
        button: "bg-black text-white hover:bg-gray-800"
    },
    gradient: {
        name: "Gradient Purple",
        bg: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500",
        text: "text-white",
        card: "bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30",
        button: "bg-white text-purple-600 hover:bg-gray-100"
    },
    neon: {
        name: "Neon Cyber",
        bg: "bg-black",
        text: "text-green-400 font-mono",
        card: "bg-black border border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400",
        button: "bg-green-500 text-black hover:bg-green-400 font-bold"
    }
}

export default function BioBuilderPage() {
    const [bioPage, setBioPage] = useState<BioPage | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // New Link State
    const [newLinkTitle, setNewLinkTitle] = useState("")
    const [newLinkUrl, setNewLinkUrl] = useState("")

    useEffect(() => {
        fetchBioPage()
    }, [])

    const fetchBioPage = async () => {
        try {
            const res = await fetch("/api/bio")
            if (res.ok) {
                const data = await res.json()
                setBioPage(data)
            }
        } catch (error) {
            console.error("Error fetching bio page:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateProfile = async () => {
        if (!bioPage) return
        setIsSaving(true)
        try {
            await fetch("/api/bio", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: bioPage.username,
                    displayName: bioPage.displayName,
                    bio: bioPage.bio,
                    theme: bioPage.theme,
                    avatarUrl: bioPage.avatarUrl
                })
            })
            alert("Perfil atualizado!")
        } catch (error) {
            alert("Erro ao atualizar perfil")
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddLink = async () => {
        if (!newLinkTitle || !newLinkUrl) return
        try {
            const res = await fetch("/api/bio/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newLinkTitle,
                    url: newLinkUrl,
                    icon: "link"
                })
            })
            if (res.ok) {
                const newLink = await res.json()
                setBioPage(prev => prev ? { ...prev, links: [...prev.links, newLink] } : null)
                setNewLinkTitle("")
                setNewLinkUrl("")
            }
        } catch (error) {
            alert("Erro ao adicionar link")
        }
    }

    const handleDeleteLink = async (id: string) => {
        try {
            const res = await fetch(`/api/bio/links?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setBioPage(prev => prev ? { ...prev, links: prev.links.filter(l => l.id !== id) } : null)
            }
        } catch (error) {
            alert("Erro ao deletar link")
        }
    }

    if (isLoading) return <DashboardLayout><div className="p-8 text-white">Carregando...</div></DashboardLayout>

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Link na Bio</h2>
                        <p className="text-gray-400">Personalize sua página pública de links.</p>
                    </div>
                    {bioPage && (
                        <Button variant="outline" className="gap-2" asChild>
                            <a href={`/u/${bioPage.username}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                                Ver Página
                            </a>
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Editor Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="links" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-white/5">
                                <TabsTrigger value="links">Links</TabsTrigger>
                                <TabsTrigger value="appearance">Aparência</TabsTrigger>
                            </TabsList>

                            <TabsContent value="links" className="space-y-6 mt-6">
                                <Card className="glass border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-white">Adicionar Novo Link</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label className="text-gray-300">Título</Label>
                                            <Input
                                                value={newLinkTitle}
                                                onChange={e => setNewLinkTitle(e.target.value)}
                                                placeholder="Ex: Meu Curso de Marketing"
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-gray-300">URL</Label>
                                            <Input
                                                value={newLinkUrl}
                                                onChange={e => setNewLinkUrl(e.target.value)}
                                                placeholder="https://..."
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                        </div>
                                        <Button onClick={handleAddLink} className="w-full bg-indigo-600 hover:bg-indigo-700">
                                            <Plus className="w-4 h-4 mr-2" /> Adicionar Link
                                        </Button>
                                    </CardContent>
                                </Card>

                                <div className="space-y-4">
                                    {bioPage?.links.map((link) => (
                                        <div key={link.id} className="flex items-center gap-4 p-4 rounded-lg glass border border-white/10 group">
                                            <GripVertical className="text-gray-500 cursor-move" />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-white">{link.title}</h4>
                                                <p className="text-sm text-gray-400 truncate">{link.url}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-400 hover:bg-red-500/10"
                                                onClick={() => handleDeleteLink(link.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="appearance" className="space-y-6 mt-6">
                                <Card className="glass border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-white">Perfil</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label className="text-gray-300">Nome de Exibição</Label>
                                            <Input
                                                value={bioPage?.displayName || ""}
                                                onChange={e => setBioPage(prev => prev ? { ...prev, displayName: e.target.value } : null)}
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-gray-300">Bio</Label>
                                            <Textarea
                                                value={bioPage?.bio || ""}
                                                onChange={e => setBioPage(prev => prev ? { ...prev, bio: e.target.value } : null)}
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-gray-300">Username (URL)</Label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">app.com/u/</span>
                                                <Input
                                                    value={bioPage?.username || ""}
                                                    onChange={e => setBioPage(prev => prev ? { ...prev, username: e.target.value } : null)}
                                                    className="bg-white/5 border-white/10 text-white"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleUpdateProfile}
                                            disabled={isSaving}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                            Salvar Alterações
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="glass border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-white">Tema</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            {Object.entries(THEMES).map(([key, theme]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setBioPage(prev => prev ? { ...prev, theme: key } : null)}
                                                    className={`
                                                        relative h-24 rounded-lg border-2 transition-all overflow-hidden text-left p-3 flex flex-col justify-end
                                                        ${bioPage?.theme === key ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-white/10 hover:border-white/30'}
                                                    `}
                                                >
                                                    <div className={`absolute inset-0 ${theme.bg}`} />
                                                    <span className={`relative z-10 text-sm font-medium ${key === 'light' ? 'text-black' : 'text-white'}`}>
                                                        {theme.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Preview Column */}
                    <div className="hidden lg:block">
                        <div className="sticky top-8">
                            <h3 className="text-lg font-medium text-white mb-4">Preview</h3>
                            <div className="border-[8px] border-gray-800 rounded-[3rem] overflow-hidden h-[600px] bg-black relative shadow-2xl">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-10" />
                                <div className={`h-full overflow-y-auto p-6 text-center transition-colors duration-300 ${THEMES[bioPage?.theme as keyof typeof THEMES]?.bg || THEMES.default.bg}`}>
                                    <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 border-4 border-white/10 shadow-xl overflow-hidden">
                                        {bioPage?.avatarUrl ? (
                                            <img src={bioPage.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white/50">
                                                {bioPage?.displayName?.charAt(0) || "?"}
                                            </div>
                                        )}
                                    </div>
                                    <h2 className={`font-bold text-xl mb-2 ${THEMES[bioPage?.theme as keyof typeof THEMES]?.text || THEMES.default.text}`}>
                                        {bioPage?.displayName || "Seu Nome"}
                                    </h2>
                                    <p className={`text-sm mb-8 opacity-80 ${THEMES[bioPage?.theme as keyof typeof THEMES]?.text || THEMES.default.text}`}>
                                        {bioPage?.bio || "Sua bio aparecerá aqui..."}
                                    </p>

                                    <div className="space-y-3">
                                        {bioPage?.links.map(link => (
                                            <a
                                                key={link.id}
                                                href="#" // Preview only
                                                className={`block w-full p-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] ${THEMES[bioPage?.theme as keyof typeof THEMES]?.card || THEMES.default.card}`}
                                            >
                                                {link.title}
                                            </a>
                                        ))}
                                        {(!bioPage?.links || bioPage.links.length === 0) && (
                                            <div className="text-gray-500 text-sm italic py-4">Adicione links para ver aqui</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
