export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface PaymentStatus {
  status: 'pending' | 'succeeded' | 'failed';
  stripeCustomerId?: string;
  paymentIntentId?: string;
  paidAt?: string;
}

export interface PriceTier {
  id: string;
  name: string;
  amount: number;
  currency: string;
}