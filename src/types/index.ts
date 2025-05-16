// Define the types based on your database schema
export interface Course {
  id: string;
  course_code: string;
  course_name: string;
  description?: string;
  credits: number;
  department: string;
  offering_faculty?: string;
  learning_hours?: string;
  course_learning_outcomes?: string;
  course_requirements?: string;
  course_equivalencies?: string;
  course_units?: number;
  average_gpa?: number;
  average_enrollment?: number;
  created_at: string;
}

// Helper function to set default values for optional course fields
export function ensureCourseFields(course: Course): Course {
  return {
    ...course,
    description: course.description || '',
    department: course.department || '',
    credits: course.credits || 0,
    offering_faculty: course.offering_faculty || '',
    learning_hours: course.learning_hours || '',
    course_learning_outcomes: course.course_learning_outcomes || '',
    course_requirements: course.course_requirements || '',
    course_equivalencies: course.course_equivalencies || '',
    course_units: course.course_units || 0,
    average_gpa: course.average_gpa || 0,
    average_enrollment: course.average_enrollment || 0
  };
}

export interface GradeDistribution {
  id: number;
  course_id: string;
  term: string;
  enrollment: number;
  average_gpa: number;
  created_at: string;
  grade_counts: number[]; // Array of grade percentages
  course_description?: string;
  offering_faculty?: string;
}

export interface Professor {
  id: string;
  name: string;
  overall_rating?: number;
  percent_retake?: number;
  level_of_difficulty?: number;
  num_ratings?: number;
  url?: string;
  latest_comment_date?: string;
  professor_tags?: string[];
}

// Additional utility types
export type TermData = {
  term: string;
  enrollment: number;
  averageGpa: number;
};

export type CourseWithStats = Course & {
  distributions: GradeDistribution[];
  termData: TermData[];
  averageGPA: number;
  totalEnrollment: number;
}; 