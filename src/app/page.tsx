import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, MousePointerClick, ShoppingBag, Activity } from "lucide-react"

const stats = [
  {
    title: "Receita Total",
    value: "R$ 12.450,00",
    description: "+20.1% desde o último mês",
    icon: DollarSign,
    color: "text-emerald-500",
  },
  {
    title: "Cliques em Links",
    value: "+2350",
    description: "+180.1% desde o último mês",
    icon: MousePointerClick,
    color: "text-blue-500",
  },
  {
    title: "Produtos Ativos",
    value: "12",
    description: "+4 novos produtos esta semana",
    icon: ShoppingBag,
    color: "text-violet-500",
  },
  {
    title: "Taxa de Conversão",
    value: "2.4%",
    description: "+0.4% desde a última semana",
    icon: Activity,
    color: "text-pink-500",
  },
]

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
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
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Nova venda: Curso de Marketing
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hotmart - R$ 197,00
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-emerald-500">+R$ 89,00</div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Campanha Publicada
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Google Ads - "Fone Bluetooth"
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-blue-500">Ativo</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
