'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { updateProgress, updateLastRead } from '@/lib/reading-storage';
import { toast } from 'sonner';

interface ConcluirButtonProps {
  slug: string;
}

export function ConcluirButton({ slug }: ConcluirButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConcluir = async () => {
    if (!user) return;
    setLoading(true);

    const result = await updateProgress(user.userId, slug, true);
    await updateLastRead(user.userId, slug);

    if (result.success) {
      toast.success('Capítulo concluído!');
    }

    router.push('/livro');
  };

  return (
    <button
      onClick={handleConcluir}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-4 min-h-[52px] bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#9A7A50] transition-colors text-base disabled:opacity-50"
    >
      <CheckCircle className="w-5 h-5" />
      {loading ? 'SALVANDO...' : 'CONCLUIR E VOLTAR'}
    </button>
  );
}
