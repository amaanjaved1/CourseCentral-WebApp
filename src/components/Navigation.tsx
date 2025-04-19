"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
            <NavLink href="/chatbot" label="Chatbot" />
            <NavLink href="/about" label="About" />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
            <MobileNavLink href="/chatbot" label="Chatbot" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/about" label="About" onClick={() => setMobileMenuOpen(false)} />
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