"use client"

import { useState, useEffect } from "react"
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Sparkles, Loader2, Calendar as CalendarIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDay } from "./calendar-day"
import { CalendarEvent } from "@/lib/calendar-service"
import { toast } from "sonner"

interface ContentCalendarProps {
    onSelectDate: (date: Date, initialContent?: string) => void
}

export function ContentCalendar({ onSelectDate }: ContentCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        fetchEvents()
    }, [currentMonth])

    const fetchEvents = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/social/calendar?date=${currentMonth.toISOString()}`)
            if (res.ok) {
                const data = await res.json()
                setEvents(data)
            }
        } catch (error) {
            console.error("Failed to fetch calendar events", error)
            toast.error("Erro ao carregar eventos do calendário")
        } finally {
            setIsLoading(false)
        }
    }

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const handleDayClick = (date: Date, event?: CalendarEvent) => {
        if (event?.type === "suggestion") {
            onSelectDate(date, event.content)
        } else if (event?.type === "post") {
            // In a real app, we might open an edit modal
            onSelectDate(date, event.content)
        } else {
            onSelectDate(date)
        }
    }

    const handleGenerateSuggestion = async () => {
        setIsGenerating(true)
        try {
            const res = await fetch("/api/social/calendar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: currentMonth.toISOString() })
            })

            if (res.ok) {
                const suggestion = await res.json()
                onSelectDate(new Date(suggestion.date), suggestion.content)
                toast.success("Sugestão gerada com sucesso!")
            }
        } catch (error) {
            toast.error("Erro ao gerar sugestão com IA")
        } finally {
            setIsGenerating(false)
        }
    }

    // Calendar Grid Logic
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

    return (
        <Card className="glass border-white/10 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <CardTitle className="text-xl text-white capitalize">
                            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                        </CardTitle>
                        <p className="text-xs text-gray-400">Visualize e agende seu conteúdo</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateSuggestion}
                        disabled={isGenerating}
                        className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        Sugestão IA
                    </Button>
                    <div className="flex items-center border border-white/10 rounded-md overflow-hidden">
                        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-none border-r border-white/10">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-none">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-7 border-b border-white/10">
                    {weekDays.map(day => (
                        <div key={day} className="py-2 text-center text-[10px] font-bold uppercase tracking-wider text-gray-500 border-r border-white/5 last:border-0">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {isLoading ? (
                        <div className="col-span-7 h-[400px] flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        </div>
                    ) : (
                        calendarDays.map((day, i) => (
                            <CalendarDay
                                key={day.toISOString()}
                                day={day}
                                currentMonth={currentMonth}
                                events={events}
                                onClick={handleDayClick}
                            />
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
