'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ResendVerification from '@/components/auth/ResendVerification';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get('status');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const error_code = searchParams.get('error_code');
  const redirectTo = searchParams.get('redirect_to') || '/';
  
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // If successful, start countdown to redirect
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push(redirectTo);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, router, redirectTo]);

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Email Verified Successfully!</h1>
        <p className="mb-4">
          Your email has been verified successfully. You will be redirected to continue in {countdown} seconds.
        </p>
        <Link 
          href={redirectTo}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Continue Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {status === 'success' ? (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-green-200">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-3">Account Verified!</h1>
              
              <p className="text-center text-gray-600 mb-6">
                Your account has been successfully verified. You can now sign in with your Queen's University email and password.
              </p>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Redirecting to login in {countdown} seconds...
                </p>
                
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => router.push('/login?redirect=' + encodeURIComponent(redirectTo))}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                  >
                    Log in now
                  </button>
                  {redirectTo !== '/' && (
                    <button
                      onClick={() => router.push(redirectTo)}
                      className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                    >
                      Go directly to destination
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-red-200">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-3">
                Verification Issue
              </h1>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <p className="text-red-600 mb-2 font-medium">
                  {error_code ? `Error ${error_code}` : (error ? `Error: ${error}` : 'Error during verification')}
                </p>
                <p className="text-red-700 text-sm">
                  {errorDescription || "There was an issue verifying your email. You may need to request a new verification email."}
                </p>
              </div>
              
              {/* Resend verification component */}
              <ResendVerification />
              
              <div className="text-center space-y-3 mt-6">
                <Link
                  href="/signup"
                  className="block w-full py-3 bg-gradient-to-r from-[#d62839] to-[#a31e36] text-white font-medium rounded-lg transition-colors text-center"
                >
                  Try Signing Up Again
                </Link>
                
                <Link
                  href="/"
                  className="inline-block text-[#00305f] hover:text-[#00305f]/80 font-medium transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d62839]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00305f]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
} 