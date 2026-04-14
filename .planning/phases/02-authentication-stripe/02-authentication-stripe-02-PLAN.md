---
phase: 02-authentication-stripe
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - app/src/app/register/page.tsx
  - app/src/components/PaymentForm.tsx
  - app/src/lib/storage.ts
autonomous: true
requirements:
  - AUTH-06
  - AUTH-07
user_setup:
  - service: stripe
    why: "Payment processing for premium access"
    env_vars:
      - name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        source: "Stripe Dashboard -> Developers -> API keys"
      - name: STRIPE_SECRET_KEY
        source: "Stripe Dashboard -> Developers -> API keys"

must_haves:
  truths:
    - "User can pay for premium access during registration"
    - "Payment status stored in localStorage"
    - "Payment form integrated with Stripe Elements"
    - "Users with paid status can access premium content"
  artifacts:
    - path: "app/src/components/PaymentForm.tsx"
      provides: "Stripe payment form with card input"
    - path: "app/src/app/register/page.tsx"
      provides: "Updated register flow with payment option"
  key_links:
    - from: "app/src/components/PaymentForm.tsx"
      to: "app/src/lib/storage"
      via: "updateUserPayment function"
      pattern: "updateUser.*paymentStatus"
    - from: "app/src/app/register/page.tsx"
      to: "app/src/components/PaymentForm"
      via: "import and conditional render"
      pattern: "PaymentForm.*payment"
---

<objective>
Integrate Stripe payment form into the registration flow.

Purpose: Allow users to pay for premium access during registration. Payment status determines access to paid content.

Output: Payment form component, updated register flow, payment status tracking
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/02-authentication-stripe/02-authentication-stripe-01-PLAN.md

## Project Context

### Phase 2, Plan 1 Completed
- Login page created at /login
- Register page created at /register
- ProtectedRoute component created

### Stripe Integration
This plan adds payment capability to the registration flow using Stripe. For MVP, we'll use:
- Stripe.js client-side for card element
- Simple localStorage for payment status (no backend processing for MVP)
- Manual test mode for development

### User Setup Required
Before running this plan:
1. Get Stripe API keys from Stripe Dashboard
2. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local
3. Set STRIPE_SECRET_KEY in .env.local (server-side only)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add Stripe package and types</name>
  <files>
    - app/package.json
    - app/src/types/payment.ts
  </files>
  <action>
    First, add Stripe to dependencies:

```bash
cd app && npm install @stripe/stripe-js @stripe/react-stripe-js
```

Then create payment types in `app/src/types/payment.ts`:

```typescript
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
  amount: number; // in cents
  currency: string;
}
```

Note: For MVP, since there's no backend server to create payment intents, we'll use a simplified approach:
- Store payment intent status in localStorage
- Use test mode for development
- In production, this would integrate with a server endpoint
  </action>
  <verify>
    <automated>npm list @stripe/stripe-js</automated>
  </verify>
  <done>Stripe packages installed and payment types defined</done>
</task>

<task type="auto">
  <name>Task 2: Create PaymentForm component</name>
  <files>
    - app/src/components/PaymentForm.tsx
  </files>
  <action>
    Create the payment form component at `app/src/components/PaymentForm.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Lock } from 'lucide-react';

// Initialize Stripe with publishable key
// Note: In production, use environment variable
const stripePromise = typeof window !== 'undefined' 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')
  : null;

interface PaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  amount?: number;
}

function PaymentFormContent({ onSuccess, onError, amount = 4900 }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    // For MVP: Simulate payment processing
    // In production, this would create a PaymentIntent on the server
    // and confirm it here
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, always succeed if card element is filled
    // In production, use stripe.confirmCardPayment with real clientSecret
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setCardError(error.message || 'Erro ao processar pagamento');
      onError(error.message || 'Erro ao processar pagamento');
      setIsProcessing(false);
      return;
    }

    if (paymentMethod) {
      // Payment method created successfully
      // In production, confirm with backend
      onSuccess();
    }

    setIsProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#6b7280',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-300 mb-2">Dados do cartão</label>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {cardError && (
        <div className="text-red-400 text-sm">{cardError}</div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center">
          <Lock className="w-4 h-4 mr-1" />
          Pagamento seguro
        </div>
        <div>
          R$ {(amount / 100).toFixed(2)}
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#B8956A] hover:bg-[#c9a67a] text-[#0A0A0A] font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#0A0A0A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processando...
          </span>
        ) : (
          <span className="flex items-center">
            <CreditCard className="w-4 h-4 mr-2" />
            Pagar R$ {(amount / 100).toFixed(2)}
          </span>
        )}
      </button>
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
```

This component:
- Wraps Stripe Elements provider
- Provides CardElement for card input
- Handles payment method creation
- Shows loading state during processing
- Follows the dark theme styling
  </action>
  <verify>
    <automated>npm run build 2>&1 | Select-String -Pattern "error|Error" -Quiet</automated>
  </verify>
  <done>PaymentForm component created with Stripe integration</done>
</task>

<task type="auto">
  <name>Task 3: Update register page with payment option</name>
  <files>
    - app/src/app/register/page.tsx
  </files>
  <action>
    Update the register page to include optional payment after successful registration:

```tsx
'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PaymentForm } from '@/components/PaymentForm';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

function RegisterContent() {
  const [step, setStep] = useState<'register' | 'payment' | 'complete'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    setIsLoading(true);

    const result = await register(email, password, name);
    
    if (result.success) {
      // If payment is required, go to payment step
      const needsPayment = searchParams.get('payment') === 'required';
      if (needsPayment) {
        setStep('payment');
      } else {
        router.push(redirect);
      }
    } else {
      setError(result.error || 'Erro ao cadastrar');
    }
    
    setIsLoading(false);
  };

  const handlePaymentSuccess = () => {
    // Update user payment status in localStorage
    // This would be handled by the auth context in production
    setStep('complete');
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
  };

  // Render steps
  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Pagamento Confirmado!</h1>
          <p className="text-gray-400 mb-8">Obrigado pela sua compra. Bem-vindo ao Back Discipline Premium.</p>
          <Link
            href={redirect}
            className="inline-block bg-[#B8956A] hover:bg-[#c9a67a] text-[#0A0A0A] font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Ir para Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <button 
            onClick={() => setStep('register')}
            className="flex items-center text-[#B8956A] hover:text-[#c9a67a] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>

          <h1 className="text-3xl font-bold text-white mb-2">Finalizar Pagamento</h1>
          <p className="text-gray-400 mb-8">Complete seu acesso premium</p>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <PaymentForm
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            amount={4900} // R$ 49.00
          />
        </div>
      </div>
    );
  }

  // Registration form (existing code remains the same)
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ... existing registration form ... */}
        <Link 
          href="/" 
          className="flex items-center text-[#B8956A] hover:text-[#c9a67a] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao início
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
        <p className="text-gray-400 mb-8">Cadastre-se para começar seu treino</p>

        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2">Nome (opcional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Senha</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirmar Senha</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
              placeholder="Confirme sua senha"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B8956A] hover:bg-[#c9a67a] text-[#0A0A0A] font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cadastrando...' : 'Continuar'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Já tem conta?{' '}
          <Link href="/login" className="text-[#B8956A] hover:text-[#c9a67a]">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#B8956A]">Carregando...</div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
```

Key changes:
- Uses Suspense for useSearchParams (required in Next.js)
- Added payment step after registration
- Shows success screen after payment
- Supports redirect parameter for post-registration navigation
  </action>
  <verify>
    <automated>npm run build 2>&1 | Select-String -Pattern "error|Error" -Quiet</automated>
  </verify>
  <done>Register page updated with payment integration</done>
</task>

<task type="auto">
  <name>Task 4: Add payment status helper to storage</name>
  <files>
    - app/src/lib/storage.ts
  </files>
  <action>
    Add payment-related helper functions to storage.ts:

```typescript
// Add to existing storage.ts

// Payment status helpers
export function updateUserPayment(userId: string, status: 'free' | 'paid'): void {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex >= 0) {
    users[userIndex].paymentStatus = status;
    setItem(STORAGE_KEYS.USERS, users);
    
    // Also update session if this is the current user
    const session = getSession();
    if (session && session.userId === userId) {
      session.paymentStatus = status;
      setSession(session);
    }
  }
}

export function getPaymentStatus(userId: string): 'free' | 'paid' | null {
  const user = getUsers().find(u => u.id === userId);
  return user?.paymentStatus || null;
}
```
  </action>
  <verify>
    <automated>npm run build 2>&1 | Select-String -Pattern "error|Error" -Quiet</automated>
  </verify>
  <done>Payment helper functions added to storage</done>
</task>

</tasks>

<verification>
- [ ] Stripe packages installed
- [ ] PaymentForm component created with CardElement
- [ ] Register page has payment flow
- [ ] Payment status can be stored and retrieved
- [ ] Build succeeds without TypeScript errors
</verification>

<success_criteria>
- Stripe Elements integration works
- Payment form displays in register flow
- Payment status stored in localStorage
- User can complete payment and access premium content
</success_criteria>

<output>
After completion, create `.planning/phases/02-authentication-stripe/02-authentication-stripe-02-SUMMARY.md`
</output>