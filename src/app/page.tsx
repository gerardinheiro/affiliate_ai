"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/auth/login-modal"
import { Globe, ArrowRight, CheckCircle2, BarChart3, Zap, Shield } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [accessCount, setAccessCount] = useState(0)

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  useEffect(() => {
    // Track page view
    fetch("/api/page-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "/" }),
    })

    // Fetch access count
    fetch("/api/page-views?page=/")
      .then(res => res.json())
      .then(data => setAccessCount(data.count))
      .catch(err => console.error("Error fetching access count:", err))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-indigo-500" />
            <span className="text-xl font-bold text-white">Affiliate<span className="text-indigo-500">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Funcionalidades
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Como Funciona
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Preços
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <LoginModal>
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Entrar
              </Button>
            </LoginModal>
            <LoginModal>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Começar Agora
              </Button>
            </LoginModal>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-sm font-medium">Plataforma em Crescimento</span>
          </div>
          <div className="text-xs text-gray-400 mb-6">
            🎯 {accessCount.toLocaleString()}+ acessos
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-slide-in">
            Automatize suas Vendas com <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Inteligência Artificial</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in delay-100">
            Crie campanhas, gerencie produtos e otimize seus resultados em uma única plataforma. Aumente seu ROI com o poder da IA.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-200">
            <LoginModal>
              <Button size="lg" className="h-12 px-8 text-lg bg-white text-indigo-900 hover:bg-gray-100 w-full sm:w-auto">
                Começar Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </LoginModal>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl glass border border-white/10 hover:border-indigo-500/30 transition-all hover-lift">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Automação Inteligente</h3>
              <p className="text-gray-400">
                Nossa IA cria copys, seleciona imagens e otimiza suas campanhas automaticamente para maximizar conversões.
              </p>
            </div>
            <div className="p-8 rounded-2xl glass border border-white/10 hover:border-indigo-500/30 transition-all hover-lift">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Analytics em Tempo Real</h3>
              <p className="text-gray-400">
                Acompanhe cada clique e venda. Dashboards detalhados para você tomar decisões baseadas em dados.
              </p>
            </div>
            <div className="p-8 rounded-2xl glass border border-white/10 hover:border-indigo-500/30 transition-all hover-lift">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Gestão Centralizada</h3>
              <p className="text-gray-400">
                Gerencie todos os seus produtos e campanhas de diferentes plataformas em um único lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Como Funciona</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Simples, rápido e eficiente. Comece a vender em minutos.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">1</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Conecte suas Contas</h3>
                  <p className="text-gray-400">Integre suas plataformas de afiliados e redes sociais com apenas alguns cliques.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">2</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Selecione os Produtos</h3>
                  <p className="text-gray-400">Escolha os melhores produtos para promover. Nossa IA sugere os mais rentáveis.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">3</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Lance Campanhas</h3>
                  <p className="text-gray-400">A IA gera o conteúdo e publica suas campanhas automaticamente.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-3xl opacity-20 rounded-full"></div>
              <div className="relative glass rounded-2xl p-6 border border-white/10">
                <div className="space-y-4">
                  <div className="h-8 bg-white/10 rounded w-3/4"></div>
                  <div className="h-32 bg-white/5 rounded w-full"></div>
                  <div className="flex gap-4">
                    <div className="h-20 bg-white/5 rounded w-1/2"></div>
                    <div className="h-20 bg-white/5 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black/40 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-indigo-500" />
              <span className="text-lg font-bold text-white">Affiliate<span className="text-indigo-500">AI</span></span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2024 AffiliateAI. Todos os direitos reservados.
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Termos</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacidade</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
