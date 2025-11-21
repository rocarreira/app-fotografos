'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Camera, Loader2 } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
        <Camera className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">App Fotógrafos</h1>
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <p className="text-lg">Carregando...</p>
      </div>
    </div>
  )
}
