"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Save, Upload } from "lucide-react"

export default function ProfilePage() {
    const { data: session, update } = useSession() || { data: null, update: () => { } }
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        bio: "",
        website: "",
        instagram: "",
        tiktok: "",
        youtube: "",
        twitter: "",
        image: "",
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/profile")
            if (res.ok) {
                const data = await res.json()
                setProfile(data)
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            })

            if (res.ok) {
                alert("Perfil atualizado com sucesso!")
                // Update session if name or image changed
                if (update) {
                    await update({
                        ...session,
                        user: {
                            ...session?.user,
                            name: profile.name,
                            image: profile.image,
                        },
                    })
                }
            } else {
                alert("Erro ao atualizar perfil.")
            }
        } catch (error) {
            console.error("Error saving profile:", error)
            alert("Erro ao salvar.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // For now, just use a placeholder URL
            // In production, you'd upload to a service like Cloudinary or AWS S3
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfile({ ...profile, image: reader.result as string })
            }
            reader.readAsDataURL(file)
        }
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
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
                    <p className="text-muted-foreground mt-2">
                        Gerencie suas informações pessoais e comerciais.
                    </p>
                </div>

                <div className="grid gap-6">
                    {/* Avatar Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Foto de Perfil</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-6">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={profile.image || undefined} />
                                <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-2xl">
                                    {profile.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <Label htmlFor="avatar-upload" className="cursor-pointer">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/50 text-indigo-400 rounded-md hover:bg-indigo-500/20 transition-colors">
                                        <Upload className="h-4 w-4" />
                                        Carregar Foto
                                    </div>
                                </Label>
                                <Input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <p className="text-xs text-gray-500">JPG, PNG ou GIF. Máx 2MB.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Pessoais</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    value={profile.name || ""}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={profile.email || ""}
                                    disabled
                                    className="bg-gray-100 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500">Email não pode ser alterado</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    rows={3}
                                    value={profile.bio || ""}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    placeholder="Conte um pouco sobre você..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Business Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Comerciais</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    type="url"
                                    value={profile.website || ""}
                                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                    placeholder="https://seusite.com"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input
                                        id="instagram"
                                        value={profile.instagram || ""}
                                        onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                                        placeholder="@usuario"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tiktok">TikTok</Label>
                                    <Input
                                        id="tiktok"
                                        value={profile.tiktok || ""}
                                        onChange={(e) => setProfile({ ...profile, tiktok: e.target.value })}
                                        placeholder="@usuario"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="youtube">YouTube</Label>
                                    <Input
                                        id="youtube"
                                        value={profile.youtube || ""}
                                        onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                                        placeholder="@canal"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="twitter">Twitter/X</Label>
                                    <Input
                                        id="twitter"
                                        value={profile.twitter || ""}
                                        onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                                        placeholder="@usuario"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={isSaving} size="lg">
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
            </div>
        </DashboardLayout>
    )
}
