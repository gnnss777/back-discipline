'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Filter, Play, X } from 'lucide-react';
import { exercises, categories } from '../../data/exercises';
import type { Exercise } from '../../types/exercise';
import { VideoModal } from '../../components/VideoModal';

export default function BibliotecaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesSearch = searchQuery === '' || 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'Todas' || ex.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-[#333] sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors font-medium tracking-wider text-sm">
            <ArrowLeft className="w-4 h-4" />
            VOLTAR
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#B8956A] flex items-center justify-center rounded-sm">
              <span className="text-[#0A0A0A] text-sm font-bold">JJ</span>
            </div>
            <span className="font-bold tracking-wider">BIBLIOTECA</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 tracking-wider">BIBLIOTECA <span className="text-[#B8956A]">TÉCNICA</span></h1>
          <p className="text-[#555] text-lg font-medium tracking-wide">GUIA COMPLETO DE EXERCÍCIOS COM TÉCNICA E DICAS</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555]" />
            <input 
              type="text" 
              placeholder="BUSCAR EXERCÍCIO..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#111] border border-[#333] rounded-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#B8956A] font-medium tracking-wider"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#555]" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-[#111] border border-[#333] rounded-sm text-white focus:outline-none focus:border-[#B8956A] font-medium tracking-wider"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 text-sm text-[#555]">
          {filteredExercises.length} exercício{filteredExercises.length !== 1 ? 's' : ''} encontrado{filteredExercises.length !== 1 ? 's' : ''}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map(exercise => (
            <div 
              key={exercise.id}
              className="p-6 bg-[#111] border border-[#333] rounded-sm hover:border-[#B8956A] hover:bg-[#151515] transition-all group relative"
            >
              {exercise.videoUrl && (
                <button
                  onClick={() => setSelectedExercise(exercise)}
                  className="absolute top-4 right-4 w-10 h-10 bg-[#B8956A]/80 hover:bg-[#B8956A] rounded-full flex items-center justify-center transition-colors z-10"
                >
                  <Play className="w-5 h-5 text-[#0A0A0A] fill-[#0A0A0A]" />
                </button>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="px-2 py-1 bg-[#B8956A]/20 text-[#B8956A] text-xs font-bold tracking-wider rounded-sm">
                    {exercise.category.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-bold mt-2 group-hover:text-[#B8956A] transition-colors tracking-wider">
                    {exercise.name}
                  </h3>
                </div>
                <span className={`px-2 py-1 text-xs font-bold tracking-wider rounded-sm ${
                  exercise.difficulty === 'Iniciante' ? 'bg-green-900/50 text-green-500' :
                  exercise.difficulty === 'Intermediário' ? 'bg-yellow-900/50 text-yellow-500' :
                  'bg-red-900/50 text-red-500'
                }`}>
                  {exercise.difficulty.toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-[#555] mb-4">{exercise.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {exercise.muscles.map(muscle => (
                  <span key={muscle} className="text-xs text-[#444] bg-[#222] px-2 py-1 rounded-sm tracking-wider">
                    {muscle.toUpperCase()}
                  </span>
                ))}
              </div>

              {exercise.tips && exercise.tips.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
                  <div className="text-xs text-[#666] mb-2">DICAS:</div>
                  <ul className="text-xs text-[#555] space-y-1">
                    {exercise.tips.slice(0, 2).map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#555]">Nenhum exercício encontrado.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Todas'); }}
              className="mt-4 text-[#B8956A] hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </main>

      <VideoModal
        isOpen={selectedExercise !== null}
        onClose={() => setSelectedExercise(null)}
        videoUrl={selectedExercise?.videoUrl || ''}
        title={selectedExercise?.name || ''}
      />
    </div>
  );
}