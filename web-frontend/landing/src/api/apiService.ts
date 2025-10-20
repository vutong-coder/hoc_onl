import axios, { AxiosResponse } from 'axios';
import { 
  User, 
  Exam, 
  Course, 
  Organization, 
  Analytics, 
  ProctoringSession, 
  Reward,
  ExamSession,
  Question,
  Answer
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class ApiService {
  // Auth endpoints
  async login(email: string, password: string): Promise<AxiosResponse<{ user: User; token: string }>> {
    return api.post('/auth/login', { email, password });
  }

  async register(userData: { email: string; password: string; name: string }): Promise<AxiosResponse<{ user: User; token: string }>> {
    return api.post('/auth/register', userData);
  }

  async logout(): Promise<AxiosResponse<void>> {
    return api.post('/auth/logout');
  }

  async getCurrentUser(): Promise<AxiosResponse<User>> {
    return api.get('/auth/me');
  }

  async googleLogin(googleToken: string): Promise<AxiosResponse<{ user: User; token: string }>> {
    return api.post('/auth/google', { token: googleToken });
  }

  // User endpoints
  async getUsers(): Promise<AxiosResponse<User[]>> {
    return api.get('/users');
  }

  async getUserById(userId: string): Promise<AxiosResponse<User>> {
    return api.get(`/users/${userId}`);
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<AxiosResponse<User>> {
    return api.put(`/users/${userId}`, userData);
  }

  async deleteUser(userId: string): Promise<AxiosResponse<void>> {
    return api.delete(`/users/${userId}`);
  }

  // Exam endpoints
  async getExams(): Promise<AxiosResponse<Exam[]>> {
    return api.get('/exams');
  }

  async getExamById(examId: string): Promise<AxiosResponse<Exam>> {
    return api.get(`/exams/${examId}`);
  }

  async createExam(examData: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<Exam>> {
    return api.post('/exams', examData);
  }

  async updateExam(examId: string, examData: Partial<Exam>): Promise<AxiosResponse<Exam>> {
    return api.put(`/exams/${examId}`, examData);
  }

  async deleteExam(examId: string): Promise<AxiosResponse<void>> {
    return api.delete(`/exams/${examId}`);
  }

  async startExamSession(examId: string): Promise<AxiosResponse<ExamSession>> {
    return api.post(`/exams/${examId}/start`);
  }

  async submitAnswer(sessionId: string, questionId: string, answer: string | number): Promise<AxiosResponse<void>> {
    return api.post(`/exam-sessions/${sessionId}/answers`, { questionId, answer });
  }

  async endExamSession(sessionId: string): Promise<AxiosResponse<ExamSession>> {
    return api.post(`/exam-sessions/${sessionId}/end`);
  }

  // Course endpoints
  async getCourses(): Promise<AxiosResponse<Course[]>> {
    return api.get('/courses');
  }

  async getCourseById(courseId: string): Promise<AxiosResponse<Course>> {
    return api.get(`/courses/${courseId}`);
  }

  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<Course>> {
    return api.post('/courses', courseData);
  }

  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<AxiosResponse<Course>> {
    return api.put(`/courses/${courseId}`, courseData);
  }

  async deleteCourse(courseId: string): Promise<AxiosResponse<void>> {
    return api.delete(`/courses/${courseId}`);
  }

  // Organization endpoints
  async getOrganizations(): Promise<AxiosResponse<Organization[]>> {
    return api.get('/organizations');
  }

  async getOrganizationById(organizationId: string): Promise<AxiosResponse<Organization>> {
    return api.get(`/organizations/${organizationId}`);
  }

  async createOrganization(organizationData: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<Organization>> {
    return api.post('/organizations', organizationData);
  }

  async updateOrganization(organizationId: string, organizationData: Partial<Organization>): Promise<AxiosResponse<Organization>> {
    return api.put(`/organizations/${organizationId}`, organizationData);
  }

  async deleteOrganization(organizationId: string): Promise<AxiosResponse<void>> {
    return api.delete(`/organizations/${organizationId}`);
  }

  // Analytics endpoints
  async getAnalytics(): Promise<AxiosResponse<Analytics>> {
    return api.get('/analytics');
  }

  // Proctoring endpoints
  async getProctoringSessions(): Promise<AxiosResponse<ProctoringSession[]>> {
    return api.get('/proctoring/sessions');
  }

  async startProctoringSession(examId: string): Promise<AxiosResponse<ProctoringSession>> {
    return api.post(`/proctoring/sessions`, { examId });
  }

  async endProctoringSession(sessionId: string): Promise<AxiosResponse<ProctoringSession>> {
    return api.post(`/proctoring/sessions/${sessionId}/end`);
  }

  // Rewards endpoints
  async getRewards(): Promise<AxiosResponse<Reward[]>> {
    return api.get('/rewards');
  }

  async claimReward(rewardId: string): Promise<AxiosResponse<Reward>> {
    return api.post(`/rewards/${rewardId}/claim`);
  }
}

const apiService = new ApiService();
export default apiService;