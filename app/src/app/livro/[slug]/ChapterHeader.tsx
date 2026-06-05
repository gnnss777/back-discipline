'use client';

import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getAllProgress, updateProgress, updateLastRead } from '@/lib/reading-storage';
import { toast } from 'sonner';

interface ChapterHeaderProps {
  slug: string;
}

export function ChapterHeader({ slug }: ChapterHeaderProps) {
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch completion status on mount
  useEffect(() => {
    if (!user) return;
    const userId = user.userId;

    async function loadStatus() {
      const progress = await getAllProgress(userId);
      const chapterRecord = progress.find(p => p.chapter_slug === slug);
      if (chapterRecord) {
        setCompleted(chapterRecord.completed);
      }
      setIsLoading(false);
    }

    loadStatus();
  }, [user, slug]);

  // Update last_read_at when component mounts (user opened this chapter)
  useEffect(() => {
    if (!user) return;
    const userId = user.userId;
    updateLastRead(userId, slug);
  }, [user, slug]);

  const handleToggle = async () => {
    if (!user) return;

    const newCompleted = !completed;
    setCompleted(newCompleted); // Optimistic update for instant UI

    const result = await updateProgress(user.userId, slug, newCompleted);
    if (!result.success) {
      // Revert on failure
      setCompleted(!newCompleted);
      toast.error('Erro ao salvar progresso');
    } else {
      toast.success(newCompleted ? 'Capítulo concluído!' : 'Capítulo desmarcado');
    }
  };

  if (isLoading) {
    return (
      <button className="flex items-center gap-2 text-sm text-primary font-medium tracking-wider min-h-[44px] px-3">
        <CheckCircle className="w-4 h-4" />
        CONCLUIR
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 text-sm font-medium tracking-wider min-h-[44px] px-3 transition-colors ${
        completed
          ? 'text-primary'
          : 'text-primary hover:text-primary-dark'
      }`}
    >
      <CheckCircle className={`w-4 h-4 ${completed ? 'fill-primary' : ''}`} />
      {completed ? 'CONCLUÍDO' : 'CONCLUIR'}
    </button>
  );
}
