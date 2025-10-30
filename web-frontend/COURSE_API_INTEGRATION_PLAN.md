# 📚 Course Service API Integration Plan

## 🎯 Mục tiêu
Tích hợp course-service backend (Java Spring Boot - Port 9001) với web-frontend giống như đã làm với token-reward-service.

## 📍 Backend API Endpoints

### **CourseController** (`/api/courses`)
- `POST /api/courses` - Tạo khóa học mới (COURSE_CREATE)
- `GET /api/courses/{courseId}` - Lấy chi tiết khóa học (COURSE_READ)
- `GET /api/courses` - Lấy danh sách khóa học có phân trang (COURSE_READ)
- `PUT /api/courses/{courseId}` - Cập nhật khóa học (COURSE_WRITE)
- `DELETE /api/courses/{courseId}` - Xóa khóa học (COURSE_DELETE)

### **MaterialController** (`/api/courses/{courseId}/materials`)
- `POST /api/courses/{courseId}/materials` - Thêm học liệu vào khóa học (MATERIAL_WRITE)
- `GET /api/courses/{courseId}/materials` - Lấy danh sách học liệu (COURSE_READ)
- `DELETE /api/materials/{materialId}` - Xóa học liệu (MATERIAL_DELETE)

### **QuizController** (`/api/quizzes`)
- `GET /api/quizzes/{quizId}` - Lấy chi tiết quiz để làm bài (COURSE_READ)
- `POST /api/quizzes/{quizId}/submit` - Nộp bài quiz (isAuthenticated)

### **ProgressController** (`/api/progress`)
- `POST /api/progress/student/{studentId}/course/{courseId}/material/{materialId}` - Cập nhật tiến độ
- `GET /api/progress/student/{studentId}/course/{courseId}` - Xem tiến độ cá nhân
- `GET /api/courses/{courseId}/progress` - Dashboard tiến độ cả lớp (ADMIN/COURSE_WRITE)

### **RewardController** (`/api/reward`)
- (Chi tiết cần kiểm tra thêm)

## 🏗️ Cấu trúc Frontend cần tạo

```
web-frontend/src/
├── services/
│   └── api/
│       └── courseApi.ts           ← NEW: Main Course API
├── admin/
│   ├── services/
│   │   └── courseApi.ts          ← NEW: Admin Course API (re-export)
│   └── hooks/
│       └── useCourses.ts         ← UPDATE: Use real API
└── hooks/
    └── useCourse.ts              ← NEW: Student course hook
```

## 📝 Implementation Steps

### Step 1: Tạo Main Course API (`src/services/api/courseApi.ts`)

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_COURSE_API_URL || 'http://localhost:9001/api';

// ==================== Types ====================
export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  price: number;
  thumbnail: string;
  isPublished: boolean;
  enrollmentCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz';
  contentUrl: string;
  order: number;
}

export interface Progress {
  studentId: number;
  courseId: string;
  completedMaterials: string[];
  progressPercentage: number;
}

// ==================== Course Operations ====================
export const getAllCourses = async (page = 0, size = 10) => {
  const response = await axios.get(`${API_BASE_URL}/courses`, {
    params: { page, size }
  });
  return response.data;
};

export const getCourseById = async (courseId: string) => {
  const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`);
  return response.data;
};

export const createCourse = async (courseData: any) => {
  const response = await axios.post(`${API_BASE_URL}/courses`, courseData);
  return response.data;
};

export const updateCourse = async (courseId: string, courseData: any) => {
  const response = await axios.put(`${API_BASE_URL}/courses/${courseId}`, courseData);
  return response.data;
};

export const deleteCourse = async (courseId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/courses/${courseId}`);
  return response.data;
};

// ==================== Material Operations ====================
export const getCourseMaterials = async (courseId: string) => {
  const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/materials`);
  return response.data;
};

export const addMaterialToCourse = async (courseId: string, materialData: any) => {
  const response = await axios.post(`${API_BASE_URL}/courses/${courseId}/materials`, materialData);
  return response.data;
};

export const deleteMaterial = async (materialId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/materials/${materialId}`);
  return response.data;
};

// ==================== Quiz Operations ====================
export const getQuizDetails = async (quizId: string) => {
  const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}`);
  return response.data;
};

export const submitQuiz = async (quizId: string, answers: any) => {
  const response = await axios.post(`${API_BASE_URL}/quizzes/${quizId}/submit`, answers);
  return response.data;
};

// ==================== Progress Operations ====================
export const updateProgress = async (studentId: number, courseId: string, materialId: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/progress/student/${studentId}/course/${courseId}/material/${materialId}`
  );
  return response.data;
};

export const getStudentProgress = async (studentId: number, courseId: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/progress/student/${studentId}/course/${courseId}`
  );
  return response.data;
};

export const getCourseProgressDashboard = async (courseId: string) => {
  const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/progress`);
  return response.data;
};

// ==================== Default Export ====================
const courseApi = {
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
  updateProgress,
  getStudentProgress,
  getCourseProgressDashboard,
};

export default courseApi;
```

### Step 2: Tạo Admin Course API (`src/admin/services/courseApi.ts`)

```typescript
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
  getCourseProgressDashboard,
  type Course,
  type Material,
  type Progress,
} from '../../services/api/courseApi';

// Re-export everything for admin use
export type { Course, Material, Progress };

export const adminCourseApi = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseMaterials,
  addMaterialToCourse,
  deleteMaterial,
  getCourseProgressDashboard,
};

export default adminCourseApi;
```

### Step 3: Cập nhật Admin Hook (`src/admin/hooks/useCourses.ts`)

```typescript
import { useState, useCallback, useEffect } from 'react'
import adminCourseApi from '../services/courseApi'

export default function useCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Load courses from API
  const loadCourses = useCallback(async (page = 0, size = 10) => {
    setLoading(true)
    try {
      const response = await adminCourseApi.getAllCourses(page, size)
      setCourses(response.data.content) // Spring Page structure
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  return {
    courses,
    loading,
    loadCourses,
    // ... other functions
  }
}
```

### Step 4: Xóa Mock Data

- Đánh dấu `mockCourses`, `mockCourseDashboard` là DEPRECATED
- Cập nhật imports để sử dụng API thay vì mock

## 🔄 Response Structure (Spring Boot)

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "content": [...],
    "pageable": {...},
    "totalElements": 100,
    "totalPages": 10,
    "number": 0,
    "size": 10
  }
}
```

## 🔐 Authentication

- Sử dụng JWT Token từ identity-service
- Backend yêu cầu quyền: `COURSE_READ`, `COURSE_WRITE`, `COURSE_CREATE`, `COURSE_DELETE`
- Frontend cần gửi token trong header: `Authorization: Bearer <token>`

## 📋 TODO Checklist

- [ ] Tạo `src/services/api/courseApi.ts`
- [ ] Tạo `src/admin/services/courseApi.ts`
- [ ] Cập nhật `src/admin/hooks/useCourses.ts`
- [ ] Xóa/Deprecated mock data trong `src/admin/mock/courses.ts`
- [ ] Tạo `src/hooks/useCourse.ts` cho student
- [ ] Cập nhật `CoursesPage.tsx` để sử dụng API
- [ ] Cập nhật `CourseProgress.tsx` để sử dụng API
- [ ] Test tích hợp với backend
- [ ] Viết documentation

## ⚙️ Environment Variables

Thêm vào `.env`:
```env
VITE_COURSE_API_URL=http://localhost:9001/api
```

---

**Status: 📋 PLANNED - READY TO IMPLEMENT**

Cấu trúc tương tự token-reward-service integration!

