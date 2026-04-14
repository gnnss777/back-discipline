---
phase: 01-foundation
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - app/src/types/user.ts
  - app/src/types/workout.ts
  - app/src/lib/storage.ts
  - app/src/context/AuthContext.tsx
  - app/src/hooks/useAuth.ts
  - app/src/app/providers.tsx
autonomous: true
requirements:
  - AUTH-01
  - AUTH-02
  - ARCH-01
user_setup: []

must_haves:
  truths:
    - "User and Workout type interfaces are defined and exported"
    - "LocalStorage utilities handle user, session, workout CRUD"
    - "AuthContext provides global user state management"
    - "useAuth hook available throughout the application"
    - "Build succeeds without TypeScript errors"
  artifacts:
    - path: "app/src/types/user.ts"
      provides: "User and UserSession interfaces"
    - path: "app/src/types/workout.ts"
      provides: "Workout, WorkoutExercise, WorkoutSet interfaces"
    - path: "app/src/lib/storage.ts"
      provides: "LocalStorage CRUD operations"
    - path: "app/src/context/AuthContext.tsx"
      provides: "Auth state management with login/register/logout"
  key_links:
    - from: "app/src/app/layout.tsx"
      to: "app/src/app/providers.tsx"
      via: "import and wrap children"
      pattern: "Providers.*children"
---

<objective>
Create user types, local storage utilities, and authentication context.

Purpose: Foundation for user management - define the data structures for users, workouts, and set up the auth system using React context with localStorage persistence.

Output: Type definitions, storage utilities, and auth context ready for Phase 2
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/codebase/CONVENTIONS.md

## Project Context

### Current State
After plan 01, the codebase is consolidated to a single Next.js app instance with a single lib folder.

### User Requirements
- Simple auth with email/password + Stripe
- Single user profile
- Offline-first with local storage

### TypeScript Conventions (from CONVENTIONS.md)
- PascalCase for interfaces: `User`, `Workout`, `Exercise`
- Explicit typing for function parameters and returns
- Use `camelCase` for functions and variables
- Interface-defined props types

### Dependencies
- None yet - building foundation
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create user and workout type definitions</name>
  <files>
    - app/src/types/user.ts
    - app/src/types/workout.ts
  </files>
  <action>
    Create TypeScript interfaces for the application data models:

**user.ts** - User types:
```typescript
// User object stored in localStorage
export interface User {
  id: string;
  email: string;
  passwordHash: string; // For localStorage auth
  name?: string;
  createdAt: string;
  paymentStatus: 'free' | 'paid';
  stripeCustomerId?: string;
}

// Session object for current logged-in user
export interface UserSession {
  userId: string;
  email: string;
  name?: string;
  paymentStatus: 'free' | 'paid';
  loggedInAt: string;
}
```

**workout.ts** - Workout types:
```typescript
// Single exercise in a workout
export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

// Single set
export interface WorkoutSet {
  reps: number;
  weight: number;
  rpe: number; // 1-10 scale
  notes?: string;
  completed: boolean;
}

// Complete workout
export interface Workout {
  id: string;
  date: string;
  exercises: WorkoutExercise[];
  notes?: string;
  duration?: number; // in minutes
}
```

Export all interfaces and create index.ts barrel file for easy imports.
  </action>
  <verify>
    <automated>TypeScript compiles without errors - no implicit any</automated>
  </verify>
  <done>User and Workout interfaces defined and exported</done>
</task>

<task type="auto">
  <name>Task 2: Create localStorage utilities</name>
  <files>
    - app/src/lib/storage.ts
  </files>
  <action>
    Create storage utilities for offline-first data persistence:

```typescript
import { User, Workout, UserSession } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'backdiscipline_users',
  SESSION: 'backdiscipline_session',
  WORKOUTS: 'backdiscipline_workouts',
  PROGRESS: 'backdiscipline_progress',
} as const;

// Generic storage helpers
export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

// User-specific helpers
export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS) || [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  setItem(STORAGE_KEYS.USERS, users);
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email === email);
}

// Session helpers
export function getSession(): UserSession | null {
  return getItem<UserSession>(STORAGE_KEYS.SESSION);
}

export function setSession(session: UserSession): void {
  setItem(STORAGE_KEYS.SESSION, session);
}

export function clearSession(): void {
  removeItem(STORAGE_KEYS.SESSION);
}

// Workout helpers
export function getWorkouts(): Workout[] {
  return getItem<Workout[]>(STORAGE_KEYS.WORKOUTS) || [];
}

export function saveWorkout(workout: Workout): void {
  const workouts = getWorkouts();
  workouts.push(workout);
  setItem(STORAGE_KEYS.WORKOUTS, workouts);
}
```

Key points:
- Handle server-side rendering (typeof window check)
- Use type-safe generic helpers
- Include user, session, and workout storage functions
  </action>
  <verify>
<automated>TypeScript compiles without errors</automated>
  </verify>
  <done>Storage utilities with CRUD operations for users, sessions, and workouts</done>
</task>

<task type="auto">
  <name>Task 3: Create authentication context and hooks</name>
  <files>
    - app/src/context/AuthContext.tsx
    - app/src/hooks/useAuth.ts
    - app/src/app/providers.tsx
  </files>
  <action>
    Create React context for authentication state management:

**AuthContext.tsx**:
```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserSession } from '@/types';
import { getSession, setSession, clearSession, findUserByEmail, saveUser } from '@/lib/storage';

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load session from localStorage on mount
    const session = getSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const existingUser = findUserByEmail(email);
    if (!existingUser) {
      return { success: false, error: 'Usuário não encontrado' };
    }
    // Simple password check (in real app, use bcrypt)
    if (existingUser.passwordHash !== password) {
      return { success: false, error: 'Senha incorreta' };
    }
    const session: UserSession = {
      userId: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      paymentStatus: existingUser.paymentStatus,
      loggedInAt: new Date().toISOString(),
    };
    setSession(session);
    setUser(session);
    return { success: true };
  };

  const register = async (email: string, password: string, name?: string) => {
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'Email já cadastrado' };
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash: password, // In production, hash this!
      name,
      createdAt: new Date().toISOString(),
      paymentStatus: 'free',
    };
    saveUser(newUser);
    const session: UserSession = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      paymentStatus: newUser.paymentStatus,
      loggedInAt: new Date().toISOString(),
    };
    setSession(session);
    setUser(session);
    return { success: true };
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

**providers.tsx** (for wrapping the app):
```typescript
'use client';

import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
```

Update the root layout to include the Providers component.
  </action>
  <verify>
  <automated>TypeScript compiles without errors</automated>
  </verify>
  <done>Auth context with login, register, logout functions and useAuth hook</done>
</task>

</tasks>

<verification>
- [ ] User and Workout types created
- [ ] Storage utilities handle localStorage correctly
- [ ] Auth context provides user state globally
- [ ] useAuth hook accessible throughout app
- [ ] Build succeeds without errors
</verification>

<success_criteria>
- Type definitions complete and exported
- localStorage helpers work for user, session, workout data
- Auth context manages login/register/logout
- useAuth hook available in any component
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-SUMMARY.md`
</output>