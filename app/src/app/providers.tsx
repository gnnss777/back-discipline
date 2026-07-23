'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '../context/AuthContext';
import { ProgressProvider } from '../context/ProgressContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { BottomNav } from '../components/Layout';
import { Toaster } from 'sonner';
import { useAuth } from '../hooks/useAuth';

function ProvidersInner({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
   <div className={user && !isAdmin ? 'lg:ml-56' : ''}>
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
      <BottomNavWrapper />
      <Toaster theme="dark" richColors position="top-center" />
     </ProgressProvider>
    </AuthProvider>
   </ErrorBoundary>
  );
}

function BottomNavWrapper() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  if (isAdmin) return null;
  return <BottomNav />;
}
