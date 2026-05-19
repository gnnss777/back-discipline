'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Plus, X } from 'lucide-react';
import { exercises } from '../data/exercises';

interface ExerciseSelectorProps {
  selectedExercise: string;
  onSelect: (exerciseId: string, exerciseName: string) => void;
}

export function ExerciseSelector({ selectedExercise, onSelect }: ExerciseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);
  const [newExercise, setNewExercise] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredExercises = useMemo(() =>
    exercises.filter(ex =>
      ex.name.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string, name: string) => {
    onSelect(id, name);
    setIsOpen(false);
    setSearch('');
  };

  const handleAddNew = () => {
    if (newExercise.trim()) {
      onSelect(`custom_${Date.now()}`, newExercise.trim());
      setNewExercise('');
      setShowAddNew(false);
      setSearch('');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-gray-300 mb-2">Exercício</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-left flex items-center justify-between hover:border-[#B8956A] transition-colors"
      >
        <span className={selectedExercise ? 'text-white' : 'text-gray-500'}>
          {selectedExercise || 'Selecionar exercício...'}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-xl max-h-80 overflow-hidden">
          <div className="p-2 border-b border-[#2A2A2A]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none text-sm"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredExercises.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => handleSelect(ex.id, ex.name)}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#2A2A2A] hover:text-[#B8956A] transition-colors text-sm"
              >
                {ex.name}
              </button>
            ))}
            {filteredExercises.length === 0 && !showAddNew && (
              <button
                type="button"
                onClick={() => setShowAddNew(true)}
                className="w-full px-4 py-2 text-left text-[#B8956A] hover:bg-[#2A2A2A] transition-colors text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar "{search}"
              </button>
            )}
          </div>

          {showAddNew && (
            <div className="p-2 border-t border-[#2A2A2A]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newExercise}
                  onChange={(e) => setNewExercise(e.target.value)}
                  placeholder="Nome do exercício"
                  className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="px-3 bg-[#B8956A] text-[#0A0A0A] rounded-lg text-sm font-medium"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddNew(false)}
                  className="px-3 text-gray-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}