import { NextRequest, NextResponse } from 'next/server';

// Simulação de banco de dados de usuários
const users = new Map<string, any>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const user = users.get(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      subscriptionStatus: user.subscriptionStatus || 'expired',
      trialEndDate: user.trialEndDate,
      billingAgreementId: user.billingAgreementId,
      lastUpdated: user.lastUpdated,
      planPrice: '$39.90/mês',
      trialDays: 7
    });

  } catch (error) {
    console.error('Erro ao buscar status da assinatura:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subscriptionStatus, billingAgreementId } = body;
    
    if (!userId || !subscriptionStatus) {
      return NextResponse.json(
        { error: 'userId and subscriptionStatus are required' },
        { status: 400 }
      );
    }

    const user = users.get(userId) || {};
    user.subscriptionStatus = subscriptionStatus;
    user.billingAgreementId = billingAgreementId;
    user.lastUpdated = new Date().toISOString();
    
    // Se for trial, definir data de fim do trial (7 dias)
    if (subscriptionStatus === 'trial') {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7);
      user.trialEndDate = trialEnd.toISOString();
    }
    
    users.set(userId, user);

    return NextResponse.json({
      success: true,
      subscriptionStatus: user.subscriptionStatus,
      trialEndDate: user.trialEndDate,
      message: 'Subscription status updated successfully'
    });

  } catch (error) {
    console.error('Erro ao atualizar status da assinatura:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}