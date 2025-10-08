import { NextRequest, NextResponse } from 'next/server';

// Interface para os dados do webhook do PayPal
interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource_type: string;
  summary: string;
  resource: {
    id: string;
    status: string;
    subscriber?: {
      email_address: string;
    };
    billing_info?: {
      next_billing_time: string;
    };
  };
  create_time: string;
}

// Simulação de banco de dados - em produção, use um banco real
const subscriptions = new Map<string, {
  id: string;
  email: string;
  status: 'active' | 'cancelled' | 'expired' | 'suspended';
  lastUpdated: string;
}>();

export async function POST(request: NextRequest) {
  try {
    // Lê o corpo da requisição
    const body: PayPalWebhookEvent = await request.json();
    
    console.log('Webhook PayPal recebido:', {
      eventType: body.event_type,
      resourceId: body.resource?.id,
      timestamp: new Date().toISOString()
    });

    // Verifica se é um evento de assinatura
    if (body.resource_type !== 'subscription') {
      console.log('Evento ignorado - não é de assinatura');
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    const subscriptionId = body.resource.id;
    const eventType = body.event_type;
    const subscriberEmail = body.resource.subscriber?.email_address || '';

    // Processa diferentes tipos de eventos
    let newStatus: 'active' | 'cancelled' | 'expired' | 'suspended' = 'active';

    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        newStatus = 'active';
        console.log(`Assinatura ${subscriptionId} ativada para ${subscriberEmail}`);
        break;

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        newStatus = 'cancelled';
        console.log(`Assinatura ${subscriptionId} cancelada para ${subscriberEmail}`);
        break;

      case 'BILLING.SUBSCRIPTION.EXPIRED':
        newStatus = 'expired';
        console.log(`Assinatura ${subscriptionId} expirada para ${subscriberEmail}`);
        break;

      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        newStatus = 'suspended';
        console.log(`Assinatura ${subscriptionId} suspensa para ${subscriberEmail}`);
        break;

      case 'PAYMENT.SALE.COMPLETED':
        newStatus = 'active';
        console.log(`Pagamento completado para assinatura ${subscriptionId}`);
        break;

      case 'PAYMENT.SALE.DENIED':
        newStatus = 'suspended';
        console.log(`Pagamento negado para assinatura ${subscriptionId}`);
        break;

      default:
        console.log(`Evento ${eventType} não processado`);
        return NextResponse.json({ status: 'event_not_processed' }, { status: 200 });
    }

    // Atualiza o status da assinatura no "banco de dados"
    subscriptions.set(subscriptionId, {
      id: subscriptionId,
      email: subscriberEmail,
      status: newStatus,
      lastUpdated: new Date().toISOString()
    });

    // Em produção, aqui você faria:
    // await database.updateSubscription(subscriptionId, { status: newStatus });
    
    console.log(`Status da assinatura ${subscriptionId} atualizado para: ${newStatus}`);

    // Retorna sucesso
    return NextResponse.json({
      status: 'success',
      message: 'Webhook processado com sucesso',
      subscriptionId,
      newStatus,
      eventType
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao processar webhook PayPal:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// Endpoint para verificar status de uma assinatura (útil para debug)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subscriptionId = searchParams.get('id');

  if (!subscriptionId) {
    return NextResponse.json({
      error: 'ID da assinatura é obrigatório'
    }, { status: 400 });
  }

  const subscription = subscriptions.get(subscriptionId);
  
  if (!subscription) {
    return NextResponse.json({
      error: 'Assinatura não encontrada'
    }, { status: 404 });
  }

  return NextResponse.json(subscription, { status: 200 });
}