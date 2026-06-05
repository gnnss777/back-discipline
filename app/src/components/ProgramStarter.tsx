'use client';

import { useState } from 'react';
import { Play, Check, X } from 'lucide-react';
import { startProgram } from '@/utils/programTracker';
import { getDayName } from '@/utils/programTracker';

interface ProgramStarterProps {
  userId: string;
  onStart: () => void;
}

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

export function ProgramStarter({ userId, onStart }: ProgramStarterProps) {
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 4, 6]);
  const [starting, setStarting] = useState(false);

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev].sort()
    );
  };

  const handleStart = async () => {
    if (selectedDays.length === 0) return;
    setStarting(true);
    startProgram(userId, selectedDays);
    await new Promise(r => setTimeout(r, 300));
    setStarting(false);
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Play className="w-6 h-6 text-primary" />
          </div>

          <h2 className="text-lg font-bold text-center mb-2">Iniciar Programa</h2>
          <p className="text-sm text-gray-400 text-center mb-6">
            Escolha os dias da semana que você treina. Acompanharemos seu progresso automaticamente.
          </p>

          <div className="space-y-3">
            <label className="block text-sm text-gray-300 font-medium mb-2">
              Dias de treino
            </label>
            <div className="grid grid-cols-7 gap-2">
              {ALL_DAYS.map(day => {
                const isSelected = selectedDays.includes(day);
                const label = getDayName(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`py-3 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-black shadow-lg shadow-primary/20'
                        : 'bg-card text-gray-500 hover:bg-border hover:text-white'
                    }`}
                  >
                    {label[0]}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 text-center">
              {selectedDays.length === 0 ? 'Selecione pelo menos 1 dia' : `${selectedDays.length} dia${selectedDays.length > 1 ? 's' : ''} por semana`}
            </p>
          </div>
        </div>

        <div className="border-t border-border p-4 flex gap-3">
          <button
            type="button"
            disabled
            className="flex-1 py-2.5 border border-border rounded-lg text-gray-500 text-sm cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleStart}
            disabled={selectedDays.length === 0 || starting}
            className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-black font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {starting ? 'Iniciando...' : (
              <>
                <Play className="w-4 h-4" />
                Começar!
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
