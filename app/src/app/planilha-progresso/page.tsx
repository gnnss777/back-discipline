'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlanilhaProgressoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/planilha');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-[#B8956A]">Redirecionando...</div>
    </div>
  );
}
