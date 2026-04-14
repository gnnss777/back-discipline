---
phase: 02-authentication-stripe
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/src/app/login/page.tsx
  - app/src/app/register/page.tsx
  - app/src/components/ProtectedRoute.tsx
  - app/src/app/layout.tsx
autonomous: true
requirements:
  - AUTH-01
  - AUTH-02
  - AUTH-05
user_setup: []

must_haves:
  truths:
    - "User can access login page at /login"
    - "User can access register page at /register"
    - "Login validates email/password against stored users"
    - "Register creates new user in localStorage"
    - "Protected routes redirect unauthenticated users to /login"
    - "Authenticated users can access protected content"
  artifacts:
    - path: "app/src/app/login/page.tsx"
      provides: "Login form with email/password inputs"
    - path: "app/src/app/register/page.tsx"
      provides: "Registration form with email/password inputs"
    - path: "app/src/components/ProtectedRoute.tsx"
      provides: "Route wrapper that checks auth state"
  key_links:
    - from: "app/src/app/login/page.tsx"
      to: "app/src/context/AuthContext"
      via: "useAuth hook"
      pattern: "useAuth.*login"
    - from: "app/src/app/register/page.tsx"
      to: "app/src/context/AuthContext"
      via: "useAuth hook"
      pattern: "useAuth.*register"
    - from: "app/src/components/ProtectedRoute.tsx"
      to: "app/src/context/AuthContext"
      via: "useAuth hook"
      pattern: "useAuth.*user"
---

<objective>
Create login/register pages and protected route wrapper.

Purpose: Allow users to register, login, and protect routes from unauthenticated access. This is Phase 2 of the Back Discipline MVP.

Output: Login page, register page, protected route component
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/codebase/CONVENTIONS.md
@.planning/codebase/STRUCTURE.md
@.planning/phases/01-foundation/01-foundation-02-PLAN.md
@.planning/phases/01-foundation/01-foundation-SUMMARY.md

## Project Context

### Current State (from Phase 1)
- User types defined in `app/src/types/user.ts` and `app/src/types/workout.ts`
- LocalStorage utilities in `app/src/lib/storage.ts`
- AuthContext in `app/src/context/AuthContext.tsx` with login/register/logout
- useAuth hook in `app/src/hooks/useAuth.ts`
- Providers wrapping the app in `app/src/app/providers.tsx`

### UI Theme
- Dark theme (#0A0A0A background, #B8956A gold accent)
- Tailwind CSS 4
- Lucide React icons

### Phase 2 Requirements
- Login page at /login
- Register page at /register  
- Protected route wrapper component
- Redirect to login when accessing protected content without session
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create login page</name>
  <files>
    - app/src/app/login/page.tsx
  </files>
  <action>
    Create the login page at `app/src/app/login/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Erro ao fazer login');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="flex items-center text-[#B8956A] hover:text-[#c9a67a] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao início
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Entrar</h1>
        <p className="text-gray-400 mb-8">Entre com sua conta para continuar</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-12 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B8956A] hover:bg-[#c9a67a] text-[#0A0A0A] font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Não tem conta?{' '}
          <Link href="/register" className="text-[#B8956A] hover:text-[#c9a67a]">
            Cadastrar
          </Link>
        </p>
      </div>
    </div>
  );
}
```

Follow the existing page patterns and conventions from the codebase.
  </action>
  <verify>
    <automated>npm run build 2>&1 | Select-String -Pattern "error|Error" -Quiet</automated>
  </verify>
  <done>Login page accessible at /login with working form</done>
</task>

<task type="auto">
  <name>Task 2: Create register page</name>
  <files>
    - app/src/app/register/page.tsx
  </files>
  <action>
    Create the registration page at `app/src/app/register/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    setIsLoading(true);

    const result = await register(email, password, name);
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Erro ao cadastrar');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="flex items-center text-[#B8956A] hover:text-[#c9a67a] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao início
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
        <p className="text-gray-400 mb-8">Cadastre-se para começar seu treino</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2">Nome (opcional)</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
                placeholder="Seu nome"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-12 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
                placeholder="Mínimo 6 caracteres"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirmar Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
                placeholder="Confirme sua senha"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B8956A] hover:bg-[#c9a67a] text-[#0A0A0A] font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
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
```

Follow the same styling conventions as login page.
  </action>
  <verify>
    <automated>npm run build 2>&1 | Select-String -Pattern "error|Error" -Quiet</automated>
  </verify>
  <done>Register page accessible at /register with validation</done>
</task>

<task type="auto">
  <name>Task 3: Create protected route wrapper</name>
  <files>
    - app/src/components/ProtectedRoute.tsx
  </files>
  <action>
    Create the ProtectedRoute component at `app/src/components/ProtectedRoute.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePayment?: boolean;
}

export function ProtectedRoute({ children, requirePayment = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while still checking auth state
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // If payment required but user hasn't paid, redirect to payment
    if (requirePayment && user.paymentStatus !== 'paid') {
      router.push('/register?payment=required');
    }
  }, [user, isLoading, router, pathname, requirePayment]);

  // Show nothing while loading or redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#B8956A]">Carregando...</div>
      </div>
    );
  }

  // Don't render children if not authorized
  if (!user || (requirePayment && user.paymentStatus !== 'paid')) {
    return null;
  }

  return <>{children}</>;
}
```

This component:
- Checks if user is authenticated via useAuth hook
- Redirects to /login if not authenticated
- Optionally checks payment status for paid content
- Shows loading state while checking auth
- Preserves the intended destination for redirect after login
  </action>
  <verify>
    <automated>npm run build 2>&1 | Select-String -Pattern "error|Error" -Quiet</automated>
  </verify>
  <done>ProtectedRoute component created and exported</done>
</task>

</tasks>

<verification>
- [ ] Login page accessible at /login
- [ ] Login validates credentials against stored users
- [ ] Register page accessible at /register  
- [ ] Register creates new user in localStorage
- [ ] ProtectedRoute redirects unauthenticated users
- [ ] Build succeeds without TypeScript errors
</verification>

<success_criteria>
- Login page at /login with email/password form
- Register page at /register with validation
- ProtectedRoute component for route protection
- Auth flow works: register → login → access protected content
</success_criteria>

<output>
After completion, create `.planning/phases/02-authentication-stripe/02-authentication-stripe-01-SUMMARY.md`
</output>