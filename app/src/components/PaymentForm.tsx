'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { saveUser, findUserByEmail, getSession } from '../lib/storage';
import type { User } from '../types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const cardElementOptions = {
  style: {
    base: {
      color: '#E8E0D0',
      fontFamily: 'Oswald, sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#666',
      },
    },
    invalid: {
      color: '#ef4444',
    },
  },
};

interface PaymentFormProps {
  onSuccess?: () => void;
}

function PaymentFormContent({ onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);
    setError('');

    const session = getSession();
    if (!session) {
      setError('Sessão não encontrada. Faça login novamente.');
      setLoading(false);
      return;
    }

    // For MVP: In production, this would create a payment intent on the server
    // For now, we'll simulate a successful payment
    const user = findUserByEmail(session.email);
    if (user) {
      // Update payment status
      const updatedUser: User = {
        ...user,
        paymentStatus: 'paid',
        stripeCustomerId: `cus_${Date.now()}`,
      };
      saveUser(updatedUser);
      setSuccess(true);
      onSuccess?.();
    } else {
      setError('Usuário não encontrado');
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-green-900/30 border border-green-800 p-4 rounded-lg">
        <p className="text-green-400 text-center">Pagamento realizado com sucesso!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-gray-300 mb-2">Dados do cartão</label>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#B8956A] hover:bg-[#c9a67a] text-[#0A0A0A] font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processando...' : 'Pagar R$ 97,00'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Pagamento seguro via Stripe
      </p>
    </form>
  );
}

export function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
}