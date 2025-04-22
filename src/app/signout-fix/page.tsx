'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import { supabase } from '@/lib/supabase';

export default function SignOutFix() {
  const { user, session, isLoading } = useAuth();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    // Check the raw Supabase session
    const checkSupabaseSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting Supabase session:', error);
      } else {
        setSupabaseUser(data.session?.user || null);
      }
    };
    
    checkSupabaseSession();
  }, []);
  
  const handleClearCookies = () => {
    const cookies = document.cookie.split(";");
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    
    localStorage.clear();
    sessionStorage.clear();
    
    setSuccess('Cookies and storage cleared. Reloading page in 2 seconds...');
    
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };
  
  const handleHardSignOut = async () => {
    try {
      setError(null);
      
      // First try Supabase sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign out error:', error);
        setError(`Supabase error: ${error.message}`);
      }
      
      // Clear all cookies and local storage
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
      
      // Clear local and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      setSuccess('Successfully signed out and cleared all data. Reloading page in 2 seconds...');
      
      // Hard reload to the home page
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err: any) {
      console.error('Error during hard sign out:', err);
      setError(`Error: ${err.message || 'Unknown error'}`);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00305f] to-[#00305f]/90">
              Sign Out Debug and Fix
            </h1>
            <p className="text-gray-600 mt-2">
              This page helps diagnose and fix sign out issues
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-6">
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Authentication State</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Auth Context State:</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p>Is Loading: {isLoading ? 'Yes' : 'No'}</p>
                  <p>User: {user ? 'Logged In as ' + user.email : 'Not Logged In'}</p>
                  <p>Session: {session ? 'Active' : 'None'}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Direct Supabase State:</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p>Supabase User: {supabaseUser ? 'Logged In as ' + supabaseUser.email : 'Not Logged In'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
              {success}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleClearCookies}
              className="py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors shadow-md"
            >
              Clear All Cookies & Storage
            </button>
            
            <button
              onClick={handleHardSignOut}
              className="py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-md"
            >
              Force Hard Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 