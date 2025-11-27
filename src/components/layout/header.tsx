"use client"

import { Button } from "@/components/ui/button"
import { Bell, User, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function Header() {
    return (
        <div className="flex items-center justify-end p-4 border-b border-white/10 h-16 glass">
            <div className="flex items-center gap-x-4">
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                    <Bell className="h-5 w-5 text-gray-300" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                    <User className="h-5 w-5 text-gray-300" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-500/10 hover:text-red-400 text-gray-300"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    title="Sair"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
