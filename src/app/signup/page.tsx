'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import { isQueensEmail, isValidEmail } from '@/utils/validation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { signUp } = useAuth();
  
  // Extract the redirect URL from the query parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      if (redirect) {
        setRedirectUrl(redirect);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submissions
    if (isLoading) return;
    
    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!isQueensEmail(email)) {
      setError('Only @queensu.ca email addresses are allowed');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password should be at least 6 characters long');
      return;
    }
    
    try {
      setError(null);
      setSuccess(null);
      setIsLoading(true);
      
      const { error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
        // If account already exists, provide additional guidance
        if (error.message.includes('already registered')) {
          setError(error.message + ' You will be redirected to login page.');
          setTimeout(() => {
            router.push(`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`);
          }, 5000);
        }
        setIsLoading(false);
        return;
      }
      
      // Show success message with notice about the redirect URL
      let successMessage = 'Account created successfully! Please check your email for confirmation.';
      if (redirectUrl) {
        successMessage += " After confirming your email, you'll be able to continue to your original destination.";
      }
      setSuccess(successMessage);
      
      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Don't redirect automatically - let user read the confirmation message
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
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
              Create an Account
            </h1>
            <div className="relative mx-auto w-24 mb-6 mt-2">
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#d62839] to-[#a31e36] rounded-full mx-auto"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#efb215]/30 rounded-full blur-md animate-pulse-slow"></div>
            </div>
            <p className="text-gray-600">
              Join CourseCentral to access the AI Course Assistant and more
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
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
                  <p className="mb-2">{success}</p>
                  <div className="mt-3 text-center">
                    <button
                      onClick={() => router.push('/login')}
                      className="inline-flex items-center justify-center px-4 py-2 bg-[#00305f] text-white text-sm font-medium rounded-md hover:bg-[#00305f]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00305f]"
                    >
                      Go to Login
                    </button>
                  </div>
                </div>
              )}
              
              <form ref={formRef} onSubmit={handleSubmit}>
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
                  <p className="mt-1 text-xs text-gray-500">
                    Must be a valid @queensu.ca email address
                  </p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00305f] focus:border-[#00305f] transition-colors text-gray-900 bg-white"
                    placeholder="••••••••"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00305f] focus:border-[#00305f] transition-colors text-gray-900 bg-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !isQueensEmail(email)}
                  className={`w-full py-3 bg-gradient-to-r from-[#d62839] to-[#a31e36] text-white font-medium rounded-lg transition-colors shadow-md hover:from-[#c61e29] hover:to-[#8a1a2e] ${
                    (isLoading || !isQueensEmail(email)) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#00305f] hover:text-[#00305f]/80 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing up, you agree to CourseCentral's{' '}
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