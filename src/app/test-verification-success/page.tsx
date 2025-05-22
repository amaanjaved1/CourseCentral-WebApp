'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestVerificationSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the verification success page after a short delay
    const timer = setTimeout(() => {
      router.push('/auth/verification-success?redirect_to=/');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Testing Verification Success Page</h1>
        <p>Redirecting to verification success page in 1 second...</p>
      </div>
    </div>
  );
} 