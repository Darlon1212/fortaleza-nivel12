import { NextRequest, NextResponse } from 'next/server'

// Função para verificar se o Supabase está configurado
function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
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

    const { assunto, conteudo, filtros } = await request.json()

    if (!assunto || !conteudo) {
      return NextResponse.json({
        success: false,
        error: 'Assunto e conteúdo são obrigatórios'
      }, { status: 400 })
    }

    // Importar dependências apenas se Supabase estiver configurado
    const { supabase } = await import('@/lib/supabase')
    const { enviarEmailsEmMassa } = await import('@/lib/email')

    // Buscar usuários baseado nos filtros
    let query = supabase
      .from('usuarios')
      .select('id, email, nome')
      .eq('ativo', true)

    // Aplicar filtros se fornecidos
    if (filtros?.tags && filtros.tags.length > 0) {
      query = query.overlaps('tags', filtros.tags)
    }

    const { data: usuarios, error: usuariosError } = await query

    if (usuariosError) {
      console.error('Erro ao buscar usuários:', usuariosError)
      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar usuários'
      }, { status: 500 })
    }

    if (!usuarios || usuarios.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Nenhum usuário encontrado com os filtros especificados'
      }, { status: 404 })
    }

    // Criar campanha no banco
    const { data: campanha, error: campanhaError } = await supabase
      .from('campanhas_email')
      .insert({
        titulo: `Campanha - ${assunto}`,
        assunto,
        conteudo,
        status: 'enviando',
        total_destinatarios: usuarios.length
      })
      .select()
      .single()

    if (campanhaError) {
      console.error('Erro ao criar campanha:', campanhaError)
      return NextResponse.json({
        success: false,
        error: 'Erro ao criar campanha'
      }, { status: 500 })
    }

    // Extrair emails dos usuários
    const emails = usuarios.map(usuario => usuario.email)

    // Personalizar conteúdo HTML
    const conteudoPersonalizado = (email: string, nome: string) => {
      return conteudo
        .replace(/\{nome\}/g, nome)
        .replace(/\{email\}/g, email)
    }

    // Enviar emails
    let totalEnviados = 0
    let totalErros = 0

    for (const usuario of usuarios) {
      try {
        const htmlPersonalizado = conteudoPersonalizado(usuario.email, usuario.nome)
        
        const sucesso = await enviarEmailsEmMassa(
          [usuario.email],
          assunto,
          htmlPersonalizado
        )

        if (sucesso.sucessos > 0) {
          totalEnviados++
          
          // Log de sucesso
          await supabase.from('logs_envio_email').insert({
            campanha_id: campanha.id,
            usuario_id: usuario.id,
            email: usuario.email,
            status: 'enviado'
          })
        } else {
          totalErros++
          
          // Log de erro
          await supabase.from('logs_envio_email').insert({
            campanha_id: campanha.id,
            usuario_id: usuario.id,
            email: usuario.email,
            status: 'erro',
            erro_mensagem: sucesso.detalhes[0]?.erro || 'Erro desconhecido'
          })
        }
      } catch (error) {
        totalErros++
        console.error(`Erro ao enviar para ${usuario.email}:`, error)
        
        // Log de erro
        await supabase.from('logs_envio_email').insert({
          campanha_id: campanha.id,
          usuario_id: usuario.id,
          email: usuario.email,
          status: 'erro',
          erro_mensagem: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    }

    // Atualizar campanha com resultados
    await supabase
      .from('campanhas_email')
      .update({
        status: totalErros === 0 ? 'enviado' : 'erro',
        total_enviados: totalEnviados,
        total_erros: totalErros,
        data_envio: new Date().toISOString()
      })
      .eq('id', campanha.id)

    return NextResponse.json({
      success: true,
      campanha_id: campanha.id,
      total_destinatarios: usuarios.length,
      total_enviados: totalEnviados,
      total_erros: totalErros,
      message: `Campanha finalizada! ${totalEnviados} emails enviados com sucesso, ${totalErros} erros.`
    })

  } catch (error) {
    console.error('Erro na API de envio de emails:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// Endpoint para buscar usuários (para preview)
export async function GET(request: NextRequest) {
  try {
    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Supabase não configurado',
        usuarios: [],
        total: 0
      })
    }

    const { searchParams } = new URL(request.url)
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)

    // Importar Supabase apenas se estiver configurado
    const { supabase } = await import('@/lib/supabase')

    let query = supabase
      .from('usuarios')
      .select('id, email, nome, tags, data_registro')
      .eq('ativo', true)
      .order('data_registro', { ascending: false })

    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags)
    }

    const { data: usuarios, error } = await query

    if (error) {
      console.error('Erro ao buscar usuários:', error)
      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar usuários',
        usuarios: [],
        total: 0
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      usuarios: usuarios || [],
      total: usuarios?.length || 0
    })

  } catch (error) {
    console.error('Erro na API de busca de usuários:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      usuarios: [],
      total: 0
    }, { status: 500 })
  }
}