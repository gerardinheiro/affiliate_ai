"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Calendar, Send, Clock, CheckCircle2, XCircle, Loader2, Image as ImageIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

type Post = {
    id: string
    content: string
    imageUrl?: string
    platforms: string[]
    status: string
    scheduledFor?: string
    publishedAt?: string
    createdAt: string
}

const platformOptions = [
    { id: "instagram", name: "Instagram", icon: "📸" },
    { id: "tiktok", name: "TikTok", icon: "🎵" },
    { id: "youtube", name: "YouTube", icon: "▶️" },
    { id: "pinterest", name: "Pinterest", icon: "📌" },
]

export default function SocialPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isPublishing, setIsPublishing] = useState(false)

    // Form state
    const [content, setContent] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
    const [scheduledFor, setScheduledFor] = useState("")

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/posts")
            if (res.ok) {
                const data = await res.json()
                setPosts(data)
            }
        } catch (error) {
            console.error("Error fetching posts:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreatePost = async () => {
        if (!content || selectedPlatforms.length === 0) {
            alert("Preencha o conteúdo e selecione pelo menos uma plataforma")
            return
        }

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    imageUrl: imageUrl || null,
                    platforms: selectedPlatforms,
                    scheduledFor: scheduledFor || null,
                }),
            })

            if (res.ok) {
                const newPost = await res.json()
                setPosts([newPost, ...posts])
                // Reset form
                setContent("")
                setImageUrl("")
                setSelectedPlatforms([])
                setScheduledFor("")
                alert("Post criado com sucesso!")
            }
        } catch (error) {
            alert("Erro ao criar post")
        }
    }

    const handlePublishNow = async (postId: string) => {
        setIsPublishing(true)
        try {
            const res = await fetch("/api/social/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId }),
            })

            if (res.ok) {
                fetchPosts()
                alert("Post publicado com sucesso!")
            }
        } catch (error) {
            alert("Erro ao publicar post")
        } finally {
            setIsPublishing(false)
        }
    }

    const handleDeletePost = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este post?")) return

        try {
            const res = await fetch(`/api/posts?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setPosts(posts.filter(p => p.id !== id))
            }
        } catch (error) {
            alert("Erro ao excluir post")
        }
    }

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { color: string; icon: any }> = {
            draft: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: Clock },
            scheduled: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Calendar },
            published: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
            failed: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
        }

        const variant = variants[status] || variants.draft
        const Icon = variant.icon

        return (
            <Badge variant="outline" className={variant.color}>
                <Icon className="w-3 h-3 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Automação Social</h2>
                    <p className="text-gray-400 mt-2">
                        Crie e agende posts para suas redes sociais conectadas.
                    </p>
                </div>

                {/* Post Composer */}
                <Card className="glass border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Criar Novo Post</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-gray-300">Conteúdo</Label>
                            <Textarea
                                placeholder="Escreva sua mensagem..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="bg-white/5 border-white/10 text-white min-h-[120px]"
                            />
                        </div>

                        <div>
                            <Label className="text-gray-300">URL da Imagem (opcional)</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://..."
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                                {imageUrl && (
                                    <Button variant="outline" size="icon" className="shrink-0">
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label className="text-gray-300 mb-3 block">Plataformas</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {platformOptions.map((platform) => (
                                    <div key={platform.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={platform.id}
                                            checked={selectedPlatforms.includes(platform.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedPlatforms([...selectedPlatforms, platform.id])
                                                } else {
                                                    setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id))
                                                }
                                            }}
                                        />
                                        <label htmlFor={platform.id} className="text-sm text-gray-300 cursor-pointer">
                                            {platform.icon} {platform.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label className="text-gray-300">Agendar para (opcional)</Label>
                            <Input
                                type="datetime-local"
                                value={scheduledFor}
                                onChange={(e) => setScheduledFor(e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <Button onClick={handleCreatePost} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            <Send className="w-4 h-4 mr-2" />
                            {scheduledFor ? "Agendar Post" : "Criar Rascunho"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Posts List */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">Meus Posts</h3>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                        </div>
                    ) : posts.length === 0 ? (
                        <Card className="glass border-white/10">
                            <CardContent className="py-12 text-center">
                                <p className="text-gray-400">Nenhum post criado ainda.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {posts.map((post) => (
                                <Card key={post.id} className="glass border-white/10 hover:border-indigo-500/50 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <p className="text-white whitespace-pre-wrap mb-3">{post.content}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {post.platforms.map((platform) => (
                                                        <Badge key={platform} variant="outline" className="border-white/20 text-gray-300">
                                                            {platformOptions.find(p => p.id === platform)?.icon} {platform}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            {getStatusBadge(post.status)}
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                            <span className="text-sm text-gray-400">
                                                {post.publishedAt
                                                    ? `Publicado em ${new Date(post.publishedAt).toLocaleString("pt-BR")}`
                                                    : post.scheduledFor
                                                        ? `Agendado para ${new Date(post.scheduledFor).toLocaleString("pt-BR")}`
                                                        : `Criado em ${new Date(post.createdAt).toLocaleString("pt-BR")}`}
                                            </span>
                                            <div className="flex gap-2">
                                                {post.status === "draft" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handlePublishNow(post.id)}
                                                        disabled={isPublishing}
                                                        className="bg-emerald-600 hover:bg-emerald-700"
                                                    >
                                                        Publicar Agora
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                >
                                                    Excluir
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
