'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { updateProgress, updateLastRead } from '@/lib/reading-storage';
import { getGroupBySlug, chapterGroups, chapters } from '@/lib/chapters';
import { toast } from 'sonner';

interface ConcluirButtonProps {
  slug: string;
}

export function ConcluirButton({ slug }: ConcluirButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const group = getGroupBySlug(slug);
  const currentIdx = group ? group.children.indexOf(slug) : -1;
  const hasNext = group && currentIdx < group.children.length - 1;
  const nextSlug = hasNext ? group!.children[currentIdx + 1] : null;

  // Find next content after this group (for "VOLTAR AO MENU" redirect)
  function getNextGroupStart(): string | null {
    if (!group) {
      // Standalone chapter — find next standalone
      const curOrder = chapters.find(c => c.slug === slug)?.order ?? -1;
      const next = chapters.find(c => c.order > curOrder && !getGroupBySlug(c.slug));
      return next?.slug ?? null;
    }
    const nextGroup = chapterGroups.find(g => g.order > group.order);
    if (nextGroup) return nextGroup.children[0];
    // No more groups — find first standalone Part II chapter after this group
    const lastChildOrder = chapters.find(c => c.slug === group.children[group.children.length - 1])?.order ?? -1;
    const nextStandalone = chapters.find(c => c.order > lastChildOrder && !getGroupBySlug(c.slug));
    return nextStandalone?.slug ?? null;
  }

  const nextContentSlug = nextSlug || getNextGroupStart();

  const handleConcluir = async () => {
    if (!user) return;
    setLoading(true);

    const result = await updateProgress(user.userId, slug, true);

    // Point "CONTINUAR" to the next unread content
    const targetSlug = nextContentSlug || slug;
    await updateLastRead(user.userId, targetSlug);

    if (result.success) {
      toast.success('Capítulo concluído!');
    }

    if (nextSlug) {
      router.push(`/livro/${nextSlug}`);
    } else {
      router.push('/livro');
    }
  };

  if (hasNext) {
    return (
      <button
        onClick={handleConcluir}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-4 min-h-[52px] bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#9A7A50] transition-colors text-base disabled:opacity-50"
      >
        <CheckCircle className="w-5 h-5" />
        {loading ? 'SALVANDO...' : 'CONCLUIR E SEGUIR'}
        <ArrowRight className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleConcluir}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-4 min-h-[52px] bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#9A7A50] transition-colors text-base disabled:opacity-50"
    >
      <BookOpen className="w-5 h-5" />
      {loading ? 'SALVANDO...' : 'VOLTAR AO MENU'}
    </button>
  );
}
