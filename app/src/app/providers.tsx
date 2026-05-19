'use client';

import { AuthProvider } from '../context/AuthContext';
import { ProgressProvider } from '../context/ProgressContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { BottomNav } from '../components/Layout';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProgressProvider>
          {children}
          <BottomNav />
          <Toaster theme="dark" richColors position="top-center" />
        </ProgressProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}