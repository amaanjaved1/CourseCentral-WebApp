"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import AuthGate from "@/components/auth/AuthGate";

export default function AddCourses() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  };
  
  const handleFileUpload = (file: File) => {
    // Check if file is PDF
    if (file.type === "application/pdf") {
      setUploadedFile(file);
      // Simulate upload success
      setTimeout(() => {
        setIsUploaded(true);
        
        // Store upload information in localStorage
        localStorage.setItem('courseDistributionUploaded', 'true');
        localStorage.setItem('courseDistributionUploadedAt', new Date().toISOString());
        
        // In a real implementation, you would also store this in the database
        // For example: supabase.from('user_uploads').insert({user_id: user.id, upload_type: 'grade_distribution', file_name: file.name});
      }, 1500);
    } else {
      alert("Please upload a PDF file. SOLUS grade distributions are downloaded as PDF files.");
    }
  };
  
  const handleSubmitAnother = () => {
    setUploadedFile(null);
    setIsUploaded(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header navigation */}
      <Navigation />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          {/* Section header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00305f] to-[#00305f]/90">Add Course Distributions</span>
            </h1>
            <div className="relative mx-auto w-24 mb-6">
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#d62839] to-[#a31e36] mb-8 rounded-full mx-auto"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#efb215]/30 rounded-full blur-md animate-pulse-slow"></div>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Help improve the site and future course selections
            </p>
          </div>
          
          {/* How To Find Guide Button */}
          <div className="flex justify-center mb-8">
            <Link
              href="https://www.queensu.ca/registrar/academic-info/grades/release-dates-and-viewing"
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              How To Find SOLUS Distribution
            </Link>
          </div>
        
          {/* Main Upload Container - Wrapped with AuthGate */}
          <AuthGate message="Please log in to upload course distributions. Your contributions help other students make informed decisions!">
            {!isUploaded ? (
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                <div className="py-6 px-6 bg-[#00305f] border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-white">Upload SOLUS Grade Distribution</h2>
                </div>
                
                {/* Drag and drop area */}
                <div 
                  className={`p-8 sm:p-12 ${
                    isDragging 
                      ? "bg-[#00305f]/5" 
                      : "bg-white"
                  } transition-all duration-300`}
                >
                  <div
                    className={`border-2 border-dashed rounded-xl py-12 px-6 text-center cursor-pointer transition-all duration-300 ${
                      isDragging 
                        ? "border-[#d62839] bg-[#d62839]/5" 
                        : "border-gray-300 hover:border-[#d62839]/60 hover:bg-gray-50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    {uploadedFile ? (
                      <div className="py-4">
                        <div className="flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#d62839] animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-md font-medium text-[#00305f] mb-2">{uploadedFile.name}</p>
                        <p className="text-[#d62839] text-sm">Processing your file...</p>
                      </div>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        <h3 className="mt-4 text-xl font-medium text-[#00305f]">
                          Drop your file here
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 max-w-xs mx-auto">
                          Drag and drop your SOLUS grade distribution PDF, or click to browse
                        </p>
                        
                        <div className="mt-5">
                          <button className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#00305f]/60 transition-colors">
                            Select PDF File
                          </button>
                        </div>
                      </>
                    )}
                    
                    <input
                      id="file-upload"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                
                {/* Important Note */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#efb215]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-[#efb215]">Important:</span> Currently, we only support on-campus courses. Online course distributions will be supported in future updates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200">
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#00305f] mb-2">Upload Successful!</h2>
                  <p className="text-gray-600 mb-8">
                    Thank you for contributing to CourseCentral. Your data will help future students make better course decisions.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={handleSubmitAnother}
                      className="w-full sm:w-auto px-6 py-3 bg-[#00305f] hover:bg-[#00305f]/90 text-white font-medium rounded-lg transition-colors duration-300 shadow-md"
                    >
                      Upload Another Distribution
                    </button>
                    
                    <Link
                      href="/"
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] text-white font-medium rounded-lg transition-colors duration-300 shadow-md"
                    >
                      Return to Homepage
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </AuthGate>
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
  );
} 