"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Mail } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                    <div className="relative w-12 h-12 mr-4">
                        <Globe className="w-12 h-12 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">
                        Affiliate<span className="text-indigo-600">AI</span>
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Sua plataforma de automação de vendas.
                </p>
            </div>

            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Entrar na conta</CardTitle>
                    <CardDescription className="text-center">
                        Escolha uma opção para continuar
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button variant="outline" onClick={() => signIn("google", { callbackUrl: "/" })}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Continuar com Google
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Ou continue com email
                            </span>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                const email = (e.target as any).email.value
                                const password = (e.target as any).password.value
                                signIn("credentials", { email, password, callbackUrl: "/" })
                            }}
                            className="grid gap-2"
                        >
                            <div className="grid gap-1">
                                <input
                                    name="email"
                                    placeholder="Email (admin@admin.com)"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    defaultValue="admin@admin.com"
                                />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Senha (admin)"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    defaultValue="admin"
                                />
                            </div>
                            <Button>
                                <Mail className="mr-2 h-4 w-4" />
                                Entrar com Email
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>

            <p className="mt-4 text-center text-sm text-muted-foreground">
                Ao clicar em continuar, você concorda com nossos{" "}
                <Link href="/terms" className="underline hover:text-primary">
                    Termos de Serviço
                </Link>{" "}
                e{" "}
                <Link href="/privacy" className="underline hover:text-primary">
                    Política de Privacidade
                </Link>
                .
            </p>
        </div>
    )
}
