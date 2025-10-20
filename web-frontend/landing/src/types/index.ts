// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

// Exam types
export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questions: Question[];
  courseId: string;
  organizationId: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay' | 'fill-in-blank';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
  examId: string;
  order: number;
}

export interface Answer {
  questionId: string;
  answer: string | number;
  timestamp: string;
}

export interface ExamSession {
  id: string;
  examId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  answers: Answer[];
  score?: number;
  status: 'in-progress' | 'completed' | 'abandoned';
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  organizationId: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  description: string;
  logo?: string;
  settings: OrganizationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettings {
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;
  maxUsers: number;
  features: string[];
}

// Analytics types
export interface Analytics {
  totalUsers: number;
  totalExams: number;
  totalCourses: number;
  totalOrganizations: number;
  userGrowth: {
    date: string;
    count: number;
  }[];
  examStats: {
    totalAttempts: number;
    averageScore: number;
    completionRate: number;
  };
  courseStats: {
    totalEnrollments: number;
    completionRate: number;
  };
}

// Proctoring types
export interface ProctoringSession {
  id: string;
  examId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  violations: ProctoringViolation[];
  status: 'active' | 'completed' | 'terminated';
}

export interface ProctoringViolation {
  id: string;
  type: 'face-not-detected' | 'multiple-faces' | 'tab-switch' | 'mobile-device';
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

// Rewards types
export interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'badge' | 'certificate' | 'token';
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ExamForm {
  title: string;
  description: string;
  duration: number;
  courseId: string;
  questions: Omit<Question, 'id' | 'examId'>[];
}

export interface CourseForm {
  title: string;
  description: string;
  organizationId: string;
}

export interface OrganizationForm {
  name: string;
  description: string;
  settings: Partial<OrganizationSettings>;
}

// Filter and Search types
export interface ExamFilters {
  courseId?: string;
  organizationId?: string;
  isActive?: boolean;
  createdBy?: string;
}

export interface UserFilters {
  role?: string;
  organizationId?: string;
  isActive?: boolean;
}

export interface CourseFilters {
  organizationId?: string;
  isActive?: boolean;
  createdBy?: string;
}

export interface OrganizationFilters {
  isActive?: boolean;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

// Settings types
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    examReminders: boolean;
    courseUpdates: boolean;
  };
}

export interface SystemSettings {
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}