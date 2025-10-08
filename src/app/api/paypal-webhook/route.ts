import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Tipos para os eventos do PayPal
interface PayPalWebhookEvent {
  event_type: string;
  resource: {
    amount?: {
      total: string;
      currency: string;
    };
    billing_agreement_id?: string;
    payer?: {
      payer_info?: {
        email: string;
      };
    };
    state?: string;
    id?: string;
  };
  create_time: string;
  resource_type: string;
}

// Tipos para notificações
interface NotificationData {
  userId: string;
  type: 'subscription_activated' | 'subscription_cancelled' | 'payment_completed' | 'payment_failed';
  message: string;
  timestamp: string;
}

// Simulação de banco de dados de usuários (em produção, usar banco real)
const users = new Map<string, any>();
const notifications = new Map<string, NotificationData[]>();

// Função para verificar assinatura do PayPal (implementação básica)
function verifyPayPalSignature(
  payload: string,
  headers: { [key: string]: string | string[] | undefined }
): boolean {
  // Em produção, implementar verificação real da assinatura PayPal
  // usando os cabeçalhos PAYPAL-TRANSMISSION-ID, PAYPAL-CERT-ID, etc.
  
  const transmissionId = headers['paypal-transmission-id'];
  const certId = headers['paypal-cert-id'];
  const signature = headers['paypal-transmission-sig'];
  
  // Por enquanto, retorna true para desenvolvimento
  // Em produção, usar a biblioteca oficial do PayPal para verificação
  return true;
}

// Função para encontrar usuário por email
function findUserByEmail(email: string): any | null {
  for (const [userId, userData] of users.entries()) {
    if (userData.email === email) {
      return { id: userId, ...userData };
    }
  }
  return null;
}

// Função para atualizar status da assinatura
function updateUserSubscription(
  userId: string, 
  status: 'trial' | 'active' | 'expired',
  billingAgreementId?: string
) {
  const user = users.get(userId);
  if (user) {
    user.subscriptionStatus = status;
    user.billingAgreementId = billingAgreementId;
    user.lastUpdated = new Date().toISOString();
    users.set(userId, user);
  }
}

// Função para adicionar notificação
function addNotification(userId: string, notification: NotificationData) {
  const userNotifications = notifications.get(userId) || [];
  userNotifications.unshift(notification);
  // Manter apenas as últimas 50 notificações
  if (userNotifications.length > 50) {
    userNotifications.splice(50);
  }
  notifications.set(userId, userNotifications);
}

// Função para processar eventos do PayPal
async function processPayPalEvent(event: PayPalWebhookEvent): Promise<void> {
  const { event_type, resource } = event;
  const userEmail = resource.payer?.payer_info?.email;
  
  if (!userEmail) {
    console.log('Email do usuário não encontrado no evento');
    return;
  }

  const user = findUserByEmail(userEmail);
  if (!user) {
    console.log(`Usuário não encontrado para email: ${userEmail}`);
    return;
  }

  console.log(`Processando evento ${event_type} para usuário ${user.id}`);

  switch (event_type) {
    case 'BILLING.SUBSCRIPTION.CREATED':
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
      // Ativar período de teste gratuito
      updateUserSubscription(user.id, 'trial', resource.billing_agreement_id);
      
      addNotification(user.id, {
        userId: user.id,
        type: 'subscription_activated',
        message: 'Sua assinatura Pro foi ativada! Aproveite 7 dias grátis com acesso total.',
        timestamp: new Date().toISOString()
      });
      
      console.log(`Assinatura ativada para usuário ${user.id}`);
      break;

    case 'PAYMENT.SALE.COMPLETED':
      // Confirmar pagamento mensal e renovar acesso
      updateUserSubscription(user.id, 'active', resource.billing_agreement_id);
      
      const amount = resource.amount?.total || '39.90';
      addNotification(user.id, {
        userId: user.id,
        type: 'payment_completed',
        message: `Pagamento de $${amount} processado com sucesso. Sua assinatura Pro foi renovada.`,
        timestamp: new Date().toISOString()
      });
      
      console.log(`Pagamento confirmado para usuário ${user.id}: $${amount}`);
      break;

    case 'BILLING.SUBSCRIPTION.CANCELLED':
    case 'BILLING.SUBSCRIPTION.EXPIRED':
    case 'PAYMENT.SALE.DENIED':
      // Bloquear acesso Pro
      updateUserSubscription(user.id, 'expired');
      
      const notificationType = event_type.includes('DENIED') ? 'payment_failed' : 'subscription_cancelled';
      const message = event_type.includes('DENIED') 
        ? 'Seu pagamento foi recusado. Verifique seus dados de pagamento e tente novamente.'
        : 'Sua assinatura Pro foi cancelada. Você pode renovar a qualquer momento.';
      
      addNotification(user.id, {
        userId: user.id,
        type: notificationType,
        message,
        timestamp: new Date().toISOString()
      });
      
      console.log(`Acesso bloqueado para usuário ${user.id}: ${event_type}`);
      break;

    default:
      console.log(`Evento não tratado: ${event_type}`);
  }
}

// Handler principal do webhook
export async function POST(request: NextRequest) {
  try {
    // Ler o corpo da requisição
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    
    // Verificar assinatura do PayPal
    if (!verifyPayPalSignature(body, headers)) {
      console.error('Assinatura PayPal inválida');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid signature' },
        { status: 401 }
      );
    }

    // Parse do JSON
    const event: PayPalWebhookEvent = JSON.parse(body);
    
    console.log('Webhook PayPal recebido:', {
      event_type: event.event_type,
      resource_type: event.resource_type,
      create_time: event.create_time
    });

    // Processar o evento
    await processPayPalEvent(event);

    // Resposta de sucesso (PayPal espera status 200)
    return NextResponse.json({ 
      status: 'success',
      message: 'Webhook processed successfully',
      event_type: event.event_type
    });

  } catch (error) {
    console.error('Erro ao processar webhook PayPal:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process webhook'
      },
      { status: 500 }
    );
  }
}

// Endpoint GET para verificar status (opcional, para debugging)
export async function GET() {
  return NextResponse.json({
    status: 'PayPal Webhook endpoint is active',
    url: '/api/paypal-webhook',
    supported_events: [
      'BILLING.SUBSCRIPTION.CREATED',
      'BILLING.SUBSCRIPTION.ACTIVATED', 
      'BILLING.SUBSCRIPTION.CANCELLED',
      'BILLING.SUBSCRIPTION.EXPIRED',
      'PAYMENT.SALE.COMPLETED',
      'PAYMENT.SALE.DENIED'
    ]
  });
}