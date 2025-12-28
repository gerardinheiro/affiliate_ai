import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Key } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ConnectionDialogProps {
    isOpen: boolean
    onClose: () => void
    onConnect: (data: Record<string, unknown>) => void
    platformName: string
    fields?: { name: string; label: string; type?: string }[]
}

export function ConnectionDialog({
    isOpen,
    onClose,
    onConnect,
    platformName,
    fields = [
        { name: "name", label: "Nome da Conta (Apelido)", type: "text" },
        { name: "apiKey", label: "API Key", type: "text" },
        { name: "accountId", label: "ID da Conta / Afiliado", type: "text" },
    ],
}: ConnectionDialogProps) {
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [error, setError] = useState<string | null>(null)

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
        onConnect(formData)
        onClose()
    }

    const isOAuthPlatform = platformName.includes("Google") ||
        platformName.includes("Meta") ||
        platformName.includes("Facebook") ||
        platformName.includes("TikTok") ||
        platformName.includes("Instagram") ||
        platformName.includes("YouTube") ||
        platformName.includes("Pinterest")

    const handleOAuthConnect = async () => {
        const platformId = platformName.toLowerCase().replace(" ", "_")
        setError(null)

        try {
            const res = await fetch(`/api/integrations/oauth/${platformId}`)
            if (res.ok) {
                const config = await res.json()
                const { authUrl, clientId, scope, redirectUri } = config

                // Construct the full OAuth URL
                const url = new URL(authUrl)
                url.searchParams.append("client_id", clientId)
                url.searchParams.append("redirect_uri", redirectUri)
                url.searchParams.append("response_type", "code")
                url.searchParams.append("scope", scope)
                url.searchParams.append("access_type", "offline") // For Google refresh tokens
                url.searchParams.append("prompt", "consent")

                // Open popup
                const width = 600
                const height = 700
                const left = window.screenX + (window.innerWidth - width) / 2
                const top = window.screenY + (window.innerHeight - height) / 2
                const popup = window.open(
                    url.toString(),
                    "oauth-popup",
                    `width=${width},height=${height},left=${left},top=${top}`
                )

                // Listen for message from callback
                const handleMessage = async (event: MessageEvent) => {
                    if (event.origin !== window.location.origin) return
                    if (event.data?.type === "OAUTH_CALLBACK") {
                        window.removeEventListener("message", handleMessage)
                        const { code, error: callbackError } = event.data

                        if (callbackError) {
                            setError(`Erro na autenticação: ${callbackError}`)
                            return
                        }

                        if (code) {
                            // Exchange code for tokens
                            const tokenRes = await fetch(`/api/integrations/oauth/${platformId}`, {
                                method: "POST",
                                body: JSON.stringify({ code }),
                            })

                            if (tokenRes.ok) {
                                const tokens = await tokenRes.json()
                                onConnect({
                                    name: `${platformName} Account`,
                                    platform: platformId,
                                    ...tokens,
                                })
                                onClose()
                            } else {
                                setError("Falha ao trocar código por token de acesso.")
                            }
                        }
                    }
                }

                window.addEventListener("message", handleMessage)

                // Cleanup listener if popup is closed manually
                const checkPopup = setInterval(() => {
                    if (!popup || popup.closed) {
                        clearInterval(checkPopup)
                        window.removeEventListener("message", handleMessage)
                    }
                }, 1000)
            } else {
                const errorText = await res.text()
                setError(errorText || "Erro ao iniciar conexão OAuth.")
            }
        } catch (error) {
            console.error("OAuth Error:", error)
            setError("Erro interno ao tentar conectar.")
        }
    }

    const getFields = () => {
        if (platformName === "Hotmart") {
            return [
                { name: "name", label: "Nome da Conta", type: "text" },
                { name: "apiKey", label: "Hotmart Token (API)", type: "password" },
                { name: "accountId", label: "ID do Usuário", type: "text" },
            ]
        }
        if (platformName === "Eduzz") {
            return [
                { name: "name", label: "Nome da Conta", type: "text" },
                { name: "apiKey", label: "Eduzz API Key", type: "password" },
                { name: "accountId", label: "Public Key", type: "text" },
            ]
        }
        return fields
    }

    const activeFields = getFields()

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] glass border-white/10 bg-black/80 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-white">Conectar {platformName}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {isOAuthPlatform
                            ? "Faça login para autorizar o acesso direto à sua conta."
                            : "Configure sua conexão e defina a região de atuação."}
                    </DialogDescription>
                </DialogHeader>

                {isOAuthPlatform ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-4">
                        <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            <Key className="w-12 h-12 text-indigo-400" />
                        </div>
                        <p className="text-sm text-center text-gray-400 max-w-[300px]">
                            Você será redirecionado para a página de autorização do {platformName}.
                        </p>
                        {error && (
                            <div className="w-full p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                                {error}
                            </div>
                        )}
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={handleOAuthConnect}
                        >
                            Conectar com {platformName}
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 py-4">
                            {activeFields.map((field) => (
                                <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor={field.name} className="text-right text-gray-300">
                                        {field.label}
                                    </Label>
                                    <Input
                                        id={field.name}
                                        type={field.type || "text"}
                                        className="col-span-3 bg-white/5 border-white/10 text-white"
                                        value={formData[field.name] || ""}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                    />
                                </div>
                            ))}

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-gray-300">País Alvo</Label>
                                <Select onValueChange={(value) => handleChange("targetCountry", value)}>
                                    <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
                                        <SelectValue placeholder="Selecione o país" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BR">Brasil 🇧🇷</SelectItem>
                                        <SelectItem value="US">Estados Unidos 🇺🇸</SelectItem>
                                        <SelectItem value="PT">Portugal 🇵🇹</SelectItem>
                                        <SelectItem value="ES">Espanha 🇪🇸</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="targetState" className="text-right text-gray-300">Estado</Label>
                                <Input
                                    id="targetState"
                                    placeholder="Ex: SP, California"
                                    className="col-span-3 bg-white/5 border-white/10 text-white"
                                    value={formData["targetState"] || ""}
                                    onChange={(e) => handleChange("targetState", e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="targetCity" className="text-right text-gray-300">Cidade</Label>
                                <Input
                                    id="targetCity"
                                    placeholder="Ex: São Paulo, Los Angeles"
                                    className="col-span-3 bg-white/5 border-white/10 text-white"
                                    value={formData["targetCity"] || ""}
                                    onChange={(e) => handleChange("targetCity", e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                Salvar Conexão
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
