"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { WelcomeTour } from "@/components/onboarding/welcome-tour"
import { useEffect, useState } from "react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true) // Default to true to avoid flash

    useEffect(() => {
        fetch("/api/profile")
            .then(res => res.json())
            .then(data => {
                if (data.hasCompletedOnboarding === false) {
                    setHasCompletedOnboarding(false)
                }
            })
            .catch(err => console.error("Error fetching profile:", err))
    }, [])

    return (
        <div className="h-full relative">
            <WelcomeTour hasCompletedOnboarding={hasCompletedOnboarding} />
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-72 h-full">
                <Header />
                <div className="p-8">{children}</div>
            </main>
        </div>
    )
}
