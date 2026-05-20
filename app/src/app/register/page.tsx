'use client';

import { useRouter } from 'next/navigation';
import { AuthModal } from '../../components/AuthModal';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AuthModal
        isOpen={true}
        onClose={() => router.push('/')}
        initialMode="register"
      />
    </div>
  );
}