"use client"

import { useLocale } from "next-intl"
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
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const switchLanguage = (newLocale: string) => {
        // next-intl middleware handles the locale prefix in the URL
        // We just need to replace the current locale prefix with the new one
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`)
        router.push(newPathname)
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
