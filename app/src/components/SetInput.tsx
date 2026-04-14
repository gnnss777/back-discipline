'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { WorkoutSet } from '../types';

interface SetInputProps {
  set: WorkoutSet;
  index: number;
  onChange: (set: WorkoutSet) => void;
  onRemove: () => void;
}

const RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

export function SetInput({ set, index, onChange, onRemove }: SetInputProps) {
  const handleChange = (field: keyof WorkoutSet, value: number | string | boolean) => {
    onChange({ ...set, [field]: value });
  };

  return (
    <div className="bg-[#151515] border border-[#2A2A2A] rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[#B8956A] font-medium text-sm">Série {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-gray-500 text-xs mb-1">Reps</label>
          <input
            type="number"
            min={1}
            max={50}
            value={set.reps || ''}
            onChange={(e) => handleChange('reps', parseInt(e.target.value) || 0)}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-2 px-3 text-white text-center focus:border-[#B8956A] focus:outline-none"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-gray-500 text-xs mb-1">Peso (kg)</label>
          <input
            type="number"
            min={0}
            max={500}
            value={set.weight || ''}
            onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-2 px-3 text-white text-center focus:border-[#B8956A] focus:outline-none"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-gray-500 text-xs mb-1">RPE</label>
          <select
            value={set.rpe || ''}
            onChange={(e) => handleChange('rpe', parseFloat(e.target.value))}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-2 px-3 text-white text-center focus:border-[#B8956A] focus:outline-none"
          >
            <option value="">-</option>
            {RPE_VALUES.map((rpe) => (
              <option key={rpe} value={rpe}>{rpe}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-500 text-xs mb-1">Notas (opcional)</label>
        <input
          type="text"
          value={set.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Notas,formacão,etc..."
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-2 px-3 text-white text-sm placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <button
          type="button"
          onClick={() => handleChange('completed', !set.completed)}
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
            set.completed
              ? 'bg-[#B8956A] border-[#B8956A] text-[#0A0A0A]'
              : 'border-[#2A2A2A] hover:border-[#B8956A]'
          }`}
        >
          {set.completed && <Check className="w-3 h-3" />}
        </button>
        <span className="text-gray-400 text-sm">Completada</span>
      </label>
    </div>
  );
}