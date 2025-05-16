'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getCourseByCode, getCourseDistributions, getDirectCourseDescription, debugDatabaseStructure } from '@/lib/db';
import { Course, GradeDistribution } from '@/types';

// Grade labels
const GRADE_LABELS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const GPA_VALUES = [4.3, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0.0];

// Color classes for different grade bands
const GRADE_COLORS = {
  'A+': 'bg-green-500', 'A': 'bg-green-400', 'A-': 'bg-green-300',
  'B+': 'bg-lime-400', 'B': 'bg-lime-300', 'B-': 'bg-lime-200',
  'C+': 'bg-yellow-400', 'C': 'bg-yellow-300', 'C-': 'bg-yellow-200',
  'D+': 'bg-orange-400', 'D': 'bg-orange-300', 'D-': 'bg-orange-200',
  'F': 'bg-red-400',
};

// Helper function to get letter grade from GPA
const getLetterGrade = (gpa: number): string => {
  if (gpa >= 4.3) return 'A+';
  if (gpa >= 4.0) return 'A';
  if (gpa >= 3.7) return 'A-';
  if (gpa >= 3.3) return 'B+';
  if (gpa >= 3.0) return 'B';
  if (gpa >= 2.7) return 'B-';
  if (gpa >= 2.3) return 'C+';
  if (gpa >= 2.0) return 'C';
  if (gpa >= 1.7) return 'C-';
  if (gpa >= 1.3) return 'D+';
  if (gpa >= 1.0) return 'D';
  if (gpa >= 0.7) return 'D-';
  return 'F';
};

// Helper function to get GPA color
const getGpaColorClass = (gpa: number): string => {
  if (gpa >= 3.7) return 'text-green-500';
  if (gpa >= 3.0) return 'text-green-400';
  if (gpa >= 2.3) return 'text-yellow-500';
  if (gpa >= 1.7) return 'text-orange-400';
  return 'text-red-500';
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseCode = params?.courseCode ? (params.courseCode as string).replace('-', ' ') : '';
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [course, setCourse] = useState<Course | null>(null);
  const [distributions, setDistributions] = useState<GradeDistribution[]>([]);
  
  // Fetch data from Supabase
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        // Debug database structure
        await debugDatabaseStructure();
        
        // Fetch course data
        const courseData = await getCourseByCode(courseCode);
        if (!courseData) {
          setError(`Course ${courseCode} not found`);
          setLoading(false);
          return;
        }
        
        // Try to get description directly as a separate request
        try {
          const directDescription = await getDirectCourseDescription(courseCode);
          if (directDescription) {
            courseData.description = directDescription;
          }
        } catch (descError) {
          console.error("Error getting direct description:", descError);
        }
        
        setCourse(courseData);
        
        // Fetch distributions data
        const distributionsData = await getCourseDistributions(courseData.id);
        setDistributions(distributionsData);
        
        // Set default selected term to the most recent
        if (distributionsData.length > 0) {
          setSelectedTerm(distributionsData[0].term);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('An error occurred while fetching course data');
        setLoading(false);
      }
    };
    
    if (courseCode) {
      fetchCourseData();
    }
  }, [courseCode]);
  
  // If loading, show a loading message
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-grow container mx-auto py-16 px-4 flex flex-col items-center justify-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-60 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-80 mb-10"></div>
            <div className="h-32 bg-gray-200 rounded w-full max-w-2xl"></div>
          </div>
        </main>
      </div>
    );
  }
  
  // If course doesn't exist, show an error
  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-grow container mx-auto py-16 px-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-[#d62839] mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find a course with code "{courseCode}".</p>
          <Link 
            href="/schools/queens" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#d62839] to-[#b5212e] text-white rounded-full hover:from-[#b5212e] hover:to-[#d62839] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Return to Courses List
          </Link>
        </main>
      </div>
    );
  }
  
  // Get unique terms for the dropdown
  const terms = Array.from(new Set(distributions.map(dist => dist.term))).sort((a, b) => {
    // Sort terms by year and term
    return b.localeCompare(a);
  });
  
  // Find the distribution for the selected term
  const selectedDistribution = distributions.find(dist => dist.term === selectedTerm);
  
  // Calculate overall average GPA across all terms
  const averageGPA = distributions.length > 0
    ? distributions.reduce((sum, dist) => sum + dist.average_gpa, 0) / distributions.length
    : 0;
  
  // Get average enrollment
  const averageEnrollment = distributions.length > 0
    ? Math.round(distributions.reduce((sum, dist) => sum + dist.enrollment, 0) / distributions.length)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Course Header - Modern Design */}
        <div className="relative mb-10 bg-gradient-to-r from-[#00305f] to-[#004d99] rounded-xl shadow-lg p-8 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-white opacity-5 rounded-full -mb-20"></div>
          
          {course.offering_faculty && (
            <span className="inline-block px-3 py-1 bg-[#d62839]/90 text-white text-sm font-medium rounded-full mb-4">
              {course.offering_faculty.replace(/^Offering Faculty:/, '')}
            </span>
          )}
          
          <h1 className="text-4xl font-bold mb-3 flex items-center">
            {course.course_code}
          </h1>
          
          <h2 className="text-2xl font-medium text-white/90 mb-6">{course.course_name}</h2>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium text-white mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Course Description
            </h3>
            <div className="text-white/80 max-w-3xl backdrop-blur-sm bg-white/5 p-4 rounded-lg border border-white/10">
              {course.description ? (
                typeof course.description === 'string' ? 
                  course.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2 last:mb-0">{paragraph}</p>
                  )) : 
                  <p>{String(course.description)}</p>
              ) : (
                <p>No description available for this course.</p>
              )}
            </div>
          </div>
        </div>

        {/* Details & Stats Section - Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden group relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
            <h3 className="text-lg font-semibold mb-4 text-[#00305f] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#d62839]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Course Details
            </h3>
            <ul className="space-y-3 flex-1">
              {course.offering_faculty && (
                <li className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150">
                  <span className="text-gray-500">Faculty:</span>
                  <span className="text-gray-900 font-medium">{course.offering_faculty.replace(/^Offering Faculty:/, '')}</span>
                </li>
              )}
              <li className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150">
                <span className="text-gray-500">Credits:</span>
                <span className="text-gray-900 font-medium">{course.credits || course.course_units || 0}</span>
              </li>
              <li className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150">
                <span className="text-gray-500">Available Terms:</span>
                <span className="text-gray-900 font-medium">{terms.length}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden group relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
            <h3 className="text-lg font-semibold mb-4 text-[#00305f] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#d62839]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H6a1 1 0 01-1-1V2zm2 1v8h6V3H7zm8 11v4h2v-4h-2zm-8 4v-4H5v4h2z" clipRule="evenodd" />
              </svg>
              Prerequisites
            </h3>
            <div className="p-3 rounded-lg bg-gray-50 text-gray-700 flex-1 flex items-center justify-center hover:bg-gray-100 transition-all duration-300">
              {course.course_requirements ? (
                <p>{course.course_requirements.replace(/^Requirements:/, '')}</p>
              ) : (
                <p>No specific requirements listed.</p>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden group relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
            <h3 className="text-lg font-semibold mb-4 text-[#00305f] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#d62839]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Performance Metrics
            </h3>
            <div className="space-y-4 flex-1">
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-xs font-semibold inline-block text-[#00305f]">Average GPA</span>
                  </div>
                  <div>
                    <span className={`text-xs font-bold inline-block px-2 py-1 rounded-full uppercase ${
                      averageGPA >= 3.7 ? 'bg-green-100 text-green-800' :
                      averageGPA >= 3.0 ? 'bg-green-100 text-green-700' :
                      averageGPA >= 2.3 ? 'bg-yellow-100 text-yellow-800' :
                      averageGPA >= 1.7 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {averageGPA.toFixed(2)} ({getLetterGrade(averageGPA)})
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded-full bg-gray-200">
                  <div 
                    style={{ width: `${(averageGPA / 4.3) * 100}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full"
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1.0</span>
                  <span>4.3</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <span className="text-gray-500">Average Enrollment:</span>
                <span className="text-gray-900 font-medium">{averageEnrollment}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Course GPA Chart - Redesigned */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-6 pb-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#00305f] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#d62839]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd" />
                  </svg>
                  GPA Analytics
                </h2>
                <span className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 py-1 px-4 rounded-full text-sm font-medium shadow-sm">
                  {course.course_code}
                </span>
              </div>
              
              {/* Chart description */}
              <div className="mb-4 -mt-2 text-sm text-gray-600">
                <p>Historical GPA trends across academic terms</p>
              </div>
              
              {distributions.length > 0 ? (
                <div>
                  <div className="relative" style={{height: "280px"}}>
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between items-end pr-2">
                      <div className="text-xs text-gray-500 font-medium">4.0</div>
                      <div className="text-xs text-gray-500">3.5</div>
                      <div className="text-xs text-gray-500 font-medium">3.0</div>
                      <div className="text-xs text-gray-500">2.5</div>
                      <div className="text-xs text-gray-500 font-medium">2.0</div>
                      <div className="text-xs text-gray-500">1.5</div>
                      <div className="text-xs text-gray-500 font-medium">1.0</div>
                    </div>
                    
                    {/* Y-axis title */}
                    <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 -rotate-90 origin-center">
                      <span className="text-xs font-semibold text-gray-600">GPA</span>
                    </div>
                    
                    {/* Chart grid */}
                    <div className="absolute top-0 left-10 right-0 bottom-8 border-l border-b border-gray-300 rounded-bl">
                      {/* Horizontal grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between">
                        <div className="w-full border-t border-gray-200"></div>
                        <div className="w-full border-t border-gray-100 border-dashed"></div>
                        <div className="w-full border-t border-gray-200"></div>
                        <div className="w-full border-t border-gray-100 border-dashed"></div>
                        <div className="w-full border-t border-gray-200"></div>
                        <div className="w-full border-t border-gray-100 border-dashed"></div>
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      
                      {/* Vertical grid lines */}
                      <div className="absolute inset-0">
                        {(() => {
                          const sortedTerms = [...new Set(distributions.map(d => d.term))].sort();
                          const count = sortedTerms.length;
                          
                          return Array.from({ length: count }).map((_, i) => {
                            const left = (i / (count - 1)) * 100;
                            return (
                              <div 
                                key={`vgrid-${i}`} 
                                className="absolute top-0 bottom-0 border-l border-gray-100 border-dashed"
                                style={{ left: `${left}%` }}
                              ></div>
                            );
                          });
                        })()}
                      </div>
                      
                      {/* Sorted terms on X-axis */}
                      {(() => {
                        const sortedTerms = [...new Set(distributions.map(d => d.term))].sort();
                        const width = 100 / Math.max(sortedTerms.length - 1, 1);
                        
                        return (
                          <>
                            {/* X-axis labels */}
                            <div className="absolute left-0 right-0 bottom-0 transform translate-y-8 flex justify-between px-6">
                              {sortedTerms.map((term, i) => (
                                <div 
                                  key={term} 
                                  className="text-xs text-gray-600 font-medium"
                                  style={{
                                    position: 'absolute',
                                    left: `${i * width}%`,
                                    transform: 'translateX(-50%) rotate(-25deg)',
                                    transformOrigin: 'top left'
                                  }}
                                >
                                  {term}
                                </div>
                              ))}
                            </div>
                            
                            {/* X-axis title */}
                            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-16">
                              <span className="text-xs font-semibold text-gray-600">Term</span>
                            </div>
                            
                            {/* Data points */}
                            {distributions.map((dist, idx) => {
                              const termIndex = sortedTerms.indexOf(dist.term);
                              const xPos = termIndex * width;
                              // Calculate y position (GPA 1.0-4.0 range mapped to 0-100%)
                              const yPos = 100 - ((dist.average_gpa - 1.0) / 3.0 * 100);
                              
                              // Determine color based on GPA
                              const dotColor = 
                                dist.average_gpa >= 3.7 ? 'bg-green-500' :
                                dist.average_gpa >= 3.0 ? 'bg-green-400' :
                                dist.average_gpa >= 2.3 ? 'bg-yellow-400' :
                                dist.average_gpa >= 1.7 ? 'bg-orange-400' :
                                'bg-red-400';
                              
                              // Calculate tooltip position adjustments for edge cases
                              const isLeftEdge = xPos < 25;
                              const isRightEdge = xPos > 75;
                              
                              return (
                                <motion.div 
                                  key={idx}
                                  className={`absolute w-5 h-5 ${dotColor} rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md border-2 border-white cursor-pointer group z-10`}
                                  style={{
                                    left: `${xPos}%`,
                                    top: `${yPos}%`
                                  }}
                                  whileHover={{ 
                                    scale: 1.3,
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                  }}
                                  title={`Term: ${dist.term}, GPA: ${dist.average_gpa.toFixed(2)}`}
                                >
                                  {/* Tooltip on hover */}
                                  <div 
                                    className={`invisible group-hover:visible absolute bg-gray-800 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-30 shadow-lg ${
                                      isLeftEdge ? 'left-0 top-7' : 
                                      isRightEdge ? 'right-0 top-7' : 
                                      'left-1/2 top-7 transform -translate-x-1/2'
                                    }`}
                                  >
                                    <div className="font-bold">{dist.term}</div>
                                    <div className="flex justify-between gap-3">
                                      <span>GPA:</span>
                                      <span className="font-medium">{dist.average_gpa.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                      <span>Grade:</span>
                                      <span className="font-medium">{getLetterGrade(dist.average_gpa)}</span>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                      <span>Students:</span>
                                      <span className="font-medium">{dist.enrollment}</span>
                                    </div>
                                    <div className={`absolute w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-800 ${
                                      isLeftEdge ? 'left-2 -top-2' : 
                                      isRightEdge ? 'right-2 -top-2' : 
                                      'left-1/2 -top-2 transform -translate-x-1/2'
                                    }`}></div>
                                  </div>
                                </motion.div>
                              );
                            })}
                            
                            {/* Connect dots with lines */}
                            <svg className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
                              <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#ef4444" />
                                  <stop offset="50%" stopColor="#eab308" />
                                  <stop offset="100%" stopColor="#22c55e" />
                                </linearGradient>
                              </defs>
                              {sortedTerms.map((term, i) => {
                                if (i === 0) return null;
                                
                                const prevTerm = sortedTerms[i-1];
                                const currDist = distributions.find(d => d.term === term);
                                const prevDist = distributions.find(d => d.term === prevTerm);
                                
                                if (!currDist || !prevDist) return null;
                                
                                const x1 = (i-1) * width;
                                const y1 = 100 - ((prevDist.average_gpa - 1.0) / 3.0 * 100);
                                const x2 = i * width;
                                const y2 = 100 - ((currDist.average_gpa - 1.0) / 3.0 * 100);
                                
                                return (
                                  <line 
                                    key={`${prevTerm}-${term}`}
                                    x1={`${x1}%`}
                                    y1={`${y1}%`}
                                    x2={`${x2}%`}
                                    y2={`${y2}%`}
                                    stroke="url(#lineGradient)"
                                    strokeWidth="2"
                                    strokeDasharray="5,3"
                                    opacity="0.7"
                                  />
                                );
                              })}
                            </svg>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-8 mb-2 flex flex-wrap gap-3 justify-center bg-gray-50 py-3 px-4 rounded-lg border border-gray-100">
                    <div className="flex items-center px-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2 shadow-sm"></div>
                      <span className="text-xs text-gray-700 font-medium">A (3.7-4.3)</span>
                    </div>
                    <div className="flex items-center px-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2 shadow-sm"></div>
                      <span className="text-xs text-gray-700 font-medium">B (3.0-3.7)</span>
                    </div>
                    <div className="flex items-center px-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2 shadow-sm"></div>
                      <span className="text-xs text-gray-700 font-medium">C (2.3-3.0)</span>
                    </div>
                    <div className="flex items-center px-2">
                      <div className="w-3 h-3 bg-orange-400 rounded-full mr-2 shadow-sm"></div>
                      <span className="text-xs text-gray-700 font-medium">D (1.7-2.3)</span>
                    </div>
                    <div className="flex items-center px-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2 shadow-sm"></div>
                      <span className="text-xs text-gray-700 font-medium">F (below 1.7)</span>
                    </div>
                  </div>
                  
                  {/* Instructions */}
                  <div className="mt-2 text-center text-xs text-gray-500">
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Hover over any dot to see detailed information
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  <p className="text-gray-500">No GPA data available for this course</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Course Distribution - Redesigned */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#00305f] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#d62839]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  Grade Distribution
                </h2>
                
                {/* Term selector */}
                <div className="relative">
                  <select
                    className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#d62839] bg-white text-gray-700 text-sm font-medium shadow-sm"
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                  >
                    {terms.map((term) => (
                      <option key={term} value={term}>{term}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {selectedDistribution || (course.id === '6' && distributions.length > 0) ? (
                <div>
                  {/* Bar chart */}
                  <div className="relative h-60 mb-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg pt-4 px-2 overflow-hidden">
                    {/* Bars */}
                    <div className="h-40 flex items-end justify-between relative">
                      {GRADE_LABELS.map((label, index) => {
                        const distribution = selectedDistribution || distributions[0];
                        const percentage = distribution.grade_counts[index];
                        
                        // Determine colors based on grade
                        const gradientColors = 
                          label === 'A+' || label === 'A' || label === 'A-' ? ['#22c55e', '#16a34a'] :
                          label === 'B+' || label === 'B' || label === 'B-' ? ['#84cc16', '#65a30d'] :
                          label === 'C+' || label === 'C' || label === 'C-' ? ['#eab308', '#ca8a04'] :
                          label === 'D+' || label === 'D' || label === 'D-' ? ['#f97316', '#ea580c'] :
                          ['#ef4444', '#dc2626'];
                        
                        // Calculate bar height - ensure it's at least 1px if percentage > 0
                        const barHeight = percentage > 0 ? Math.max(1, percentage * 2.5) : 0;
                        
                        return (
                          <div key={label} className="flex flex-col items-center justify-end h-full group relative">
                            {/* The bar itself - with min height for visibility */}
                            <div 
                              className={`w-7 rounded-t-md cursor-pointer hover:brightness-110 transition-all duration-200 relative overflow-visible ${
                                percentage > 0 && percentage < 3 ? 'min-h-[4px] bg-opacity-50' : ''
                              }`}
                              style={{ 
                                height: `${barHeight}%`,
                                background: `linear-gradient(to bottom, ${gradientColors[0]}, ${gradientColors[1]})`,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                              }}
                            >
                              {/* Highlight effect */}
                              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                              
                              {/* Percentage tooltip */}
                              {percentage > 0 && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20">
                                  <div className="bg-gray-800 text-white text-xs font-bold py-1 px-2 rounded shadow-md whitespace-nowrap">
                                    {percentage.toFixed(1)}%
                                  </div>
                                  {/* Small triangle pointer */}
                                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 mx-auto"></div>
                                </div>
                              )}
                            </div>
                            
                            {/* Grade label */}
                            <div className="text-xs text-gray-700 mt-2 font-medium">{label}</div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Bottom label */}
                    <div className="text-center text-sm text-gray-500 mt-6 mb-2">Grade Distribution</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <div className="text-sm font-medium text-[#00305f] mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                        Distribution Breakdown
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        {GRADE_LABELS.map((label, index) => {
                          const distribution = selectedDistribution || distributions[0];
                          const percentage = distribution.grade_counts[index];
                          if (percentage > 0) {
                            // Define gradient colors for each grade type
                            const gradientColors = 
                              label === 'A+' || label === 'A' || label === 'A-' ? ['#22c55e', '#16a34a'] :
                              label === 'B+' || label === 'B' || label === 'B-' ? ['#84cc16', '#65a30d'] :
                              label === 'C+' || label === 'C' || label === 'C-' ? ['#eab308', '#ca8a04'] :
                              label === 'D+' || label === 'D' || label === 'D-' ? ['#f97316', '#ea580c'] :
                              ['#ef4444', '#dc2626'];
                            
                            return (
                              <div key={label} className="flex items-center">
                                <div className="w-3 h-3 rounded-sm mr-2 bg-gradient-to-br" style={{ 
                                  background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`
                                }}></div>
                                <div className="text-sm">
                                  <span className="font-medium text-gray-800">{label}:</span>
                                  <span className="ml-1 text-gray-500">{percentage.toFixed(1)}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <div className="text-sm font-medium text-[#00305f] mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Term Insights
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 rounded bg-white shadow-sm">
                          <span className="text-gray-500">Average GPA:</span>
                          <span className={`font-medium ${getGpaColorClass(selectedDistribution ? selectedDistribution.average_gpa : 0)}`}> 
                            {selectedDistribution ? selectedDistribution.average_gpa.toFixed(2) : 'N/A'}
                            {selectedDistribution ? ` (${getLetterGrade(selectedDistribution.average_gpa)})` : ''}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-white shadow-sm">
                          <span className="text-gray-500">Enrollment:</span>
                          <span className="font-medium text-gray-800">
                            {selectedDistribution ? selectedDistribution.enrollment : distributions[0].enrollment}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-white shadow-sm">
                          <span className="text-gray-500">Term:</span>
                          <span className="font-medium text-gray-800">{selectedTerm}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  <p className="text-gray-500">No distribution data available for the selected term.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back to courses button */}
        <div className="mt-10 text-center">
          <Link 
            href="/schools/queens" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#d62839] to-[#b5212e] text-white rounded-full hover:from-[#b5212e] hover:to-[#d62839] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Return to Courses List
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
} 