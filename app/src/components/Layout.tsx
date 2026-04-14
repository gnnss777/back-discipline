'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Dumbbell, BarChart3 } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Início' },
  { href: '/livro', icon: BookOpen, label: 'Programa' },
  { href: '/historico', icon: Dumbbell, label: 'Treino' },
  { href: '/biblioteca', icon: Dumbbell, label: 'Biblioteca' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#2A2A2A] md:hidden z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-4 ${
                isActive ? 'text-[#B8956A]' : 'text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Header({ title }: { title: string }) {
  return (
    <header className="border-b border-[#2A2A2A] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#B8956A] flex items-center justify-center rounded-sm">
            <span className="text-[#0A0A0A] text-sm font-bold">JJ</span>
          </div>
          <span className="font-bold tracking-wider text-sm">BACK DISCIPLINE</span>
        </Link>
        <span className="text-gray-400 text-sm">{title}</span>
      </div>
    </header>
  );
}