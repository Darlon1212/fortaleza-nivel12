import { useState, useEffect } from 'react';
import { SubscriptionStatus } from '@/lib/types';

export const useSubscription = (userId: string | null) => {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);

  // Buscar status da assinatura
  const fetchSubscriptionStatus = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/subscription?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setSubscription(data);
      } else {
        // Se usuário não encontrado, criar com status expired
        setSubscription({
          subscriptionStatus: 'expired',
          planPrice: '$39.90/mês',
          trialDays: 7
        });
      }
    } catch (error) {
      console.error('Erro ao buscar status da assinatura:', error);
      setSubscription({
        subscriptionStatus: 'expired',
        planPrice: '$39.90/mês',
        trialDays: 7
      });
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status da assinatura
  const updateSubscriptionStatus = async (
    status: 'trial' | 'active' | 'expired',
    billingAgreementId?: string
  ) => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          subscriptionStatus: status,
          billingAgreementId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(prev => ({
          ...prev,
          subscriptionStatus: data.subscriptionStatus,
          trialEndDate: data.trialEndDate,
          billingAgreementId,
          lastUpdated: data.lastUpdated || new Date().toISOString(),
          planPrice: '$39.90/mês',
          trialDays: 7
        }));
      }
    } catch (error) {
      console.error('Erro ao atualizar status da assinatura:', error);
    }
  };

  // Verificar se está no período de trial
  const isInTrial = () => {
    if (!subscription || subscription.subscriptionStatus !== 'trial') return false;
    if (!subscription.trialEndDate) return false;
    
    const trialEnd = new Date(subscription.trialEndDate);
    const now = new Date();
    return now < trialEnd;
  };

  // Verificar se tem acesso Pro
  const hasProAccess = () => {
    if (!subscription) return false;
    
    return subscription.subscriptionStatus === 'active' || 
           (subscription.subscriptionStatus === 'trial' && isInTrial());
  };

  // Calcular dias restantes do trial
  const getTrialDaysRemaining = () => {
    if (!subscription || !subscription.trialEndDate) return 0;
    
    const trialEnd = new Date(subscription.trialEndDate);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [userId]);

  return {
    subscription,
    loading,
    fetchSubscriptionStatus,
    updateSubscriptionStatus,
    isInTrial,
    hasProAccess,
    getTrialDaysRemaining
  };
};