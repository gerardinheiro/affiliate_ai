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
import { ContentCalendar } from "@/components/social/content-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "next-intl"

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
    const t = useTranslations("Social")
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
            alert(t("composer.validation"))
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
                alert(t("composer.success"))
            }
        } catch (error) {
            alert(t("composer.error"))
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
                alert(t("history.publishSuccess"))
            }
        } catch (error) {
            alert(t("history.publishError"))
        } finally {
            setIsPublishing(false)
        }
    }

    const handleSelectFromCalendar = (date: Date, initialContent?: string) => {
        setScheduledFor(formatDateForInput(date))
        if (initialContent) {
            setContent(initialContent)
        }
        // Scroll to composer
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const formatDateForInput = (date: Date) => {
        // Simple formatter for datetime-local input
        const pad = (n: number) => n.toString().padStart(2, '0')
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    const handleDeletePost = async (id: string) => {
        if (!confirm(t("history.deleteConfirm"))) return

        try {
            const res = await fetch(`/api/posts?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setPosts(posts.filter(p => p.id !== id))
            }
        } catch (error) {
            alert(t("history.deleteError"))
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
                    <h2 className="text-3xl font-bold tracking-tight text-white">{t("title")}</h2>
                    <p className="text-gray-400 mt-2">
                        {t("description")}
                    </p>
                </div>

                <Tabs defaultValue="composer" className="space-y-6">
                    <TabsList className="bg-white/5 border border-white/10">
                        <TabsTrigger value="composer" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400">{t("tabs.composer")}</TabsTrigger>
                        <TabsTrigger value="calendar" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400">{t("tabs.calendar")}</TabsTrigger>
                        <TabsTrigger value="history" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400">{t("tabs.history")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="composer" className="space-y-6">
                        {/* Post Composer */}
                        <Card className="glass border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">{t("composer.title")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-gray-300">{t("composer.content")}</Label>
                                    <Textarea
                                        placeholder={t("composer.contentPlaceholder")}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white min-h-[120px]"
                                    />
                                </div>

                                <div>
                                    <Label className="text-gray-300">{t("composer.imageUrl")}</Label>
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
                                    <Label className="text-gray-300 mb-3 block">{t("composer.platforms")}</Label>
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
                                    <Label className="text-gray-300">{t("composer.schedule")}</Label>
                                    <Input
                                        type="datetime-local"
                                        value={scheduledFor}
                                        onChange={(e) => setScheduledFor(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>

                                <Button onClick={handleCreatePost} className="w-full bg-indigo-600 hover:bg-indigo-700">
                                    <Send className="w-4 h-4 mr-2" />
                                    {scheduledFor ? t("composer.submitSchedule") : t("composer.submitDraft")}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="calendar">
                        <ContentCalendar onSelectDate={handleSelectFromCalendar} />
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        {/* Posts List */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">{t("history.title")}</h3>

                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                                </div>
                            ) : posts.length === 0 ? (
                                <Card className="glass border-white/10">
                                    <CardContent className="py-12 text-center">
                                        <p className="text-gray-400">{t("history.noPosts")}</p>
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
                                                            ? t("history.publishedAt", { date: new Date(post.publishedAt).toLocaleString() })
                                                            : post.scheduledFor
                                                                ? t("history.scheduledFor", { date: new Date(post.scheduledFor).toLocaleString() })
                                                                : t("history.createdAt", { date: new Date(post.createdAt).toLocaleString() })}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        {post.status === "draft" && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handlePublishNow(post.id)}
                                                                disabled={isPublishing}
                                                                className="bg-emerald-600 hover:bg-emerald-700"
                                                            >
                                                                {t("history.publishNow")}
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleDeletePost(post.id)}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        >
                                                            {t("history.delete")}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
