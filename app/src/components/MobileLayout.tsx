'use client';

import { BottomNav } from './Layout';

interface MobileLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function MobileLayout({ children, showNav = true }: MobileLayoutProps) {
  return (
    <>
      {children}
      {showNav && <BottomNav />}
    </>
  );
}