'use client'

import { useState, useEffect } from 'react'
import { Mail, Users, Send, Plus, Tag, CheckCircle, Clock, AlertCircle, Eye, Settings } from 'lucide-react'

interface Usuario {
  id: number
  nome: string
  email: string
  telefone?: string
  tags: string[]
  data_cadastro: string
}

interface Campanha {
  id: number
  assunto: string
  conteudo: string
  tags_filtro: string[]
  data_envio: string
  status: 'enviada' | 'rascunho'
  total_destinatarios: number
}

interface NovaCampanha {
  assunto: string
  conteudo: string
  tags: string
}

interface NovoUsuario {
  nome: string
  email: string
  telefone: string
  tags: string
}

export default function DevEmailMarketing() {
  const [activeTab, setActiveTab] = useState<'campanha' | 'usuario' | 'historico'>('campanha')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [campanhas, setCampanhas] = useState<Campanha[]>([])
  const [novaCampanha, setNovaCampanha] = useState<NovaCampanha>({
    assunto: '',
    conteudo: '',
    tags: ''
  })
  const [novoUsuario, setNovoUsuario] = useState<NovoUsuario>({
    nome: '',
    email: '',
    telefone: '',
    tags: ''
  })
  const [enviando, setEnviando] = useState(false)
  const [cadastrando, setCadastrando] = useState(false)
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null)
  const [modoDemo, setModoDemo] = useState(false)

  // Verificação de acesso de desenvolvedor
  const [acessoAutorizado, setAcessoAutorizado] = useState(false)
  const [senhaInput, setSenhaInput] = useState('')

  const verificarAcesso = () => {
    // Senha simples para demonstração - em produção, use autenticação real
    if (senhaInput === 'dev123') {
      setAcessoAutorizado(true)
      localStorage.setItem('dev_access', 'true')
    } else {
      setMensagem({ tipo: 'erro', texto: 'Senha incorreta. Acesso negado.' })
    }
  }

  useEffect(() => {
    // Verificar se já tem acesso salvo
    const accessSaved = localStorage.getItem('dev_access')
    if (accessSaved === 'true') {
      setAcessoAutorizado(true)
    }
  }, [])

  useEffect(() => {
    if (acessoAutorizado) {
      carregarDados()
    }
  }, [acessoAutorizado])

  const carregarDados = async () => {
    try {
      // Tentar carregar dados do Supabase
      const response = await fetch('/api/email/campanhas')
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json()
        
        if (response.ok && !result.error) {
          // Supabase configurado
          setModoDemo(false)
          if (result.campanhas) setCampanhas(result.campanhas)
          // Carregar usuários se necessário
        } else {
          // Erro na API, usar modo demo
          usarModoDemo()
        }
      } else {
        // Resposta não é JSON, usar modo demo
        usarModoDemo()
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      usarModoDemo()
    }
  }

  const usarModoDemo = () => {
    setModoDemo(true)
    setUsuarios([
      {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '(11) 99999-1111',
        tags: ['tecnologia', 'marketing'],
        data_cadastro: '2024-01-15'
      },
      {
        id: 2,
        nome: 'Maria Santos',
        email: 'maria@email.com',
        telefone: '(11) 99999-2222',
        tags: ['vendas', 'gestão'],
        data_cadastro: '2024-01-16'
      },
      {
        id: 3,
        nome: 'Pedro Costa',
        email: 'pedro@email.com',
        tags: ['tecnologia'],
        data_cadastro: '2024-01-17'
      }
    ])
    setCampanhas([
      {
        id: 1,
        assunto: 'Bem-vindos à nossa newsletter!',
        conteudo: 'Olá! Obrigado por se cadastrar...',
        tags_filtro: ['tecnologia'],
        data_envio: '2024-01-15',
        status: 'enviada',
        total_destinatarios: 2
      },
      {
        id: 2,
        assunto: 'Novidades em Marketing Digital',
        conteudo: 'Confira as últimas tendências...',
        tags_filtro: ['marketing', 'vendas'],
        data_envio: '2024-01-16',
        status: 'enviada',
        total_destinatarios: 3
      }
    ])
  }

  const enviarCampanha = async () => {
    if (!novaCampanha.assunto.trim() || !novaCampanha.conteudo.trim()) {
      setMensagem({ tipo: 'erro', texto: 'Assunto e conteúdo são obrigatórios' })
      return
    }

    setEnviando(true)
    setMensagem(null)

    try {
      if (modoDemo) {
        // Simular envio para demonstração
        await new Promise(resolve => setTimeout(resolve, 2000))
        setMensagem({ tipo: 'sucesso', texto: 'Campanha enviada com sucesso! (Modo demonstração)' })
        setNovaCampanha({ assunto: '', conteudo: '', tags: '' })
        return
      }

      const response = await fetch('/api/email/enviar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...novaCampanha,
          filtros: {
            tags: novaCampanha.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          }
        }),
      })

      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json()

        if (result.success) {
          setMensagem({ tipo: 'sucesso', texto: `Campanha enviada com sucesso para ${result.total_enviados} destinatários!` })
          setNovaCampanha({ assunto: '', conteudo: '', tags: '' })
          carregarDados()
        } else {
          setMensagem({ tipo: 'erro', texto: result.error || 'Erro ao enviar campanha' })
        }
      } else {
        throw new Error('Resposta inválida do servidor')
      }
    } catch (error) {
      console.error('Erro ao enviar campanha:', error)
      setMensagem({ tipo: 'erro', texto: 'Erro ao conectar com o servidor. Verifique sua configuração.' })
    } finally {
      setEnviando(false)
    }
  }

  const cadastrarUsuario = async () => {
    if (!novoUsuario.email.trim() || !novoUsuario.nome.trim()) {
      setMensagem({ tipo: 'erro', texto: 'Nome e email são obrigatórios' })
      return
    }

    setCadastrando(true)
    setMensagem(null)

    try {
      if (modoDemo) {
        // Simular cadastro para demonstração
        await new Promise(resolve => setTimeout(resolve, 1000))
        setMensagem({ tipo: 'sucesso', texto: 'Usuário cadastrado com sucesso! (Modo demonstração)' })
        setNovoUsuario({ nome: '', email: '', telefone: '', tags: '' })
        return
      }

      const response = await fetch('/api/email/campanhas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...novoUsuario,
          tags: novoUsuario.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        }),
      })

      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json()

        if (result.success) {
          setMensagem({ tipo: 'sucesso', texto: 'Usuário cadastrado com sucesso!' })
          setNovoUsuario({ nome: '', email: '', telefone: '', tags: '' })
          carregarDados()
        } else {
          setMensagem({ tipo: 'erro', texto: result.error || 'Erro ao cadastrar usuário' })
        }
      } else {
        throw new Error('Resposta inválida do servidor')
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error)
      setMensagem({ tipo: 'erro', texto: 'Erro ao conectar com o servidor. Verifique sua configuração.' })
    } finally {
      setCadastrando(false)
    }
  }

  const limparMensagem = () => {
    setMensagem(null)
  }

  const sairDoSistema = () => {
    setAcessoAutorizado(false)
    localStorage.removeItem('dev_access')
    setSenhaInput('')
  }

  // Tela de login para desenvolvedores
  if (!acessoAutorizado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Settings className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Área Restrita</h1>
            <p className="text-gray-600">Acesso exclusivo para desenvolvedores</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha de Desenvolvedor
              </label>
              <input
                type="password"
                value={senhaInput}
                onChange={(e) => setSenhaInput(e.target.value)}
                placeholder="Digite a senha"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && verificarAcesso()}
              />
            </div>

            {mensagem && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">{mensagem.texto}</span>
                </div>
              </div>
            )}

            <button
              onClick={verificarAcesso}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300"
            >
              Acessar Sistema
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Dica para demonstração: use "dev123"
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header com indicador de modo demo */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Email Marketing - Dev Panel
            </h1>
            <p className="text-gray-600">Painel exclusivo para desenvolvedores</p>
          </div>
          <div className="flex items-center gap-4">
            {modoDemo && (
              <div className="bg-orange-100 border border-orange-300 text-orange-800 px-4 py-2 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 inline-block mr-2" />
                Modo Demonstração
              </div>
            )}
            <button
              onClick={sairDoSistema}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p className="text-3xl font-bold text-blue-600">{usuarios.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campanhas Enviadas</p>
                <p className="text-3xl font-bold text-green-600">{campanhas.filter(c => c.status === 'enviada').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Envios</p>
                <p className="text-3xl font-bold text-purple-600">
                  {campanhas.reduce((acc, c) => acc + c.total_destinatarios, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('campanha')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'campanha'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Send className="w-4 h-4 inline-block mr-2" />
                Enviar Campanha
              </button>
              <button
                onClick={() => setActiveTab('usuario')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'usuario'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Plus className="w-4 h-4 inline-block mr-2" />
                Cadastrar Usuário
              </button>
              <button
                onClick={() => setActiveTab('historico')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'historico'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye className="w-4 h-4 inline-block mr-2" />
                Ver Campanhas
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Mensagem de Feedback */}
            {mensagem && (
              <div className={`mb-6 p-4 rounded-xl border-2 ${
                mensagem.tipo === 'sucesso' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {mensagem.tipo === 'sucesso' ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 mr-2" />
                    )}
                    <span className="font-medium">{mensagem.texto}</span>
                  </div>
                  <button
                    onClick={limparMensagem}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Conteúdo das Abas */}
            {activeTab === 'campanha' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Enviar Nova Campanha</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Assunto do Email *
                      </label>
                      <input
                        type="text"
                        value={novaCampanha.assunto}
                        onChange={(e) => setNovaCampanha({...novaCampanha, assunto: e.target.value})}
                        placeholder="Digite o assunto do email"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <Tag className="w-4 h-4 inline-block mr-2" />
                        Filtrar por Tags (opcional)
                      </label>
                      <input
                        type="text"
                        value={novaCampanha.tags}
                        onChange={(e) => setNovaCampanha({...novaCampanha, tags: e.target.value})}
                        placeholder="tecnologia, marketing, vendas (separados por vírgula)"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Deixe vazio para enviar para todos os usuários
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Conteúdo do Email *
                    </label>
                    <textarea
                      value={novaCampanha.conteudo}
                      onChange={(e) => setNovaCampanha({...novaCampanha, conteudo: e.target.value})}
                      placeholder="Digite o conteúdo do email..."
                      rows={8}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={enviarCampanha}
                  disabled={enviando}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {enviando ? (
                    <>
                      <Clock className="w-5 h-5 inline-block mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 inline-block mr-2" />
                      Enviar Campanha
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === 'usuario' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Novo Usuário</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={novoUsuario.nome}
                      onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})}
                      placeholder="Digite o nome completo"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={novoUsuario.email}
                      onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})}
                      placeholder="email@exemplo.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Telefone (opcional)
                    </label>
                    <input
                      type="tel"
                      value={novoUsuario.telefone}
                      onChange={(e) => setNovoUsuario({...novoUsuario, telefone: e.target.value})}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tags (opcional)
                    </label>
                    <input
                      type="text"
                      value={novoUsuario.tags}
                      onChange={(e) => setNovoUsuario({...novoUsuario, tags: e.target.value})}
                      placeholder="tecnologia, marketing, vendas"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <button
                  onClick={cadastrarUsuario}
                  disabled={cadastrando}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {cadastrando ? (
                    <>
                      <Clock className="w-5 h-5 inline-block mr-2 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 inline-block mr-2" />
                      Cadastrar Usuário
                    </>
                  )}
                </button>

                {/* Lista de Usuários */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Usuários Cadastrados ({usuarios.length})</h3>
                  <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                    {usuarios.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Nenhum usuário cadastrado ainda</p>
                    ) : (
                      <div className="space-y-3">
                        {usuarios.map((usuario) => (
                          <div key={usuario.id} className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-gray-800">{usuario.nome}</h4>
                                <p className="text-gray-600 text-sm">{usuario.email}</p>
                                {usuario.telefone && (
                                  <p className="text-gray-500 text-sm">{usuario.telefone}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500 mb-2">{usuario.data_cadastro}</p>
                                {usuario.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {usuario.tags.map((tag, index) => (
                                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'historico' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Campanhas</h2>
                
                {campanhas.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Nenhuma campanha enviada ainda</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campanhas.map((campanha) => (
                      <div key={campanha.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{campanha.assunto}</h3>
                            <p className="text-gray-600 text-sm">Enviada em {campanha.data_envio}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              campanha.status === 'enviada' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {campanha.status === 'enviada' ? 'Enviada' : 'Rascunho'}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">
                              {campanha.total_destinatarios} destinatários
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-gray-700 text-sm">{campanha.conteudo}</p>
                        </div>
                        
                        {campanha.tags_filtro.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-gray-500">Filtros:</span>
                            {campanha.tags_filtro.map((tag, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}