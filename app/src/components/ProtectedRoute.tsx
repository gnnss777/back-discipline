'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
 children: React.ReactNode;
 requirePayment?: boolean;
}

export function ProtectedRoute({ children, requirePayment = false }: ProtectedRouteProps) {
 const { user, isLoading } = useAuth();
 const router = useRouter();
 const pathname = usePathname();

 useEffect(() => {
  if (isLoading) return;

  if (!user) {
   router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
   return;
  }

  if (requirePayment && user.paymentStatus !== 'paid') {
   router.push('/register?payment=required');
  }
 }, [user, isLoading, router, pathname, requirePayment]);

 if (isLoading) {
  return (
   <div className="min-h-screen bg-background flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
   </div>
  );
 }

 if (!user || (requirePayment && user.paymentStatus !== 'paid')) {
  return null;
 }

 return <>{children}</>;
}