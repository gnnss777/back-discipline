'use client';

import { useState } from 'react';
import { Plus, Save, X, Dumbbell, Calendar } from 'lucide-react';
import { ExerciseSelector } from './ExerciseSelector';
import { SetInput } from './SetInput';
import { saveWorkout, getSession } from '../lib/storage';
import type { Workout, WorkoutExercise, WorkoutSet } from '../types';

interface WorkoutLogFormProps {
  onSave?: () => void;
  onCancel?: () => void;
}

export function WorkoutLogForm({ onSave, onCancel }: WorkoutLogFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const addExercise = () => {
    const newExercise: WorkoutExercise = {
      exerciseId: crypto.randomUUID(),
      exerciseName: '',
      sets: [],
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (index: number, updates: Partial<WorkoutExercise>) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], ...updates };
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const addSet = (exerciseIndex: number) => {
    const newSet: WorkoutSet = {
      reps: 0,
      weight: 0,
      rpe: 0,
      notes: '',
      completed: false,
    };
    const updated = [...exercises];
    updated[exerciseIndex].sets.push(newSet);
    setExercises(updated);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, set: WorkoutSet) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex] = set;
    setExercises(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    setExercises(updated);
  };

  const handleSave = async () => {
    const session = getSession();
    if (!session) return;

    const validExercises = exercises.filter(ex => ex.exerciseName && ex.sets.length > 0);
    
    if (validExercises.length === 0) {
      alert('Adicione pelo menos um exercício com uma série');
      return;
    }

    setIsSaving(true);

    const workout: Workout = {
      id: `${session.userId}_${Date.now()}`,
      date: new Date(date).toISOString(),
      exercises: validExercises,
      notes,
      duration: 0,
    };

    saveWorkout(workout);
    setIsSaving(false);
    onSave?.();
  };

  const canSave = exercises.some(ex => ex.exerciseName && ex.sets.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-300 mb-2">Data do Treino</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-4 text-white focus:border-[#B8956A] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <div key={exercise.exerciseId} className="bg-[#151515] border border-[#2A2A2A] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[#B8956A]" />
                <span className="text-white font-medium">Exercício {index + 1}</span>
              </div>
              <button
                type="button"
                onClick={() => removeExercise(index)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ExerciseSelector
              selectedExercise={exercise.exerciseName}
              onSelect={(name) => updateExercise(index, { exerciseName: name })}
            />

            <div className="mt-4 space-y-3">
              {exercise.sets.map((set, setIndex) => (
                <SetInput
                  key={setIndex}
                  set={set}
                  index={setIndex}
                  onChange={(updated) => updateSet(index, setIndex, updated)}
                  onRemove={() => removeSet(index, setIndex)}
                />
              ))}

              <button
                type="button"
                onClick={() => addSet(index)}
                className="w-full py-2 border border-dashed border-[#2A2A2A] rounded-lg text-gray-500 hover:text-[#B8956A] hover:border-[#B8956A] transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Série
              </button>
            </div>
          </div>
        ))}
      </div>

      {exercises.length === 0 ? (
        <button
          type="button"
          onClick={addExercise}
          className="w-full py-4 border-2 border-dashed border-[#2A2A2A] rounded-lg text-gray-500 hover:text-[#B8956A] hover:border-[#B8956A] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Exercício
        </button>
      ) : (
        <button
          type="button"
          onClick={addExercise}
          className="w-full py-2 border border-dashed border-[#2A2A2A] rounded-lg text-gray-500 hover:text-[#B8956A] hover:border-[#B8956A] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Outro Exercício
        </button>
      )}

      <div>
        <label className="block text-gray-300 mb-2">Notas do Treino (opcional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Como foi o treino? Sentiu algo?"
          rows={3}
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none resize-none"
        />
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border border-[#2A2A2A] rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className="flex-1 bg-[#B8956A] hover:bg-[#c9a67a] text-[#0A0A0A] font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Salvando...' : 'Salvar Treino'}
        </button>
      </div>
    </div>
  );
}