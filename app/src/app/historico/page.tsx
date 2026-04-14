'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { WorkoutHistory } from '../../components/WorkoutHistory';

export default function HistoricoPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="border-b border-[#2A2A2A] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
          <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Link>
          <span className="ml-4 text-lg font-medium">Histórico de Treinos</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <WorkoutHistory userId={user.userId} />
      </main>
    </div>
  );
}