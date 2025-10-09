import { NextRequest, NextResponse } from 'next/server'

// Função para verificar se o Supabase está configurado
function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function GET() {
  try {
    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Supabase não configurado',
        campanhas: [],
        estatisticas: {
          total_usuarios: 0,
          usuarios_ativos: 0,
          total_campanhas: 0
        }
      })
    }

    // Importar Supabase apenas se estiver configurado
    const { supabase } = await import('@/lib/supabase')

    // Buscar campanhas
    const { data: campanhas, error: campanhasError } = await supabase
      .from('campanhas_email')
      .select('*')
      .order('data_criacao', { ascending: false })

    if (campanhasError) {
      console.error('Erro ao buscar campanhas:', campanhasError)
      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar campanhas',
        campanhas: [],
        estatisticas: {
          total_usuarios: 0,
          usuarios_ativos: 0,
          total_campanhas: 0
        }
      })
    }

    // Buscar estatísticas gerais
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, ativo')

    if (usuariosError) {
      console.error('Erro ao buscar usuários:', usuariosError)
      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar estatísticas',
        campanhas: campanhas || [],
        estatisticas: {
          total_usuarios: 0,
          usuarios_ativos: 0,
          total_campanhas: campanhas?.length || 0
        }
      })
    }

    const totalUsuarios = usuarios?.length || 0
    const usuariosAtivos = usuarios?.filter(u => u.ativo).length || 0

    return NextResponse.json({
      success: true,
      campanhas: campanhas || [],
      estatisticas: {
        total_usuarios: totalUsuarios,
        usuarios_ativos: usuariosAtivos,
        total_campanhas: campanhas?.length || 0
      }
    })

  } catch (error) {
    console.error('Erro na API de campanhas:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      campanhas: [],
      estatisticas: {
        total_usuarios: 0,
        usuarios_ativos: 0,
        total_campanhas: 0
      }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Supabase não configurado - sistema em modo demonstração'
      })
    }

    const { email, nome, telefone, tags } = await request.json()

    if (!email || !nome) {
      return NextResponse.json({
        success: false,
        error: 'Email e nome são obrigatórios'
      }, { status: 400 })
    }

    // Importar Supabase apenas se estiver configurado
    const { supabase } = await import('@/lib/supabase')

    // Inserir novo usuário
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .insert({
        email,
        nome,
        telefone,
        tags: tags || []
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({
          success: false,
          error: 'Este email já está cadastrado'
        }, { status: 409 })
      }
      
      console.error('Erro ao criar usuário:', error)
      return NextResponse.json({
        success: false,
        error: 'Erro ao criar usuário'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      usuario,
      message: 'Usuário cadastrado com sucesso!'
    })

  } catch (error) {
    console.error('Erro na API de usuários:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}