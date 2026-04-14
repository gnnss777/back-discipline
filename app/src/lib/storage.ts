import type { User, UserSession, Workout, UserProgress, WorkoutExercise, WorkoutSet, ChapterProgress } from '../types';

const STORAGE_KEYS = {
  USERS: 'backdiscipline_users',
  SESSION: 'backdiscipline_session',
  WORKOUTS: 'backdiscipline_workouts',
  PROGRESS: 'backdiscipline_progress',
} as const;

function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS) || [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  setItem(STORAGE_KEYS.USERS, users);
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email === email);
}

export function getSession(): UserSession | null {
  return getItem<UserSession>(STORAGE_KEYS.SESSION);
}

export function setSession(session: UserSession): void {
  setItem(STORAGE_KEYS.SESSION, session);
}

export function clearSession(): void {
  removeItem(STORAGE_KEYS.SESSION);
}

export function getWorkouts(): Workout[] {
  return getItem<Workout[]>(STORAGE_KEYS.WORKOUTS) || [];
}

export function getWorkoutsByUser(userId: string): Workout[] {
  return getWorkouts().filter(w => w.id.startsWith(userId));
}

export function saveWorkout(workout: Workout): void {
  const workouts = getWorkouts();
  workouts.push(workout);
  setItem(STORAGE_KEYS.WORKOUTS, workouts);
}

export function getProgress(userId: string): UserProgress | null {
  return getItem<UserProgress>(`${STORAGE_KEYS.PROGRESS}_${userId}`);
}

export function saveProgress(progress: UserProgress): void {
  setItem(`${STORAGE_KEYS.PROGRESS}_${progress.userId}`, progress);
}

export function getVolumeStats(userId: string, weekStart?: Date): { weekly: number; total: number; frequency: number } {
  const workouts = getWorkoutsByUser(userId);
  let totalVolume = 0;
  let weeklyVolume = 0;
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  workouts.forEach((workout: Workout) => {
    let workoutVolume = 0;
    workout.exercises.forEach((ex: WorkoutExercise) => {
      ex.sets.forEach((set: WorkoutSet) => {
        workoutVolume += set.reps * set.weight;
      });
    });
    totalVolume += workoutVolume;
    if (weekStart && new Date(workout.date) >= weekAgo) {
      weeklyVolume += workoutVolume;
    }
  });

  const frequency = workouts.filter((w: Workout) => {
    const d = new Date(w.date);
    return d >= weekAgo;
  }).length;

  return { weekly: weeklyVolume || weeklyVolume, total: totalVolume, frequency };
}

export function getUserProgress(userId: string): UserProgress | null {
  return getItem<UserProgress>(`${STORAGE_KEYS.PROGRESS}_${userId}`);
}

export function saveUserProgress(progress: UserProgress): void {
  setItem(`${STORAGE_KEYS.PROGRESS}_${progress.userId}`, progress);
}

export function getChapterProgress(userId: string, chapterSlug: string): ChapterProgress | null {
  const progress = getUserProgress(userId);
  return progress?.chapters.find(c => c.slug === chapterSlug) || null;
}

export function updateChapterProgress(userId: string, chapterSlug: string, completed: boolean): void {
  let progress = getUserProgress(userId);
  if (!progress) {
    progress = {
      userId,
      currentWeek: 1,
      currentDay: 1,
      chapters: [],
      workouts: [],
      startedAt: new Date().toISOString(),
      totalDaysTrained: 0,
      weeklyVolume: 0,
      monthlyVolume: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
      totalVolume: 0,
    };
  }
  
  const existingChapter = progress.chapters.find(c => c.slug === chapterSlug);
  if (existingChapter) {
    existingChapter.completed = completed;
    existingChapter.completedAt = completed ? new Date().toISOString() : undefined;
  } else {
    progress.chapters.push({
      chapterId: chapterSlug,
      slug: chapterSlug,
      completed,
      completedAt: completed ? new Date().toISOString() : undefined,
    });
  }
  
  saveUserProgress(progress);
}

export function getProgressStats(userId: string): {
  chaptersCompleted: number;
  totalDaysTrained: number;
  weeklyVolume: number;
  currentWeek: number;
  currentDay: number;
} {
  const progress = getUserProgress(userId);
  const workouts = getWorkoutsByUser(userId);
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  let weeklyVolume = 0;
  workouts.forEach((w: Workout) => {
    if (new Date(w.date) >= weekAgo) {
      w.exercises.forEach((ex: WorkoutExercise) => {
        ex.sets.forEach((set: WorkoutSet) => {
          weeklyVolume += set.reps * set.weight;
        });
      });
    }
  });
  
  const uniqueDays = new Set(workouts.map((w: Workout) => w.date.split('T')[0]));
  const totalDaysTrained = uniqueDays.size;
  
  const chaptersCompleted = progress?.chapters.filter(c => c.completed).length || 0;
  const startedAt = progress?.startedAt ? new Date(progress.startedAt) : now;
  const daysSinceStart = Math.floor((now.getTime() - startedAt.getTime()) / (24 * 60 * 60 * 1000));
  const currentWeek = Math.min(Math.ceil(daysSinceStart / 7) + 1, 6);
  const currentDay = (daysSinceStart % 7) + 1;
  
  return { chaptersCompleted, totalDaysTrained, weeklyVolume, currentWeek, currentDay };
}