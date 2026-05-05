# Phase 07: Cloud Authentication - Research

**Researched:** 2026-05-04
**Domain:** Authentication with Supabase for Next.js 16 App Router
**Confidence:** HIGH

## Summary

This phase replaces localStorage-based authentication with Supabase cloud authentication using @supabase/ssr. The implementation leverages cookie-based sessions (httpOnly cookies) that persist across devices and browser sessions, enabling cross-device login. Supabase Auth provides email/password registration and login out of the box, with automatic session management including token refresh handled by the @supabase/ssr package.

**Primary recommendation:** Use @supabase/ssr for Next.js 16 App Router with createServerClient for middleware/Server Components and createBrowserClient for Client Components. Replace AuthContext methods to call Supabase auth functions instead of localStorage.

---

## Standard Stack

### Core Authentication

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/ssr | ^0.6.0 | Cookie-based auth for App Router | Official Next.js 16 package. Manages sessions via httpOnly cookies (not localStorage). Works in middleware, Server Components, and Client Components. |
| @supabase/supabase-js | ^2.48.0 | Browser client for client-side queries | Use only in Client Components. Server Components use createServerClient from @supabase/ssr. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-hook-form | ^7.54.0 | Form state management | Login/register form handling (existing pattern) |
| zod | ^3.24.0 | Schema validation | Email/password validation (existing pattern) |

**Installation:**
```bash
npm install @supabase/ssr @supabase/supabase-js
```

---

## Architecture Patterns

### Recommended Project Structure

```
app/
├── supabase/
│   ├── server.ts      # Server client (middleware, Server Actions)
│   └── client.ts    # Browser client (Client Components)
├── actions/
│   └── auth.ts      # Server Actions: login, register, logout
├── context/
│   └── AuthContext.tsx  # Refactored for Supabase
```

### Pattern 1: Supabase Server Client

For use in middleware, Server Components, and Server Actions.

```typescript
// app/supabase/server.ts
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(cookieStore.toString())
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — ignore cookie errors
          }
        },
      },
    }
  )
}
```

### Pattern 2: Supabase Browser Client

For use in Client Components only.

```typescript
// app/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | undefined

export function createSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  return supabaseClient
}
```

### Pattern 3: Auth Server Actions

```typescript
// app/actions/auth.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/app/supabase/server'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()

  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/')
}
```

### Pattern 4: Client-Side Auth Context

```typescript
// app/src/context/AuthContext.tsx (refactored)
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createSupabaseClient } from '@/app/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createSupabaseClient()

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const supabase = createSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  }

  const register = async (email: string, password: string) => {
    const supabase = createSupabaseClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  }

  const logout = async () => {
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Session management | Custom JWT/localStorage tokens | @supabase/ssr | httpOnly cookies, automatic refresh, cross-device persistence |
| Token refresh | Custom refresh logic | @supabase/ssr automatic | Handles refresh token rotation, expiry gracefully |
| Password hashing | Custom bcrypt/scrypt | SupabaseAuth | Built-in, secure, less complexity |

**Key insight:** Custom session management is a security liability. Using @supabase/ssr ensures httpOnly cookies, automatic token refresh, and proper security defaults.

---

## Common Pitfalls

### Pitfall 1: Storing Tokens in localStorage (OWASP Violation)

**What goes wrong:** XSS vulnerabilities allow attackers to steal authentication tokens.

**Why it happens:** localStorage is accessible via JavaScript.

**How to avoid:** Use @supabase/ssr which stores tokens in httpOnly cookies automatically.

### Pitfall 2: Middleware-Only Authentication (CVE-2025-29927)

**What goes wrong:** Authentication only checked in middleware can be bypassed.

**Why it happens:** Next.js middleware vulnerabilities, static routes bypass.

**How to avoid:** Implement auth checks at multiple boundaries: middleware, Server Components, and Client Components. @supabase/ssr handles this.

### Pitfall 3: Session Token vs Database User Drift

**What goes wrong:** Session exists but user deleted from database, silent failures.

**Why it happens:** Account deletion after session creation.

**How to avoid:** Verify user exists in database before operations. Use Supabase's auth.uid() in RLS policies.

### Pitfall 4: Token Refresh Failures Silently

**What goes wrong:** Users appear "logged in" but can't access data.

**Why it happens:** Network issues during refresh.

**How to avoid:** Handle auth state changes via onAuthStateChange listener, show appropriate errors.

---

## Code Examples

### Environment Variables (.env.local)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx...
```

### Login Page Integration

```typescript
// app/src/app/login/page.tsx (refactored)
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { login, user, isLoading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await login(email, password)
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Erro ao fazer login')
    }
  }

  // ... render form
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|-------------|--------|
| localStorage tokens | httpOnly cookies via @supabase/ssr | 2026 | Security improvement, cross-device support |
| Custom JWT parsing | Supabase automatic session | 2026 | Simpler, more secure |

**Deprecated/outdated:**
- Custom JWT/localStorage auth: Replaced by Supabase for security and cross-device support
- @supabase/supabase-js alone: Replaced by @supabase/ssr for cookie-based sessions

---

## Open Questions

1. **Session Expiration Duration**
   - What we know: Default Supabase session is 30 days
   - What's unclear: Should we allow users to configure this?
   - Recommendation: Keep default for now, can adjust via Supabase dashboard

2. **Existing localStorage User Data**
   - What we know: D-04 states "Start fresh — no existing localStorage users to migrate"
   - What's unclear: Is there any user data to preserve?
   - Recommendation: Follow the decision - no migration needed

3. **Profile Data Storage**
   - What we know: AUTH requirements focus on auth, not profile data
   - What's unclear: Should we extend with profile table now or later?
   - Recommendation: Focus on auth for this phase, profile for later phase

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Supabase project | Cloud auth | Required | — | Must be created first |
| Node.js 18+ | @supabase/ssr | ✓ (project) | — | — |
| Next.js 16 | @supabase/ssr | ✓ (project) | — | — |

**Missing dependencies with no fallback:**
- Supabase project must be created before implementation

**Missing dependencies with fallback:**
- None - @supabase/ssr is well-supported

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | User can register with email/password in cloud database | Supabase.auth.signUp() provides cloud registration |
| AUTH-02 | User can login from any device with same credentials | httpOnly cookies persist across devices |
| AUTH-03 | Session persists across browser sessions | @supabase/ssr automatic session management |

---

## Sources

### Primary (HIGH confidence)
- [Supabase Auth with Next.js — Official Guide](https://supabase.com/docs/guides/auth/server-side/nextjs) (2026-05-01)
- [Supabase Quickstart for Next.js](https://supabase.com/docs/guides/auth/quickstarts/nextjs) (2026-05-01)

### Secondary (MEDIUM confidence)
- [Supabase Auth SSR Patterns](https://supabase.io/docs/guides/with-nextjs) (2026-04-03)
- [ARCHITECTURE.md research document](.planning/research/ARCHITECTURE.md)
- [PITFALLS.md research document](.planning/research/PITFALLS.md)

### Tertiary (LOW confidence)
- [TheCodeForge - Supabase Auth Next.js Guide](https://thecodeforge.io/javascript/supabase-auth-next-js-complete-guide/) (2026-04-12)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - @supabase/ssr is the official package for Next.js 16
- Architecture: HIGH - Official Supabase docs and patterns
- Pitfalls: HIGH - Based on official docs and known security issues

**Research date:** 2026-05-04
**Valid until:** 60 days (stable package)