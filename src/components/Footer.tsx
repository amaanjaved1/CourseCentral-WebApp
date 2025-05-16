import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-6 bg-gradient-to-r from-[#00305f] via-[#00254a] to-[#efb215]/90 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-white/90">© {new Date().getFullYear()} CourseCentral</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/about" className="text-white/80 hover:text-white transition">About</Link>
            <Link href="#" className="text-white/80 hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="text-white/80 hover:text-white transition">Terms of Service</Link>
            <Link href="mailto:contact@coursecentral.ca" className="text-white/80 hover:text-white transition">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 