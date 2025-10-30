// Admin Course API Service - Re-export from main API
import courseApiMain, {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseMaterials,
  addMaterialToCourse,
  deleteMaterial,
  getQuizDetails,
  submitQuiz,
  getCourseProgressDashboard,
  type Course,
  type CreateCourseRequest,
  type UpdateCourseRequest,
  type Material,
  type CreateMaterialRequest,
  type Quiz,
  type QuizResult,
  type SubmitQuizRequest,
  type Progress,
  type PageResponse,
  type ApiResponse,
} from '../../services/api/courseApi';

// Re-export types for admin use
export type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  Material,
  CreateMaterialRequest,
  Quiz,
  QuizResult,
  SubmitQuizRequest,
  Progress,
  PageResponse,
  ApiResponse,
};

// Admin-specific functions (if needed in future)
// These are placeholders for potential admin-only operations

/**
 * Get course statistics (admin only)
 */
export async function getCourseStatistics(): Promise<{
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
  averageRating: number;
}> {
  try {
    // TODO: Implement when backend has admin stats endpoint
    // const response = await axios.get(`${API_BASE_URL}/admin/courses/stats`)
    // return response.data
    
    // Placeholder: Calculate from getAllCourses
    const coursesResponse = await getAllCourses(0, 1000);
    const courses = coursesResponse.data.content;
    
    return {
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.isPublished).length,
      draftCourses: courses.filter(c => !c.isPublished).length,
      totalEnrollments: courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0),
      averageRating: courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length || 0,
    };
  } catch (error) {
    console.error('Error getting course statistics:', error);
    throw new Error('Failed to get course statistics');
  }
}

/**
 * Get top performing courses (admin only)
 */
export async function getTopCourses(limit: number = 10): Promise<Course[]> {
  try {
    const coursesResponse = await getAllCourses(0, 100);
    const courses = coursesResponse.data.content;
    
    return courses
      .filter(c => c.isPublished)
      .sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting top courses:', error);
    throw new Error('Failed to get top courses');
  }
}

/**
 * Search courses by query (admin only)
 */
export async function searchCourses(query: string, page = 0, size = 10): Promise<ApiResponse<PageResponse<Course>>> {
  try {
    // TODO: Implement when backend has search endpoint
    // For now, use getAllCourses and filter on frontend
    const coursesResponse = await getAllCourses(page, size);
    
    if (!query) {
      return coursesResponse;
    }
    
    const filtered = coursesResponse.data.content.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      ...coursesResponse,
      data: {
        ...coursesResponse.data,
        content: filtered,
        totalElements: filtered.length,
      }
    };
  } catch (error) {
    console.error('Error searching courses:', error);
    throw new Error('Failed to search courses');
  }
}

// Admin Course API object
export const adminCourseApi = {
  // Course operations
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  
  // Material operations
  getCourseMaterials,
  addMaterialToCourse,
  deleteMaterial,
  
  // Quiz operations
  getQuizDetails,
  submitQuiz,
  
  // Progress operations
  getCourseProgressDashboard,
  
  // Admin-specific operations
  getCourseStatistics,
  getTopCourses,
  searchCourses,
};

export default adminCourseApi;

