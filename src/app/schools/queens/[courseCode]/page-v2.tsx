'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCourseByCode } from '@/lib/db';
import type { CourseWithStats, GradeDistribution } from '@/types';

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
  const courseCode = params?.courseCode ? (params.courseCode as string).replace(/-/g, ' ').toUpperCase() : '';
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [course, setCourse] = useState<CourseWithStats | null>(null);
  
  // Fetch data from Supabase
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        // Fetch course data
        const courseData = await getCourseByCode(courseCode);
        if (!courseData) {
          setError(`Course ${courseCode} not found`);
          setLoading(false);
          return;
        }
        
        setCourse(courseData);
        
        // Set default selected term to the most recent
        if (courseData.distributions && courseData.distributions.length > 0) {
          setSelectedTerm(courseData.distributions[0].term);
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
  const terms = Array.from(new Set(course.distributions.map(dist => dist.term))).sort((a, b) => {
    // Sort terms by year and term
    return b.localeCompare(a);
  });
  
  // Find the distribution for the selected term
  const selectedDistribution = course.distributions.find(dist => dist.term === selectedTerm);
  
  // Check if course has distributions
  const hasDistributions = course.distributions.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Course Header - Modern Design */}
        <div className="relative mb-10 bg-gradient-to-r from-[#00305f] to-[#004d99] rounded-xl shadow-lg p-8 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-white opacity-5 rounded-full -mb-20"></div>
          
          {course.department && (
            <span className="inline-block px-3 py-1 bg-[#d62839]/90 text-white text-sm font-medium rounded-full mb-4">
              {course.department.replace(/^Offering Faculty:/, '')}
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
              {course.department && (
                <li className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150">
                  <span className="text-gray-500">Faculty:</span>
                  <span className="text-gray-900 font-medium">{course.department.replace(/^Offering Faculty:/, '')}</span>
                </li>
              )}
              <li className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150">
                <span className="text-gray-500">Credits:</span>
                <span className="text-gray-900 font-medium">{course.credits}</span>
              </li>
              <li className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150">
                <span className="text-gray-500">Available Terms:</span>
                <span className="text-gray-900 font-medium">{terms.length}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden group relative">
            {/* Rest of the card content will go here in the next update */}
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden group relative">
            {/* Rest of the card content will go here in the next update */}
          </div>
        </div>
        
        {/* Charts section will go here in the next update */}
        
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
    </div>
  );
} 