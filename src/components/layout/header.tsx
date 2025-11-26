import { Button } from "@/components/ui/button"
import { Bell, User } from "lucide-react"

export function Header() {
    return (
        <div className="flex items-center justify-end p-4 border-b h-16 bg-background">
            <div className="flex items-center gap-x-4">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>
        </div>
    )
}
