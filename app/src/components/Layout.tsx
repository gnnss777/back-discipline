'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Dumbbell, Timer, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserAvatar } from './UserAvatar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Painel' },
  { href: '/planilha', icon: Dumbbell, label: 'Plano de Treino' },
  { href: '/timer', icon: Timer, label: 'Cronômetro' },
  { href: '/biblioteca', icon: Search, label: 'Biblioteca' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 bg-[#0A0A0A] border-r border-[#2A2A2A] flex-col z-50">
        <Link href="/dashboard" className="flex items-center gap-2 px-5 py-5 border-b border-[#2A2A2A]">
          <div className="w-8 h-8 bg-[#B8956A] flex items-center justify-center rounded-sm">
            <span className="text-[#0A0A0A] text-sm font-bold">JJ</span>
          </div>
          <span className="font-bold tracking-wider text-xs text-white">BACK DISCIPLINE</span>
        </Link>
        <nav className="flex-1 flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#B8956A]/10 text-[#B8956A]'
                    : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#2A2A2A] lg:hidden z-50">
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
    </>
  );
}

export function Header({ title }: { title: string }) {
  const { user } = useAuth();

  return (
    <header className="border-b border-[#2A2A2A] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#B8956A] flex items-center justify-center rounded-sm">
            <span className="text-[#0A0A0A] text-sm font-bold">JJ</span>
          </div>
          <span className="font-bold tracking-wider text-sm">BACK DISCIPLINE</span>
        </Link>
        {user ? (
          <UserAvatar name={user.name} email={user.email} />
        ) : (
          <span className="text-gray-400 text-sm">{title}</span>
        )}
      </div>
    </header>
  );
}