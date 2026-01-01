"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
    const [locale, setLocale] = useState("pt")
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Get locale from localStorage or default to 'pt'
        const savedLocale = localStorage.getItem("locale") || "pt"
        setLocale(savedLocale)
    }, [])

    const switchLanguage = (newLocale: string) => {
        // Save locale preference
        localStorage.setItem("locale", newLocale)
        setLocale(newLocale)

        // Reload the page to apply new locale
        window.location.reload()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Languages className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900 border-white/10 text-white">
                <DropdownMenuItem
                    onClick={() => switchLanguage("pt")}
                    className={locale === "pt" ? "bg-indigo-600" : ""}
                >
                    Português (BR)
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => switchLanguage("en")}
                    className={locale === "en" ? "bg-indigo-600" : ""}
                >
                    English (US)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
