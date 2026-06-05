'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getUserProgress, saveUserProgress, getProgressStats, getWorkoutsByUser, updateChapterProgress as updateChapterStorage } from '../lib/storage';
import { getProgress as getCloudProgress, saveProgress as saveCloudProgress } from '../lib/user-progress-sync';
import type { UserProgress, ChapterProgress } from '../types';

interface ProgressStats {
  chaptersCompleted: number;
  totalDaysTrained: number;
  weeklyVolume: number;
  currentWeek: number;
  currentDay: number;
  totalVolume: number;
}

interface ProgressContextType {
  progress: UserProgress | null;
  stats: ProgressStats;
  isLoading: boolean;
  updateChapterProgress: (slug: string, completed: boolean) => void;
  refresh: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [stats, setStats] = useState<ProgressStats>({
    chaptersCompleted: 0,
    totalDaysTrained: 0,
    weeklyVolume: 0,
    currentWeek: 1,
    currentDay: 1,
    totalVolume: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    if (!user) return;

    const cloud = await getCloudProgress(user.userId);
    const data = cloud || getUserProgress(user.userId);
    const workoutStats = getProgressStats(user.userId);
    const workouts = getWorkoutsByUser(user.userId);

    let totalVolume = 0;
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          totalVolume += set.reps * set.weight;
        });
      });
    });

    setStats({
      ...workoutStats,
      totalVolume,
    });

    if (data) {
      setProgress(data);
    } else {
      const newProgress: UserProgress = {
        userId: user.userId,
        currentWeek: 1,
        currentDay: 1,
        chapters: [],
        workouts: [],
        startedAt: new Date().toISOString(),
        programStartedAt: null,
        trainingDays: [1, 4, 6],
        missedDays: [],
        totalDaysTrained: 0,
        weeklyVolume: workoutStats.weeklyVolume,
        monthlyVolume: workoutStats.weeklyVolume,
        longestStreak: 0,
        lastWorkoutDate: null,
        totalVolume,
      };
      saveUserProgress(newProgress);
      await saveCloudProgress(user.userId, newProgress);
      setProgress(newProgress);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      loadProgress();
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [authLoading, user, loadProgress]);

  const handleUpdateChapter = (slug: string, completed: boolean) => {
    if (!user) return;
    updateChapterStorage(user.userId, slug, completed);
    loadProgress();
  };

  const refresh = () => {
    loadProgress();
  };

  return (
    <ProgressContext.Provider value={{ progress, stats, isLoading, updateChapterProgress: handleUpdateChapter, refresh }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}