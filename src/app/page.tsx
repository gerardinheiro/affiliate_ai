import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, MousePointerClick, ShoppingBag, Activity } from "lucide-react"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getDashboardStats(userId: string) {
  const [products, campaigns] = await Promise.all([
    db.product.count({ where: { userId } }),
    db.campaign.findMany({ where: { userId } }),
  ])

  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0)
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0.0"

  return {
    revenue: totalRevenue,
    clicks: totalClicks,
    products,
    conversionRate,
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const userId = (session.user as any).id
  const stats = await getDashboardStats(userId)

  const statsCards = [
    {
      title: "Receita Total",
      value: `R$ ${stats.revenue.toFixed(2)}`,
      description: stats.revenue > 0 ? "Baseado nas suas campanhas" : "Comece criando campanhas",
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: "Cliques em Links",
      value: `${stats.clicks}`,
      description: stats.clicks > 0 ? "Total de cliques" : "Nenhum clique ainda",
      icon: MousePointerClick,
      color: "text-blue-500",
    },
    {
      title: "Produtos Ativos",
      value: `${stats.products}`,
      description: stats.products > 0 ? `${stats.products} produtos cadastrados` : "Adicione seus primeiros produtos",
      icon: ShoppingBag,
      color: "text-violet-500",
    },
    {
      title: "Taxa de Conversão",
      value: `${stats.conversionRate}%`,
      description: stats.clicks > 0 ? "Baseado nos cliques" : "Aguardando dados",
      icon: Activity,
      color: "text-pink-500",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Visão Geral de Vendas</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Gráfico de Vendas (Em Breve)
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {stats.products === 0 && stats.clicks === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma atividade ainda. Comece adicionando produtos!
                  </p>
                ) : (
                  <>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {stats.products} Produtos Cadastrados
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total de produtos ativos
                        </p>
                      </div>
                      <div className="ml-auto font-medium text-blue-500">{stats.products}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Cliques Totais
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Através das suas campanhas
                        </p>
                      </div>
                      <div className="ml-auto font-medium text-emerald-500">{stats.clicks}</div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
