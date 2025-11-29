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
    const [showMobileMenu, setShowMobileMenu] = useState(false)

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

            {/* Sidebar - always rendered for mobile */}
            <Sidebar showMobile={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

            <main className="md:pl-72 h-full">
                <Header onMenuClick={() => setShowMobileMenu(!showMobileMenu)} />
                <div className="p-4 md:p-8">{children}</div>
            </main>
        </div>
    )
}
