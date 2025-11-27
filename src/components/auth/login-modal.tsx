"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Globe, Mail } from "lucide-react"
import { signIn } from "next-auth/react"
import { useState } from "react"

export function LoginModal({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        await signIn("google", { callbackUrl: "/dashboard" })
    }

    const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        const email = (e.currentTarget as any).email.value
        const password = (e.currentTarget as any).password.value
        await signIn("credentials", { email, password, callbackUrl: "/dashboard" })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md glass border-white/10 bg-black/80 backdrop-blur-xl">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-2xl font-bold text-center text-white">Entrar na conta</DialogTitle>
                    <DialogDescription className="text-center text-gray-400">
                        Escolha uma opção para continuar
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Button
                        variant="outline"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-gray-200"
                    >
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Continuar com Google
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-transparent px-2 text-gray-400">
                                Ou continue com email
                            </span>
                        </div>
                    </div>
                    <form onSubmit={handleEmailLogin} className="grid gap-2">
                        <div className="grid gap-1">
                            <input
                                name="email"
                                placeholder="Email (admin@admin.com)"
                                className="flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                defaultValue="admin@admin.com"
                                disabled={isLoading}
                            />
                            <input
                                name="password"
                                type="password"
                                placeholder="Senha (admin)"
                                className="flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                defaultValue="admin"
                                disabled={isLoading}
                            />
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                            <Mail className="mr-2 h-4 w-4" />
                            Entrar com Email
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
