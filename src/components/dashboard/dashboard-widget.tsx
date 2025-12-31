"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, EyeOff, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DashboardWidgetProps {
    id: string
    children: React.ReactNode
    isEditing?: boolean
    onHide?: () => void
    className?: string
}

export function DashboardWidget({ id, children, isEditing, onHide, className }: DashboardWidgetProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative group",
                isEditing && "ring-2 ring-indigo-500/20 rounded-xl transition-all",
                className
            )}
        >
            {isEditing && (
                <div className="absolute -top-3 -right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full shadow-lg bg-white text-gray-900 hover:bg-gray-100"
                        onClick={onHide}
                    >
                        <EyeOff className="h-4 w-4" />
                    </Button>
                    <div
                        {...attributes}
                        {...listeners}
                        className="h-8 w-8 rounded-full shadow-lg bg-indigo-600 text-white flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-indigo-700"
                    >
                        <GripVertical className="h-4 w-4" />
                    </div>
                </div>
            )}
            {children}
        </div>
    )
}
