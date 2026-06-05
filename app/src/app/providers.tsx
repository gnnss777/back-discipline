'use client';

import { AuthProvider } from '../context/AuthContext';
import { ProgressProvider } from '../context/ProgressContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { BottomNav } from '../components/Layout';
import { Toaster } from 'sonner';
import { useAuth } from '../hooks/useAuth';

function ProvidersInner({ children }: { children: React.ReactNode }) {
 const { user } = useAuth();
 return (
  <div className={user ? 'lg:ml-56' : ''}>
   {children}
  </div>
 );
}

export function Providers({ children }: { children: React.ReactNode }) {
 return (
  <ErrorBoundary>
   <AuthProvider>
    <ProgressProvider>
     <ProvidersInner>
      {children}
     </ProvidersInner>
     <BottomNav />
     <Toaster theme="dark" richColors position="top-center" />
    </ProgressProvider>
   </AuthProvider>
  </ErrorBoundary>
 );
}