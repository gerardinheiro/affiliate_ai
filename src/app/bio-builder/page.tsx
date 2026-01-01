"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ExternalLink, Save, Loader2, Eye, Layout, Palette, BarChart3, Settings, User, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { LinkEditor } from "@/components/bio/link-editor"
import { BioAnalytics } from "@/components/bio/bio-analytics"
import { Preview } from "@/components/bio/preview"
import { ShareDialog } from "@/components/bio/share-dialog"
import { cn } from "@/lib/utils"

import { BioPage, BioLink } from "@/types/bio"

import { THEMES } from "@/lib/themes"

export const dynamic = 'force-dynamic'

export default function BioBuilderPage() {
    const [bioPage, setBioPage] = useState<BioPage | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [activeTab, setActiveTab] = useState("editor")

    // Local state for editing
    const [profile, setProfile] = useState<{ name: string, bio: string, avatar: string, username: string } | null>(null)
    const [links, setLinks] = useState<BioLink[]>([])
    const [theme, setTheme] = useState("modern")

    useEffect(() => {
        fetchBioPage()
    }, [])

    const fetchBioPage = async () => {
        try {
            const res = await fetch("/api/bio")
            if (res.ok) {
                const data = await res.json()
                setBioPage(data)
                setProfile({
                    name: data.name,
                    bio: data.bio,
                    avatar: data.avatar,
                    username: data.username
                })
                setLinks(data.links)
                setTheme(data.theme)
            }
        } catch {
            console.error("Error fetching bio page")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        if (!profile) return
        setIsSaving(true)
        try {
            const res = await fetch("/api/bio", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profile.name,
                    bio: profile.bio,
                    avatar: profile.avatar,
                    links,
                    theme
                })
            })
            if (res.ok) {
                const updated = await res.json()
                setBioPage(updated)
                // toast success
            }
        } catch (error) {
            console.error("Error saving bio page", error)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <DashboardLayout><div className="p-8 text-white">Carregando...</div></DashboardLayout>

    return (
        <DashboardLayout>
            <div className="h-full relative">
                <div className="p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Link na Bio</h1>
                            <p className="text-muted-foreground">
                                Personalize sua página pública de links.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                                <Eye className="w-4 h-4 mr-2" />
                                {showPreview ? "Ocultar Preview" : "Ver Preview"}
                            </Button>
                            <ShareDialog username={profile?.username || ""} />
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Salvar Alterações
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="editor" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="editor" className="gap-2">
                                <Layout className="w-4 h-4" />
                                Editor
                            </TabsTrigger>
                            <TabsTrigger value="appearance" className="gap-2">
                                <Palette className="w-4 h-4" />
                                Aparência
                            </TabsTrigger>
                            <TabsTrigger value="analytics" className="gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Analytics
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="gap-2">
                                <Settings className="w-4 h-4" />
                                Configurações
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="editor" className="space-y-6">
                            <div className="grid lg:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Perfil</CardTitle>
                                            <CardDescription>
                                                Informações principais da sua página.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-20 h-20 rounded-full overflow-hidden border">
                                                    {profile?.avatar ? (
                                                        <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                                            <User className="w-8 h-8 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="absolute bottom-0 right-0 w-6 h-6 rounded-full"
                                                    >
                                                        <Upload className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="space-y-1">
                                                        <Label>Nome de Exibição</Label>
                                                        <Input
                                                            value={profile?.name || ""}
                                                            onChange={(e) => setProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                                                            placeholder="Seu nome ou marca"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label>Bio</Label>
                                                        <Textarea
                                                            value={profile?.bio || ""}
                                                            onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                                                            placeholder="Uma breve descrição sobre você"
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <LinkEditor
                                        links={links}
                                        onChange={setLinks}
                                    />
                                </div>

                                <div className={cn(
                                    "lg:block sticky top-6",
                                    showPreview ? "block fixed inset-0 z-50 bg-background lg:static lg:bg-transparent" : "hidden"
                                )}>
                                    <div className="h-[calc(100vh-8rem)] border rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-black">
                                        <Preview
                                            profile={profile}
                                            links={links}
                                            theme={theme}
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="appearance">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Temas</CardTitle>
                                    <CardDescription>
                                        Escolha o visual da sua página.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {Object.entries(THEMES).map(([key, value]) => (
                                            <button
                                                key={key}
                                                onClick={() => setTheme(key)}
                                                className={cn(
                                                    "relative aspect-[9/16] rounded-xl border-2 overflow-hidden transition-all",
                                                    theme === key ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent hover:border-muted"
                                                )}
                                                style={{
                                                    background: value.bg
                                                }}
                                            >
                                                <div className="absolute inset-x-4 top-8 bottom-4 bg-white/10 rounded-lg backdrop-blur-sm" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                                                    <span className="font-medium text-white drop-shadow-md capitalize">
                                                        {key}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="analytics">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Analytics</CardTitle>
                                    <CardDescription>
                                        Visualize o desempenho da sua página.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">Analytics em breve...</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configurações SEO</CardTitle>
                                    <CardDescription>
                                        Otimize sua página para buscadores.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Título Meta</Label>
                                        <Input placeholder="Título que aparece no Google" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Descrição Meta</Label>
                                        <Textarea placeholder="Descrição que aparece no Google" />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardLayout>
    )
}
