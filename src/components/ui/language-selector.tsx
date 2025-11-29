"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe, Check } from "lucide-react"
import { useLocale } from "@/contexts/locale-context"

export function LanguageSelector() {
    const { locale, setLocale } = useLocale()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Globe className="h-5 w-5" />
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-12 z-50 min-w-[150px] glass border border-white/10 bg-black/90 backdrop-blur-xl rounded-md shadow-lg p-1">
                        <button
                            onClick={() => {
                                setLocale('pt-BR')
                                setIsOpen(false)
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-sm hover:bg-white/10 transition-colors ${locale === 'pt-BR' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-300'
                                }`}
                        >
                            <span>🇧🇷 Português</span>
                            {locale === 'pt-BR' && <Check className="h-4 w-4" />}
                        </button>
                        <button
                            onClick={() => {
                                setLocale('en')
                                setIsOpen(false)
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-sm hover:bg-white/10 transition-colors ${locale === 'en' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-300'
                                }`}
                        >
                            <span>🇺🇸 English</span>
                            {locale === 'en' && <Check className="h-4 w-4" />}
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
