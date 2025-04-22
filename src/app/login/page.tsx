'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import { isQueensEmail, isValidEmail } from '@/utils/validation';

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    
    if (!isQueensEmail(email)) {
      setError('Only @queensu.ca email addresses are allowed');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        // Redirect to the destination page after successful login
        router.push(redirectTo);
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00305f] to-[#00305f]/90">
              Sign in to Your Account
            </h1>
            <div className="relative mx-auto w-24 mb-6 mt-2">
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#d62839] to-[#a31e36] rounded-full mx-auto"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#efb215]/30 rounded-full blur-md animate-pulse-slow"></div>
            </div>
            <p className="text-gray-600">
              Access your CourseCentral account
            </p>
            <p className="text-sm font-medium text-[#00305f] mt-2">
              Only available to Queen's University students with @queensu.ca emails
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Queen's University Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-2 border ${
                        isQueensEmail(email) 
                          ? 'border-green-400 focus:ring-green-400 focus:border-green-400' 
                          : 'border-gray-300 focus:ring-[#00305f] focus:border-[#00305f]'
                      } rounded-lg transition-colors text-gray-900 bg-white`}
                      placeholder="youremail@queensu.ca"
                      required
                    />
                    {email && isQueensEmail(email) && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs text-[#d62839] hover:text-[#a31e36] transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00305f] focus:border-[#00305f] transition-colors text-gray-900 bg-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !isQueensEmail(email)}
                  className={`w-full py-3 bg-gradient-to-r from-[#00305f] to-[#00305f]/90 text-white font-medium rounded-lg transition-colors shadow-md hover:from-[#00305f]/90 hover:to-[#00305f]/80 ${
                    (isLoading || !isQueensEmail(email)) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-[#d62839] hover:text-[#a31e36] font-medium transition-colors">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to CourseCentral's{' '}
              <a href="#" className="text-[#00305f] hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-[#00305f] hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>
      
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d62839]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00305f]/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Animation styles */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.95; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 