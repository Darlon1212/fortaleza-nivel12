import { createClient } from '@supabase/supabase-js'

// Verificar se as variáveis de ambiente estão configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Só criar o cliente se as variáveis estiverem configuradas
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Tipos para a tabela de usuários
export interface Usuario {
  id: string
  email: string
  nome: string
  telefone?: string
  data_registro: string
  ativo: boolean
  tags?: string[]
}

// Tipos para campanhas de email
export interface CampanhaEmail {
  id: string
  titulo: string
  assunto: string
  conteudo: string
  data_criacao: string
  data_envio?: string
  status: 'rascunho' | 'enviando' | 'enviado' | 'erro'
  total_destinatarios: number
  total_enviados: number
  total_erros: number
}