"use client"

import { useEffect, useRef } from "react"

export function BioTracker({ bioPageId }: { bioPageId: string }) {
    const hasTracked = useRef(false)

    useEffect(() => {
        if (hasTracked.current) return
        hasTracked.current = true

        fetch("/api/bio/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "view", bioPageId })
        }).catch(err => console.error("Failed to track view", err))
    }, [bioPageId])

    return null
}
