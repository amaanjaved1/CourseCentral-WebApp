'use client';

import React from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Image from 'next/image';
import Footer from '@/components/Footer';

// Team member data
const teamMembers = [
  {
    name: 'Amaan Javed',
    role: 'Software Engineer',
    program: "Queen's Computing '26",
    image: '/images/placeholder-profile.png', // Replace with actual image
    links: {
      linkedin: 'https://linkedin.com/in/',
      github: 'https://github.com/',
      website: 'https://website.com/'
    }
  },
  {
    name: 'Aayush Aryal',
    role: 'Software Engineer',
    program: "Queen's Computing '28",
    image: '/images/placeholder-profile.png', // Replace with actual image
    links: {
      linkedin: 'https://linkedin.com/in/',
      github: 'https://github.com/',
      website: 'https://website.com/'
    }
  }
];

// Stats data
const stats = [
  {
    title: "We have gathered",
    value: "500+ courses",
    icon: "📊"
  },
  {
    title: "From over",
    value: "8+ Semesters",
    icon: "🗓️"
  },
  {
    title: "all to support",
    value: "Queen's students",
    icon: "🎓"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00305f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d62839]/5 rounded-full blur-3xl"></div>
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'radial-gradient(#00305f 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      <Navigation />
      
      <main className="flex-grow px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="mb-24">
            <div className="relative">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-[#00305f]">
                About <span className="text-[#d62839]">Course Central</span>
              </h1>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#d62839] to-[#00305f] mx-auto mb-12 rounded-full"></div>
              <div className="absolute -top-10 right-1/4 w-12 h-12 bg-[#efb215]/10 rounded-full blur-lg"></div>
              <div className="absolute top-10 -left-4 w-16 h-16 bg-[#d62839]/10 rounded-full blur-lg"></div>
            </div>
            
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                Course Central was created to help Queen's University students make informed decisions 
                about their courses by providing comprehensive data, AI-powered insights, and a community 
                of shared experiences.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our platform combines grade distributions, professor reviews, and course information 
                in one place, making course selection easier and more transparent.
              </p>
            </div>
          </section>
          
          {/* What We're Doing Section */}
          <section className="mb-24 relative">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#00305f]/5 rounded-full blur-3xl"></div>
            <h2 className="text-3xl font-bold text-center mb-14 text-[#00305f]">
              What is Course Central doing?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 bg-white group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00305f]/0 via-[#00305f]/0 to-[#00305f]/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#d62839]">{stat.value}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-14 text-center text-gray-600 max-w-3xl mx-auto">
              <p className="mb-2 text-lg">
                Course Central is a free resource for students to find all the course information they need.
              </p>
              <p className="text-md">
                We're continuously working to improve our platform and add more features to help students succeed.
              </p>
            </div>
          </section>
          
          {/* Meet the Team Section */}
          <section className="mb-24 relative">
            <div className="absolute -right-20 top-40 w-64 h-64 bg-[#d62839]/5 rounded-full blur-3xl"></div>
            <h2 className="text-3xl font-bold text-center mb-16 text-[#00305f]">Meet the Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 max-w-5xl mx-auto">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 group"
                >
                  <div className="h-8 bg-gradient-to-r from-[#00305f] to-[#d62839]"></div>
                  <div className="p-8 relative">
                    <div className="flex items-center justify-center mb-6 -mt-16">
                      <div className="w-28 h-28 rounded-full bg-white p-1.5 shadow-lg overflow-hidden relative">
                        <div className="rounded-full w-full h-full bg-gradient-to-r from-[#efb215]/30 to-[#d62839]/30 flex items-center justify-center text-3xl font-bold text-[#00305f]">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-center text-[#00305f] mb-1">{member.name}</h3>
                    <p className="text-gray-600 text-center mb-2">{member.role}</p>
                    <p className="text-[#d62839] text-sm font-medium text-center mb-6">{member.program}</p>
                    
                    <div className="flex justify-center space-x-4">
                      <Link 
                        href={member.links.linkedin} 
                        target="_blank"
                        aria-label="LinkedIn"
                        className="bg-gray-100 hover:bg-[#0077b5]/10 text-gray-700 hover:text-[#0077b5] transition-colors p-3 rounded-full"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </Link>
                      <Link 
                        href={member.links.github} 
                        target="_blank"
                        aria-label="GitHub"
                        className="bg-gray-100 hover:bg-gray-800/10 text-gray-700 hover:text-gray-800 transition-colors p-3 rounded-full"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </Link>
                      <Link 
                        href={member.links.website} 
                        target="_blank"
                        aria-label="Personal Website"
                        className="bg-gray-100 hover:bg-[#d62839]/10 text-gray-700 hover:text-[#d62839] transition-colors p-3 rounded-full"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Mission Section */}
          <section className="mb-24">
            <div className="bg-gradient-to-r from-[#00305f]/10 to-[#d62839]/10 rounded-2xl p-10 lg:p-14 max-w-4xl mx-auto transition-all duration-500 ease-in-out shadow-sm hover:shadow-md transform hover:translate-y-[-2px]">
              <h2 className="text-2xl font-bold text-center mb-6 text-[#00305f]">Our Mission</h2>
              <p className="text-lg text-center text-gray-700 mb-8 leading-relaxed">
                To empower Queen's students to make better academic decisions through data transparency and community insights.
              </p>
              <div className="flex justify-center">
                <Link 
                  href="/ai-features" 
                  className="relative group bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl inline-block font-medium transition-all duration-500 ease-in-out shadow-md hover:shadow-lg overflow-hidden hover:scale-105"
                >
                  <span className="relative z-10">Try AI Assistant</span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-[#c61e29] to-[#8a1a2e] transition-transform duration-700 ease-in-out"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 -mt-4 -mr-4 bg-white/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out delay-100"></div>
                </Link>
              </div>
            </div>
          </section>
          
          {/* Contact/Get Involved Section */}
          <section>
            <h2 className="text-2xl font-bold text-center mb-8 text-[#00305f]">Get Involved</h2>
            <div className="text-center">
              <p className="text-gray-700 mb-6">
                Interested in contributing to Course Central or have suggestions?
              </p>
              <a 
                href="mailto:contact@coursecentral.ca" 
                className="text-[#d62839] font-medium hover:text-[#c61e29] transition-colors inline-flex items-center"
              >
                <span>Reach out to us</span>
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </section>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 