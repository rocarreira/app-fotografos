'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Search, FileText, Download, Eye, Trash2 } from 'lucide-react'
import jsPDF from 'jspdf'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Quote = {
  id: string
  client_id: string
  photography_type: string
  description: string
  price: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
  created_at: string
  clients?: {
    name: string
    email: string
  }
}

const statusColors = {
  draft: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const statusLabels = {
  draft: 'Rascunho',
  sent: 'Enviado',
  accepted: 'Aceito',
  rejected: 'Rejeitado',
}

export default function OrcamentosPage() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    loadQuotes()
  }, [])

  useEffect(() => {
    const filtered = quotes.filter(quote =>
      quote.photography_type.toLowerCase().includes(search.toLowerCase()) ||
      quote.clients?.name.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredQuotes(filtered)
  }, [search, quotes])

  const loadQuotes = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('quotes')
      .select('*, clients(name, email)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setQuotes(data)
      setFilteredQuotes(data)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', deleteId)

    if (!error) {
      setQuotes(quotes.filter(q => q.id !== deleteId))
      setDeleteId(null)
    }
  }

  const generatePDF = (quote: Quote) => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text('ORÇAMENTO', 105, 20, { align: 'center' })
    
    // Client Info
    doc.setFontSize(12)
    doc.text(`Cliente: ${quote.clients?.name || 'N/A'}`, 20, 40)
    doc.text(`E-mail: ${quote.clients?.email || 'N/A'}`, 20, 50)
    
    // Quote Details
    doc.setFontSize(14)
    doc.text('Detalhes do Serviço', 20, 70)
    doc.setFontSize(11)
    doc.text(`Tipo de Fotografia: ${quote.photography_type}`, 20, 80)
    
    // Description
    doc.text('Descrição:', 20, 95)
    const splitDescription = doc.splitTextToSize(quote.description, 170)
    doc.text(splitDescription, 20, 105)
    
    // Price
    doc.setFontSize(16)
    doc.text(`Valor Total: R$ ${quote.price.toFixed(2)}`, 20, 140)
    
    // Footer
    doc.setFontSize(10)
    doc.text(`Data: ${new Date(quote.created_at).toLocaleDateString('pt-BR')}`, 20, 270)
    
    doc.save(`orcamento-${quote.id}.pdf`)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Orçamentos</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Gerencie seus orçamentos</p>
              </div>
            </div>
            <Link href="/dashboard/orcamentos/novo">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Orçamento
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por tipo de fotografia ou cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quotes List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">Carregando...</p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {search ? 'Nenhum orçamento encontrado' : 'Nenhum orçamento criado ainda'}
              </p>
              {!search && (
                <Link href="/dashboard/orcamentos/novo">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Orçamento
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{quote.photography_type}</CardTitle>
                    <Badge className={statusColors[quote.status]}>
                      {statusLabels[quote.status]}
                    </Badge>
                  </div>
                  <CardDescription>{quote.clients?.name || 'Cliente não encontrado'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {quote.description}
                  </p>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    R$ {quote.price.toFixed(2)}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generatePDF(quote)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(quote.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
