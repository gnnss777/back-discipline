'use client';

import { AuthProvider } from '../context/AuthContext';
import { ProgressProvider } from '../context/ProgressContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProgressProvider>
          {children}
          <Toaster theme="dark" richColors position="top-center" />
        </ProgressProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}