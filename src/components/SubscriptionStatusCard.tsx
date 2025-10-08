import React from 'react';
import { Crown, Clock, AlertTriangle, CheckCircle, CreditCard } from 'lucide-react';
import { SubscriptionStatus } from '@/lib/types';

interface SubscriptionStatusCardProps {
  subscription: SubscriptionStatus | null;
  trialDaysRemaining: number;
  hasProAccess: boolean;
  onRenewClick?: () => void;
}

const SubscriptionStatusCard: React.FC<SubscriptionStatusCardProps> = ({
  subscription,
  trialDaysRemaining,
  hasProAccess,
  onRenewClick
}) => {
  if (!subscription) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (subscription.subscriptionStatus) {
      case 'trial':
        return {
          icon: <Clock className="w-5 h-5 text-blue-500" />,
          title: 'Período de Teste',
          description: `${trialDaysRemaining} dias restantes do seu teste gratuito`,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700'
        };
      case 'active':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          title: 'Assinatura Ativa',
          description: 'Sua assinatura Pro está ativa e funcionando',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700'
        };
      case 'expired':
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          title: 'Assinatura Expirada',
          description: 'Renove sua assinatura para continuar usando os recursos Pro',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`rounded-lg border ${statusInfo.borderColor} ${statusInfo.bgColor} p-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {statusInfo.icon}
          <div>
            <h3 className={`font-semibold ${statusInfo.textColor}`}>
              {statusInfo.title}
            </h3>
            <p className={`text-sm ${statusInfo.textColor} opacity-80 mt-1`}>
              {statusInfo.description}
            </p>
            
            {subscription.subscriptionStatus === 'active' && subscription.billingAgreementId && (
              <p className="text-xs text-gray-500 mt-2">
                ID da Assinatura: {subscription.billingAgreementId}
              </p>
            )}
          </div>
        </div>
        
        <Crown className={`w-6 h-6 ${hasProAccess ? 'text-yellow-500' : 'text-gray-300'}`} />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Plano Pro</span>
          <span className="font-semibold text-gray-900">{subscription.planPrice}</span>
        </div>
        
        {subscription.subscriptionStatus === 'trial' && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Período de teste</span>
              <span>{trialDaysRemaining}/{subscription.trialDays} dias</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((subscription.trialDays - trialDaysRemaining) / subscription.trialDays) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {(subscription.subscriptionStatus === 'expired' || 
        (subscription.subscriptionStatus === 'trial' && trialDaysRemaining <= 3)) && (
        <div className="mt-4">
          <button
            onClick={onRenewClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>
              {subscription.subscriptionStatus === 'expired' ? 'Renovar Assinatura' : 'Assinar Agora'}
            </span>
          </button>
        </div>
      )}

      {subscription.lastUpdated && (
        <p className="text-xs text-gray-400 mt-3">
          Última atualização: {new Date(subscription.lastUpdated).toLocaleString('pt-BR')}
        </p>
      )}
    </div>
  );
};

export default SubscriptionStatusCard;