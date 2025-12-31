"use client"

import { Badge } from "@/components/ui/badge"
import { CalendarEvent } from "@/lib/calendar-service"
import { format, isToday, isSameMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Sparkles, Send, Clock } from "lucide-react"

interface CalendarDayProps {
    day: Date
    currentMonth: Date
    events: CalendarEvent[]
    onClick: (date: Date, event?: CalendarEvent) => void
}

export function CalendarDay({ day, currentMonth, events, onClick }: CalendarDayProps) {
    const isCurrentMonth = isSameMonth(day, currentMonth)
    const dayEvents = events.filter(e => isSameDay(new Date(e.date), day))
    const hasSuggestion = dayEvents.some(e => e.type === "suggestion")
    const hasPost = dayEvents.some(e => e.type === "post")

    return (
        <div
            onClick={() => onClick(day)}
            className={`
                min-h-[100px] p-2 border border-white/5 transition-all cursor-pointer
                ${isCurrentMonth ? "bg-white/5 hover:bg-white/10" : "bg-transparent opacity-30"}
                ${isToday(day) ? "ring-1 ring-indigo-500 ring-inset" : ""}
                flex flex-col gap-1
            `}
        >
            <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium ${isToday(day) ? "text-indigo-400" : "text-gray-400"}`}>
                    {format(day, "d")}
                </span>
                {hasSuggestion && (
                    <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                )}
            </div>

            <div className="flex flex-col gap-1 overflow-hidden">
                {dayEvents.map(event => (
                    <div
                        key={event.id}
                        onClick={(e) => {
                            e.stopPropagation()
                            onClick(day, event)
                        }}
                        className={`
                            text-[10px] px-1.5 py-0.5 rounded truncate flex items-center gap-1
                            ${event.type === "suggestion"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : event.status === "published"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            }
                        `}
                    >
                        {event.type === "suggestion" ? <Sparkles className="w-2 h-2" /> : <Send className="w-2 h-2" />}
                        {event.content}
                    </div>
                ))}
            </div>
        </div>
    )
}

function isSameDay(d1: Date, d2: Date) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
}
