import DashboardLayout from "@/components/layout/dashboard-layout"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StatsDashboard } from "@/components/dashboard/stats-dashboard"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect("/login")
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                </div>

                <StatsDashboard />
            </div>
        </DashboardLayout>
    )
}
