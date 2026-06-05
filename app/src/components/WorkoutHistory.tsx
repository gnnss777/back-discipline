'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Dumbbell } from 'lucide-react';
import { getWorkoutsByUser } from '../lib/storage';
import type { Workout } from '../types';

interface WorkoutHistoryProps {
 userId: string;
}

function formatDate(dateStr: string) {
 const date = new Date(dateStr);
 return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function calculateVolume(workout: Workout) {
 let volume = 0;
 workout.exercises.forEach(ex => {
  ex.sets.forEach(set => {
   volume += set.reps * set.weight;
  });
 });
 return volume;
}

function WorkoutCard({ workout }: { workout: Workout }) {
 const [expanded, setExpanded] = useState(false);
 const volume = calculateVolume(workout);
 const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

 return (
  <div className="bg-card border border-border rounded-lg overflow-hidden">
   <button
    type="button"
    onClick={() => setExpanded(!expanded)}
    className="w-full p-4 flex items-center justify-between hover:bg-card transition-colors"
   >
    <div className="flex items-center gap-4">
     <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
      <Dumbbell className="w-5 h-5 text-primary" />
     </div>
     <div className="text-left">
      <div className="text-white font-medium">{formatDate(workout.date)}</div>
      <div className="text-muted-foreground text-sm">
       {workout.exercises.length} exercícios · {totalSets} séries · {volume.toLocaleString()} kg
      </div>
     </div>
    </div>
    {expanded ? (
     <ChevronUp className="w-5 h-5 text-muted-foreground" />
    ) : (
     <ChevronDown className="w-5 h-5 text-muted-foreground" />
    )}
   </button>

   {expanded && (
    <div className="px-4 pb-4 space-y-3 border-t border-border">
     {workout.exercises.map((exercise, exIndex) => (
      <div key={exIndex} className="pt-3">
       <div className="text-primary font-medium text-sm mb-2">{exercise.exerciseName}</div>
       <div className="space-y-1">
        {exercise.sets.map((set, setIndex) => (
         <div key={setIndex} className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
           Série {setIndex + 1}: {set.reps} reps × {set.weight}kg
           {set.rpe > 0 && <span className="text-primary"> @RPE{set.rpe}</span>}
          </span>
          {set.completed ? (
           <span className="text-green-500 text-xs">✓</span>
          ) : (
           <span className="text-muted-foreground text-xs">-</span>
          )}
         </div>
        ))}
       </div>
      </div>
     ))}
     {workout.notes && (
      <div className="pt-2 border-t border-border">
       <div className="text-muted-foreground text-xs mb-1">Notas:</div>
       <div className="text-muted-foreground text-sm">{workout.notes}</div>
      </div>
     )}
    </div>
   )}
  </div>
 );
}

export function WorkoutHistory({ userId }: WorkoutHistoryProps) {
 const [workouts, setWorkouts] = useState<Workout[]>([]);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  const fetchWorkouts = async () => {
   const data = getWorkoutsByUser(userId);
   const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
   setWorkouts(sorted);
   setIsLoading(false);
  };
  fetchWorkouts();
 }, [userId]);

 if (isLoading) {
  return (
   <div className="text-center py-8 text-muted-foreground">
    Carregando...
   </div>
  );
 }

 if (workouts.length === 0) {
  return (
   <div className="text-center py-12">
    <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
    <p className="text-muted-foreground">Nenhum treino registrado ainda.</p>
    <p className="text-muted-foreground text-sm">Comece a treinar!</p>
   </div>
  );
 }

 return (
  <div className="space-y-3">
   {workouts.map((workout) => (
    <WorkoutCard key={workout.id} workout={workout} />
   ))}
  </div>
 );
}