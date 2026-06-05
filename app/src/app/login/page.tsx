'use client';

import { useRouter } from 'next/navigation';
import { AuthModal } from '../../components/AuthModal';

export default function LoginPage() {
 const router = useRouter();

 return (
  <div className="min-h-screen bg-background">
   <AuthModal
    isOpen={true}
    onClose={() => router.push('/')}
    initialMode="login"
   />
  </div>
 );
}