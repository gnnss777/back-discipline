'use client';

import Link from 'next/link';
import { ArrowRight, Timer as TimerIcon } from 'lucide-react';
import { RestTimer } from '@/components/RestTimer';

export default function TimerPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <header className="border-b border-[#2A2A2A] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowRight className="w-4 h-4 rotate-180" /> Voltar
          </Link>
          <div className="flex items-center gap-2">
            <TimerIcon className="w-4 h-4 text-[#B8956A]" />
            <span className="text-sm font-bold tracking-[0.15em] text-[#B8956A]">CRONÔMETRO</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <RestTimer />
      </main>
    </div>
  );
}
