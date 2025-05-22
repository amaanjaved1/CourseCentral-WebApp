import { supabase } from './supabase';
import { Course, GradeDistribution, Professor, ensureCourseFields } from '@/types';

// Course utilities
export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('course_distributions')
    .select(`
      *,
      courses:course_id (*)
    `)
    .order('term', { ascending: false });

  if (error) {
    console.error('Error fetching courses with distributions:', error);
    return [];
  }

  // Process the joined data to return course objects with their distributions
  const coursesMap = new Map();

  data?.forEach(distribution => {
    const course = distribution.courses;

    if (course && !coursesMap.has(course.id)) {
      coursesMap.set(course.id, {
        ...course,
        distributions: [],
        average_gpa: 0,
        average_enrollment: 0
      });
    }

    if (course) {
      const courseData = coursesMap.get(course.id);
      courseData.distributions.push(distribution);

      // Recalculate averages
      const totalGPA = courseData.distributions.reduce((sum: number, dist: GradeDistribution) => sum + dist.average_gpa, 0);
      const totalEnrollment = courseData.distributions.reduce((sum: number, dist: GradeDistribution) => sum + dist.enrollment, 0);

      courseData.average_gpa = totalGPA / courseData.distributions.length;
      courseData.average_enrollment = totalEnrollment / courseData.distributions.length;

      coursesMap.set(course.id, courseData);
    }
  });

  return Array.from(coursesMap.values());
}

export async function getCourseByCode(courseCode: string): Promise<Course | null> {
  try {
    // Get the basic course data
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('course_code', courseCode)
      .single();
    
    if (error) {
      console.error(`Error fetching course with code ${courseCode}:`, error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // Now fetch the distributions to calculate averages
    const { data: distributions, error: distError } = await supabase
      .from('course_distributions')
      .select('*')
      .eq('course_id', data.id)
      .order('term', { ascending: false });
    
    if (!distError && distributions && distributions.length > 0) {
      // Calculate average GPA and enrollment
      const totalGPA = distributions.reduce((sum: number, dist: any) => sum + dist.average_gpa, 0);
      const totalEnrollment = distributions.reduce((sum: number, dist: any) => sum + dist.enrollment, 0);
      
      data.average_gpa = totalGPA / distributions.length;
      data.average_enrollment = Math.round(totalEnrollment / distributions.length);
    }
    
    return ensureCourseFields(data);
  } catch (e) {
    console.error("Exception in getCourseByCode:", e);
    return null;
  }
}

// Grade distributions utilities
export async function getCourseDistributions(courseId: string): Promise<GradeDistribution[]> {
  const { data, error } = await supabase
    .from('course_distributions')
    .select('*')
    .eq('course_id', courseId)
    .order('term', { ascending: false });

  if (error) {
    console.error(`Error fetching distributions for course ${courseId}:`, error);
    return [];
  }
  
  // Log the first result to see all available fields
  if (data && data.length > 0) {
    console.log("Distribution data fields:", Object.keys(data[0]));
  }

  return data || [];
}

export async function getDistributionsByTerm(courseId: string, term: string): Promise<GradeDistribution | null> {
  const { data, error } = await supabase
    .from('course_distributions')
    .select('*')
    .eq('course_id', courseId)
    .eq('term', term)
    .single();

  if (error) {
    console.error(`Error fetching distribution for course ${courseId} in term ${term}:`, error);
    return null;
  }

  return data;
}

// Professor utilities
export async function getProfessors(): Promise<Professor[]> {
  const { data, error } = await supabase
    .from('professors')
    .select('*');

  if (error) {
    console.error('Error fetching professors:', error);
    return [];
  }

  return data || [];
}

export async function getProfessorById(id: string): Promise<Professor | null> {
  const { data, error } = await supabase
    .from('professors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching professor with id ${id}:`, error);
    return null;
  }

  return data;
}

// Helper functions for calculating statistics
export async function calculateAverageGPA(courseId: string): Promise<number> {
  const distributions = await getCourseDistributions(courseId);

  if (distributions.length === 0) return 0;

  const sum = distributions.reduce((acc, dist) => acc + dist.average_gpa, 0);
  return sum / distributions.length;
}

export async function getRecentTerms(courseId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('course_distributions')
    .select('term')
    .eq('course_id', courseId)
    .order('term', { ascending: false });

  if (error) {
    console.error(`Error fetching terms for course ${courseId}:`, error);
    return [];
  }

  return (data || []).map(item => item.term);
}

// Add a new function to get the raw structure of the tables
export async function getDatabaseInfo() {
  try {
    // Get course_distributions structure
    const { data: distData, error: distError } = await supabase
      .from('course_distributions')
      .select('*')
      .limit(1);
      
    if (distError) {
      console.error("Error getting course_distributions:", distError);
    } else if (distData && distData.length > 0) {
      console.log("course_distributions fields:", Object.keys(distData[0]));
      console.log("Sample data:", JSON.stringify(distData[0]));
    }
    
    // Get courses structure
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);
      
    if (courseError) {
      console.error("Error getting courses:", courseError);
    } else if (courseData && courseData.length > 0) {
      console.log("courses fields:", Object.keys(courseData[0]));
      console.log("Sample data:", JSON.stringify(courseData[0]));
    }
    
    // Try a join
    const { data: joinData, error: joinError } = await supabase
      .from('course_distributions')
      .select('*, courses!inner(*)')
      .limit(1);
      
    if (joinError) {
      console.error("Error with join:", joinError);
    } else if (joinData && joinData.length > 0) {
      console.log("Join result:", joinData[0]);
    }
    
    return true;
  } catch (e) {
    console.error("Exception in getDatabaseInfo:", e);
    return false;
  }
}

// Function that uses raw SQL to get course description
export async function getCourseDescriptionByCode(courseCode: string) {
  try {
    const { data, error } = await supabase.rpc('get_course_description', { course_code: courseCode });
    
    if (error) {
      console.error("Error executing raw SQL:", error);
      
      // Fallback to direct SQL
      const { data: sqlData, error: sqlError } = await supabase
        .from('course_distributions')
        .select('course_description')
        .eq('course_id', 
          supabase
            .from('courses')
            .select('id')
            .eq('course_code', courseCode)
        )
        .limit(1);
        
      if (sqlError) {
        console.error("Error with fallback SQL:", sqlError);
        return null;
      }
      
      if (sqlData && sqlData.length > 0) {
        return sqlData[0].course_description;
      }
      
      return null;
    }
    
    return data;
  } catch (e) {
    console.error("Exception in getCourseDescriptionByCode:", e);
    return null;
  }
}

// Function to get course description directly
export async function getDirectCourseDescription(courseCode: string): Promise<string | null> {
  try {
    // First get the course ID
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('course_code', courseCode)
      .single();
    
    if (courseError || !courseData) {
      console.error("Error getting course ID:", courseError);
      return null;
    }
    
    // Now directly query the course_distributions table
    const { data, error } = await supabase
      .from('course_distributions')
      .select('*') // Select all columns to see what's available
      .eq('course_id', courseData.id)
      .limit(1);
    
    if (error) {
      console.error("Error getting course distribution:", error);
      return null;
    }
    
    // Debug the data to find the column name
    if (data && data.length > 0) {
      console.log("Distribution columns:", Object.keys(data[0]));
      console.log("First distribution data:", data[0]);
      
      // Check for known possible field names
      const fields = ['course_description', 'description', 'info', 'details'];
      for (const field of fields) {
        if (data[0][field]) {
          console.log(`Found description in field: ${field}`, data[0][field]);
          return data[0][field];
        }
      }
    }
    
    return null;
  } catch (e) {
    console.error("Exception in getDirectCourseDescription:", e);
    return null;
  }
}

// Debug function to inspect database structure
export async function debugDatabaseStructure(): Promise<void> {
  try {
    // Get course_distributions structure
    const { data: distData, error: distError } = await supabase
      .from('course_distributions')
      .select('*')
      .limit(1);
      
    if (distError) {
      console.error("Error getting course_distributions:", distError);
    } else if (distData && distData.length > 0) {
      console.log("course_distributions fields:", Object.keys(distData[0]));
      console.log("course_distributions sample:", distData[0]);
    }
    
    // Get courses structure
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);
      
    if (courseError) {
      console.error("Error getting courses:", courseError);
    } else if (courseData && courseData.length > 0) {
      console.log("courses fields:", Object.keys(courseData[0]));
      console.log("courses sample:", courseData[0]);
    }
    
    // Try a raw SQL query to get description
    const { error: sqlError } = await supabase.rpc('get_table_structure', {
      table_name: 'course_distributions'
    });
    
    if (sqlError) {
      console.error("SQL error:", sqlError);
    }
    
  } catch (e) {
    console.error("Exception in debugDatabaseStructure:", e);
  }
}

// Function to fetch Reddit comments for a course
export async function getRedditCommentsForCourse(courseCode: string): Promise<any[]> {
  try {
    // Using raw SQL query exactly as specified
    const { data, error } = await supabase
      .from('rag_chunks')
      .select('text, professor_name, source_url, tags, upvotes, sentiment_label')
      .eq('course_code', courseCode)
      .eq('SOURCE', 'reddit') // Changed from 'source' to 'SOURCE' (uppercase)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching Reddit comments for course ${courseCode}:`, error);
      console.error("SQL query error details:", JSON.stringify(error));
      return [];
    }

    console.log(`Retrieved ${data?.length || 0} Reddit comments for ${courseCode}`);
    return data || [];
  } catch (e) {
    console.error(`Exception in getRedditCommentsForCourse for ${courseCode}:`, e);
    return [];
  }
}

// Function to fetch RateMyProf comments for a course
export async function getRateMyProfCommentsForCourse(courseCode: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('rag_chunks')
      .select('text, professor_name, source_url, sentiment_label, tags, quality_rating, difficulty_rating')
      .eq('course_code', courseCode)
      .eq('SOURCE', 'ratemyprofessors') // Changed from 'ratemyprof' to 'ratemyprofessors'
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching RateMyProf comments for course ${courseCode}:`, error);
      console.error("SQL query error details:", JSON.stringify(error));
      return [];
    }

    console.log(`Retrieved ${data?.length || 0} RateMyProf comments for ${courseCode}`);
    return data || [];
  } catch (e) {
    console.error(`Exception in getRateMyProfCommentsForCourse for ${courseCode}:`, e);
    return [];
  }
}

// Direct query approach for RateMyProf comments
export async function fetchRateMyProfCommentsDirect(courseCode: string): Promise<any[]> {
  try {
    // This is the exact query as specified by the user
    const { data, error } = await supabase
      .from('rag_chunks')
      .select('text, professor_name, source_url, sentiment_label, tags, quality_rating, difficulty_rating')
      .filter('course_code', 'eq', courseCode)
      .filter('SOURCE', 'eq', 'ratemyprofessors')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Direct query error for RateMyProf ${courseCode}:`, error);
      return [];
    }

    console.log(`Direct query found ${data?.length || 0} RateMyProf results`);
    return data || [];
  } catch (e) {
    console.error(`Exception in fetchRateMyProfCommentsDirect for ${courseCode}:`, e);
    return [];
  }
}

// Function to directly execute the raw SQL query for Reddit comments
export async function getRedditCommentsRawSQL(courseCode: string): Promise<any[]> {
  try {
    const { data, error } = await supabase.rpc('get_reddit_comments', { course_code_param: courseCode });

    if (error) {
      console.error(`Error executing raw SQL for Reddit comments for ${courseCode}:`, error);
      
      // Fallback to direct SQL query without the RPC
      const query = `
        SELECT text, professor_name, source_url, tags, upvotes, sentiment_label
        FROM rag_chunks
        WHERE course_code = '${courseCode}' AND SOURCE = 'reddit'
        ORDER BY created_at DESC
      `;
      
      const { data: sqlData, error: sqlError } = await supabase.rpc('execute_sql', { query_text: query });
      
      if (sqlError) {
        console.error("Error with fallback SQL:", sqlError);
        return [];
      }
      
      console.log("Raw SQL results:", sqlData);
      return sqlData || [];
    }

    return data || [];
  } catch (e) {
    console.error(`Exception in getRedditCommentsRawSQL for ${courseCode}:`, e);
    return [];
  }
}

// Direct SQL query approach for Reddit comments
export async function fetchRedditCommentsDirect(courseCode: string): Promise<any[]> {
  try {
    // This is the exact query as specified by the user
    const { data, error } = await supabase
      .from('rag_chunks')
      .select('text, professor_name, source_url, tags, upvotes, sentiment_label')
      .filter('course_code', 'eq', courseCode)
      .filter('SOURCE', 'eq', 'reddit')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Direct query error for ${courseCode}:`, error);
      return [];
    }

    console.log(`Direct query found ${data?.length || 0} results`);
    return data || [];
  } catch (e) {
    console.error(`Exception in fetchRedditCommentsDirect for ${courseCode}:`, e);
    return [];
  }
}

// Function to execute raw SQL for RateMyProf comments
export async function getRateMyProfRawSQL(courseCode: string): Promise<any[]> {
  try {
    // Create the raw SQL query exactly as specified by the user
    const query = `
      SELECT text, professor_name, source_url, sentiment_label, tags, quality_rating, difficulty_rating
      FROM rag_chunks
      WHERE course_code = '${courseCode}' AND SOURCE = 'ratemyprofessors'
      ORDER BY created_at DESC
    `;
    
    // Try to execute the query using a stored procedure if available
    try {
      const { data, error } = await supabase.rpc('execute_sql', { query_text: query });
      
      if (!error && data && data.length > 0) {
        console.log(`Raw SQL found ${data.length} RateMyProf results`);
        return data;
      }
    } catch (rpcError) {
      console.error("RPC error:", rpcError);
      // Continue to fallback methods
    }
    
    // If RPC fails, try a more direct approach with the Supabase client
    const { data, error } = await supabase
      .from('rag_chunks')
      .select('text, professor_name, source_url, sentiment_label, tags, quality_rating, difficulty_rating')
      .eq('course_code', courseCode)
      .eq('SOURCE', 'ratemyprofessors')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Final attempt error for RateMyProf ${courseCode}:`, error);
      return [];
    }
    
    console.log(`Final attempt found ${data?.length || 0} RateMyProf results`);
    return data || [];
  } catch (e) {
    console.error(`Exception in getRateMyProfRawSQL for ${courseCode}:`, e);
    return [];
  }
} 