'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

export default function AIFeatures() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        
        <main className="flex-grow px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00305f] to-[#00305f]/90">
                  AI Course Assistant
                </span>
              </h1>
              <div className="relative mx-auto w-24 mb-6">
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#d62839] to-[#a31e36] mb-8 rounded-full mx-auto"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#efb215]/30 rounded-full blur-md animate-pulse-slow"></div>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get answers about Queen's courses, professors, grade distributions, and more with our AI-powered assistant.
              </p>
            </div>
            
            {/* AI Chat Interface Placeholder */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-10">
              {/* Chat header */}
              <div className="bg-[#00305f] px-6 py-4">
                <h2 className="text-white font-medium">Course Assistant Chat</h2>
              </div>
              
              {/* Chat messages area - this is a placeholder */}
              <div className="bg-gray-50 h-96 p-4 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                  {/* System message */}
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
                </div>
              </div>
              
              {/* Chat input */}
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Ask about a course or professor..."
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00305f] focus:border-[#00305f] transition-colors"
                  />
                  <button
                    className="ml-2 px-4 py-2 bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Sample questions */}
            <div className="mb-16">
              <h3 className="text-xl font-bold text-[#00305f] mb-4 text-center">Try asking about:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="font-medium text-[#d62839]">Course difficulty:</p>
                  <p className="text-gray-600 text-sm">"How difficult is CISC 121 compared to CISC 124?"</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="font-medium text-[#d62839]">Professor information:</p>
                  <p className="text-gray-600 text-sm">"Who are the best professors for COMM 151?"</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="font-medium text-[#d62839]">Grade distributions:</p>
                  <p className="text-gray-600 text-sm">"What's the typical grade distribution for PSYC 100?"</p>
                </div>
              </div>
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
    </ProtectedRoute>
  );
} 