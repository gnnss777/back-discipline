'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, History, Timer } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { WorkoutHistory } from '../../components/WorkoutHistory';
import { WorkoutLogForm } from '../../components/WorkoutLogForm';
import { RestTimer } from '../../components/RestTimer';

type Tab = 'history' | 'log' | 'timer';

export default function HistoricoPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('log');

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="border-b border-[#2A2A2A] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Link>
          <span className="text-lg font-medium">Treino</span>
          <div className="w-16" />
        </div>
        
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <div className="flex bg-[#111] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('log')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'log'
                  ? 'bg-[#B8956A] text-[#0A0A0A]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              Log
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-[#B8956A] text-[#0A0A0A]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              Histórico
            </button>
            <button
              onClick={() => setActiveTab('timer')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'timer'
                  ? 'bg-[#B8956A] text-[#0A0A0A]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Timer className="w-4 h-4" />
              Timer
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {activeTab === 'log' && (
          <WorkoutLogForm
            onSave={() => setActiveTab('history')}
            onCancel={() => setActiveTab('history')}
          />
        )}
        {activeTab === 'history' && (
          <WorkoutHistory userId={user.userId} />
        )}
        {activeTab === 'timer' && (
          <RestTimer />
        )}
      </main>
    </div>
  );
}