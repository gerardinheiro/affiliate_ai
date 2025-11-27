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
    onConnect: (data: any) => void
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

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
        onConnect(formData)
        onClose()
    }

    const isOAuthPlatform = platformName.includes("Google") || platformName.includes("Meta") || platformName.includes("Facebook")

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] glass border-white/10 bg-black/80 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-white">Conectar {platformName}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {isOAuthPlatform
                            ? "Faça login para autorizar o acesso."
                            : "Configure sua conexão e defina a região de atuação."}
                    </DialogDescription>
                </DialogHeader>

                {isOAuthPlatform ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-4">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                                setTimeout(() => {
                                    onConnect({ token: "oauth-mock-token", name: `${platformName} Account` });
                                    onClose();
                                }, 2000);
                            }}
                        >
                            Conectar com {platformName}
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 py-4">
                            {fields.map((field) => (
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
