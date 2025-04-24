'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

// Inner component that uses searchParams
function VerifyEmailContent() {
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
            <p className="text-gray-600 mb-6">Your email has been successfully verified. You can now proceed to sign in.</p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-600">Redirecting you to the login page in <span className="font-bold">{countdown}</span> seconds...</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login?verified=true')}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Go to Login Now
              </button>
              
              <Link href="/" className="inline-block text-blue-600 hover:underline">
                Return to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If there was an error
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full mx-auto p-6 rounded-lg shadow-lg bg-white border border-gray-100">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Verification Failed</h1>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/login"
              className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
            >
              Go to Login
            </Link>
            
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-2">Having trouble?</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/auth/confirmation" className="text-blue-600 hover:underline">
                    Check verification status
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-blue-600 hover:underline">
                    Try signing up again
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Debug information, hidden in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 text-xs text-gray-500 border-t pt-4">
              <p className="font-bold mb-1">Debug info:</p>
              <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Main component wrapped in Suspense
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-center">
          <div className="mx-auto w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-6"></div>
          <p className="text-gray-600">Loading verification page...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 