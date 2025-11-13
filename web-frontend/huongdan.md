# 📚 HƯỚNG DẪN HỆ THỐNG WEB-FRONTEND - NCKH Online Examination System

> Tài liệu toàn diện về luồng hoạt động, kiến trúc, các hàm chính và cách sử dụng hệ thống thi trực tuyến

**Phiên bản:** 1.0 | **Ngôn ngữ:** React 18.3.1 + TypeScript 5.6.3 + Vite 7.1.9

---

## 📑 MỤC LỤC

1. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
2. [Luồng hoạt động chính](#luồng-hoạt-động-chính)
3. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
4. [Redux Store](#redux-store)
5. [Routing](#routing)
6. [Các Hooks quan trọng](#các-hooks-quan-trọng)
7. [API Services](#api-services)
8. [Các trang chính](#các-trang-chính)
9. [Admin Module](#admin-module)
10. [Hệ thống Camera AI](#hệ-thống-camera-ai)

---

## 🏗️ Kiến trúc hệ thống

### Tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                    WEB FRONTEND (React)                      │
│                  Port: 5173 (Development)                    │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Identity Service │ │ Exam Service     │ │ Online Exam      │
│ (Port: 9000)     │ │ (Port: 9005)     │ │ Service (3000)   │
│ Java Spring      │ │ Java Spring      │ │ Node.js Express  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

### Stack công nghệ

| Lớp | Công nghệ | Phiên bản |
|-----|-----------|----------|
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.6.3 |
| Build Tool | Vite | 7.1.9 |
| State Management | Redux Toolkit | 2.9.0 |
| Routing | React Router | 6.30.1 |
| HTTP Client | Axios | 1.12.2 |
| Icons | Lucide React | 0.468.0 |
| Blockchain | Ethers.js | 6.15.0 |
| Testing | Vitest | 3.2.4 |

---

## 🔄 Luồng hoạt động chính

### 1. Luồng Đăng nhập

```
User → /auth/login → authApi.login() → Identity Service (9000)
  ↓
loginUser() thunk → Save token/user to localStorage
  ↓
Update Redux: loggedIn=true, role=user/admin
  ↓
ProtectedRoute check role → Redirect /user hoặc /admin
```

**Các hàm chính:**
- `authApi.login()` - Gọi API đăng nhập
- `loginUser()` - Redux thunk
- `checkAuth()` - Kiểm tra xem user đã đăng nhập chưa

### 2. Luồng Làm bài thi

```
/user/exam (ExamPage)
  ↓
Click "Bắt đầu" → /exam/:examId/pre-check (ExamPreCheckPage)
  ↓
fetchExamDetails() → Get quiz from backend
  ↓
startExamSession() → Create submission
  ↓
/exam/:examId/take (ExamTakingPage)
  ↓
User làm bài → updateAnswer() → Auto-save mỗi 30s
  ↓
Click "Nộp bài" → submitExam() → Backend tính điểm
  ↓
/exam/:examId/result (ExamResultPage) → Xem kết quả
```

**Các hàm chính:**
- `fetchExamDetails()` - Lấy thông tin bài thi
- `startExamSession()` - Bắt đầu session
- `updateAnswer()` - Cập nhật câu trả lời
- `submitExam()` - Nộp bài thi

### 3. Luồng Admin Quản lý Bài thi

```
/admin/exams (ExamsPage)
  ├─ Thêm bài thi → AddExamModal → POST /exams
  ├─ Sửa bài thi → EditExamModal → PUT /exams/:id
  ├─ Xóa bài thi → DeleteExamModal → DELETE /exams/:id
  ├─ Xem chi tiết → ViewExamModal
  ├─ Sao chép → duplicateExam()
  ├─ Sinh đề ngẫu nhiên → GenerateQuestionsModal
  ├─ Nhập Excel → ImportQuestionsModal
  └─ Xuất Excel → exportExamsToExcel()
```

---

## 📁 Cấu trúc thư mục

```
web-frontend/src/
├── index.tsx                    # Entry point
├── App.tsx                      # Root component
├── routes/
│   └── AppRoutes.tsx            # Main routing
├── admin/                       # Admin Module
│   ├── pages/                   # 13 admin pages
│   ├── components/              # Admin components
│   ├── hooks/
│   │   └── useExams.ts          # Exam management hook
│   ├── services/
│   │   └── examApi.ts           # Admin exam API
│   └── types/
├── pages/                       # User Pages
│   ├── ExamPage.tsx             # Danh sách bài thi
│   ├── ExamPreCheckPage.tsx     # Kiểm tra camera
│   ├── ExamTakingPage.tsx       # Làm bài thi
│   ├── ExamResultPage.tsx       # Xem kết quả
│   └── ...
├── components/
│   ├── atoms/                   # UI components
│   ├── molecules/               # Composite components
│   │   ├── ExamQuestion.tsx
│   │   ├── AICameraMonitor.tsx
│   │   └── ...
│   └── layouts/
├── hooks/                       # Custom Hooks
│   ├── useExamSession.ts        # Exam session management
│   ├── useAICameraMonitor.ts    # AI camera monitoring
│   ├── useCamera.ts             # Camera access
│   └── ...
├── services/
│   ├── examService.ts           # Exam business logic
│   ├── proctoringService.ts     # Proctoring API
│   └── api/
│       ├── authApi.ts           # Auth API
│       ├── onlineExamApi.ts     # Online exam API
│       └── ...
├── store/                       # Redux Store
│   ├── index.ts                 # Store config
│   ├── hooks.ts                 # useAppDispatch, useAppSelector
│   └── slices/
│       ├── authSlice.ts         # Auth state
│       ├── examSlice.ts         # Exam state
│       └── ...
├── contexts/
│   └── ThemeContext.tsx         # Dark/Light theme
├── utils/
│   ├── types.ts                 # TypeScript types
│   └── constants.ts
└── assets/
    └── theme.css                # Global theme
```

---

## 🎛️ Redux Store

### Store Configuration

```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,      // Authentication
    exam: examReducer,      // Exam state
    monitor: monitorReducer, // Monitoring
    wallet: walletReducer   // Wallet
  }
})
```

### Auth Slice

**State:**
```typescript
{
  loggedIn: boolean
  role: 'admin' | 'user' | null
  user: User | null
  loading: boolean
  error: string | null
}
```

**Thunks:**
- `loginUser(credentials)` - Đăng nhập
- `registerUser(credentials)` - Đăng ký
- `logoutUser()` - Đăng xuất
- `checkAuth()` - Kiểm tra đăng nhập

### Exam Slice

**State:**
```typescript
{
  currentExam: ExamDetails | null
  questions: ExamQuestion[]
  session: ExamSession | null
  currentQuestionIndex: number
  answers: Record<string, ExamAnswer>
  timeRemaining: number
  status: 'idle' | 'loading' | 'active' | 'finished' | 'error'
  visitedQuestions: number[]
  flaggedQuestions: number[]
}
```

**Thunks:**
- `fetchExamDetails(examId)` - Lấy thông tin bài thi
- `startExamSession(examId)` - Bắt đầu session
- `saveAnswer(params)` - Lưu câu trả lời
- `submitExam()` - Nộp bài thi

**Reducers:**
- `setCurrentQuestion(index)` - Chuyển câu hỏi
- `updateAnswer(params)` - Cập nhật đáp án
- `tickTimer()` - Giảm 1 giây
- `toggleQuestionFlag(id)` - Đánh dấu câu

---

## 🗺️ Routing

### Main Routes

```typescript
<Routes>
  <Route path="/auth/*" element={<AuthLayout />} />
  <Route path="/" element={<LandingPage />} />
  <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminRoutes /></ProtectedRoute>} />
  <Route path="/user/*" element={<ProtectedRoute requiredRole="user"><UserLayout /></ProtectedRoute>} />
  <Route path="/exam/:examId/pre-check" element={<ExamPreCheckPage />} />
  <Route path="/exam/:examId/take" element={<ExamTakingPage />} />
  <Route path="/exam/:examId/result" element={<ExamResultPage />} />
</Routes>
```

### Auth Routes

```typescript
<Route path="login" element={<LoginPage />} />
<Route path="register" element={<RegisterPage />} />
<Route path="forgot" element={<ForgotPasswordPage />} />
```

### Admin Routes

```typescript
<Route path="dashboard" element={<DashboardPage />} />
<Route path="users" element={<UsersPage />} />
<Route path="exams" element={<ExamsPage />} />
<Route path="proctoring" element={<ProctoringPage />} />
<Route path="security" element={<SecurityPage />} />
<Route path="reward" element={<RewardPage />} />
<Route path="copyright" element={<CopyrightPage />} />
```

---

## 🪝 Các Hooks quan trọng

### 1. `useExamSession()` - Quản lý Exam Session

**Vị trí:** `src/hooks/useExamSession.ts`

**Chức năng:** Quản lý toàn bộ logic bài thi

**Return:**
```typescript
{
  currentExam, questions, currentQuestion, currentQuestionIndex,
  totalQuestions, answeredQuestions, progress, visitedQuestions,
  timeRemaining, timeWarning, formatTime,
  status, error, answers, flaggedQuestions, session,
  isProctoringMinimized, showSubmitModal, isSubmitting,
  handleAnswerChange, handleFlagQuestion,
  handleNextQuestion, handlePreviousQuestion, handleGoToQuestion,
  handleSubmitExam, handleCameraReady, handleCameraError,
  navigate
}
```

**Cách sử dụng:**
```typescript
const { currentExam, timeRemaining, answers } = useExamSession();
```

### 2. `useAICameraMonitor()` - AI Camera Monitoring

**Vị trí:** `src/hooks/useAICameraMonitor.ts`

**Chức năng:** Giám sát camera với AI phát hiện gian lận

**Return:**
```typescript
{
  isActive, isAnalyzing, error,
  detections, metrics,
  startMonitoring, stopMonitoring, captureScreenshot,
  setDetectionSensitivity, enableDetectionType,
  frameStorage: { totalFramesCaptured, totalDetections, ... }
}
```

**Detection Types:**
- `FACE_NOT_DETECTED` - Không phát hiện khuôn mặt
- `MULTIPLE_FACES` - Nhiều người
- `MOBILE_PHONE_DETECTED` - Phát hiện điện thoại
- `CAMERA_TAMPERED` - Camera bị che
- `LOOKING_AWAY` - Nhìn ra khỏi màn hình
- `tab_switch` - Chuyển tab

### 3. `useCamera()` - Camera Access

**Vị trí:** `src/hooks/useCamera.ts`

**Chức năng:** Truy cập camera của thiết bị

**Return:**
```typescript
{
  stream, videoRef, isActive, error,
  startCamera, stopCamera, captureFrame
}
```

### 4. `useExamTimer()` - Timer Countdown

**Chức năng:** Quản lý timer đếm ngược

**Return:**
```typescript
{
  timeRemaining, isWarning, isTimeUp,
  startTimer, stopTimer, resetTimer
}
```

### 5. `useFrameStorage()` - Frame Storage

**Chức năng:** Lưu trữ frames từ camera

**Return:**
```typescript
{
  totalFramesCaptured, totalDetections, storageSize,
  addFrame, getStatistics, exportData, clearAll
}
```

---

## 📡 API Services

### 1. `authApi.ts` - Authentication

```typescript
login(credentials: { usernameOrEmail, password })
  → POST /identity/api/v1/auth/login
  → Response: { accessToken, refreshToken, user }

register(credentials: { username, email, password, ... })
  → POST /identity/api/v1/auth/register
  → Response: { success, message }
```

### 2. `onlineExamApi.ts` - Online Exam

```typescript
getAllQuizzes()
  → GET /api/quizzes
  → Response: Quiz[]

getQuizDetails(quizId)
  → GET /api/quizzes/:quizId
  → Response: Quiz (with questions)

startQuiz(quizId)
  → POST /api/quizzes/:quizId/start
  → Response: { submissionId, startTime }

submitQuiz(submissionId, answers)
  → POST /api/submissions/:submissionId/submit
  → Response: { submissionId, score, ... }

getQuizResult(submissionId)
  → GET /api/submissions/:submissionId/result
  → Response: { score, correctAnswers, ... }
```

### 3. `examService.ts` - Exam Business Logic

```typescript
getExamDetails(examId)
  → Adapter convert backend Quiz → frontend ExamDetails

startExam(examId)
  → Call onlineExamApi.startQuiz()
  → Return: { sessionId, startTime }

saveAnswer(sessionId, questionId, answer)
  → Save to localStorage (auto-save)

submitExam(submission)
  → Call onlineExamApi.submitQuiz()
  → Return: ExamResult with submissionId

getExamResult(sessionId)
  → Call onlineExamApi.getQuizResult()
  → Return: ExamResult
```

### 4. `proctoringService.ts` - Proctoring

```typescript
analyzeFrame(imageData)
  → POST /api/proctoring/analyze-frame
  → Response: { detections, metrics }

sendScreenshot(sessionId, imageData)
  → POST /api/proctoring/sessions/:id/screenshots
  → Save screenshot to backend

getSessionEvents(sessionId)
  → GET /api/sessions/:id/events
  → Response: Event[]
```

---

## 📄 Các trang chính

### User Pages

| Trang | Path | Chức năng |
|-------|------|----------|
| Landing | `/` | Trang chủ |
| Login | `/auth/login` | Đăng nhập |
| Register | `/auth/register` | Đăng ký |
| User Home | `/user/home` | Trang chủ user |
| Exam List | `/user/exam` | Danh sách bài thi |
| Pre-Check | `/exam/:id/pre-check` | Kiểm tra camera |
| Taking | `/exam/:id/take` | Làm bài thi |
| Result | `/exam/:id/result` | Xem kết quả |
| Reward | `/user/reward` | Quản lý token |
| Copyright | `/user/copyright` | Bản quyền tài liệu |

### Admin Pages (13 trang)

| Trang | Path | Chức năng |
|-------|------|----------|
| Dashboard | `/admin/dashboard` | Tổng quan |
| Users | `/admin/users` | Quản lý người dùng |
| Exams | `/admin/exams` | Quản lý bài thi |
| Proctoring | `/admin/proctoring` | Giám sát real-time |
| Security | `/admin/security` | Blockchain & security |
| Reward | `/admin/reward` | Quản lý token |
| Multisig | `/admin/multisig` | Ví đa chữ ký |
| Courses | `/admin/courses` | Quản lý khóa học |
| Organizations | `/admin/organizations` | Quản lý tổ chức |
| Certify | `/admin/certify` | Chứng chỉ |
| Admin | `/admin/admin` | Quản lý admin |
| Analytics | `/admin/analytics` | Phân tích |
| Copyright | `/admin/copyright` | Bản quyền |

---

## 🛠️ Admin Module

### ExamsPage - Quản lý Bài thi

**Tính năng (10 features):**

1. **Thêm đề thi** - AddExamModal
   - Form 14 trường (title, description, duration, etc.)
   - POST /exams

2. **Sửa đề thi** - EditExamModal
   - Pre-filled form
   - PUT /exams/:id

3. **Xóa đề thi** - DeleteExamModal
   - Confirmation modal
   - DELETE /exams/:id

4. **Xem chi tiết** - ViewExamModal
   - Hiển thị toàn bộ thông tin

5. **Sao chép** - duplicateExam()
   - Duplicate exam với 1 click

6. **Sinh đề ngẫu nhiên** - GenerateQuestionsModal
   - 4 modes độ khó
   - Mixed Auto (40-40-20)
   - Mixed Custom (tùy chỉnh)
   - Easy/Medium/Hard only

7. **Nhập Excel** - ImportQuestionsModal
   - Import với preview & validation

8. **Xuất Excel** - exportExamsToExcel()
   - Export 19 columns

9. **Tìm kiếm & Lọc**
   - 4 filters: subject, difficulty, status, type

10. **Phân trang**
    - 10 items/trang

### useExams Hook

```typescript
const {
  exams, allExams,
  filters, updateFilter,
  currentPage, setCurrentPage, totalPages,
  sortKey, sortOrder, handleSort,
  deleteExam, updateExam, duplicateExam,
  generateRandomExam, generateQuestionsForExam,
  addExam, subjects,
  publishExam, unpublishExam,
  examTypes, examDifficulties, examStatuses
} = useExams()
```

---

## 🎥 Hệ thống Camera AI

### Dual Camera System

**1. ProctoringView (Hiển thị)**
- Kích thước: 352x264px
- Có thể thu nhỏ/phóng to
- Status indicator

**2. AICameraMonitor (Phân tích)**
- Ẩn (display: none)
- Tự động bật sau 2 giây
- Phân tích frame để phát hiện vi phạm

### AI Detection

```typescript
interface CheatingDetection {
  type: 'FACE_NOT_DETECTED' | 'MULTIPLE_FACES' | 'MOBILE_PHONE_DETECTED' | 'CAMERA_TAMPERED' | 'LOOKING_AWAY' | 'tab_switch'
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number  // 0-100
  timestamp: number
  description: string
  screenshot?: string
}
```

### Violation Alert System

- **Severity Levels**: Low, Medium, High, Critical
- **Alert Modal**: Hiển thị khi phát hiện vi phạm
- **Countdown Timer**: 15 giây với progress bar
- **Auto-stop Exam**: Tự động dừng nếu không phản hồi
- **Blockchain Logging**: Ghi vi phạm lên blockchain

### Frame Storage

- Lưu trữ frames (base64) và AI responses
- Tính toán statistics (violation types, severity counts)
- Auto cleanup old data
- Export data as JSON
- Storage size tracking

---

## 🔗 Blockchain & Token System

### Smart Contracts

1. **LearnToken.sol** - ERC-20 Token
   - Auto-reward functions
   - Pause/unpause
   - Minter management

2. **CopyrightRegistry.sol** - Copyright Protection
   - SHA-256 hash storage
   - Timestamp verification
   - IPFS support

### Token Rewards

```typescript
awardLessonCompletion(user)      // 10 tokens
awardExamPass(user, score)       // 50 tokens
awardDailyStreak(user)           // 5 tokens/day
awardCertification(user)         // 200 tokens
awardContestWin(user, rank)      // 500 tokens
```

### Reward Store (50+ items)

- Courses, Vouchers, Electronics, Physical items
- Minimum withdrawal: 100 tokens
- Transaction fee: 2%
- 19 ngân hàng Việt Nam

---

## 🚀 Hướng dẫn phát triển

### Setup & Run

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Run tests
npm test
```

### Thêm tính năng mới

1. **Thêm Redux state**
   - Tạo slice mới trong `store/slices/`
   - Add reducer vào `store/index.ts`

2. **Thêm API endpoint**
   - Tạo function mới trong `services/api/`
   - Gọi từ thunk hoặc component

3. **Thêm page mới**
   - Tạo component trong `pages/`
   - Add route trong `AppRoutes.tsx`

4. **Thêm component**
   - Atoms: `components/atoms/`
   - Molecules: `components/molecules/`
   - Sections: `components/sections/`

### Best Practices

- Sử dụng TypeScript cho type safety
- Memoize components với React.memo
- Sử dụng useMemo, useCallback để optimize
- Lưu ý Redux state không nên quá lớn
- Sử dụng custom hooks để reuse logic
- Viết tests cho critical functions

---

## 📞 Troubleshooting

### Camera không hoạt động
- Kiểm tra quyền browser
- Đảm bảo HTTPS hoặc localhost
- Không có app khác dùng camera

### Lỗi kết nối backend
- Kiểm tra services đang chạy
- Xem console logs
- Clear cache và reload

### MetaMask không kết nối
- Cài đặt extension
- Kiểm tra network (Sepolia cho testnet)
- Refresh page

---

**Tài liệu này được cập nhật lần cuối vào Nov 2024**
