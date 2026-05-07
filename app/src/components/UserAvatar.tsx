'use client';

import Link from 'next/link';

interface UserAvatarProps {
  name?: string;
  email: string;
  size?: 'sm' | 'md';
}

function getInitials(name?: string, email?: string): string {
  if (name && name.trim()) {
    return name.trim().charAt(0).toUpperCase();
  }
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  return '?';
}

export function UserAvatar({ name, email, size = 'sm' }: UserAvatarProps) {
  const initials = getInitials(name, email);

  const sizeClasses = size === 'md'
    ? 'w-12 h-12 text-lg'
    : 'w-8 h-8 text-sm';

  return (
    <Link
      href="/perfil"
      className={`${sizeClasses} bg-[#B8956A] flex items-center justify-center rounded-full hover:opacity-90 transition-opacity`}
      title="Perfil"
    >
      <span className="text-[#0A0A0A] font-bold">{initials}</span>
    </Link>
  );
}
