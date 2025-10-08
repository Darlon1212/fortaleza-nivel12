export interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense' | 'investment';
  category: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  monthlyLivingCost: number;
  financialReserve: number;
  monthlySpendingLimit: number;
  subscriptionStatus: 'trial' | 'active' | 'expired';
  trialEndDate: string;
  billingAgreementId?: string;
  lastUpdated?: string;
}

export interface FinancialData {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalInvestments: number;
  fortressLevel: number;
  transactions: Transaction[];
}

export interface InvestmentType {
  id: string;
  name: string;
  amount: number;
  type: 'stocks' | 'fixed_income' | 'real_estate' | 'others';
  date: string;
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

// Novos tipos para o sistema de pagamento PayPal
export interface PayPalWebhookEvent {
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

export interface NotificationData {
  id: string;
  userId: string;
  type: 'subscription_activated' | 'subscription_cancelled' | 'payment_completed' | 'payment_failed';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SubscriptionStatus {
  subscriptionStatus: 'trial' | 'active' | 'expired';
  trialEndDate?: string;
  billingAgreementId?: string;
  lastUpdated?: string;
  planPrice: string;
  trialDays: number;
}