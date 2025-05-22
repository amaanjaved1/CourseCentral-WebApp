'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getCourseByCode, getCourseDistributions, getDirectCourseDescription, debugDatabaseStructure, getRedditCommentsForCourse, getRateMyProfCommentsForCourse, getRedditCommentsRawSQL, fetchRedditCommentsDirect, fetchRateMyProfCommentsDirect, getRateMyProfRawSQL } from '@/lib/db';
import { Course, GradeDistribution, RagComment } from '@/types';

// Grade labels
const GRADE_LABELS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const GPA_VALUES = [4.3, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0.0];

// Animation constants
const ANIMATION_CONFIG = {
  duration: 0.4,
  ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for smooth easing
  staggerChildren: 0.1
};

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
  const [redditComments, setRedditComments] = useState<RagComment[]>([]);
  const [rateMyProfComments, setRateMyProfComments] = useState<RagComment[]>([]);
  const [distributionsLoading, setDistributionsLoading] = useState<boolean>(true);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(true);
  
  // Enhanced animations for individual elements
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: ANIMATION_CONFIG.duration, 
        ease: ANIMATION_CONFIG.ease 
      } 
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: ANIMATION_CONFIG.duration, 
        ease: ANIMATION_CONFIG.ease
      }
    }
  };
  
  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: ANIMATION_CONFIG.duration,
        ease: ANIMATION_CONFIG.ease
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: ANIMATION_CONFIG.staggerChildren,
        delayChildren: 0.1
      }
    }
  };
  
  // Fetch data from Supabase
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setDistributionsLoading(true);
        setCommentsLoading(true);
        
        // Fetch course data
        const courseData = await getCourseByCode(courseCode);
        if (!courseData) {
          setError(`Course ${courseCode} not found`);
          setLoading(false);
          return;
        }
        
        // Set course data first to display basic info while other data loads
        setCourse(courseData);
        
        // Set loading to false immediately after getting the basic course data
        setLoading(false);
        
        // Continue loading other data in the background
        Promise.all([
          getCourseDistributions(courseData.id),
          getDirectCourseDescription(courseCode).catch(err => {
            console.error("Error getting direct description:", err);
            return null;
          }),
          getRedditCommentsForCourse(courseCode).catch(err => {
            console.error("Error fetching Reddit comments:", err);
            return [];
          }),
          getRateMyProfCommentsForCourse(courseCode).catch(err => {
            console.error("Error fetching RateMyProf comments:", err);
            return [];
          })
        ]).then(([distributionsData, directDescription, redditData, rmpData]) => {
          // Update course description if available
          if (directDescription) {
            setCourse(prevCourse => 
              prevCourse ? { ...prevCourse, description: directDescription } : prevCourse
            );
          }
          
          // Update distributions with smooth transition
          setTimeout(() => {
            setDistributions(distributionsData);
            setDistributionsLoading(false);
          }, 100);
        
        // Set default selected term to the most recent
        if (distributionsData.length > 0) {
          setSelectedTerm(distributionsData[0].term);
        }
        
          // Set comments with smooth transition
          setTimeout(() => {
            setRedditComments(redditData);
            setRateMyProfComments(rmpData);
            setCommentsLoading(false);
          }, 200);
          
          // Load fallback data asynchronously
        if (!redditData || redditData.length === 0) {
            getRedditCommentsRawSQL(courseCode)
              .then(rawSqlData => {
            if (rawSqlData && rawSqlData.length > 0) {
                  setRedditComments(rawSqlData);
            } else {
                  return fetchRedditCommentsDirect(courseCode);
                }
              })
              .then(directData => {
              if (directData && directData.length > 0) {
                  setRedditComments(directData);
                }
              })
              .catch(err => console.error("Error with fallback Reddit methods:", err));
          }
          
        if (!rmpData || rmpData.length === 0) {
            fetchRateMyProfCommentsDirect(courseCode)
              .then(directData => {
            if (directData && directData.length > 0) {
                  setRateMyProfComments(directData);
            } else {
                  return getRateMyProfRawSQL(courseCode);
                }
              })
              .then(rawSqlData => {
              if (rawSqlData && rawSqlData.length > 0) {
                  setRateMyProfComments(rawSqlData);
                }
              })
              .catch(err => console.error("Error with fallback RateMyProf methods:", err));
          }
        }).catch(err => {
          console.error('Error fetching additional course data:', err);
          setDistributionsLoading(false);
          setCommentsLoading(false);
        });
        
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('An error occurred while fetching course data');
        setLoading(false);
        setDistributionsLoading(false);
        setCommentsLoading(false);
      }
    };
    
    if (courseCode) {
      fetchCourseData();
    }
  }, [courseCode]);
  
  // If loading, show a loading message with a limited timeout
  useEffect(() => {
    // If loading takes more than 3 seconds, force exit loading state
    if (loading) {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  // Similar timeout for distribution data
  useEffect(() => {
    if (distributionsLoading) {
      const timeout = setTimeout(() => {
        setDistributionsLoading(false);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [distributionsLoading]);
  
  // Similar timeout for comments data
  useEffect(() => {
    if (commentsLoading) {
      const timeout = setTimeout(() => {
        setCommentsLoading(false);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [commentsLoading]);
  
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
        {/* Course Header with entrance animation */}
        <motion.div 
          className="relative mb-10 bg-gradient-to-r from-[#00305f] to-[#004d99] rounded-xl shadow-lg p-8 text-white overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={fadeInScale}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-white opacity-5 rounded-full -mb-20"></div>
          
          {course?.offering_faculty && (
            <span className="inline-block px-3 py-1 bg-[#d62839]/90 text-white text-sm font-medium rounded-full mb-4">
              {course.offering_faculty.replace(/^Offering Faculty:/, '')}
            </span>
          )}
          
          <h1 className="text-4xl font-bold mb-3 flex items-center">
            {course?.course_code}
          </h1>
          
          <h2 className="text-2xl font-medium text-white/90 mb-6">{course?.course_name}</h2>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium text-white mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Course Description
            </h3>
            <div className="text-white/80 max-w-3xl backdrop-blur-sm bg-white/5 p-4 rounded-lg border border-white/10 min-h-[80px]">
              {course?.description ? (
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
        </motion.div>

        {/* Details & Stats Section with staggered animations */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden group relative"
            variants={fadeInUp}
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
            <h3 className="text-lg font-semibold mb-4 text-[#00305f] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#d62839]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Course Details
            </h3>
            <ul className="space-y-3 flex-1">
              {course?.offering_faculty && (
                <li className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150">
                  <span className="text-gray-500">Faculty:</span>
                  <span className="text-gray-900 font-medium">{course.offering_faculty.replace(/^Offering Faculty:/, '')}</span>
                </li>
              )}
              <li className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150">
                <span className="text-gray-500">Credits:</span>
                <span className="text-gray-900 font-medium">{course?.credits || course?.course_units || 0}</span>
              </li>
              <li className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150">
                <span className="text-gray-500">Available Terms:</span>
                <span className="text-gray-900 font-medium">{terms.length || "Loading..."}</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden group relative"
            variants={fadeInUp}
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
            <h3 className="text-lg font-semibold mb-4 text-[#00305f] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#d62839]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H6a1 1 0 01-1-1V2zm2 1v8h6V3H7zm8 11v4h2v-4h-2zm-8 4v-4H5v4h2z" clipRule="evenodd" />
              </svg>
              Prerequisites
            </h3>
            <div className="p-3 rounded-lg bg-gray-50 text-gray-700 flex-1 flex items-center justify-center hover:bg-gray-100 transition-all duration-300">
              {course?.course_requirements ? (
                <p>{course.course_requirements.replace(/^Requirements:/, '')}</p>
              ) : (
                <p>No specific requirements listed.</p>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden group relative"
            variants={fadeInUp}
          >
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
          </motion.div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Add back the course data sections here - to be added in a separate edit */}
        </div>

        {/* Reddit & RateMyProf Comments Section with staggered entrance */}
        <motion.div 
          className="mt-12 mb-16 max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <motion.h2 
            className="text-3xl font-bold mb-8 text-[#00305f] text-center"
            variants={fadeInUp}
          >
            Wanna see what people on ratemyprof and reddit are saying?
          </motion.h2>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
            variants={staggerContainer}
          >
            {/* Reddit Comments section */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              variants={fadeInUp}
            >
              <div className="bg-gradient-to-r from-[#FF4500] to-[#FF6A00] py-4 px-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="white">
                    <path d="M14.5 15.41C14.5 15.77 14.39 16.09 14.18 16.29C13.97 16.5 13.66 16.59 13.3 16.59C12.94 16.59 12.62 16.5 12.42 16.29C12.21 16.09 12.1 15.77 12.1 15.41C12.1 15.05 12.21 14.73 12.42 14.53C12.62 14.32 12.94 14.21 13.3 14.21C13.66 14.21 13.97 14.32 14.18 14.53C14.39 14.73 14.5 15.05 14.5 15.41ZM10.8 15.41C10.8 15.77 10.69 16.09 10.48 16.29C10.27 16.5 9.95 16.59 9.6 16.59C9.24 16.59 8.92 16.5 8.72 16.29C8.5 16.09 8.4 15.77 8.4 15.41C8.4 15.05 8.5 14.73 8.72 14.53C8.92 14.32 9.24 14.21 9.6 14.21C9.95 14.21 10.27 14.32 10.48 14.53C10.69 14.73 10.8 15.05 10.8 15.41ZM21.1 12C21.1 14.07 20.19 15.91 18.8 17.3C17.4 18.69 15.56 19.61 13.5 19.61C11.44 19.61 9.59 18.69 8.2 17.3C6.81 15.91 5.9 14.07 5.9 12C5.9 9.93 6.81 8.09 8.2 6.7C9.59 5.31 11.44 4.39 13.5 4.39C15.56 4.39 17.4 5.31 18.8 6.7C20.19 8.09 21.1 9.93 21.1 12ZM18.11 12C18.11 11.69 18.08 11.38 18.01 11.09C17.04 11.09 15.34 11.09 14.56 9.5C14.56 7.35 15.82 5.17 15.96 5C15.07 4.71 14.12 4.56 13.13 4.56C10.41 4.56 7.97 5.77 6.51 7.7C8.09 8.07 9.29 9.5 9.29 11.19C9.29 12.93 7.95 14.37 6.25 14.64C6.83 15.87 7.89 16.88 9.21 17.5C10.55 18.12 12.1 18.24 13.53 17.92C14.97 17.6 16.23 16.85 17.07 15.77C17.91 14.7 18.27 13.38 18.11 12.05V12ZM17.71 9.11C17.49 9.31 17.2 9.41 16.89 9.41C16.59 9.41 16.3 9.31 16.09 9.11C15.88 8.91 15.77 8.62 15.77 8.32C15.77 8.02 15.88 7.72 16.09 7.51C16.3 7.3 16.59 7.2 16.89 7.2C17.2 7.2 17.49 7.3 17.71 7.51C17.91 7.72 18.01 8.02 18.01 8.32C18.01 8.62 17.91 8.91 17.71 9.11ZM4.5 7.12C4.5 8.15 5.35 9 6.38 9C7.4 9 8.25 8.15 8.25 7.12C8.25 6.09 7.4 5.25 6.38 5.25C5.35 5.25 4.5 6.09 4.5 7.12Z"/>
                  </svg>
                  Recent Reddit Comments
                </h3>
              </div>

              <div className="p-6 min-h-[200px]">
                {redditComments.length > 0 ? (
                  <div className="space-y-5">
                    {redditComments.slice(0, 2).map((comment, index) => (
                      <div key={index} className="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-200">
                        <p className="text-gray-700 text-base font-medium leading-relaxed mb-4">{comment.text}</p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {comment.professor_name && (
                              <span className="text-xs font-semibold bg-orange-50 text-orange-700 px-3 py-1 rounded-full mr-2">
                                Prof: {comment.professor_name}
                              </span>
                            )}
                            {comment.sentiment_label && (
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${comment.sentiment_label === 'positive' ? 'bg-green-50 text-green-700' : 
                                  comment.sentiment_label === 'negative' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                {comment.sentiment_label.charAt(0).toUpperCase() + comment.sentiment_label.slice(1)}
                              </span>
                            )}
                          </div>
                          
                          <a 
                            href={comment.source_url || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-4 py-1.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-sm hover:shadow flex items-center space-x-1 transform group-hover:translate-x-0.5"
                          >
                            <span>View</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No Reddit comments available for this course.</p>
                    <p className="text-gray-400 text-sm mt-1">Check back soon for student insights!</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* RateMyProf Comments */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              variants={fadeInUp}
            >
              <div className="bg-gradient-to-r from-[#2E5090] to-[#4A6DB5] py-4 px-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  RateMyProf Comments
                </h3>
              </div>

              <div className="p-6 min-h-[200px]">
                {rateMyProfComments.length > 0 ? (
                  <div className="space-y-5">
                    {rateMyProfComments.slice(0, 2).map((comment, index) => (
                      <div key={index} className="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
                        <p className="text-gray-700 text-base font-medium leading-relaxed mb-4">{comment.text}</p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex flex-wrap gap-2 items-center">
                            {comment.professor_name && (
                              <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                Prof: {comment.professor_name}
                              </span>
                            )}
                            {comment.quality_rating && (
                              <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                                <span>Quality: {comment.quality_rating}/5</span>
                              </span>
                            )}
                            {comment.difficulty_rating && (
                              <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1 rounded-full flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M3.055 13H5a2 2 0 012 2v3a2 2 0 01-2 2H3.055c-.366 1.39-1.478 2.5-2.869 2.866.677-1.393 1.484-2.14 2.869-5.866zM22 13.5V17h-6.5A2.5 2.5 0 0013 14.5V13h9zm-9-5V7h6.5a2.5 2.5 0 012.5 2.5V11h-9zM3.5 8A4.5 4.5 0 018 3.5h8A4.5 4.5 0 0120.5 8h-17z"/>
                                </svg>
                                <span>Difficulty: {comment.difficulty_rating}/5</span>
                              </span>
                            )}
                          </div>
                          
                          <a 
                            href={comment.source_url || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow flex items-center space-x-1 transform group-hover:translate-x-0.5"
                          >
                            <span>View</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No RateMyProf comments available for this course.</p>
                    <p className="text-gray-400 text-sm mt-1">Check back soon for professor reviews!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Talk with our chatbot */}
          <motion.div 
            className="relative flex flex-col items-center justify-center mt-12 mb-6 bg-gradient-to-br from-white to-blue-50 py-10 px-8 rounded-2xl shadow-md overflow-hidden border border-gray-100"
            variants={fadeInUp}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d62839] to-[#00305f]"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#00305f]/5 rounded-full"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#d62839]/5 rounded-full"></div>
            
            <h3 className="text-2xl font-bold mb-4 text-[#00305f] relative z-10">Talk with our chatbot to get more insights!</h3>
            <p className="text-gray-600 mb-6 max-w-lg text-center relative z-10">Our AI assistant can answer questions about courses, professors, and help you make informed decisions about your academic path.</p>
            
            <a 
              href="/ai-features" 
              className="relative z-10 inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-[#d62839] to-[#b5212e] text-white rounded-lg hover:from-[#b5212e] hover:to-[#d62839] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-semibold tracking-wide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Visit Chatbot
            </a>
          </motion.div>
        </motion.div>

        {/* Back to courses button */}
        <motion.div 
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Link 
            href="/schools/queens" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#d62839] to-[#b5212e] text-white rounded-full hover:from-[#b5212e] hover:to-[#d62839] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Return to Courses List
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
} 