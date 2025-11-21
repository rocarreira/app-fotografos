import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validação rigorosa das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === '' || supabaseAnonKey === '') {
  throw new Error(
    '⚠️ ERRO: Variáveis de ambiente do Supabase não configuradas.\n\n' +
    'Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.\n' +
    'Vá em Configurações do Projeto -> Integrações -> Conectar Supabase'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string
          status: 'lead' | 'contacted' | 'negotiating' | 'closed' | 'lost'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      quotes: {
        Row: {
          id: string
          user_id: string
          client_id: string
          photography_type: string
          description: string
          price: number
          status: 'draft' | 'sent' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['quotes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['quotes']['Insert']>
      }
      jobs: {
        Row: {
          id: string
          user_id: string
          client_id: string
          quote_id: string | null
          title: string
          date: string
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          checklist: string[]
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>
      }
      email_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          subject: string
          body: string
          type: 'quote' | 'follow_up' | 'confirmation' | 'custom'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['email_templates']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['email_templates']['Insert']>
      }
      portfolio_items: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          image_url: string
          category: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['portfolio_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['portfolio_items']['Insert']>
      }
    }
  }
}
