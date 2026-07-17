'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginModal from './LoginModal';

export default function LoginPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-white to-orange-50 -z-10" />
      <LoginModal onClose={handleClose} />
    </div>
  );
}