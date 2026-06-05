'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlanilhaProgressoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/planilha');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-primary">Redirecionando...</div>
    </div>
  );
}
