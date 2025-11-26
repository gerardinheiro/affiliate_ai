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
        { name: "apiKey", label: "API Key", type: "text" },
        { name: "accountId", label: "Account ID / Affiliate ID", type: "text" },
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Conectar {platformName}</DialogTitle>
                    <DialogDescription>
                        {isOAuthPlatform
                            ? "Faça login para autorizar o acesso."
                            : "Insira suas credenciais para conectar o sistema."}
                    </DialogDescription>
                </DialogHeader>

                {isOAuthPlatform ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-4">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                                // Simulate OAuth window
                                const width = 600;
                                const height = 600;
                                const left = window.screen.width / 2 - width / 2;
                                const top = window.screen.height / 2 - height / 2;
                                window.open(
                                    `https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin`,
                                    "oauth",
                                    `width=${width},height=${height},top=${top},left=${left}`
                                );

                                // Simulate success after delay
                                setTimeout(() => {
                                    onConnect({ token: "oauth-mock-token" });
                                    onClose();
                                }, 3000);
                            }}
                        >
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                            Conectar com {platformName}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            Você será redirecionado para a página segura de login.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 py-4">
                            {fields.map((field) => (
                                <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor={field.name} className="text-right">
                                        {field.label}
                                    </Label>
                                    <Input
                                        id={field.name}
                                        type={field.type || "text"}
                                        className="col-span-3"
                                        value={formData[field.name] || ""}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleSubmit}>
                                Salvar Conexão
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
