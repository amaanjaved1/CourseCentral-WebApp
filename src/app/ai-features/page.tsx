'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AIFeatures() {
  const { user, isLoading } = useAuth();
  const isLoggedIn = !!user;
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);
  
  useEffect(() => {
    // Check if user has uploaded a distribution when component mounts
    // or when user authentication state changes
    if (typeof window !== 'undefined' && isLoggedIn) {
      const hasUploadedValue = localStorage.getItem('courseDistributionUploaded');
      setHasUploaded(hasUploadedValue === 'true');
    }
  }, [isLoggedIn]);
  
  const handleChatInteraction = () => {
    if (!isLoggedIn) {
      setShowAccessModal(true);
    }
  };
  
  const closeModal = () => {
    setShowAccessModal(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-grow px-4 py-6 flex flex-col">
        <div className="max-w-3xl mx-auto w-full">
          {/* Header - Simple and clean */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#00305f]">AI Course Assistant</h1>
            <div className="w-16 h-1 bg-[#d62839] rounded-full mx-auto my-3"></div>
            <p className="text-gray-600 text-sm">
              Get answers about Queen's courses, professors, and grade distributions.
            </p>
          </div>
          
          {/* Chat Interface - Visible to everyone */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
            {/* Chat header */}
            <div className="bg-[#00305f] px-5 py-3">
              <h2 className="text-white font-medium">Course Assistant Chat</h2>
            </div>
            
            {/* Chat content area */}
            <div className="bg-gray-50 h-72 p-4 overflow-y-auto">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-[#d62839] flex-shrink-0 flex items-center justify-center text-white">
                  AI
                </div>
                <div className="ml-3 bg-white rounded-lg p-3 shadow-sm max-w-3xl">
                  <p className="text-gray-800">
                    Hello! I'm your Queen's University course assistant. Ask me anything about courses, professors, or grade distributions.
                  </p>
                </div>
              </div>
              
              {!isLoggedIn && (
                <div className="flex items-center bg-blue-50 p-3 rounded-lg mt-4 border border-blue-100">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-700">
                    You need to sign in to use the AI Assistant.
                    <span className="block mt-1 text-xs text-blue-600">Click in the textbox below to get started.</span>
                  </p>
                </div>
              )}
            </div>
            
            {/* Chat input */}
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Ask about a course or professor..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00305f] focus:border-[#00305f]"
                  onFocus={handleChatInteraction}
                  onClick={handleChatInteraction}
                />
                <button 
                  className="ml-2 px-4 py-2 bg-[#d62839] text-white font-medium rounded-lg"
                  onClick={handleChatInteraction}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Course Distribution Contribution Callout */}
          {isLoggedIn && (
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
              <h3 className="text-[#00305f] font-medium mb-2">Help Fellow Students</h3>
              <p className="text-gray-700 text-sm mb-3">
                Consider uploading your course distributions to help improve recommendations for the Queen's community.
              </p>
              <Link
                href="/add-courses"
                className="inline-block bg-[#00305f] hover:bg-[#00305f]/90 text-white text-sm font-medium py-1.5 px-3 rounded-lg transition-colors"
              >
                Upload Course Distribution
              </Link>
            </div>
          )}
          
          {/* Sample questions */}
          <div>
            <h3 className="text-center text-[#00305f] font-medium mb-3">Try asking about:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="font-medium text-[#d62839] text-sm">Course difficulty</p>
                <p className="text-gray-600 text-xs">"How difficult is CISC 121 compared to CISC 124?"</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="font-medium text-[#d62839] text-sm">Professor information</p>
                <p className="text-gray-600 text-xs">"Who are the best professors for COMM 151?"</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="font-medium text-[#d62839] text-sm">Grade distributions</p>
                <p className="text-gray-600 text-xs">"What's the typical grade distribution for PSYC 100?"</p>
              </div>
            </div>
          </div>
          
          {/* Access Modal - Modal with Tailwind transition */}
          {showAccessModal && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeModal();
                }
              }}
            >
              <div 
                className="bg-white rounded-lg shadow-lg max-w-md w-full m-4 border border-gray-200 transform transition-all duration-300 ease-in-out"
                style={{ 
                  animation: "0.3s ease-out 0s 1 normal forwards running modalEntrance" 
                }}
              >
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-[#00305f]">Access the AI Assistant</h3>
                    <button 
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#d62839] flex items-center justify-center text-white font-medium text-sm mr-3">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Sign in with your account</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    Sign in to access the AI Course Assistant and get personalized help with your courses.
                  </p>
                  
                  <div className="space-y-3">
                    <Link
                      href="/signup"
                      className="bg-[#d62839] hover:bg-[#c61e29] text-white font-medium py-2 px-4 rounded-lg transition-colors w-full block text-center"
                    >
                      Sign Up Now
                    </Link>
                    <Link
                      href="/login"
                      className="text-[#00305f] hover:text-[#00305f]/80 font-medium py-2 px-4 rounded-lg transition-colors w-full block text-center"
                    >
                      Already have an account? Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Simple subtle background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d62839]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00305f]/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes modalEntrance {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
} 