"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import UserAvatar from './UserAvatar';

// Desktop navigation link with animation
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link 
      href={href} 
      className="relative text-[#00305f] font-medium group px-2 py-1"
    >
      <span className="relative z-10 group-hover:text-[#d62839] transition-colors duration-300">{label}</span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d62839] group-hover:w-full transition-all duration-300 ease-out"></span>
    </Link>
  );
}

// Mobile navigation link with animation
function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      className="relative px-3 py-3 text-[#00305f] font-medium rounded-lg flex items-center hover:bg-gray-50 transition-all duration-200"
      onClick={onClick}
    >
      <span className="relative z-10 group-hover:text-[#d62839] transition-colors duration-300">{label}</span>
      <svg 
        className="w-4 h-4 ml-auto text-gray-400" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
          clipRule="evenodd"
        />
      </svg>
    </Link>
  );
}

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close user menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const userMenu = document.getElementById('user-menu-container');
      if (userMenu && !userMenu.contains(event.target as Node) && userMenuOpen) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);
  
  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      
      // Clear all localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      
      // Force a complete page reload to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    } finally {
      setUserMenuOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'} transition-all duration-300 border-b border-gray-100/80`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and site name */}
          <div className="flex items-center group">
            <div className="mr-2 relative overflow-hidden rounded-full transform transition-transform group-hover:scale-110 duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-[#d62839]/20 to-[#00305f]/20 animate-spin-slow opacity-0 group-hover:opacity-100"></div>
              <Image 
                src="/images/QueensLogo.png" 
                alt="Queen's University Logo" 
                width={32} 
                height={32}
                className="relative z-10"
              />
            </div>
            <Link href="/" className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] transition-all duration-300 ease-in-out">
              CourseCentral
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink href="/" label="Home" />
            <NavLink href="/view-courses" label="View Courses" />
            <NavLink href="/add-courses" label="Add Courses" />
            <NavLink href="/ai-features" label="AI Assistant" />
            <NavLink href="/about" label="About" />
          </nav>

          {/* Auth buttons or user menu (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <div className="relative" id="user-menu-container">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <UserAvatar size="sm" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[#00305f] hover:text-[#00305f]/80 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {!isLoading && user && (
              <div className="mr-2">
                <Link href="/account">
                  <UserAvatar size="sm" />
                </Link>
              </div>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100/80 transition-all duration-300 ease-in-out focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <div className={`absolute w-5 h-0.5 bg-gray-600 transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}></div>
              <div className={`absolute w-5 h-0.5 bg-gray-600 transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
              <div className={`absolute w-5 h-0.5 bg-gray-600 transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white px-4 pt-2 pb-4 border-t border-gray-100 animate-slideDown">
          <div className="flex flex-col space-y-1">
            <MobileNavLink href="/" label="Home" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/view-courses" label="View Courses" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/add-courses" label="Add Courses" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/ai-features" label="AI Assistant" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/about" label="About" onClick={() => setMobileMenuOpen(false)} />
            
            {/* Auth links for mobile */}
            {!isLoading && (
              <div className="pt-2 mt-2 border-t border-gray-100">
                {user ? (
                  <>
                    <MobileNavLink href="/account" label="Account Settings" onClick={() => setMobileMenuOpen(false)} />
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-3 text-red-600 font-medium rounded-lg flex items-center hover:bg-gray-50 transition-all duration-200"
                    >
                      Sign out
                      <svg className="w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414-1.414L12.414 10l2.293-2.293a1 1 0 10-1.414-1.414L11 8.586 8.707 6.293a1 1 0 10-1.414 1.414L9.586 10l-2.293 2.293a1 1 0 101.414 1.414L11 11.414l2.293 2.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-3 py-3 text-[#00305f] font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-3 py-3 text-[#d62839] font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      )}
      
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </header>
  );
} 