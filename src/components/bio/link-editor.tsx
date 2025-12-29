"use client"

import { useState } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { BioLink } from "@/types/bio"

interface LinkEditorProps {
    links: BioLink[]
    onReorder: (links: BioLink[]) => void
    onDelete: (id: string) => void
}

function SortableLink({ link, onDelete }: { link: BioLink, onDelete: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: link.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1
    }

    return (
        <div ref={setNodeRef} style={style} className="mb-3">
            <Card className="p-4 flex items-center gap-4 bg-white/5 border-white/10 hover:border-white/20 transition-colors">
                <div {...attributes} {...listeners} className="cursor-move text-gray-500 hover:text-white transition-colors">
                    <GripVertical className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{link.title}</h4>
                    <p className="text-sm text-gray-400 truncate">{link.url}</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Future: Edit Button */}
                    {/* <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                        <Pencil className="w-4 h-4" />
                    </Button> */}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        onClick={() => onDelete(link.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export function LinkEditor({ links, onReorder, onDelete }: LinkEditorProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = links.findIndex((item) => item.id === active.id)
            const newIndex = links.findIndex((item) => item.id === over.id)

            const newLinks = arrayMove(links, oldIndex, newIndex)

            // Update order property
            const updatedLinks = newLinks.map((link, index) => ({
                ...link,
                order: index
            }))

            onReorder(updatedLinks)
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={links.map(l => l.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3">
                    {links.map((link) => (
                        <SortableLink key={link.id} link={link} onDelete={onDelete} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}
