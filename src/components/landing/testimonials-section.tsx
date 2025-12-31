"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
    {
        name: "Maria Silva",
        role: "Afiliada Digital",
        company: "Marketing Online",
        avatar: "MS",
        rating: 5,
        text: "A plataforma revolucionou minha forma de trabalhar com marketing de afiliados. A IA economiza horas do meu tempo criando copys incríveis. Meus resultados aumentaram 300% em 2 meses!",
    },
    {
        name: "João Santos",
        role: "Gestor de Tráfego",
        company: "Agência Digital Pro",
        avatar: "JS",
        rating: 5,
        text: "Incrível! Consigo gerenciar todos os meus produtos e campanhas em um só lugar. A automação social é um divisor de águas. Recomendo para qualquer profissional sério de marketing.",
    },
    {
        name: "Ana Costa",
        role: "Criadora de Conteúdo",
        company: "Influencer",
        avatar: "AC",
        rating: 5,
        text: "Nunca foi tão fácil monetizar meu conteúdo. A Bio Page é linda e funcional, e os analytics me ajudam a entender melhor minha audiência. Ferramenta essencial!",
    },
    {
        name: "Pedro Oliveira",
        role: "Empreendedor Digital",
        company: "Startup Tech",
        avatar: "PO",
        rating: 5,
        text: "A melhor plataforma de afiliados que já usei. A interface é intuitiva, os recursos são poderosos e o suporte é excepcional. Vale cada centavo!",
    },
    {
        name: "Carla Mendes",
        role: "Social Media Manager",
        company: "Agência Criativa",
        avatar: "CM",
        rating: 5,
        text: "Uso para gerenciar múltiplos clientes e a plataforma facilita muito meu trabalho. Os criativos gerados pela IA são de altíssima qualidade. Economizo horas toda semana!",
    },
    {
        name: "Ricardo Alves",
        role: "Consultor de Marketing",
        company: "Consultoria Digital",
        avatar: "RA",
        rating: 5,
        text: "Ferramenta completa e profissional. Recomendo para todos os meus clientes. O ROI é impressionante e a curva de aprendizado é muito rápida.",
    },
]

export function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const goToPrevious = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    const goToNext = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const currentTestimonial = testimonials[currentIndex]

    return (
        <section className="py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        O Que Nossos Clientes Dizem
                    </h2>
                    <p className="text-xl text-gray-400">
                        Junte-se a milhares de profissionais satisfeitos
                    </p>
                </div>

                <div className="relative">
                    {/* Main Testimonial Card */}
                    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-white/10 overflow-hidden">
                        <CardContent className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                                        {currentTestimonial.avatar}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-center md:text-left">
                                    <Quote className="w-12 h-12 text-indigo-500/30 mb-4 mx-auto md:mx-0" />

                                    {/* Rating */}
                                    <div className="flex gap-1 mb-4 justify-center md:justify-start">
                                        {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                        ))}
                                    </div>

                                    {/* Text */}
                                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                        &quot;{currentTestimonial.text}&quot;
                                    </p>

                                    {/* Author */}
                                    <div>
                                        <p className="text-white font-semibold text-lg">
                                            {currentTestimonial.name}
                                        </p>
                                        <p className="text-gray-400">
                                            {currentTestimonial.role} • {currentTestimonial.company}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToPrevious}
                            className="bg-white/5 border-white/10 hover:bg-white/10"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setIsAutoPlaying(false)
                                        setCurrentIndex(index)
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                        ? "bg-indigo-500 w-8"
                                        : "bg-white/20 hover:bg-white/40"
                                        }`}
                                />
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToNext}
                            className="bg-white/5 border-white/10 hover:bg-white/10"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Small Testimonial Grid (Desktop Only) */}
                <div className="hidden lg:grid grid-cols-3 gap-4 mt-12">
                    {testimonials.slice(0, 3).map((testimonial, index) => (
                        <Card
                            key={index}
                            className="bg-gray-900 border-white/10 hover:border-indigo-500/30 transition-all cursor-pointer"
                            onClick={() => {
                                setIsAutoPlaying(false)
                                setCurrentIndex(index)
                            }}
                        >
                            <CardContent className="p-6">
                                <div className="flex gap-1 mb-3">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                                    &quot;{testimonial.text}&quot;
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-gray-500 text-xs">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
