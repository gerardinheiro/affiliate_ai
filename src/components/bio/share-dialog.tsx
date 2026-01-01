"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

export function ShareDialog({ username }: { username: string }) {
    return (
        <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
        </Button>
    )
}
