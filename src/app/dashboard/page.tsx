'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Users, FileText, Briefcase, Image, LogOut, Plus } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    clients: 0,
    quotes: 0,
    jobs: 0,
    portfolio: 0
  })

  useEffect(() => {
    checkUser()
    loadStats()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
    }
  }

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [clients, quotes, jobs, portfolio] = await Promise.all([
      supabase.from('clients').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('quotes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('portfolio_items').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ])

    setStats({
      clients: clients.count || 0,
      quotes: quotes.count || 0,
      jobs: jobs.count || 0,
      portfolio: portfolio.count || 0,
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">App Fotógrafos</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Clientes</CardDescription>
              <CardTitle className="text-3xl">{stats.clients}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/clientes">
                <Button variant="outline" size="sm" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Ver Clientes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Orçamentos</CardDescription>
              <CardTitle className="text-3xl">{stats.quotes}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/orcamentos">
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Orçamentos
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Jobs</CardDescription>
              <CardTitle className="text-3xl">{stats.jobs}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/jobs">
                <Button variant="outline" size="sm" className="w-full">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Ver Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Portfólio</CardDescription>
              <CardTitle className="text-3xl">{stats.portfolio}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/portfolio">
                <Button variant="outline" size="sm" className="w-full">
                  <Image className="w-4 h-4 mr-2" />
                  Ver Portfólio
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse as principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link href="/dashboard/clientes/novo">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Novo Cliente</span>
                </Button>
              </Link>
              <Link href="/dashboard/orcamentos/novo">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Novo Orçamento</span>
                </Button>
              </Link>
              <Link href="/dashboard/jobs/novo">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Novo Job</span>
                </Button>
              </Link>
              <Link href="/dashboard/templates">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm">Templates E-mail</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
