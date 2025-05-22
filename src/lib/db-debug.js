// CommonJS module for debugging
const { createClient } = require('@supabase/supabase-js');

// Hardcode the values to ensure we're connecting to the right database
const supabaseUrl = "https://kpjnsppbmyfrchhbnnjd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwam5zcHBibXlmcmNoaGJubmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NzE5NjEsImV4cCI6MjA2MDI0Nzk2MX0._dQiEyVbqG9bf7vC8CVrodrV773_DqD3r-9ttH9CvWw";

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debug function to inspect database structure
async function debugDatabaseStructure() {
  try {
    console.log("Connected to Supabase URL:", supabaseUrl);
    
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
    } else {
      console.log("No course_distributions found");
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
    } else {
      console.log("No courses found");
    }
    
    // Count the number of courses
    const { count: coursesCount, error: countError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error("Error counting courses:", countError);
    } else {
      console.log("Total courses count:", coursesCount);
    }
  } catch (e) {
    console.error("Exception in debugDatabaseStructure:", e);
  }
}

// Run the debug function
debugDatabaseStructure()
  .then(() => console.log("Debug complete"))
  .catch(err => console.error("Error:", err)); 