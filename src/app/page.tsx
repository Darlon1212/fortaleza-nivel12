"use client";

import { useState, useEffect } from 'react';
import { 
  Home, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  MessageCircle, 
  Phone, 
  Settings, 
  HelpCircle,
  Plus,
  DollarSign,
  Shield,
  Target,
  Crown,
  Bot,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User as UserIcon,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Edit3,
  Users,
  Copy,
  Gift,
  Star,
  Clock,
  BookOpen,
  TrendingUp as TrendingUpIcon,
  Zap,
  Award,
  ChevronRight,
  Play,
  Calendar,
  Headphones,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Area, 
  AreaChart, 
  ComposedChart, 
  Bar, 
  RadialBarChart, 
  RadialBar, 
  BarChart as RechartsBarChart 
} from 'recharts';
import { Transaction, User, FinancialData } from '@/lib/types';
import { formatCurrency, calculateFortressLevel, calculateMonthlyTotal, getExpensesByCategory, getRandomMotivationalQuote } from '@/lib/utils';
import { AIChat, SettingsTab } from '@/components/AdditionalTabs';

// Tipos para autenticação
interface AuthUser {
  id: string;
  email: string;
  name: string;
  hasPaymentMethod: boolean;
  subscriptionStatus: 'trial' | 'active' | 'expired';
  trialEndDate: string;
}

// Base de usuários válidos (simulando um banco de dados)
const VALID_USERS = [
  {
    email: 'admin@fn12.com',
    password: 'admin123',
    name: 'Administrador FN12',
    hasPaymentMethod: true,
    subscriptionStatus: 'active' as const
  },
  {
    email: 'user@fn12.com',
    password: 'user123',
    name: 'Usuário Teste',
    hasPaymentMethod: true,
    subscriptionStatus: 'active' as const
  },
  {
    email: 'demo@fn12.com',
    password: 'demo123',
    name: 'Usuário Demo',
    hasPaymentMethod: false,
    subscriptionStatus: 'trial' as const
  }
];

// Lista de países com códigos
const countries = [
  { code: '+1', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+1', name: 'Canadá', flag: '🇨🇦' },
  { code: '+55', name: 'Brasil', flag: '🇧🇷' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: '+57', name: 'Colômbia', flag: '🇨🇴' },
  { code: '+51', name: 'Peru', flag: '🇵🇪' },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪' },
  { code: '+593', name: 'Equador', flag: '🇪🇨' },
  { code: '+598', name: 'Uruguai', flag: '🇺🇾' },
  { code: '+595', name: 'Paraguai', flag: '🇵🇾' },
  { code: '+591', name: 'Bolívia', flag: '🇧🇴' },
  { code: '+34', name: 'Espanha', flag: '🇪🇸' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹' },
  { code: '+33', name: 'França', flag: '🇫🇷' },
  { code: '+49', name: 'Alemanha', flag: '🇩🇪' },
  { code: '+39', name: 'Itália', flag: '🇮🇹' },
  { code: '+44', name: 'Reino Unido', flag: '🇬🇧' },
  { code: '+52', name: 'México', flag: '🇲🇽' },
];

// Função para calcular a reserva financeira integrada
const calculateIntegratedFinancialReserve = (transactions: Transaction[], initialReserve: number = 0): number => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalInvestments = transactions
    .filter(t => t.type === 'investment')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Saldo disponível (receitas - gastos) + investimentos + reserva inicial
  const availableBalance = totalIncome - totalExpenses;
  const totalReserve = initialReserve + availableBalance + totalInvestments;
  
  return Math.max(0, totalReserve); // Nunca negativo
};

// Componente de Login - ATUALIZADO COM VALIDAÇÃO REAL
const LoginScreen = ({ onLogin, onSwitchToRegister }: { 
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simular delay de autenticação
    setTimeout(() => {
      // Validar credenciais contra a base de usuários válidos
      const validUser = VALID_USERS.find(
        user => user.email === email && user.password === password
      );

      if (validUser) {
        onLogin(email, password);
      } else {
        setError('E-mail ou senha incorretos. Tente novamente.');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/afa5b2c1-993f-4a9d-8ad1-00ca5d9bbce1.png" 
              alt="Logo FN12" 
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Fortaleza Nível 12</h1>
          <p className="text-gray-300">Entre na sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Exibir erro de autenticação */}
          {error && (
            <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold py-3 px-6 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Credenciais de teste para demonstração */}
        <div className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
          <h3 className="text-blue-400 font-medium mb-2 text-center">Contas de Teste:</h3>
          <div className="space-y-2 text-sm">
            <div className="text-gray-300">
              <strong>Admin:</strong> admin@fn12.com / admin123
            </div>
            <div className="text-gray-300">
              <strong>Usuário:</strong> user@fn12.com / user123
            </div>
            <div className="text-gray-300">
              <strong>Demo:</strong> demo@fn12.com / demo123
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Não tem uma conta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-yellow-400 hover:text-yellow-300 font-medium"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente de Cadastro - ATUALIZADO COM VALIDAÇÃO DE E-MAIL ÚNICO
const RegisterScreen = ({ onRegister, onSwitchToLogin }: { 
  onRegister: (name: string, email: string, password: string, phone: string, countryCode: string) => void;
  onSwitchToLogin: () => void;
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resetar erros
    setPasswordError('');
    setEmailError('');
    
    // Verificar se e-mail já existe
    const emailExists = VALID_USERS.some(user => user.email === email);
    if (emailExists) {
      setEmailError('Este e-mail já está cadastrado. Tente fazer login.');
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    // Simular delay de cadastro
    setTimeout(() => {
      onRegister(name, email, password, phone, countryCode);
      setIsLoading(false);
    }, 1000);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica formatação baseada no país selecionado
    if (countryCode === '+55') { // Brasil
      if (numbers.length <= 11) {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
    } else if (countryCode === '+1') { // EUA/Canadá
      if (numbers.length <= 10) {
        return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      }
    }
    
    return numbers;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/afa5b2c1-993f-4a9d-8ad1-00ca5d9bbce1.png" 
              alt="Logo FN12" 
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Fortaleza Nível 12</h1>
          <p className="text-gray-300">Crie sua conta</p>
          <p className="text-sm text-yellow-400 mt-2">US$7.90/mês • Cancele quando quiser</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nome completo</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Seu nome completo"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>
            {emailError && (
              <p className="text-red-400 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Número de celular</label>
            <div className="flex gap-2">
              {/* Seletor de país */}
              <div className="relative">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 px-3 py-3 bg-white/10 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none"
                >
                  {countries.map((country) => (
                    <option key={`${country.code}-${country.name}`} value={country.code} className="bg-gray-800">
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Campo do número */}
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder={countryCode === '+55' ? '(11) 99999-9999' : '(555) 123-4567'}
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Escolha o país onde seu número está registrado
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Confirme sua senha"
                required
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-red-400 text-sm">{passwordError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold py-3 px-6 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Já tem uma conta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-yellow-400 hover:text-yellow-300 font-medium"
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente de Pagamento - INTEGRADO COM PAYPAL
const PaymentScreen = ({ user, onPaymentComplete, onSkipTrial }: { 
  user: AuthUser;
  onPaymentComplete: () => void;
  onSkipTrial: () => void;
}) => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Carregar o SDK do PayPal
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=Ab2FkeDBkVY0W8zpBKEHFpevVIL1QRjcGW_GfC8yios81ERquJkTVgCgLsO1V-lmm47xHTIQgelp5e8m&vault=true&intent=subscription";
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    
    script.onload = () => {
      setPaypalLoaded(true);
      initializePayPalButton();
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup: remover script quando componente for desmontado
      const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const initializePayPalButton = () => {
    if (window.paypal) {
      window.paypal.Buttons({
        style: {
          shape: 'pill',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: function(data: any, actions: any) {
          return actions.subscription.create({
            plan_id: 'P-0TW11735CH346140ENDS53YI'
          });
        },
        onApprove: function(data: any, actions: any) {
          setIsProcessing(true);
          
          // Salvar o ID da assinatura no backend
          saveSubscriptionId(data.subscriptionID);
          
          // Liberar acesso completo
          setTimeout(() => {
            setIsProcessing(false);
            onPaymentComplete();
          }, 2000);
        },
        onError: function(err: any) {
          console.error('Erro no PayPal:', err);
          setIsProcessing(false);
          alert('Erro ao processar pagamento. Tente novamente.');
        },
        onCancel: function(data: any) {
          console.log('Pagamento cancelado:', data);
          setIsProcessing(false);
        }
      }).render('#paypal-button-container-P-0TW11735CH346140ENDS53YI');
    }
  };

  const saveSubscriptionId = async (subscriptionID: string) => {
    try {
      // Aqui você salvaria o subscriptionID no seu backend
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          subscriptionId: subscriptionID,
          planId: 'P-0TW11735CH346140ENDS53YI',
          status: 'active'
        }),
      });

      if (response.ok) {
        console.log('Assinatura salva com sucesso:', subscriptionID);
      } else {
        console.error('Erro ao salvar assinatura');
      }
    } catch (error) {
      console.error('Erro ao salvar assinatura:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <CreditCard className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Assinar Fortaleza Nível 12</h1>
          <p className="text-gray-300">Complete sua assinatura para ter acesso total</p>
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mt-4">
            <p className="text-yellow-200 text-sm">
              <strong>Plano Mensal</strong><br />
              US$7.90/mês • Cancele quando quiser
            </p>
          </div>
        </div>

        {/* Container do botão PayPal */}
        <div className="mb-6">
          <div id="paypal-button-container-P-0TW11735CH346140ENDS53YI"></div>
          
          {!paypalLoaded && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              <span className="ml-3 text-gray-300">Carregando PayPal...</span>
            </div>
          )}
        </div>

        {/* Indicador de processamento */}
        {isProcessing && (
          <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mr-3"></div>
              <span className="text-green-300">Processando assinatura...</span>
            </div>
          </div>
        )}

        {/* Benefícios da assinatura */}
        <div className="bg-gray-800/30 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-white mb-3">O que você terá acesso:</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Dashboard completo de finanças
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Controle de gastos e investimentos
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Sistema de níveis da Fortaleza
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Assistente IA financeiro
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Acesso à mentoria FN12
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Programa de indicações
            </li>
          </ul>
        </div>

        {/* Informações de segurança */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            🔒 Pagamento seguro processado pelo PayPal<br />
            Cancele sua assinatura a qualquer momento
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente de Boas-vindas - NOVA VERSÃO ELEGANTE E SURPREENDENTE
const WelcomeScreen = ({ onContinue }: { onContinue: () => void }) => {
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Animação sequencial
    const timer1 = setTimeout(() => setShowContent(true), 500);
    const timer2 = setTimeout(() => setShowButton(true), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efeitos de fundo animados */}
      <div className="absolute inset-0">
        {/* Partículas douradas flutuantes */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-yellow-500 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-50"></div>
        
        {/* Gradientes circulares */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-600/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Logo e título com animação de entrada */}
        <div className={`transition-all duration-1000 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative mb-8">
            {/* Anel dourado animado ao redor do logo */}
            <div className="absolute inset-0 w-32 h-32 mx-auto">
              <div className="w-full h-full border-2 border-yellow-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
              <div className="absolute inset-2 w-28 h-28 border border-yellow-500/20 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
            </div>
            
            {/* Logo central */}
            <div className="relative w-24 h-24 mx-auto mb-6 bg-black rounded-full flex items-center justify-center shadow-2xl">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/afa5b2c1-993f-4a9d-8ad1-00ca5d9bbce1.png" 
                alt="Logo FN12" 
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Fortaleza Nível 12
          </h1>
          
          {/* Linha decorativa */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-8"></div>
        </div>

        {/* Mensagem principal com efeito de digitação */}
        <div className={`transition-all duration-1500 delay-500 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-yellow-500/20 shadow-2xl mb-8">
            {/* Ícones decorativos */}
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            </div>

            {/* Frase principal */}
            <blockquote className="text-xl md:text-2xl text-gray-100 leading-relaxed font-light italic mb-6">
              "Bem-vindo ao mundo dos investidores. Aqui, sua mente constrói sua liberdade. 
              Esta é sua <span className="text-yellow-400 font-semibold not-italic">Fortaleza Nível 12</span>."
            </blockquote>

            {/* Elementos visuais adicionais */}
            <div className="flex justify-center space-x-8 text-gray-400 text-sm">
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-2 text-yellow-400" />
                <span>Liberdade Financeira</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-yellow-400" />
                <span>Crescimento Inteligente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de ação com animação especial */}
        <div className={`transition-all duration-1000 delay-1000 transform ${showButton ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
          <button
            onClick={onContinue}
            className="group relative bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 px-12 rounded-2xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-yellow-500/25"
          >
            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-white/20 to-yellow-300/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative flex items-center justify-center">
              <span className="text-lg mr-3">Iniciar Jornada</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>

          {/* Texto motivacional abaixo do botão */}
          <p className="text-gray-400 text-sm mt-4 opacity-80">
            Sua transformação financeira começa agora
          </p>
        </div>

        {/* Indicadores de progresso */}
        <div className={`mt-12 transition-all duration-1000 delay-1500 transform ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-yellow-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-yellow-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Dashboard - ATUALIZADO COM GRÁFICO DE EVOLUÇÃO MELHORADO
const Dashboard = ({ financialData, user, transactions }: { financialData: FinancialData; user: User; transactions: Transaction[] }) => {
  // Calcular reserva financeira integrada
  const integratedReserve = calculateIntegratedFinancialReserve(transactions, 0);
  const fortressLevel = calculateFortressLevel(integratedReserve, user.monthlyLivingCost);
  const quote = getRandomMotivationalQuote();
  
  // Dados para o gráfico de pizza dos gastos
  const expensesByCategory = getExpensesByCategory(transactions);
  const pieChartData = expensesByCategory.map(category => ({
    name: category.name,
    value: category.amount,
    color: category.color
  }));

  // Função para gerar dados de evolução dos 12 meses integrados com transações reais
  const getMonthlyEvolutionData = () => {
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    return months.map((month, index) => {
      // Se for o mês atual ou anterior, calcular com base nas transações reais
      if (index <= currentMonth) {
        const monthTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === index && transactionDate.getFullYear() === currentDate.getFullYear();
        });
        
        const entradas = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const saidas = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const investimentos = monthTransactions
          .filter(t => t.type === 'investment')
          .reduce((sum, t) => sum + t.amount, 0);
        
        // Calcular saldo acumulado até este mês
        const saldoAcumulado = transactions
          .filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() <= index && tDate.getFullYear() === currentDate.getFullYear();
          })
          .reduce((acc, t) => {
            if (t.type === 'income' || t.type === 'investment') return acc + t.amount;
            if (t.type === 'expense') return acc - t.amount;
            return acc;
          }, 0);
        
        const nivel = calculateFortressLevel(Math.max(0, saldoAcumulado), user.monthlyLivingCost);
        
        return {
          month,
          entradas,
          saidas,
          investimentos,
          nivel,
          saldo: Math.max(0, saldoAcumulado)
        };
      } else {
        // Meses futuros começam zerados
        return {
          month,
          entradas: 0,
          saidas: 0,
          investimentos: 0,
          nivel: 1,
          saldo: 0
        };
      }
    });
  };

  const evolutionData = getMonthlyEvolutionData();

  // Dados para o gráfico circular de teto de gastos - NOVO DESIGN MINIMALISTA
  const spendingPercentage = Math.min(100, (financialData.monthlyExpenses / user.monthlySpendingLimit) * 100);
  const isOverLimit = financialData.monthlyExpenses > user.monthlySpendingLimit;
  const remainingPercentage = Math.max(0, 100 - spendingPercentage);
  
  // Dados para o gráfico circular
  const circularData = [
    {
      name: 'Usado',
      value: spendingPercentage,
      fill: isOverLimit ? '#EF4444' : '#10B981'
    },
    {
      name: 'Disponível',
      value: remainingPercentage,
      fill: '#E5E7EB'
    }
  ];

  // Cores para o gráfico de pizza
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  
  return (
    <div className="space-y-6">
      {/* Header com Nível da Fortaleza - ATUALIZADO */}
      <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Fortaleza Nível {fortressLevel}</h2>
            <p className="text-blue-200">{quote}</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-black" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-blue-200 text-sm">Reserva Financeira Integrada</p>
            <p className="text-2xl font-bold">{formatCurrency(integratedReserve)}</p>
            <p className="text-xs text-blue-300 mt-1">
              Saldo + Investimentos = Sua Reserva
            </p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Custo de Vida Mensal</p>
            <p className="text-2xl font-bold">{formatCurrency(user.monthlyLivingCost)}</p>
            <p className="text-xs text-blue-300 mt-1">
              {integratedReserve > 0 ? `${Math.floor(integratedReserve / user.monthlyLivingCost)} meses de proteção` : 'Configure seus gastos'}
            </p>
          </div>
        </div>
      </div>

      {/* Cards de Resumo - ATUALIZADO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-300 text-sm font-medium">Saldo Atual</h3>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(financialData.currentBalance)}</p>
          <p className="text-xs text-gray-400 mt-1">Receitas - Gastos</p>
        </div>
        
        <div className="bg-black rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-300 text-sm font-medium">Entradas do Mês</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(financialData.monthlyIncome)}</p>
        </div>
        
        <div className="bg-black rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-300 text-sm font-medium">Gastos do Mês</h3>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(financialData.monthlyExpenses)}</p>
        </div>

        <div className="bg-black rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-300 text-sm font-medium">Investimentos</h3>
            <PieChart className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(financialData.totalInvestments)}</p>
          <p className="text-xs text-gray-400 mt-1">Somam à reserva</p>
        </div>
      </div>

      {/* Explicação da Integração - NOVO */}
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
            <Shield className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Como Funciona a Reserva Integrada</h3>
            <p className="text-gray-300 text-sm">Seu dinheiro trabalha automaticamente para sua segurança</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {formatCurrency(financialData.currentBalance)}
            </div>
            <p className="text-sm text-gray-300">Saldo Disponível</p>
            <p className="text-xs text-gray-400 mt-1">Receitas - Gastos</p>
          </div>
          
          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400 mb-2">
              {formatCurrency(financialData.totalInvestments)}
            </div>
            <p className="text-sm text-gray-300">Investimentos</p>
            <p className="text-xs text-gray-400 mt-1">Crescem sua reserva</p>
          </div>
          
          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400 mb-2">
              {formatCurrency(integratedReserve)}
            </div>
            <p className="text-sm text-gray-300">Reserva Total</p>
            <p className="text-xs text-gray-400 mt-1">Sua proteção financeira</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Gastos por Categoria */}
        <div className="bg-black rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-600" />
            Gastos Por Categoria
          </h3>
          {pieChartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhum gasto registrado ainda</p>
                <p className="text-sm text-gray-400 mt-2">Comece lançando suas primeiras transações</p>
              </div>
            </div>
          )}
        </div>

        {/* Gráfico Circular de Teto de Gastos - NOVO DESIGN MINIMALISTA */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-yellow-400" />
            Controle de Teto de Gastos
          </h3>
          
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={circularData}
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={450}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {circularData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
              
              {/* Centro do círculo com informações */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-3xl font-bold ${isOverLimit ? 'text-red-400' : 'text-green-400'}`}>
                  {spendingPercentage.toFixed(0)}%
                </div>
                <div className="text-gray-400 text-sm">usado</div>
              </div>
            </div>
          </div>
          
          {/* Informações compactas */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">
                {formatCurrency(financialData.monthlyExpenses)}
              </div>
              <div className="text-gray-400 text-xs">Gastos</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-400">
                {formatCurrency(user.monthlySpendingLimit)}
              </div>
              <div className="text-gray-400 text-xs">Limite</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${isOverLimit ? 'text-red-400' : 'text-green-400'}`}>
                {formatCurrency(Math.abs(user.monthlySpendingLimit - financialData.monthlyExpenses))}
              </div>
              <div className="text-gray-400 text-xs">{isOverLimit ? 'Excesso' : 'Disponível'}</div>
            </div>
          </div>
          
          {isOverLimit && (
            <div className="mt-4 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span className="text-xs">Limite excedido!</span>
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de Evolução Financeira - 12 MESES INTEGRADO */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-6 border border-blue-500/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
          Evolução Financeira
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={evolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="entradaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="saidaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="investimentoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="money"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                yAxisId="level"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#F59E0B', fontSize: 12 }}
                domain={[0, 12]}
                tickFormatter={(value) => `N${value}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#fff'
                }}
                formatter={(value, name) => {
                  if (name === 'nivel') return [value, 'Nível da Fortaleza'];
                  if (name === 'saldo') return [formatCurrency(Number(value)), 'Saldo Acumulado'];
                  return [formatCurrency(Number(value)), name];
                }}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Legend 
                wrapperStyle={{ color: '#9CA3AF' }}
              />
              
              {/* Barras para valores monetários */}
              <Bar
                yAxisId="money"
                dataKey="entradas"
                fill="url(#entradaGradient)"
                name="Entradas"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                yAxisId="money"
                dataKey="saidas"
                fill="url(#saidaGradient)"
                name="Saídas"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                yAxisId="money"
                dataKey="investimentos"
                fill="url(#investimentoGradient)"
                name="Investimentos"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              
              {/* Linha para o nível da fortaleza */}
              <Line
                yAxisId="level"
                type="monotone"
                dataKey="nivel"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                name="Nível da Fortaleza"
              />
              
              {/* Linha para o saldo acumulado */}
              <Line
                yAxisId="money"
                type="monotone"
                dataKey="saldo"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                strokeDasharray="5 5"
                name="Saldo Acumulado"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Indicadores */}
        <div className="grid grid-cols-5 gap-4 mt-4">
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
            <p className="text-xs text-green-300">Entradas</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
            <p className="text-xs text-red-300">Saídas</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1"></div>
            <p className="text-xs text-purple-300">Investimentos</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
            <p className="text-xs text-yellow-300">Nível</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-1 bg-cyan-500 rounded-full mx-auto mb-1" style={{ borderStyle: 'dashed' }}></div>
            <p className="text-xs text-cyan-300">Saldo</p>
          </div>
        </div>
      </div>

      {/* Alerta de Limite de Gastos */}
      {financialData.monthlyExpenses > user.monthlySpendingLimit && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">
              Atenção! Você ultrapassou seu limite mensal de gastos em {formatCurrency(financialData.monthlyExpenses - user.monthlySpendingLimit)}
            </p>
          </div>
        </div>
      )}

      {/* Progresso para o Próximo Nível - ATUALIZADO */}
      <div className="bg-black rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Progresso para o Próximo Nível</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Nível {fortressLevel}</span>
            <span className="text-gray-300">Nível {fortressLevel + 1}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(100, ((integratedReserve % user.monthlyLivingCost) / user.monthlyLivingCost) * 100)}%` 
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">
            Faltam {formatCurrency(user.monthlyLivingCost - (integratedReserve % user.monthlyLivingCost))} para o próximo nível
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente de Entradas
const IncomeTab = ({ onAddTransaction, transactions, onDeleteTransaction, customCategories, onAddCategory }: { 
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  customCategories: { income: string[]; expense: string[] };
  onAddCategory: (type: 'income' | 'expense', category: string) => void;
}) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Salário');
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const defaultCategories = ['Salário', 'Gorjeta', 'Renda Extra', 'Outros'];
  const allCategories = [...defaultCategories, ...customCategories.income];

  const incomeTransactions = transactions.filter(t => t.type === 'income').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && date) {
      onAddTransaction({
        amount: parseFloat(amount),
        date,
        type: 'income',
        category,
      });
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && !allCategories.includes(newCategory.trim().toLowerCase())) {
      onAddCategory('income', newCategory.trim().toLowerCase());
      setCategory(newCategory.trim().toLowerCase());
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black rounded-2xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Lançar Entrada</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Valor (US$)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">Tipo de Entrada</label>
              <button
                type="button"
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nova categoria
              </button>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {allCategories.map(cat => (
                <option key={cat} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>
          </div>

          {showAddCategory && (
            <div className="bg-gray-800 p-4 rounded-xl">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nome da nova categoria"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Adicionar
                </button>
              </form>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Adicionar Entrada
          </button>
        </form>
      </div>

      {/* Lista de Entradas */}
      {incomeTransactions.length > 0 && (
        <div className="bg-black rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Entradas Recentes</h3>
          <div className="space-y-3">
            {incomeTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-green-900/20 rounded-xl border border-green-700/30">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-green-400 capitalize">{transaction.category}</span>
                    <span className="text-lg font-bold text-green-400">{formatCurrency(transaction.amount)}</span>
                  </div>
                  <p className="text-sm text-green-300 mt-1">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Excluir entrada"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de Gastos
const ExpensesTab = ({ onAddTransaction, transactions, onDeleteTransaction, customCategories, onAddCategory }: { 
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  customCategories: { income: string[]; expense: string[] };
  onAddCategory: (type: 'income' | 'expense', category: string) => void;
}) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Alimentação');
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const defaultCategories = ['Alimentação', 'Lazer', 'Transporte', 'Moradia', 'Seguro de Carro', 'Seguro de Saúde', 'Seguro de Vida', 'Seguro Residencial', 'Educação', 'Saúde', 'Vestuário', 'Telefone/Internet', 'Outros'];
  const allCategories = [...defaultCategories, ...customCategories.expense];

  const expensesByCategory = getExpensesByCategory(transactions);
  const expenseTransactions = transactions.filter(t => t.type === 'expense').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && date) {
      onAddTransaction({
        amount: parseFloat(amount),
        date,
        type: 'expense',
        category,
      });
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && !allCategories.includes(newCategory.trim().toLowerCase())) {
      onAddCategory('expense', newCategory.trim().toLowerCase());
      setCategory(newCategory.trim().toLowerCase());
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black rounded-2xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Lançar Gasto</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Valor (US$)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">Categoria</label>
              <button
                type="button"
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nova categoria
              </button>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {allCategories.map(cat => (
                <option key={cat} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>
          </div>

          {showAddCategory && (
            <div className="bg-gray-800 p-4 rounded-xl">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nome da nova categoria"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Adicionar
                </button>
              </form>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Adicionar Gasto
          </button>
        </form>
      </div>

      {/* Lista de Gastos */}
      {expenseTransactions.length > 0 && (
        <div className="bg-black rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Gastos Recentes</h3>
          <div className="space-y-3">
            {expenseTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-red-900/20 rounded-xl border border-red-700/30">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-red-400 capitalize">{transaction.category}</span>
                    <span className="text-lg font-bold text-red-400">-{formatCurrency(transaction.amount)}</span>
                  </div>
                  <p className="text-sm text-red-300 mt-1">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Excluir gasto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumo dos Gastos por Categoria */}
      {expensesByCategory.length > 0 && (
        <div className="bg-black rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Gastos por Categoria</h3>
          <div className="space-y-3">
            {expensesByCategory.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-gray-300 capitalize">{category.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{formatCurrency(category.amount)}</p>
                  <p className="text-sm text-gray-400">{category.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de Lançamentos (antigo Investimentos) - ATUALIZADO COM EXCLUSÃO
const LaunchTab = ({ onAddTransaction, transactions, onDeleteTransaction }: { 
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('Ações');

  const totalInvestments = calculateMonthlyTotal(transactions, 'investment');
  const investmentsByType = transactions
    .filter(t => t.type === 'investment')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const investmentTransactions = transactions.filter(t => t.type === 'investment').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && date) {
      onAddTransaction({
        amount: parseFloat(amount),
        date,
        type: 'investment',
        category: type,
      });
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black rounded-2xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Lançar Investimento</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Valor Investido (US$)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Investimento</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Ações">Ações</option>
              <option value="Renda Fixa">Renda Fixa</option>
              <option value="Fundo Imobiliário">Fundo Imobiliário</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Lançar Investimento
          </button>
        </form>
      </div>

      {/* Lista de Lançamentos Recentes - NOVO */}
      {investmentTransactions.length > 0 && (
        <div className="bg-black rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Lançamentos Recentes</h3>
          <div className="space-y-3">
            {investmentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-purple-900/20 rounded-xl border border-purple-700/30">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-purple-400 capitalize">{transaction.category}</span>
                    <span className="text-lg font-bold text-purple-400">{formatCurrency(transaction.amount)}</span>
                  </div>
                  <p className="text-sm text-purple-300 mt-1">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Excluir lançamento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumo dos Investimentos */}
      <div className="bg-black rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Carteira de Investimentos</h3>
        <div className="mb-4">
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalInvestments)}</p>
          <p className="text-sm text-gray-400">Total investido este mês</p>
        </div>
        
        {Object.keys(investmentsByType).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-white">Composição da Carteira:</h4>
            {Object.entries(investmentsByType).map(([type, amount]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-gray-300 capitalize">{type}</span>
                <span className="font-semibold text-white">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Indicações
const ReferralTab = ({ user }: { user: User }) => {
  const [referralCode] = useState(`FN12${user.id.toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
  const [referrals] = useState([
    { id: '1', name: 'João Silva', email: 'joao@email.com', status: 'active', joinDate: '2024-01-15' },
    { id: '2', name: 'Maria Santos', email: 'maria@email.com', status: 'trial', joinDate: '2024-01-20' },
    { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', status: 'active', joinDate: '2024-01-25' },
  ]);
  const [copySuccess, setCopySuccess] = useState(false);

  const activeReferrals = referrals.filter(r => r.status === 'active').length;
  const totalReferrals = referrals.length;
  const freeMonthsEarned = activeReferrals;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar código:', err);
    }
  };

  const shareUrl = `https://fortalezanivel12.com/cadastro?ref=${referralCode}`;

  const handleShareWhatsApp = () => {
    const message = `🏰 Descubra a Fortaleza Nível 12! \\\\n\\\\nTransforme sua vida financeira com o app que já mudou a vida de milhares de pessoas.\\\\n\\\\n✨ Use meu código de indicação: ${referralCode}\\\\n🎁 Ganhe 1 MÊS GRÁTIS na assinatura!\\\\n\\\\nCadastre-se agora: ${shareUrl}\\\\n\\\\n#FortalezaNivel12 #LiberdadeFinanceira`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareEmail = () => {
    const subject = 'Ganhe 1 mês grátis na Fortaleza Nível 12!';
    const body = `Olá!\\\\n\\\\nQuero compartilhar com você uma oportunidade incrível de transformar sua vida financeira.\\\\n\\\\nA Fortaleza Nível 12 é o app que está revolucionando a forma como as pessoas gerenciam suas finanças e constroem riqueza.\\\\n\\\\n🎁 OFERTA ESPECIAL: Use meu código de indicação \\\\\"${referralCode}\\\\\" e ganhe 1 MÊS GRÁTIS!\\\\n\\\\nCadastre-se agora: ${shareUrl}\\\\n\\\\nNão perca essa chance de começar sua jornada rumo à liberdade financeira!\\\\n\\\\nAbraços,\\\\n${user.name}`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <div className="space-y-6">
      {/* Header do Programa de Indicações */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">Programa de Indicações</h2>
            <p className="text-purple-100">Indique amigos e ganhe meses grátis!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalReferrals}</div>
            <div className="text-sm text-purple-200">Indicações</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{activeReferrals}</div>
            <div className="text-sm text-purple-200">Ativas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{freeMonthsEarned}</div>
            <div className="text-sm text-purple-200">Meses Grátis</div>
          </div>
        </div>
      </div>

      {/* Seu Código de Indicação */}
      <div className="bg-black rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Gift className="w-5 h-5 mr-2 text-yellow-400" />
          Seu Código de Indicação
        </h3>
        
        <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-400 font-mono">{referralCode}</div>
              <p className="text-sm text-gray-400 mt-1">Compartilhe este código com seus amigos</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-black font-medium rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copySuccess ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
          <h4 className="font-semibold text-blue-400 mb-2">Como funciona:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Compartilhe seu código com amigos</li>
            <li>• Eles se cadastram usando seu código</li>
            <li>• Quando eles assinam, você ganha 1 mês grátis</li>
            <li>• Sem limite de indicações!</li>
          </ul>
        </div>
      </div>

      {/* Botões de Compartilhamento */}
      <div className="bg-black rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Compartilhar Indicação</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Compartilhar no WhatsApp
          </button>
          
          <button
            onClick={handleShareEmail}
            className="flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <Mail className="w-5 h-5 mr-2" />
            Compartilhar por E-mail
          </button>
        </div>
      </div>

      {/* Lista de Indicações */}
      {referrals.length > 0 && (
        <div className="bg-black rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Suas Indicações</h3>
          
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{referral.name}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      referral.status === 'active' 
                        ? 'bg-green-900/30 text-green-400 border border-green-700/30' 
                        : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30'
                    }`}>
                      {referral.status === 'active' ? 'Ativo' : 'Trial'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {referral.email} • Entrou em {new Date(referral.joinDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {referral.status === 'active' && (
                  <div className="ml-4 flex items-center text-green-400">
                    <Gift className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">+1 mês</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benefícios do Programa */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Benefícios do Programa</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">1 Mês Grátis por Indicação</h4>
                <p className="text-sm text-gray-400">Para cada amigo que assinar, você ganha 1 mês grátis</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Sem Limite de Indicações</h4>
                <p className="text-sm text-gray-400">Indique quantos amigos quiser e acumule meses grátis</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Status VIP</h4>
                <p className="text-sm text-gray-400">Indicadores ativos ganham acesso a recursos exclusivos</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Bônus Especiais</h4>
                <p className="text-sm text-gray-400">Recompensas extras para grandes indicadores</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Mentoria - ATUALIZADO COM NOVA LOGO
const MentorshipTab = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    objective: '',
    bestTime: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setFormData({ name: '', phone: '', objective: '', bestTime: '' });
    }, 3000);
  };

  const whatsappUrl = "https://wa.me/55SEUNUMERO?text=Olá,+quero+fazer+parte+da+mentoria+FN12";

  const sections = [
    { id: 'overview', label: 'Visão Geral', icon: BookOpen },
    { id: 'benefits', label: 'O que Você Aprende', icon: Star },
    { id: 'results', label: 'Resultados', icon: TrendingUpIcon },
    { id: 'contact', label: 'Quero Participar', icon: Phone },
  ];

  return (
    <div className="space-y-6">
      {/* Header Principal - ATUALIZADO COM NOVA LOGO */}
      <div className="bg-gradient-to-r from-black to-gray-900 rounded-3xl p-8 text-white border border-gray-700 relative overflow-hidden">
        {/* Efeito de brilho de fundo */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5"></div>
        
        <div className="relative z-10 text-center">
          {/* Logo centralizada */}
          <div className="w-24 h-24 mx-auto mb-6 bg-black rounded-full flex items-center justify-center shadow-2xl">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/afa5b2c1-993f-4a9d-8ad1-00ca5d9bbce1.png" 
              alt="Logo FN12" 
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          
          <h1 className="text-3xl font-bold mb-3">Mentoria FN12</h1>
          <p className="text-xl font-semibold mb-2 text-yellow-400">Invista para Receber, Não para Arriscar</p>
          <p className="text-gray-300 text-lg">
            Aprenda a investir com segurança e constância, mesmo começando do zero
          </p>
        </div>
      </div>

      {/* Navegação por Seções */}
      <div className="bg-black rounded-2xl p-2 border border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="text-sm">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo das Seções */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Proposta de Valor */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-6 border border-blue-500/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Por que a Mentoria FN12 é Diferente?</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Não Precisa Ser Gênio</h3>
                <p className="text-gray-300 text-sm">Método simples e direto, sem complicações desnecessárias</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Não Precisa de Tempo</h3>
                <p className="text-gray-300 text-sm">Aprenda uma vez, invista com segurança e deixe o dinheiro trabalhar</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Não Precisa Ser Trader</h3>
                <p className="text-gray-300 text-sm">Construímos patrimônio, não fazemos especulação arriscada</p>
              </div>
            </div>
          </div>

          {/* Diferencial Principal */}
          <div className="bg-black rounded-2xl p-6 border border-yellow-500/30">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mr-4">
                <TrendingUpIcon className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Aqui, a gente não faz trade. A gente constrói patrimônio.</h3>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-gray-300 leading-relaxed">
                Enquanto o trader tenta comprar e vender ações todos os dias para lucrar na variação do preço 
                (e muitas vezes perde dinheiro e saúde), <span className="text-yellow-400 font-semibold">nós investimos em empresas sólidas 
                que pagam dividendos</span> — uma parte do lucro que vai direto para o seu bolso, todo mês.
              </p>
              
              <div className="mt-4 p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
                <p className="text-green-300 font-medium text-center">
                  💡 Você compra uma ação hoje → Ela começa a te pagar todos os meses → Mesmo que você não faça mais nada
                </p>
              </div>
            </div>
          </div>

          {/* Objeções Comuns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <MessageCircle className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="font-semibold text-white">"Mas eu não tenho tempo..."</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Essa mentoria foi feita justamente para você que não tem tempo. Você aprende uma vez, 
                investe com segurança e deixa o dinheiro trabalhar por você. Não precisa ficar acompanhando 
                gráficos ou vender e comprar todos os dias.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <HelpCircle className="w-6 h-6 text-purple-400 mr-3" />
                <h3 className="font-semibold text-white">"Mas eu não entendo nada..."</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Você vai aprender do zero. Com linguagem clara, suporte humano e sem enrolação. 
                Nosso foco é transformar o complicado em simples e aplicável. Precisa apenas decidir mudar.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'benefits' && (
        <div className="space-y-6">
          <div className="bg-black rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">O que você vai aprender na Mentoria FN12</h2>
            
            <div className="space-y-4">
              {[
                {
                  icon: CheckCircle,
                  title: "Como abrir sua conta em uma corretora",
                  description: "Com nosso suporte em tempo real por WhatsApp e videochamada",
                  color: "text-green-400"
                },
                {
                  icon: TrendingUpIcon,
                  title: "Como fazer seu primeiro investimento inteligente",
                  description: "Com acompanhamento passo a passo",
                  color: "text-blue-400"
                },
                {
                  icon: DollarSign,
                  title: "Como receber dividendos mensais",
                  description: "Mesmo investindo pouco",
                  color: "text-yellow-400"
                },
                {
                  icon: Shield,
                  title: "Como montar uma carteira segura e diversificada",
                  description: "Proteção e crescimento do seu patrimônio",
                  color: "text-purple-400"
                },
                {
                  icon: Target,
                  title: "Como estabelecer metas de ganho realistas",
                  description: "Como 1% ao mês — que acumulam com o tempo",
                  color: "text-red-400"
                },
                {
                  icon: Award,
                  title: "Como evoluir com desafios e estudos",
                  description: "Suporte diário no grupo e no privado",
                  color: "text-cyan-400"
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${item.color.replace('text-', 'bg-').replace('400', '500/20')}`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mentalidade */}
          <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-6 border border-purple-500/30">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">🧠 Não é só sobre dinheiro</h3>
              <div className="space-y-3 text-purple-100">
                <p>É sobre <span className="text-purple-300 font-semibold">mentalidade, disciplina e futuro</span></p>
                <p>É sobre deixar de ser escravo do sistema e começar a <span className="text-purple-300 font-semibold">construir liberdade</span></p>
                <p>É sobre você ser o <span className="text-purple-300 font-semibold">exemplo que sua família precisa</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'results' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">🔥 O que essa mentoria entrega</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: DollarSign,
                title: "Lucro real com dividendos",
                description: "Já no primeiro mês",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: CheckCircle,
                title: "Uma conta aberta e funcionando",
                description: "Pronta para seus investimentos",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: "Uma carteira montada com segurança",
                description: "Diversificada e protegida",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Users,
                title: "Um grupo ativo e acolhedor",
                description: "De investidores como você",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: Headphones,
                title: "Orientações individuais",
                description: "E suporte diário",
                gradient: "from-red-500 to-pink-500"
              },
              {
                icon: TrendingUpIcon,
                title: "Crescimento financeiro e pessoal",
                description: "Contínuo e sustentável",
                gradient: "from-indigo-500 to-purple-500"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-black rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center mr-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action Motivacional */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-3">⚠️ Não permita que sua geração seja um fracasso</h3>
            <p className="text-red-100 mb-4">
              Você pode ser o divisor de águas da sua história. Tudo começa com uma decisão.
            </p>
            <div className="w-20 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>
        </div>
      )}

      {activeSection === 'contact' && (
        <div className="space-y-6">
          {/* Botões de Ação Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => window.open(whatsappUrl, '_blank')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-6 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Phone className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="text-lg">Quero fazer parte da mentoria FN12</div>
                <div className="text-sm text-green-200">Falar agora com um mentor</div>
              </div>
            </button>
            
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-6 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="text-lg">Quero ser contactado</div>
                <div className="text-sm text-blue-200">Deixe seus dados</div>
              </div>
            </button>
          </div>

          {/* Formulário de Contato */}
          {showForm && !submitted && (
            <div className="bg-black rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Solicitar Contato da Mentoria</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Telefone com WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Objetivo com a Mentoria</label>
                  <textarea
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows={3}
                    placeholder="Ex: Quero aprender a investir para ter renda passiva..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Melhor Horário para Contato</label>
                  <select
                    value={formData.bestTime}
                    onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="manhã">Manhã (8h - 12h)</option>
                    <option value="tarde">Tarde (12h - 18h)</option>
                    <option value="noite">Noite (18h - 22h)</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300"
                >
                  Enviar Solicitação
                </button>
              </form>
            </div>
          )}

          {/* Confirmação de Envio */}
          {submitted && (
            <div className="bg-green-900/20 border border-green-700/30 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Recebido!</h3>
              <p className="text-green-300">Um mentor da Fortaleza Nível 12 vai entrar em contato com você em breve.</p>
            </div>
          )}

          {/* Informações Adicionais */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Por que escolher a Mentoria FN12?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Método Comprovado</h4>
                <p className="text-gray-400 text-sm">Estratégias testadas e aprovadas por milhares de alunos</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Suporte Total</h4>
                <p className="text-gray-400 text-sm">Acompanhamento individual e grupo de apoio ativo</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUpIcon className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Resultados Reais</h4>
                <p className="text-gray-400 text-sm">Dividendos mensais desde o primeiro investimento</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente Principal
export default function FortalezaNivel12() {
  // Estados de autenticação
  const [authState, setAuthState] = useState<'login' | 'register' | 'payment' | 'welcome' | 'app'>('login');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  
  // Estados do app
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customCategories, setCustomCategories] = useState<{ income: string[]; expense: string[] }>({
    income: [],
    expense: []
  });
  const [user, setUser] = useState<User>({
    id: '1',
    email: 'user@example.com',
    name: 'Usuário',
    monthlyLivingCost: 3000,
    financialReserve: 0, // Será calculado dinamicamente
    monthlySpendingLimit: 2500,
    subscriptionStatus: 'trial',
    trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Funções de autenticação - ATUALIZADA COM VALIDAÇÃO REAL
  const handleLogin = (email: string, password: string) => {
    // Validar credenciais contra a base de usuários válidos
    const validUser = VALID_USERS.find(
      user => user.email === email && user.password === password
    );

    if (validUser) {
      const newAuthUser: AuthUser = {
        id: '1',
        email,
        name: validUser.name,
        hasPaymentMethod: validUser.hasPaymentMethod,
        subscriptionStatus: validUser.subscriptionStatus,
        trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      setAuthUser(newAuthUser);
      setUser(prev => ({ ...prev, email, name: validUser.name }));
      
      // Se usuário já tem pagamento ativo, pular para boas-vindas
      if (validUser.hasPaymentMethod && validUser.subscriptionStatus === 'active') {
        setAuthState('welcome');
      } else {
        setAuthState('payment');
      }
    }
  };

  const handleRegister = (name: string, email: string, password: string, phone: string, countryCode: string) => {
    // Simular cadastro (em produção, salvaria no banco de dados)
    const newAuthUser: AuthUser = {
      id: Date.now().toString(),
      email,
      name,
      hasPaymentMethod: false,
      subscriptionStatus: 'trial',
      trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    setAuthUser(newAuthUser);
    setUser(prev => ({ ...prev, email, name }));
    setAuthState('payment');
  };

  const handlePaymentComplete = () => {
    if (authUser) {
      setAuthUser({ ...authUser, hasPaymentMethod: true, subscriptionStatus: 'active' });
      setAuthState('welcome');
    }
  };

  const handleSkipTrial = () => {
    setAuthState('welcome');
  };

  const handleWelcomeContinue = () => {
    setAuthState('app');
    setShowWelcome(false);
  };

  // Funções do app
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCustomCategory = (type: 'income' | 'expense', category: string) => {
    setCustomCategories(prev => ({
      ...prev,
      [type]: [...prev[type], category]
    }));
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // Calcular dados financeiros integrados
  const integratedReserve = calculateIntegratedFinancialReserve(transactions, 0);
  
  const financialData: FinancialData = {
    currentBalance: calculateMonthlyTotal(transactions, 'income') - calculateMonthlyTotal(transactions, 'expense'),
    monthlyIncome: calculateMonthlyTotal(transactions, 'income'),
    monthlyExpenses: calculateMonthlyTotal(transactions, 'expense'),
    totalInvestments: calculateMonthlyTotal(transactions, 'investment'),
    fortressLevel: calculateFortressLevel(integratedReserve, user.monthlyLivingCost),
    transactions,
  };

  // Renderização condicional baseada no estado de autenticação
  if (authState === 'login') {
    return (
      <LoginScreen 
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthState('register')}
      />
    );
  }

  if (authState === 'register') {
    return (
      <RegisterScreen 
        onRegister={handleRegister}
        onSwitchToLogin={() => setAuthState('login')}
      />
    );
  }

  if (authState === 'payment' && authUser) {
    return (
      <PaymentScreen 
        user={authUser}
        onPaymentComplete={handlePaymentComplete}
        onSkipTrial={handleSkipTrial}
      />
    );
  }

  if (authState === 'welcome') {
    return <WelcomeScreen onContinue={handleWelcomeContinue} />;
  }

  // App principal
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'income', label: 'Entradas', icon: TrendingUp },
    { id: 'expenses', label: 'Gastos', icon: TrendingDown },
    { id: 'launch', label: 'Lançamentos', icon: PieChart },
    { id: 'referral', label: 'Indicações', icon: Users },
    { id: 'ai-chat', label: 'Assistente IA', icon: Bot },
    { id: 'mentorship', label: 'Mentoria', icon: Phone },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/afa5b2c1-993f-4a9d-8ad1-00ca5d9bbce1.png" 
                  alt="Logo FN12" 
                  className="w-6 h-6 rounded object-cover"
                />
              </div>
              <h1 className="text-xl font-bold text-white">Fortaleza Nível 12</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Nível {calculateFortressLevel(integratedReserve, user.monthlyLivingCost)}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">{authUser?.name}</span>
                <button
                  onClick={() => {
                    setAuthState('login');
                    setAuthUser(null);
                  }}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-black rounded-2xl p-4 border border-gray-800">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && <Dashboard financialData={financialData} user={user} transactions={transactions} />}
            {activeTab === 'income' && (
              <IncomeTab 
                onAddTransaction={addTransaction} 
                transactions={transactions}
                onDeleteTransaction={deleteTransaction}
                customCategories={customCategories}
                onAddCategory={addCustomCategory}
              />
            )}
            {activeTab === 'expenses' && (
              <ExpensesTab 
                onAddTransaction={addTransaction} 
                transactions={transactions}
                onDeleteTransaction={deleteTransaction}
                customCategories={customCategories}
                onAddCategory={addCustomCategory}
              />
            )}
            {activeTab === 'launch' && <LaunchTab onAddTransaction={addTransaction} transactions={transactions} onDeleteTransaction={deleteTransaction} />}
            {activeTab === 'referral' && <ReferralTab user={user} />}
            {activeTab === 'ai-chat' && <AIChat />}
            {activeTab === 'mentorship' && <MentorshipTab />}
            {activeTab === 'settings' && <SettingsTab user={user} onUpdateUser={updateUser} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Declaração global para o PayPal SDK
declare global {
  interface Window {
    paypal: any;
  }
}