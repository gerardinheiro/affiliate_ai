"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Confetti from "react-confetti"

interface Badge {
    id: string
    name: string
    description: string
    icon: string
    rarity: "common" | "rare" | "epic" | "legendary"
    xpReward: number
}

interface BadgeUnlockedModalProps {
    badges: Badge[]
    onClose: () => void
}

const rarityColors = {
    common: "from-gray-400 to-gray-600",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-orange-600",
}

const rarityGlow = {
    common: "shadow-gray-500/50",
    rare: "shadow-blue-500/50",
    epic: "shadow-purple-500/50",
    legendary: "shadow-yellow-500/50",
}

export function BadgeUnlockedModal({ badges, onClose }: BadgeUnlockedModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showConfetti, setShowConfetti] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000)
        return () => clearTimeout(timer)
    }, [])

    const currentBadge = badges[currentIndex]

    const handleNext = () => {
        if (currentIndex < badges.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            onClose()
        }
    }

    return (
        <>
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={200}
                />
            )}

            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-md mx-4"
                    >
                        <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 shadow-2xl">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="flex justify-center"
                                >
                                    <Sparkles className="w-8 h-8 text-yellow-400" />
                                </motion.div>

                                <h2 className="text-2xl font-bold text-white">
                                    Conquista Desbloqueada!
                                </h2>

                                <motion.div
                                    initial={{ scale: 0, rotateY: 0 }}
                                    animate={{ scale: 1, rotateY: 360 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${rarityColors[currentBadge.rarity]
                                        } shadow-2xl ${rarityGlow[currentBadge.rarity]}`}
                                >
                                    <span className="text-6xl">{currentBadge.icon}</span>
                                </motion.div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">
                                        {currentBadge.name}
                                    </h3>
                                    <p className="text-gray-400">{currentBadge.description}</p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10">
                                        <span className="text-sm font-medium text-white capitalize">
                                            {currentBadge.rarity}
                                        </span>
                                    </div>
                                    {currentBadge.xpReward > 0 && (
                                        <p className="text-sm text-indigo-400">
                                            +{currentBadge.xpReward} XP
                                        </p>
                                    )}
                                </div>

                                {badges.length > 1 && (
                                    <p className="text-sm text-gray-500">
                                        {currentIndex + 1} de {badges.length}
                                    </p>
                                )}

                                <Button
                                    onClick={handleNext}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                >
                                    {currentIndex < badges.length - 1 ? "Próximo" : "Continuar"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        </>
    )
}
