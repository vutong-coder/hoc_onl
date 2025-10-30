# Hệ thống Khóa học User - Tích hợp Course Service

## 📋 Tổng quan

Đã xây dựng hoàn thiện hệ thống quản lý và học tập khóa học cho user, tích hợp đầy đủ với backend course-service.

## ✨ Tính năng đã triển khai

### 1. **Trang danh sách khóa học** (`/user/courses`)
- ✅ Hiển thị danh sách tất cả khóa học có sẵn
- ✅ Tìm kiếm khóa học theo tên, mô tả
- ✅ Lọc theo cấp độ (Cơ bản, Trung cấp, Nâng cao)
- ✅ Lọc theo danh mục
- ✅ Chuyển đổi chế độ xem (Grid/List)
- ✅ Phân trang
- ✅ Hiển thị thông tin: thumbnail, giảng viên, thời lượng, rating, giá

### 2. **Trang chi tiết khóa học** (`/user/courses/:courseId`)
- ✅ Thông tin chi tiết khóa học
- ✅ Danh sách tài liệu học tập (materials)
- ✅ Thông tin giảng viên
- ✅ Kết quả học tập (learning outcomes)
- ✅ Yêu cầu tiên quyết (prerequisites)
- ✅ Tiến độ học tập (nếu đã đăng ký)
- ✅ Nút đăng ký/Tiếp tục học

### 3. **Trang học tập** (`/user/courses/:courseId/learn`)
- ✅ Xem video bài học
- ✅ Đọc tài liệu
- ✅ Làm quiz
- ✅ Đánh dấu hoàn thành bài học
- ✅ Thanh sidebar hiển thị nội dung khóa học
- ✅ Điều hướng giữa các bài học
- ✅ Theo dõi tiến độ real-time

### 4. **Hệ thống Quiz**
- ✅ Component `QuizTaking`: Làm bài quiz với đếm ngược thời gian
- ✅ Component `QuizResult`: Hiển thị kết quả chi tiết
- ✅ Hỗ trợ nhiều loại câu hỏi:
  - Multiple choice (Trắc nghiệm)
  - True/False (Đúng/Sai)
  - Short answer (Trả lời ngắn)
- ✅ Điều hướng giữa các câu hỏi
- ✅ Đánh dấu câu đã trả lời
- ✅ Xác nhận trước khi nộp bài
- ✅ Hiển thị điểm số và thống kê

### 5. **Component CourseProgress** (Dashboard)
- ✅ Hiển thị tiến độ các khóa học đang học
- ✅ Tích hợp API thực từ backend
- ✅ Hiển thị thông báo khi chưa có khóa học
- ✅ Liên kết đến trang chi tiết khóa học

## 🗂️ Cấu trúc file

```
web-frontend/
├── src/
│   ├── pages/
│   │   ├── UserCoursesPage.tsx          # Danh sách khóa học
│   │   ├── CourseDetailPage.tsx         # Chi tiết khóa học
│   │   └── CourseLearnPage.tsx          # Trang học
│   │
│   ├── components/
│   │   ├── sections/
│   │   │   └── CourseProgress.tsx       # Widget tiến độ (đã cập nhật)
│   │   │
│   │   └── quiz/
│   │       ├── QuizTaking.tsx           # Component làm quiz
│   │       └── QuizResult.tsx           # Component kết quả quiz
│   │
│   ├── services/api/
│   │   └── courseApi.ts                 # API service (đã có)
│   │
│   ├── assets/css/
│   │   ├── UserCoursesPage.css
│   │   ├── CourseDetailPage.css
│   │   ├── CourseLearnPage.css
│   │   ├── QuizTaking.css
│   │   └── QuizResult.css
│   │
│   └── routes/
│       └── AppRoutes.tsx                # Đã thêm routes mới
```

## 🔌 API Integration

### Course Service Endpoints được sử dụng:

```typescript
// Courses
GET    /api/courses?page=0&size=10          // Lấy danh sách khóa học
GET    /api/courses/{courseId}              // Lấy chi tiết khóa học

// Materials
GET    /api/courses/{courseId}/materials    // Lấy danh sách materials

// Progress
GET    /api/progress/student/{studentId}/course/{courseId}  // Lấy tiến độ
POST   /api/progress/student/{studentId}/course/{courseId}/material/{materialId}  // Cập nhật tiến độ

// Quiz
GET    /api/quizzes/{quizId}                // Lấy chi tiết quiz
POST   /api/quizzes/{quizId}/submit         // Nộp bài quiz
```

## 🚀 Routes đã thêm

```typescript
// Trong UserLayout (có header/sidebar)
/user/courses                    → UserCoursesPage
/user/courses/:courseId          → CourseDetailPage

// Standalone (fullscreen, không có layout)
/user/courses/:courseId/learn    → CourseLearnPage
```

## 🎨 UI/UX Features

### Responsive Design
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px)

### Animations & Transitions
- ✅ Fade in/out effects
- ✅ Slide animations
- ✅ Hover effects
- ✅ Loading states
- ✅ Progress bar animations

### User Experience
- ✅ Loading states với spinner
- ✅ Error handling và hiển thị lỗi
- ✅ Empty states
- ✅ Confirmation modals
- ✅ Toast notifications (có thể tích hợp thêm)

## 📝 Cách sử dụng

### 1. Xem danh sách khóa học
```typescript
// Người dùng vào /user/courses
// Hệ thống tự động load courses từ API
// Có thể search, filter, và phân trang
```

### 2. Xem chi tiết và đăng ký
```typescript
// Click vào khóa học → /user/courses/:courseId
// Xem thông tin chi tiết
// Click "Đăng ký học" để bắt đầu
```

### 3. Học tập
```typescript
// Click "Tiếp tục học" → /user/courses/:courseId/learn
// Xem video, đọc tài liệu, làm quiz
// Đánh dấu hoàn thành từng bài học
// Tiến độ tự động cập nhật
```

### 4. Làm Quiz
```typescript
// Trong CourseLearnPage, khi gặp material type = 'quiz'
// Click "Bắt đầu làm bài"
// Trả lời câu hỏi
// Nộp bài và xem kết quả
```

## 🔧 Cấu hình Environment

Đảm bảo có biến môi trường trong `.env`:

```env
VITE_COURSE_API_URL=http://localhost:9001/api
```

Hoặc sử dụng default trong code: `http://localhost:9001/api`

## 🎯 Backend Course Service cần chạy

Đảm bảo course-service đang chạy tại port 9001 với các API endpoints:
- Course CRUD
- Material management
- Quiz operations
- Progress tracking

## ⚠️ Lưu ý

### Authentication
- Tất cả các trang đều được bảo vệ bởi `ProtectedRoute` với `requiredRole="user"`
- User phải đăng nhập mới có thể truy cập
- Token được tự động gửi trong header (nếu đã cấu hình axios interceptor)

### Authorization Backend
Backend course-service yêu cầu các quyền:
- `COURSE_READ`: Xem khóa học và materials
- `COURSE_CREATE`: Tạo khóa học (admin)
- `COURSE_WRITE`: Cập nhật khóa học (admin)
- `COURSE_DELETE`: Xóa khóa học (admin)

User bình thường chỉ cần `COURSE_READ` để học.

### Progress Tracking
- Progress chỉ được lưu khi user đã "enroll" vào khóa học
- Backend cần implement enrollment logic
- Hiện tại đang giả sử user có thể truy cập bất kỳ course nào

## 🔜 Các tính năng có thể mở rộng

1. **Enrollment System**
   - API đăng ký khóa học
   - Quản lý enrollment
   - Kiểm tra quyền truy cập

2. **Certificate Generation**
   - Tự động tạo certificate khi hoàn thành
   - Download PDF certificate
   - Hiển thị trong profile

3. **Discussion/Comments**
   - Bình luận trong từng bài học
   - Hỏi đáp với giảng viên
   - Forum khóa học

4. **Ratings & Reviews**
   - Đánh giá khóa học
   - Viết review
   - Hiển thị ratings

5. **Bookmarks & Notes**
   - Đánh dấu bài học quan trọng
   - Ghi chú trong video
   - Tìm kiếm ghi chú

6. **Notifications**
   - Thông báo bài học mới
   - Nhắc nhở deadline
   - Achievement notifications

## 🐛 Testing

Để test hệ thống:

1. **Đảm bảo backend đang chạy**
   ```bash
   # Start course-service
   cd Code-spark/services/course-service
   mvn spring-boot:run
   ```

2. **Login vào hệ thống với role USER**

3. **Test các flows:**
   - Browse courses: `/user/courses`
   - View detail: Click vào course
   - Start learning: Click "Đăng ký học"
   - Complete materials: Đánh dấu hoàn thành
   - Take quiz: Làm bài quiz và xem kết quả

## 📚 API Types

Tất cả types đã được định nghĩa trong `courseApi.ts`:
- `Course`
- `Material`
- `Quiz`, `QuizQuestion`, `QuizOption`
- `Progress`
- `ApiResponse`, `PageResponse`

## ✅ Checklist hoàn thành

- [x] Trang danh sách khóa học với search, filter, pagination
- [x] Trang chi tiết khóa học với đầy đủ thông tin
- [x] Trang học tập với video, documents, quiz
- [x] Component Quiz hoàn chỉnh
- [x] Component QuizResult
- [x] Tích hợp API real backend
- [x] Cập nhật CourseProgress component
- [x] Thêm routes
- [x] Responsive design
- [x] Error handling
- [x] Loading states
- [x] Animations & transitions

## 🎉 Kết luận

Hệ thống courses cho user đã được xây dựng hoàn thiện với đầy đủ các chức năng cơ bản:
- Xem và tìm kiếm khóa học
- Xem chi tiết và đăng ký
- Học tập với video, documents, quiz
- Theo dõi tiến độ real-time
- UI/UX hiện đại, responsive

Sẵn sàng để tích hợp với backend course-service và test end-to-end!

