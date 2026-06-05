'use client';

import Link from 'next/link';
import { ArrowRight, Timer as TimerIcon } from 'lucide-react';
import { RestTimer } from '@/components/RestTimer';

export default function TimerPage() {
 return (
  <div className="min-h-screen bg-background text-white pb-24">
   <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
    <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
     <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm">
      <ArrowRight className="w-4 h-4 rotate-180" /> Voltar
     </Link>
     <div className="flex items-center gap-2">
      <TimerIcon className="w-4 h-4 text-primary" />
      <span className="text-sm font-bold tracking-[0.15em] text-primary">CRONÔMETRO</span>
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
