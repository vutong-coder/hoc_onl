// Course API Service
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_COURSE_API_URL || 'http://localhost:9001/api';

// Create axios instance with interceptors
const courseAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
courseAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
courseAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
      // Optionally redirect to login page
      // window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// ==================== Types ====================

export interface CourseCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Instructor {
  id: string;
  name: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  videoUrl?: string;
  contentUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category?: CourseCategory;
  instructor?: Instructor;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // hours
  price: number;
  tokenSymbol?: string;
  thumbnail?: string;
  videoUrl?: string;
  tags?: string[];
  status?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  enrollmentCount?: number;
  maxEnrollments?: number;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  lessons?: Lesson[];
  prerequisites?: string[];
  learningOutcomes?: string[];
  certificateAvailable?: boolean;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  shortDescription?: string;
  categoryId?: string;
  instructorId?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  price: number;
  thumbnail?: string;
  tags?: string[];
  prerequisites?: string[];
  learningOutcomes?: string[];
  certificateAvailable?: boolean;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  shortDescription?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  price?: number;
  thumbnail?: string;
  tags?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'document' | 'quiz' | 'text';
  contentUrl?: string;
  videoUrl?: string;
  order: number;
  duration?: number;
  createdAt: string;
}

export interface CreateMaterialRequest {
  title: string;
  description?: string;
  type: 'video' | 'document' | 'quiz' | 'text';
  contentUrl?: string;
  videoUrl?: string;
  order: number;
  duration?: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: QuizOption[];
  correctAnswer?: string;
  points: number;
}

export interface QuizOption {
  id: string;
  optionText: string;
  isCorrect: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface SubmitQuizRequest {
  studentId: number;
  answers: Array<{
    questionId: string;
    answer: string;
  }>;
}

export interface QuizResult {
  score: number;
  totalPoints: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  submittedAt: string;
}

export interface Progress {
  id: string;
  studentId: number;
  courseId: string;
  completedMaterials: string[];
  progressPercentage: number;
  lastAccessedAt: string;
  completedAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// ==================== Course Operations ====================

/**
 * Get all courses with pagination
 */
export const getAllCourses = async (page = 0, size = 10): Promise<ApiResponse<PageResponse<Course>>> => {
  try {
    const response = await courseAxios.get('/courses', {
      params: { page, size }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error getting all courses:', error);
    throw new Error(error.response?.data?.message || 'Failed to get courses');
  }
};

/**
 * Get course by ID
 */
export const getCourseById = async (courseId: string): Promise<ApiResponse<Course>> => {
  try {
    const response = await courseAxios.get(`/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting course:', error);
    throw new Error(error.response?.data?.message || 'Failed to get course');
  }
};

/**
 * Create new course
 */
export const createCourse = async (courseData: CreateCourseRequest): Promise<ApiResponse<Course>> => {
  try {
    const response = await courseAxios.post('/courses', courseData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating course:', error);
    throw new Error(error.response?.data?.message || 'Failed to create course');
  }
};

/**
 * Update course
 */
export const updateCourse = async (courseId: string, courseData: UpdateCourseRequest): Promise<ApiResponse<Course>> => {
  try {
    const response = await courseAxios.put(`/courses/${courseId}`, courseData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating course:', error);
    throw new Error(error.response?.data?.message || 'Failed to update course');
  }
};

/**
 * Delete course
 */
export const deleteCourse = async (courseId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await courseAxios.delete(`/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting course:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete course');
  }
};

// ==================== Material Operations ====================

/**
 * Get all materials for a course
 */
export const getCourseMaterials = async (courseId: string): Promise<ApiResponse<Material[]>> => {
  try {
    const response = await courseAxios.get(`/courses/${courseId}/materials`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting materials:', error);
    throw new Error(error.response?.data?.message || 'Failed to get materials');
  }
};

/**
 * Add material to course
 */
export const addMaterialToCourse = async (courseId: string, materialData: CreateMaterialRequest): Promise<ApiResponse<Material>> => {
  try {
    const response = await courseAxios.post(`/courses/${courseId}/materials`, materialData);
    return response.data;
  } catch (error: any) {
    console.error('Error adding material:', error);
    throw new Error(error.response?.data?.message || 'Failed to add material');
  }
};

/**
 * Delete material
 */
export const deleteMaterial = async (materialId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await courseAxios.delete(`/materials/${materialId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting material:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete material');
  }
};

// ==================== Quiz Operations ====================

/**
 * Get quiz details
 */
export const getQuizDetails = async (quizId: string): Promise<ApiResponse<Quiz>> => {
  try {
    const response = await courseAxios.get(`/quizzes/${quizId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting quiz:', error);
    throw new Error(error.response?.data?.message || 'Failed to get quiz');
  }
};

/**
 * Submit quiz
 */
export const submitQuiz = async (quizId: string, submission: SubmitQuizRequest): Promise<ApiResponse<QuizResult>> => {
  try {
    const response = await courseAxios.post(`/quizzes/${quizId}/submit`, submission);
    return response.data;
  } catch (error: any) {
    console.error('Error submitting quiz:', error);
    throw new Error(error.response?.data?.message || 'Failed to submit quiz');
  }
};

// ==================== Progress Operations ====================

/**
 * Update student progress
 */
export const updateProgress = async (
  studentId: number,
  courseId: string,
  materialId: string
): Promise<ApiResponse<Progress>> => {
  try {
    const response = await courseAxios.post(
      `/progress/student/${studentId}/course/${courseId}/material/${materialId}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error updating progress:', error);
    throw new Error(error.response?.data?.message || 'Failed to update progress');
  }
};

/**
 * Get student progress in course
 */
export const getStudentProgress = async (studentId: number, courseId: string): Promise<ApiResponse<Progress>> => {
  try {
    const response = await courseAxios.get(
      `/progress/student/${studentId}/course/${courseId}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error getting progress:', error);
    throw new Error(error.response?.data?.message || 'Failed to get progress');
  }
};

/**
 * Get course progress dashboard (for instructors/admin)
 */
export const getCourseProgressDashboard = async (courseId: string): Promise<ApiResponse<Progress[]>> => {
  try {
    const response = await courseAxios.get(`/courses/${courseId}/progress`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting progress dashboard:', error);
    throw new Error(error.response?.data?.message || 'Failed to get progress dashboard');
  }
};

// ==================== Default Export ====================

const courseApi = {
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
  updateProgress,
  getStudentProgress,
  getCourseProgressDashboard,
};

export default courseApi;

