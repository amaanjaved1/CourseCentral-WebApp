'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  const [hashParams, setHashParams] = useState<Record<string, string>>({});

  // Handle the countdown and redirection
  useEffect(() => {
    if (isSuccess) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push('/login?verified=true');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isSuccess, router]);

  useEffect(() => {
    // Get params from hash if they exist
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        try {
          // Remove the # and parse as URLSearchParams
          const hashString = hash.substring(1);
          const params = new URLSearchParams(hashString);
          const hashParamsObj: Record<string, string> = {};
          
          params.forEach((value, key) => {
            hashParamsObj[key] = value;
          });
          
          setHashParams(hashParamsObj);
          setDebugInfo(prev => ({...prev, hashParams: hashParamsObj}));
          console.log('Hash params:', hashParamsObj);
        } catch (e) {
          console.error('Error parsing hash params:', e);
        }
      }
    }

    const params = Object.fromEntries(searchParams.entries());
    const token = searchParams.get('token');
    const tokenHash = searchParams.get('token_hash') || hashParams.token_hash;
    const code = searchParams.get('code');
    const type = searchParams.get('type') || 'signup';
    const email = searchParams.get('email');
    
    setDebugInfo({
      url: typeof window !== 'undefined' ? window.location.href : 'No window',
      params,
      token,
      tokenHash,
      code,
      type,
      email,
      hash: typeof window !== 'undefined' ? window.location.hash : 'No window',
    });

    console.log('All URL data:', {
      params,
      token,
      tokenHash,
      code,
      type,
      email,
      hash: typeof window !== 'undefined' ? window.location.href : 'No window',
    });

    // Check if this is a direct access to the page (e.g., "verify email" button clicked)
    const isDirectAccess = !token && !tokenHash && !code && 
      !hashParams.token && !hashParams.token_hash && !hashParams.code;

    // Determine which token and verification method to use
    if (code) {
      verifyWithCode(code);
    } else if (token && email) {
      verifyWithToken(token, email, type as 'signup' | 'recovery' | 'email_change');
    } else if (tokenHash) {
      // For backward compatibility with old links
      verifyWithLegacyToken(tokenHash);
    } else if (hashParams.token || hashParams.token_hash || hashParams.code) {
      const hashToken = hashParams.token || hashParams.token_hash;
      const hashCode = hashParams.code;
      
      if (hashCode) {
        verifyWithCode(hashCode);
      } else if (hashToken && hashParams.email) {
        verifyWithToken(hashToken, hashParams.email, (hashParams.type || 'signup') as 'signup' | 'recovery' | 'email_change');
      } else if (hashToken) {
        verifyWithLegacyToken(hashToken);
      } else if (isDirectAccess) {
        // If user directly accessed this page, show success instead of error
        setIsLoading(false);
        setIsSuccess(true);
      } else {
        setIsLoading(false);
        setError('No verification token found in the URL. Please check your email and click the link again.');
      }
    } else if (isDirectAccess) {
      // If user directly accessed this page, show success instead of error
      setIsLoading(false);
      setIsSuccess(true);
    } else {
      setIsLoading(false);
      setError('No verification token found in the URL. Please check your email and click the link again.');
    }
  }, [searchParams, hashParams, router]);

  const verifyWithToken = async (token: string, email: string, type: 'signup' | 'recovery' | 'email_change') => {
    try {
      console.log(`Attempting ${type} verification with token and email:`, { token, email, type });
      setDebugInfo(prev => ({...prev, verificationAttempt: true, method: 'token', tokenUsed: token, emailUsed: email, typeUsed: type}));
      
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type,
          email,
          token
        }),
      });

      handleVerificationResponse(response);
    } catch (error) {
      handleVerificationError(error);
    }
  };

  const verifyWithCode = async (code: string) => {
    try {
      console.log('Attempting verification with code:', code);
      setDebugInfo(prev => ({...prev, verificationAttempt: true, method: 'code', codeUsed: code}));
      
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'code_exchange',
          code
        }),
      });

      handleVerificationResponse(response);
    } catch (error) {
      handleVerificationError(error);
    }
  };

  // Legacy method for backward compatibility
  const verifyWithLegacyToken = async (token: string) => {
    try {
      console.log('Attempting legacy verification with token:', token);
      setDebugInfo(prev => ({...prev, verificationAttempt: true, method: 'legacy', tokenUsed: token}));
      
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      handleVerificationResponse(response);
    } catch (error) {
      handleVerificationError(error);
    }
  };

  const handleVerificationResponse = async (response: Response) => {
    try {
      const data = await response.json();
      setDebugInfo(prev => ({...prev, verificationResponse: data}));
      console.log('Verification response:', data);

      if (response.ok) {
        setIsSuccess(true);
        setIsLoading(false);
      } else {
        // Special case: if the error is 'already confirmed', treat it as success
        if (data.error === 'already confirmed' || data.message?.includes('already confirmed')) {
          setIsSuccess(true);
          setIsLoading(false);
        } else {
          setError(data.error || data.message || 'Failed to verify email');
          setIsLoading(false);
        }
      }
    } catch (error) {
      handleVerificationError(error);
    }
  };

  const handleVerificationError = (error: any) => {
    console.error('Error verifying email:', error);
    setDebugInfo(prev => ({...prev, verificationError: error}));
    setError('An unexpected error occurred. Please try again or contact support.');
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-4 w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mx-auto"></div>
            <h1 className="text-2xl font-bold mb-2">Verifying Your Email...</h1>
            <p className="text-gray-600">Please wait while we confirm your email address.</p>
          </div>
        </main>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="max-w-md w-full mx-auto text-center p-6 rounded-lg shadow-lg bg-white border border-gray-100">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
            <p className="text-gray-600 mb-4">Your email has been successfully verified.</p>
            <p className="text-gray-600 mb-4">You will be redirected to login in {countdown} seconds...</p>
            <div className="mt-6">
              <Link 
                href="/login?verified=true" 
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out w-full"
              >
                Login Now
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full mx-auto text-center p-6 rounded-lg shadow-lg bg-white">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
          <p className="text-gray-600 mb-4">
            {error || 'We couldn\'t verify your email. The link may have expired or been used already.'}
          </p>
          <div className="flex flex-col space-y-3">
            <Link href="/login" className="inline-block bg-tricolore-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
              Go to Login
            </Link>
            <Link href="/signup" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
              Try Signing Up Again
            </Link>
          </div>
          
          {/* Uncomment for debugging */}
          {/*
          <div className="mt-8 text-left border-t pt-4">
            <h3 className="font-bold mb-2">Debug Information:</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          */}
        </div>
      </main>
    </div>
  );
} 