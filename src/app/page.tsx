"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [hasSeenAnimation, setHasSeenAnimation] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Check if the user has seen the animation before
    const hasVisited = localStorage.getItem('hasSeenAIButtonAnimation');
    if (!hasVisited) {
      setHasSeenAnimation(false);
      // Set the flag in localStorage so animation only plays once
      localStorage.setItem('hasSeenAIButtonAnimation', 'true');
    }
  }, []);

  const handleButtonHover = () => {
    if (!hasSeenAnimation) {
      setShouldAnimate(true);
      setHasSeenAnimation(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header navigation */}
      <Navigation />

      {/* AI Feature Button - Make it more prominent */}
      <div className="bg-white flex justify-center pt-4 pb-0">
        <div className="animate-subtle-bounce">
          {/* Redesigned AI Course Assistant Card - Pill-shaped */}
          <div className="relative max-w-md w-full overflow-hidden">
            <Link 
              href="/ai-features" 
              className="group flex items-center justify-between bg-gradient-to-r from-[#d62839] to-[#a31e36] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-lg transition-colors duration-300 w-full overflow-hidden"
              onMouseEnter={handleButtonHover}
            >
              {/* Improved rounded pill shape and hover effects */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-30 group-hover:opacity-40 transition-colors duration-300"></div>
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              
              {/* Enhanced orange circular border/glow */}
              <div className="absolute -inset-0.5 rounded-full border-2 border-[#ff8a00] opacity-60 animate-pulse-slow group-hover:opacity-80 transition-colors duration-300"></div>
              
              {/* Fixed animated border that moves around the entire card */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                {/* Improved circular moving border effect */}
                <div className="absolute -inset-[2px] border-4 border-[#ffb700] rounded-full animate-border-travel overflow-hidden shadow-[0_0_10px_3px_rgba(255,183,0,0.4)] group-hover:shadow-[0_0_12px_4px_rgba(255,183,0,0.5)] transition-colors duration-300"></div>
                
                {/* Enhanced corner glow - only keeping bottom left */}
                <div className="absolute bottom-0 left-0 w-28 h-28 -mb-10 -ml-10 bg-[#ff8a00]/20 rounded-full blur-xl group-hover:bg-[#ff8a00]/30 transition-colors duration-300"></div>
              </div>
              
              {/* Content */}
              <div className="flex items-center z-10">
                <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md mr-3 group-hover:text-[#d62839] transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#d62839]">
                    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9z" clipRule="evenodd" />
                  </svg>
                  <div className="absolute -top-1 -right-1">
                    <div className="w-2.5 h-2.5 bg-[#ff8a00] rounded-full animate-ping-slow"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-white transition-colors duration-300">AI Course Assistant</h3>
                  <p className="text-white/90 text-xs">Ask anything about Queen's courses</p>
                </div>
              </div>
              
              <span className="border-l border-white/30 pl-3 ml-1 text-sm font-medium text-white whitespace-nowrap flex items-center transition-colors duration-300 z-10">
                Try Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1.5 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Add these animations to your globals.css or use them inline */}
      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s ease-in-out infinite;
        }
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0) translateZ(0); }
          50% { transform: translateY(-8px) translateZ(0); }
        }
        .animate-subtle-bounce {
          animation: subtle-bounce 4s ease-in-out infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-font-smoothing: subpixel-antialiased;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.95; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        /* Enhanced animation for the traveling border effect */
        @keyframes border-travel {
          0% {
            clip-path: polygon(0 0, 8% 0, 8% 100%, 0 100%);
            opacity: 1;
          }
          25% {
            clip-path: polygon(0 0, 100% 0, 100% 8%, 0 8%);
            opacity: 1;
          }
          50% {
            clip-path: polygon(92% 0, 100% 0, 100% 100%, 92% 100%);
            opacity: 1;
          }
          75% {
            clip-path: polygon(0 92%, 100% 92%, 100% 100%, 0 100%);
            opacity: 1;
          }
          100% {
            clip-path: polygon(0 0, 8% 0, 8% 100%, 0 100%);
            opacity: 1;
          }
        }
        .animate-border-travel {
          animation: border-travel 3s linear infinite;
          filter: drop-shadow(0 0 3px #ffb700);
        }
      `}</style>

      {/* Hero section */}
      <section className="relative bg-white py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-[#d62839]/5 rounded-full blur-3xl -top-10 -right-20"></div>
          <div className="absolute w-80 h-80 bg-[#00305f]/5 rounded-full blur-3xl -bottom-10 -left-20"></div>
          <div className="dot-pattern absolute inset-0 opacity-[0.15]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
          {/* Left side content */}
          <div className="w-full md:w-1/2 mb-16 md:mb-0 md:pr-8 lg:pr-12">
            <div className="max-w-xl">
              <h1 className="relative text-3xl sm:text-4xl md:text-5xl font-bold mb-8 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00305f] to-[#00305f]/90">
                  AI-powered insights for
                </span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#d62839] to-[#a31e36]">
                  smarter course decisions
                </span>
                <div className="absolute -left-2 -top-2 w-12 h-12 bg-[#efb215]/20 rounded-full blur-lg"></div>
              </h1>
              
              <div className="relative">
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#d62839] to-[#a31e36] mb-8 sm:mb-10 rounded-full"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#efb215]/30 rounded-full blur-md animate-pulse-slow"></div>
              </div>
              
              <p className="text-gray-700 text-base sm:text-lg mb-10 sm:mb-12 leading-relaxed">
                Get <span className="font-medium text-[#d62839]">instant answers about any Queen's course</span> from our AI chatbot and explore <span className="font-medium text-[#00305f]">comprehensive grade distributions</span> across 10+ semesters.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center space-y-5 sm:space-y-0 sm:space-x-5">
                <Link 
                  href="/ai-features" 
                  className="relative group bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl inline-block font-medium transition-all duration-500 ease-in-out w-full sm:w-auto text-center shadow-md hover:shadow-lg overflow-hidden hover:scale-105"
                >
                  <span className="relative z-10">Try AI Assistant</span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-[#c61e29] to-[#8a1a2e] transition-transform duration-700 ease-in-out"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 -mt-4 -mr-4 bg-white/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out delay-100"></div>
                </Link>
                
                <Link 
                  href="/grade-data" 
                  className="group relative bg-gradient-to-r from-[#00305f] to-[#00305f]/90 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl inline-block font-medium transition-all duration-500 ease-in-out w-full sm:w-auto text-center overflow-hidden hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#efb215] group-hover:to-[#ff8a00] transition-all duration-500 ease-in-out">Explore Grade Data</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-500 ease-in-out group-hover:text-[#efb215]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </div>
              
              <div className="mt-10 text-center sm:text-left">
                <p className="inline-flex items-center text-sm text-[#d62839]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Created for Queen's students, by Queen's students
                </p>
              </div>
            </div>
          </div>

          {/* Right side planner visual - Keep as empty box */}
          <div className="w-full md:w-1/2">
            <div className="relative">
              {/* Preview box for future content - reference ID: future-content-preview */}
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 mx-auto max-w-md animate-float-slow transform hover:-translate-y-2 transition-all duration-500 ease-in-out overflow-hidden group">
                {/* Empty container reserved for future dynamic content */}
                <div className="p-6 h-64 flex flex-col items-center justify-center">
                  {/* This area is intentionally left blank for future implementation */}
                  <span className="text-gray-300 text-lg font-medium">preview</span>
                </div>
              </div>
              
              {/* Decorative cards in background */}
              <div className="absolute -right-6 top-10 w-48 h-48 bg-[#efb215]/10 rounded-2xl transform rotate-12 blur-sm"></div>
              <div className="absolute -left-10 bottom-20 w-40 h-40 bg-[#d62839]/10 rounded-2xl transform -rotate-6 blur-sm"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative divider using brand colors */}
      <div className="relative py-8 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 bg-[url('/images/dot-pattern.svg')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center">
            <div className="flex-grow h-0.5 bg-gradient-to-r from-[#d62839]/40 via-[#d62839]/10 to-transparent"></div>
            <div className="mx-6 flex space-x-3 items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#d62839] to-[#a31e36] transform rotate-0 hover:rotate-45 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </div>
            <div className="flex-grow h-0.5 bg-gradient-to-l from-[#00305f]/40 via-[#00305f]/10 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="bg-white py-20 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#efb215]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d62839]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14 sm:mb-16">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#d62839]/10 mb-4">
              <span className="text-[#d62839] text-sm font-medium mr-2">Features</span>
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d62839] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#d62839]"></span>
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00305f] to-[#00305f]/90">Get the full picture with</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#d62839] to-[#a31e36]">our AI course assistant</span>
            </h2>
            <div className="relative mx-auto w-24 mb-6">
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#d62839] to-[#a31e36] mb-8 rounded-full mx-auto"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#efb215]/30 rounded-full blur-md animate-pulse-slow"></div>
            </div>
            <p className="text-gray-600 max-w-xl mx-auto px-4 text-sm sm:text-base mb-10 sm:mb-16">
              Get instant answers about courses, professors, and grade distributions with our AI-powered assistant
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {/* Feature 1: AI Course Assistant */}
            <div className="group relative bg-gradient-to-br from-[#efb215]/3 to-[#efb215]/8 p-0.5 rounded-2xl transform transition duration-500 hover:scale-[1.02]">
              <div className="bg-white rounded-2xl p-6 sm:p-8 h-full shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#efb215] to-[#efb215]/50 rounded-t-xl transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="bg-[#fef5e7] h-16 w-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#efb215] group-hover:shadow-md transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#efb215] group-hover:text-white transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#00305f] text-lg sm:text-xl mb-3 group-hover:text-[#efb215] transition-colors duration-300">AI Course Assistant</h3>
                <p className="text-gray-600 text-sm sm:text-base">Our intelligent chatbot answers any question about Queen's courses, professors, and teaching styles instantly – like having a personal academic advisor.</p>
                <div className="w-8 h-8 rounded-full bg-[#fef5e7] flex items-center justify-center mt-6 ml-auto transform translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#efb215]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Feature 2: Real Grade Distributions */}
            <div className="group relative bg-gradient-to-br from-[#d62839]/3 to-[#d62839]/8 p-0.5 rounded-2xl transform transition duration-500 hover:scale-[1.02]">
              <div className="bg-white rounded-2xl p-6 sm:p-8 h-full shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d62839] to-[#d62839]/50 rounded-t-xl transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="bg-[#f9e5e8] h-16 w-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#d62839] group-hover:shadow-md transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#d62839] group-hover:text-white transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#00305f] text-lg sm:text-xl mb-3 group-hover:text-[#d62839] transition-colors duration-300">Real Grade Distributions</h3>
                <p className="text-gray-600 text-sm sm:text-base">Explore actual grade breakdowns across 10+ semesters to understand the true difficulty of any Queen's course.</p>
                <div className="w-8 h-8 rounded-full bg-[#f9e5e8] flex items-center justify-center mt-6 ml-auto transform translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d62839]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Feature 3: Course Analytics */}
            <div className="group relative bg-gradient-to-br from-[#00305f]/3 to-[#00305f]/8 p-0.5 rounded-2xl transform transition duration-500 hover:scale-[1.02]">
              <div className="bg-white rounded-2xl p-6 sm:p-8 h-full shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00305f] to-[#00305f]/50 rounded-t-xl transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="bg-[#e5e9f0] h-16 w-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00305f] group-hover:shadow-md transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#00305f] group-hover:text-white transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#00305f] text-lg sm:text-xl mb-3 group-hover:text-[#00305f] transition-colors duration-300">Course Analytics</h3>
                <p className="text-gray-600 text-sm sm:text-base">Visualize passing rates, grade averages, and enrollment trends to identify the most suitable courses for your goals.</p>
                <div className="w-8 h-8 rounded-full bg-[#e5e9f0] flex items-center justify-center mt-6 ml-auto transform translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00305f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Feature 4: Semester Tracking */}
            <div className="group relative bg-gradient-to-br from-[#d62839]/3 to-[#d62839]/8 p-0.5 rounded-2xl transform transition duration-500 hover:scale-[1.02]">
              <div className="bg-white rounded-2xl p-6 sm:p-8 h-full shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d62839] to-[#d62839]/50 rounded-t-xl transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="bg-[#f9e5e8] h-16 w-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#d62839] group-hover:shadow-md transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#d62839] group-hover:text-white transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#00305f] text-lg sm:text-xl mb-3 group-hover:text-[#d62839] transition-colors duration-300">Semester Tracking</h3>
                <p className="text-gray-600 text-sm sm:text-base">Compare how courses have evolved over time with historical course data going back to 2015.</p>
                <div className="w-8 h-8 rounded-full bg-[#f9e5e8] flex items-center justify-center mt-6 ml-auto transform translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d62839]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Feature 5: Mobile Access */}
            <div className="group relative bg-gradient-to-br from-[#00305f]/3 to-[#00305f]/8 p-0.5 rounded-2xl transform transition duration-500 hover:scale-[1.02]">
              <div className="bg-white rounded-2xl p-6 sm:p-8 h-full shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00305f] to-[#00305f]/50 rounded-t-xl transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="bg-[#e5e9f0] h-16 w-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00305f] group-hover:shadow-md transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#00305f] group-hover:text-white transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#00305f] text-lg sm:text-xl mb-3 group-hover:text-[#00305f] transition-colors duration-300">Mobile Access</h3>
                <p className="text-gray-600 text-sm sm:text-base">View course stats and chat with our AI assistant from any device — ideal for researching on the go.</p>
                <div className="w-8 h-8 rounded-full bg-[#e5e9f0] flex items-center justify-center mt-6 ml-auto transform translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00305f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Feature 6: Student-Powered Reviews */}
            <div className="group relative bg-gradient-to-br from-[#efb215]/3 to-[#efb215]/8 p-0.5 rounded-2xl transform transition duration-500 hover:scale-[1.02]">
              <div className="bg-white rounded-2xl p-6 sm:p-8 h-full shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#efb215] to-[#efb215]/50 rounded-t-xl transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="bg-[#fef5e7] h-16 w-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#efb215] group-hover:shadow-md transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#efb215] group-hover:text-white transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#00305f] text-lg sm:text-xl mb-3 group-hover:text-[#efb215] transition-colors duration-300">Student-Powered Reviews</h3>
                <p className="text-gray-600 text-sm sm:text-base">See feedback based on student experiences pulled from Reddit and RateMyProfessor — filtered to be relevant to Queen's courses and instructors.</p>
                <div className="w-8 h-8 rounded-full bg-[#fef5e7] flex items-center justify-center mt-6 ml-auto transform translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#efb215]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Why CourseCentral Matters Section */}
      <section className="relative py-20 sm:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[#f9f9fa]"></div>
        <div className="absolute h-96 w-96 bg-[#efb215]/10 rounded-full blur-3xl right-0 top-1/4 transform translate-x-1/2"></div>
        <div className="absolute h-80 w-80 bg-[#d62839]/10 rounded-full blur-3xl left-0 bottom-1/4 transform -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-block relative mb-4">
              <span className="inline-block px-4 py-2 rounded-full bg-[#00305f]/10 text-[#00305f] text-sm font-medium">Why Choose Us</span>
              <div className="absolute -right-2 -bottom-2 w-5 h-5 bg-[#d62839]/20 rounded-full blur-md animate-pulse-slow"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00305f] to-[#00305f]/90">Why CourseCentral Matters</span>
            </h2>
            <div className="relative mx-auto w-24 mb-6">
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#d62839] to-[#a31e36] mb-8 rounded-full mx-auto"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#efb215]/30 rounded-full blur-md animate-pulse-slow"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Reason 1: Make Smarter Course Decisions */}
            <div className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-[#d62839]/30 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="bg-[#d62839] h-12 w-12 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-md relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-[#00305f] group-hover:text-[#d62839] transition-colors duration-300">Make Smarter Course Decisions</h3>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-[#d62839] font-medium">→</div>
                <p className="text-gray-600">Know what to expect before enrolling with insights from real grade data and past student reviews.</p>
              </div>
            </div>
            
            {/* Reason 2: Get Answers, Instantly */}
            <div className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-[#00305f]/30 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="bg-[#00305f] h-12 w-12 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-md relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-[#00305f] group-hover:text-[#00305f] transition-colors duration-300">Get Answers, Instantly</h3>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-[#00305f] font-medium">→</div>
                <p className="text-gray-600">No more guessing — use the chatbot to ask questions about classes and profs, 24/7.</p>
              </div>
            </div>
            
            {/* Reason 3: Built for Queen's */}
            <div className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-[#efb215]/30 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="bg-[#efb215] h-12 w-12 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-md relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-[#00305f] group-hover:text-[#efb215] transition-colors duration-300">Built for Queen's</h3>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-[#efb215] font-medium">→</div>
                <p className="text-gray-600">CourseCentral is made specifically for Queen's courses and students.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white py-20 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f9f9fa] via-white to-white"></div>
        <div className="absolute h-96 w-96 bg-[#d62839]/5 rounded-full blur-3xl -left-20 top-20 transform rotate-45"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-block relative mb-4">
              <span className="inline-block px-4 py-2 rounded-full bg-[#efb215]/10 text-[#efb215] text-sm font-medium">Testimonials</span>
              <div className="absolute -left-2 -bottom-2 w-5 h-5 bg-[#d62839]/20 rounded-full blur-md animate-pulse-slow"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00305f] to-[#00305f]/90">What Queen's students are saying</span>
            </h2>
            <div className="relative mx-auto w-24 mb-6">
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#efb215] to-[#d6a215] mb-8 rounded-full mx-auto"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#00305f]/20 rounded-full blur-md animate-pulse-slow"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transform transition-all duration-500 hover:scale-[1.02] group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#d62839]/0 group-hover:bg-[#d62839] rounded-t-xl transition-colors duration-300"></div>
              <div className="flex items-center mb-3">
                <div className="flex text-[#efb215]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="relative mb-6">
                <p className="text-gray-600 text-sm sm:text-base italic mb-4 relative z-10">
                  "The AI assistant recommended a professor whose teaching style matched how I learn. Best course experience I've had at Queen's!"
                </p>
                <svg className="absolute text-[#00305f]/5 h-12 w-12 -top-4 -left-2 transform -rotate-12" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
                </svg>
              </div>
              <div className="flex items-center">
                <div className="relative h-12 w-12 mr-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00305f] to-[#00305f]/80 animate-pulse-slow"></div>
                  <div className="absolute inset-0.5 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[#00305f] font-bold">E</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Queen's Engineering Student</p>
                  <p className="text-xs text-gray-500">Class of 2024</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transform transition-all duration-500 hover:scale-[1.02] group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#efb215]/0 group-hover:bg-[#efb215] rounded-t-xl transition-colors duration-300"></div>
              <div className="flex items-center mb-3">
                <div className="flex text-[#efb215]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="relative mb-6">
                <p className="text-gray-600 text-sm sm:text-base italic mb-4 relative z-10">
                  "The AI chatbot gave me insights about my professor's teaching style that I couldn't find anywhere else."
                </p>
                <svg className="absolute text-[#efb215]/5 h-12 w-12 -top-4 -left-2 transform -rotate-12" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
                </svg>
              </div>
              <div className="flex items-center">
                <div className="relative h-12 w-12 mr-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#efb215] to-[#efb215]/80 animate-pulse-slow"></div>
                  <div className="absolute inset-0.5 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[#efb215] font-bold">A</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Queen's Arts Student</p>
                  <p className="text-xs text-gray-500">Class of 2026</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transform transition-all duration-500 hover:scale-[1.02] group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#00305f]/0 group-hover:bg-[#00305f] rounded-t-xl transition-colors duration-300"></div>
              <div className="flex items-center mb-3">
                <div className="flex text-[#efb215]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="relative mb-6">
                <p className="text-gray-600 text-sm sm:text-base italic mb-4 relative z-10">
                  "Being able to see how course difficulty changed over different semesters helped me pick the best time to take COMM 151."
                </p>
                <svg className="absolute text-[#00305f]/5 h-12 w-12 -top-4 -left-2 transform -rotate-12" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
                </svg>
              </div>
              <div className="flex items-center">
                <div className="relative h-12 w-12 mr-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00305f] to-[#00305f]/80 animate-pulse-slow"></div>
                  <div className="absolute inset-0.5 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[#00305f] font-bold">S</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Queen's Science Student</p>
                  <p className="text-xs text-gray-500">Class of 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute h-96 w-96 bg-[#d62839]/5 rounded-full blur-3xl right-0 bottom-0 transform translate-x-1/2 translate-y-1/4"></div>
        <div className="absolute h-80 w-80 bg-[#00305f]/5 rounded-full blur-3xl left-0 top-0 transform -translate-x-1/3 -translate-y-1/4"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-block relative mb-4">
              <span className="inline-block px-4 py-2 rounded-full bg-[#d62839]/10 text-[#d62839] text-sm font-medium">FAQs</span>
              <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#00305f]/10 rounded-full blur-md"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00305f] to-[#00305f]/90">Frequently Asked Questions</span>
            </h2>
          </div>
          
          <div className="space-y-5">
            <div className="group bg-white p-7 rounded-xl border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md hover:border-[#d62839]/30 hover:translate-y-[-2px]">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#d62839]/10 text-[#d62839] group-hover:bg-[#d62839] group-hover:text-white transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#00305f] group-hover:text-[#d62839] transition-colors duration-300 mb-2">Is CourseCentral connected to SOLUS?</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    CourseCentral is not officially connected to SOLUS, but we've collected grade distribution data from multiple reliable sources. You'll need to register for courses through SOLUS after researching them on our platform.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group bg-white p-7 rounded-xl border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md hover:border-[#00305f]/30 hover:translate-y-[-2px]">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#00305f]/10 text-[#00305f] group-hover:bg-[#00305f] group-hover:text-white transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#00305f] group-hover:text-[#00305f] transition-colors duration-300 mb-2">Where does the chatbot get its information?</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Our AI advisor is trained on thousands of student reviews from Queen's course catalogs, Reddit discussions, and RateMyProfessor reviews to provide you with comprehensive insights about courses and professors.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group bg-white p-7 rounded-xl border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md hover:border-[#efb215]/30 hover:translate-y-[-2px]">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#efb215]/10 text-[#efb215] group-hover:bg-[#efb215] group-hover:text-white transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#00305f] group-hover:text-[#efb215] transition-colors duration-300 mb-2">How up-to-date is the grade data?</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    We update our database each semester with the latest grade distributions and course information to ensure you have access to the most current data for decision making.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group bg-white p-7 rounded-xl border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md hover:border-[#d62839]/30 hover:translate-y-[-2px]">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#d62839]/10 text-[#d62839] group-hover:bg-[#d62839] group-hover:text-white transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#00305f] group-hover:text-[#d62839] transition-colors duration-300 mb-2">Is this tool free?</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Yes, CourseCentral is completely free for all Queen's University students. We believe in making data-driven course selection accessible to everyone.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group bg-white p-7 rounded-xl border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md hover:border-[#00305f]/30 hover:translate-y-[-2px]">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#00305f]/10 text-[#00305f] group-hover:bg-[#00305f] group-hover:text-white transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#00305f] group-hover:text-[#00305f] transition-colors duration-300 mb-2">What courses are supported?</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Currently, CourseCentral only supports on-campus courses at Queen's University. We're working on adding support for online courses in the future, but for now, our data and AI assistant focus exclusively on in-person course offerings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Queen's University section */}
      <section className="bg-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/dot-pattern.png')] opacity-5"></div>
        <div className="absolute h-60 w-60 bg-[#efb215]/10 rounded-full blur-3xl left-20 top-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40 bg-white rounded-lg shadow-md flex items-center justify-center p-3 transform transition-transform duration-500 hover:scale-105">
                <Image 
                  src="/images/QueensLogo.png" 
                  alt="Queen's University Logo" 
                  width={150} 
                  height={100}
                  className="object-contain"
                />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#d62839] mb-2">Queen's University</h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
              Helping students navigate the course selection process at Queen's University since 2023.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-3 italic max-w-md mx-auto">
              Note: CourseCentral is not affiliated with or endorsed by Queen's University.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#00305f] to-[#001c3a] text-white py-8 sm:py-10 px-4 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-60 w-60 rounded-full bg-[#d62839]/10 blur-3xl -top-20 right-0 transform rotate-45"></div>
          <div className="absolute h-40 w-40 rounded-full bg-[#efb215]/10 blur-3xl bottom-10 left-20 animate-pulse-slow"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d62839] via-[#efb215] to-[#d62839]/70"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center mb-3">
                <svg width="30" height="30" viewBox="0 0 48 48" className="mr-2">
                  <path fill="#d62839" d="M8,8v32h32V8H8z M22,36h-4V22h-4v-4h8V36z M34,28h-4v8h-4V16h8V28z"/>
                </svg>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">CourseCentral</span>
              </div>
              <p className="text-gray-300 mb-3 text-sm">
                Empowering Queen's students to make informed academic decisions through comprehensive grade data and AI-powered course insights.
              </p>
            </div>
            
            <div>
              <h3 className="text-base font-semibold mb-2 border-b border-gray-700 pb-2">Support</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-300 flex items-center">
                    <svg className="w-3 h-3 mr-2 text-[#d62839]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-300 flex items-center">
                    <svg className="w-3 h-3 mr-2 text-[#d62839]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-300 flex items-center">
                    <svg className="w-3 h-3 mr-2 text-[#d62839]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-xs text-gray-400">
              © {new Date().getFullYear()} CourseCentral. All rights reserved.
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-400">Made with</div>
              <div className="text-[#d62839] animate-pulse">❤</div>
              <div className="text-xs text-gray-400">by Queen's students</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
