# 📖 CHI TIẾT CÁC HÀM QUAN TRỌNG - Web Frontend

> Tài liệu chi tiết về các hàm chính, cách hoạt động, tham số và giá trị trả về

---

## 📑 MỤC LỤC

1. [Redux Thunks](#redux-thunks)
2. [Custom Hooks](#custom-hooks)
3. [API Services](#api-services)
4. [Component Handlers](#component-handlers)
5. [Utility Functions](#utility-functions)

---

## 🔴 Redux Thunks

### 1. `loginUser(credentials)` - Đăng nhập

**Vị trí:** `src/store/slices/authSlice.ts`

**Mục đích:** Xác thực người dùng và lưu token

**Tham số:**
```typescript
credentials: {
  usernameOrEmail: string  // Email hoặc username
  password: string         // Mật khẩu
}
```

**Quy trình:**
```
1. Gọi authApi.login(credentials)
   ↓
2. POST /identity/api/v1/auth/login
   ↓
3. Backend trả về: { accessToken, refreshToken, user }
   ↓
4. Lưu vào localStorage:
   - localStorage.setItem('accessToken', token)
   - localStorage.setItem('refreshToken', token)
   - localStorage.setItem('user', JSON.stringify(user))
   ↓
5. Update Redux state:
   - loggedIn = true
   - role = user.role
   - user = user object
```

**Giá trị trả về:**
```typescript
{
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  avatar?: string
}
```

**Lỗi có thể xảy ra:**
- `Login failed` - Sai email/password
- `Network error` - Lỗi kết nối

**Cách sử dụng:**
```typescript
const dispatch = useAppDispatch();

dispatch(loginUser({
  usernameOrEmail: 'admin@test.com',
  password: 'password123'
}))
.then(() => {
  // Đăng nhập thành công
  navigate('/user/home');
})
.catch((error) => {
  // Xử lý lỗi
  console.error(error);
});
```

---

### 2. `checkAuth()` - Kiểm tra xác thực

**Vị trí:** `src/store/slices/authSlice.ts`

**Mục đích:** Kiểm tra xem user đã đăng nhập chưa (chạy khi app load)

**Tham số:** Không có

**Quy trình:**
```
1. Kiểm tra localStorage:
   - Có 'user' key?
   - Có 'accessToken' key?
   ↓
2. Nếu có cả hai:
   - Parse user từ localStorage
   - Update Redux state: loggedIn = true
   ↓
3. Nếu không có:
   - Update Redux state: loggedIn = false
   - Redirect đến /auth/login
```

**Giá trị trả về:**
```typescript
{
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}
```

**Cách sử dụng:**
```typescript
// Chạy khi app load (trong AppRoutes.tsx)
useEffect(() => {
  dispatch(checkAuth());
}, [dispatch]);
```

---

### 3. `fetchExamDetails(examId)` - Lấy thông tin bài thi

**Vị trí:** `src/store/slices/examSlice.ts`

**Mục đích:** Lấy chi tiết bài thi từ backend

**Tham số:**
```typescript
examId: string  // ID của bài thi (UUID)
```

**Quy trình:**
```
1. Gọi examService.getExamDetails(examId)
   ↓
2. Gọi onlineExamApi.getQuizDetails(examId)
   ↓
3. GET /api/quizzes/:quizId
   ↓
4. Backend trả về Quiz object:
   {
     id, title, description, timeLimitMinutes,
     difficulty, subject, isProctored,
     instructions, questions: [...]
   }
   ↓
5. Adapter convert Quiz → ExamDetails:
   - Tính totalPoints từ questions
   - Convert duration từ minutes → seconds
   - Map questions từ backend format
   ↓
6. Update Redux state:
   - currentExam = ExamDetails
   - questions = ExamQuestion[]
   - timeRemaining = duration * 60 (seconds)
```

**Giá trị trả về:**
```typescript
{
  id: string
  title: string
  description: string
  duration: number              // minutes
  totalQuestions: number
  totalPoints: number
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  isProctored: boolean
  instructions: string[]
  questions: ExamQuestion[]
}
```

**Lỗi có thể xảy ra:**
- `Không thể tải thông tin bài thi`

**Cách sử dụng:**
```typescript
const dispatch = useAppDispatch();

useEffect(() => {
  if (examId) {
    dispatch(fetchExamDetails(examId))
      .unwrap()
      .then((exam) => {
        console.log('Exam loaded:', exam);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}, [examId, dispatch]);
```

---

### 4. `startExamSession(examId)` - Bắt đầu session bài thi

**Vị trí:** `src/store/slices/examSlice.ts`

**Mục đích:** Tạo submission mới và bắt đầu session

**Tham số:**
```typescript
examId: string  // ID của bài thi
```

**Quy trình:**
```
1. Gọi onlineExamApi.startQuiz(examId)
   ↓
2. POST /api/quizzes/:quizId/start
   ↓
3. Backend tạo submission mới:
   - Ghi lại startTime
   - Tạo record trong database
   ↓
4. Backend trả về:
   {
     data: {
       submissionId: string,
       startTime: string
     }
   }
   ↓
5. Update Redux state:
   - session = { id, examId, startTime, status }
   - startTime = Date.now()
   - status = 'pre-check'
```

**Giá trị trả về:**
```typescript
{
  sessionId: string          // submission ID
  startTime: string          // ISO string
}
```

**Lỗi có thể xảy ra:**
- `409 Conflict` - Submission đã tồn tại
- `400 Bad Request` - Exam đã hoàn thành
- `Không thể bắt đầu bài thi`

**Cách sử dụng:**
```typescript
const dispatch = useAppDispatch();

dispatch(startExamSession(examId))
  .unwrap()
  .then((session) => {
    console.log('Session started:', session);
    // Redirect to exam taking page
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

---

### 5. `updateAnswer(params)` - Cập nhật câu trả lời

**Vị trí:** `src/store/slices/examSlice.ts`

**Mục đích:** Lưu câu trả lời vào Redux state (không gọi backend)

**Tham số:**
```typescript
{
  questionId: number | string  // ID câu hỏi (UUID)
  answer: any                  // Đáp án (optionId, text, code, etc.)
}
```

**Quy trình:**
```
1. Nhận tham số { questionId, answer }
   ↓
2. Update Redux state.exam.answers:
   answers[questionId] = {
     questionId,
     answer,
     timeSpent: 0
   }
   ↓
3. Không gọi backend (chỉ lưu local)
```

**Giá trị trả về:** Không có (sync action)

**Cách sử dụng:**
```typescript
const dispatch = useAppDispatch();

// Khi user chọn đáp án
dispatch(updateAnswer({
  questionId: 'uuid-123',
  answer: 'option-id-456'
}));
```

---

### 6. `submitExam()` - Nộp bài thi

**Vị trị:** `src/store/slices/examSlice.ts`

**Mục đích:** Nộp bài thi và nhận kết quả

**Tham số:** Không có (lấy từ state)

**Quy trình:**
```
1. Lấy từ Redux state:
   - currentExam
   - session
   - answers
   - startTime
   ↓
2. Tính toán:
   - timeSpent = (Date.now() - startTime) / 60000 (minutes)
   ↓
3. Tạo submission object:
   {
     examId: string
     sessionId: string
     answers: [
       {
         questionId: string,
         selectedOptionId: string
       }
     ]
     timeSpent: number
     submittedAt: string
   }
   ↓
4. Gọi onlineExamApi.submitQuiz(sessionId, answers)
   ↓
5. POST /api/submissions/:submissionId/submit
   ↓
6. Backend tính điểm:
   - So sánh answers với correctAnswers
   - Tính score (%)
   - Tính correctAnswers count
   ↓
7. Backend trả về:
   {
     data: {
       submissionId: string,
       score: number,
       correctAnswers: number,
       wrongAnswers: number,
       totalQuestions: number
     }
   }
   ↓
8. Update Redux state:
   - status = 'finished'
   - session.status = 'completed'
   - submissionId = response.submissionId
```

**Giá trị trả về:**
```typescript
{
  submissionId: string
  examId: string
  sessionId: string
  score: number              // 0-100 (%)
  totalQuestions: number
  correctAnswers: number
  wrongAnswers?: number
  timeSpent: number          // minutes
  submittedAt: string        // ISO string
  passed: boolean            // score >= 70
  percentile?: number        // 0-100
  quizTitle?: string
  questions?: QuestionResult[]
}
```

**Lỗi có thể xảy ra:**
- `Thiếu thông tin cần thiết để nộp bài`
- `Không thể nộp bài thi`

**Cách sử dụng:**
```typescript
const dispatch = useAppDispatch();

dispatch(submitExam())
  .unwrap()
  .then((result) => {
    console.log('Exam submitted:', result);
    // Redirect to result page
    navigate(`/exam/${examId}/result?submissionId=${result.submissionId}`);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

---

## 🪝 Custom Hooks

### 1. `useExamSession()` - Quản lý Exam Session

**Vị trí:** `src/hooks/useExamSession.ts`

**Mục đích:** Quản lý toàn bộ logic bài thi (fetch, start, answer, submit)

**Return Object:**

```typescript
{
  // ===== STATE =====
  currentExam: ExamDetails | null
  questions: ExamQuestion[]
  currentQuestion: ExamQuestion | undefined
  currentQuestionIndex: number
  answers: Record<string, ExamAnswer>
  timeRemaining: number              // seconds
  status: ExamStatus
  error: string | null
  visitedQuestions: number[]
  flaggedQuestions: number[]
  session: ExamSession | null
  
  // ===== CALCULATED VALUES =====
  totalQuestions: number
  answeredQuestions: number
  progress: number                   // 0-100
  timeWarning: boolean               // < 5 minutes
  
  // ===== UI STATE =====
  isProctoringMinimized: boolean
  showSubmitModal: boolean
  isSubmitting: boolean
  
  // ===== HANDLERS =====
  handleAnswerChange: (answer: any) => void
  handleFlagQuestion: () => void
  handleNextQuestion: () => void
  handlePreviousQuestion: () => void
  handleGoToQuestion: (index: number) => void
  handleSubmitExam: () => Promise<void>
  handleTimeUp: () => void
  handleCameraReady: () => void
  handleCameraError: (error: string) => void
  
  // ===== UTILITIES =====
  formatTime: (seconds: number) => string
  navigate: NavigateFunction
  
  // ===== SETTERS =====
  setIsProctoringMinimized: (bool: boolean) => void
  setShowSubmitModal: (bool: boolean) => void
}
```

**Các Effects (Side Effects):**

```typescript
// 1. Initialize exam khi examId thay đổi
useEffect(() => {
  if (examId && status === 'idle') {
    dispatch(fetchExamDetails(examId));
  }
}, [examId, status, dispatch]);

// 2. Start timer khi exam active
useEffect(() => {
  if (status === 'active' && timeRemaining > 0) {
    const timer = setInterval(() => {
      dispatch(tickTimer());
    }, 1000);
    return () => clearInterval(timer);
  }
}, [status, timeRemaining, dispatch]);

// 3. Start session khi exam details loaded
useEffect(() => {
  if (status === 'idle' && currentExam && !session) {
    dispatch(startExamSession(currentExam.id));
  }
}, [status, currentExam, session, dispatch]);

// 4. Update status to active khi session starts
useEffect(() => {
  if (status === 'pre-check' && session) {
    dispatch(setStatus('active'));
  }
}, [status, session, dispatch]);

// 5. Auto-save answers mỗi 30 giây
useEffect(() => {
  const autoSave = setInterval(() => {
    if (session && currentQuestion && answers[currentQuestion.id]) {
      examService.saveAnswer(
        session.id,
        currentQuestion.id,
        answers[currentQuestion.id].answer
      );
    }
  }, 30000);
  return () => clearInterval(autoSave);
}, [session, currentQuestion, answers]);
```

**Cách sử dụng:**

```typescript
const {
  currentExam,
  currentQuestion,
  timeRemaining,
  progress,
  handleAnswerChange,
  handleSubmitExam,
  formatTime
} = useExamSession();

// Hiển thị câu hỏi
<ExamQuestion
  question={currentQuestion}
  onAnswerChange={handleAnswerChange}
/>

// Hiển thị timer
<div>{formatTime(timeRemaining)}</div>

// Nộp bài
<button onClick={handleSubmitExam}>Nộp bài</button>
```

---

### 2. `useAICameraMonitor()` - AI Camera Monitoring

**Vị trí:** `src/hooks/useAICameraMonitor.ts`

**Mục đích:** Giám sát camera với AI phát hiện gian lận

**Tham số:**
```typescript
{
  examId?: string      // ID bài thi
  studentId?: string   // ID học sinh
  sessionId?: string   // ID session
}
```

**Return Object:**

```typescript
{
  // ===== CAMERA STATE =====
  isActive: boolean
  isAnalyzing: boolean
  error: string | null
  
  // ===== DETECTION RESULTS =====
  detections: CheatingDetection[]
  metrics: CameraMetrics | null
  
  // ===== ACTIONS =====
  startMonitoring: () => Promise<void>
  stopMonitoring: () => void
  captureScreenshot: () => string | null
  
  // ===== CONFIGURATION =====
  setDetectionSensitivity: (level: 'low' | 'medium' | 'high') => void
  enableDetectionType: (type: string, enabled: boolean) => void
  
  // ===== FRAME STORAGE =====
  frameStorage: {
    totalFramesCaptured: number
    totalDetections: number
    storageSize: number
    getStatistics: () => any
    exportData: () => void
    clearAll: () => void
  }
}
```

**CheatingDetection Interface:**

```typescript
interface CheatingDetection {
  type: 'FACE_NOT_DETECTED'
       | 'MULTIPLE_FACES'
       | 'MOBILE_PHONE_DETECTED'
       | 'CAMERA_TAMPERED'
       | 'LOOKING_AWAY'
       | 'tab_switch'
  
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number              // 0-100
  timestamp: number               // milliseconds
  description: string
  screenshot?: string             // base64
  metadata?: any
}
```

**CameraMetrics Interface:**

```typescript
interface CameraMetrics {
  fps: number                     // Frames per second
  resolution: string              // "1280x720"
  brightness: number              // 0-100
  contrast: number                // 0-100
  isStable: boolean
}
```

**Các hàm chính:**

**`startMonitoring()`**
```typescript
// Bắt đầu giám sát camera
const { startMonitoring } = useAICameraMonitor();

await startMonitoring();
// - Truy cập camera
// - Bắt đầu phân tích frames
// - Gửi frames đến backend AI
```

**`stopMonitoring()`**
```typescript
// Dừng giám sát
const { stopMonitoring } = useAICameraMonitor();

stopMonitoring();
// - Dừng phân tích
// - Giải phóng camera
```

**`captureScreenshot()`**
```typescript
// Chụp ảnh từ camera
const { captureScreenshot } = useAICameraMonitor();

const screenshot = captureScreenshot();
// Returns: base64 string hoặc null
```

**`setDetectionSensitivity(level)`**
```typescript
// Đặt độ nhạy phát hiện
const { setDetectionSensitivity } = useAICameraMonitor();

setDetectionSensitivity('high');  // Nhạy hơn
// 'low' | 'medium' | 'high'
```

**`enableDetectionType(type, enabled)`**
```typescript
// Bật/tắt loại phát hiện
const { enableDetectionType } = useAICameraMonitor();

enableDetectionType('FACE_NOT_DETECTED', true);
enableDetectionType('MOBILE_PHONE_DETECTED', false);
```

**Cách sử dụng:**

```typescript
const {
  isActive,
  detections,
  metrics,
  startMonitoring,
  stopMonitoring
} = useAICameraMonitor({
  examId: 'exam-123',
  studentId: 'student-456',
  sessionId: 'session-789'
});

// Bắt đầu giám sát
useEffect(() => {
  startMonitoring();
  return () => stopMonitoring();
}, []);

// Xử lý phát hiện vi phạm
useEffect(() => {
  detections.forEach((detection) => {
    if (detection.severity === 'high' || detection.severity === 'critical') {
      // Hiển thị cảnh báo
      showViolationAlert(detection);
    }
  });
}, [detections]);
```

---

### 3. `useCamera()` - Camera Access

**Vị trí:** `src/hooks/useCamera.ts`

**Mục đích:** Truy cập camera của thiết bị

**Return Object:**

```typescript
{
  stream: MediaStream | null
  videoRef: React.RefObject<HTMLVideoElement>
  isActive: boolean
  error: string | null
  
  startCamera: () => Promise<void>
  stopCamera: () => void
  captureFrame: () => string | null  // base64
}
```

**Cách sử dụng:**

```typescript
const { videoRef, isActive, error, startCamera, stopCamera } = useCamera();

useEffect(() => {
  startCamera();
  return () => stopCamera();
}, []);

return (
  <div>
    <video ref={videoRef} autoPlay playsInline />
    {error && <p>Lỗi camera: {error}</p>}
  </div>
);
```

---

### 4. `useExamTimer()` - Timer Countdown

**Vị trí:** `src/hooks/useExamTimer.ts`

**Mục đích:** Quản lý timer đếm ngược

**Return Object:**

```typescript
{
  timeRemaining: number
  isWarning: boolean              // < 5 minutes
  isTimeUp: boolean
  
  startTimer: (seconds: number) => void
  stopTimer: () => void
  resetTimer: (seconds: number) => void
}
```

---

### 5. `useFrameStorage()` - Frame Storage

**Vị trị:** `src/hooks/useFrameStorage.ts`

**Mục đích:** Lưu trữ frames từ camera

**Tham số:**
```typescript
{
  maxFrames: number              // Max frames to store (default: 100)
  maxResponses: number           // Max AI responses (default: 200)
  autoCleanup: boolean           // Auto cleanup old data
  cleanupInterval: number        // Cleanup interval (ms)
}
```

**Return Object:**

```typescript
{
  totalFramesCaptured: number
  totalDetections: number
  storageSize: number            // bytes
  
  addFrame: (frameData: string, examId: string, studentId: string) => string
  addResponse: (frameId: string, detections: any[], processingTime: number) => void
  getStatistics: () => {
    totalFrames: number
    totalDetections: number
    detectionsByType: Record<string, number>
    severityDistribution: Record<string, number>
  }
  exportData: () => void         // Export as JSON
  clearAll: () => void
}
```

---

## 📡 API Services

### 1. `authApi.login()` - Đăng nhập

**Vị trí:** `src/services/api/authApi.ts`

```typescript
login(credentials: {
  usernameOrEmail: string
  password: string
}): Promise<{
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    user: {
      id: number
      email: string
      firstName: string
      lastName: string
      roles: string[]
      avatarUrl?: string
    }
  }
  message: string
}>
```

**Cách sử dụng:**

```typescript
const response = await authApi.login({
  usernameOrEmail: 'admin@test.com',
  password: 'password123'
});

if (response.success) {
  const { accessToken, user } = response.data;
  localStorage.setItem('accessToken', accessToken);
}
```

---

### 2. `onlineExamApi.getAllQuizzes()` - Lấy danh sách bài thi

**Vị trị:** `src/services/api/onlineExamApi.ts`

```typescript
getAllQuizzes(): Promise<Quiz[]>
```

**Response:**
```typescript
[
  {
    id: string
    title: string
    description: string
    timeLimitMinutes: number
    difficulty: 'easy' | 'medium' | 'hard'
    subject: string
    isProctored: boolean
    questions: Question[]
  }
]
```

---

### 3. `onlineExamApi.startQuiz()` - Bắt đầu bài thi

**Vị trị:** `src/services/api/onlineExamApi.ts`

```typescript
startQuiz(quizId: string): Promise<{
  data: {
    submissionId: string
    startTime: string
  }
}>
```

---

### 4. `onlineExamApi.submitQuiz()` - Nộp bài thi

**Vị trị:** `src/services/api/onlineExamApi.ts`

```typescript
submitQuiz(submissionId: string, payload: {
  answers: {
    questionId: string
    selectedOptionId: string
  }[]
}): Promise<{
  data: {
    submissionId: string
    score: number
    correctAnswers: number
    wrongAnswers: number
    totalQuestions: number
  }
}>
```

---

### 5. `examService.getExamDetails()` - Lấy thông tin bài thi

**Vị trị:** `src/services/examService.ts`

```typescript
getExamDetails(examId: string): Promise<ExamDetails>
```

**Quy trình:**
1. Gọi `onlineExamApi.getQuizDetails(examId)`
2. Adapter convert backend Quiz → frontend ExamDetails
3. Return ExamDetails

---

### 6. `examService.submitExam()` - Nộp bài thi

**Vị trị:** `src/services/examService.ts`

```typescript
submitExam(submission: ExamSubmission): Promise<ExamResult>
```

**Quy trình:**
1. Convert frontend answers → backend format
2. Gọi `onlineExamApi.submitQuiz()`
3. Clear cached answers
4. Return ExamResult với submissionId

---

## 🎯 Component Handlers

### ExamTakingPage Handlers

**`handleViolationDetected(detection)`**
```typescript
// Xử lý khi phát hiện vi phạm
const handleViolationDetected = useCallback(async (detection: CheatingDetection) => {
  setViolations(prev => [...prev, detection]);
  
  // Hiển thị cảnh báo nếu severity >= medium
  if (['medium', 'high', 'critical'].includes(detection.severity)) {
    setCurrentViolation(detection);
    setShowViolationAlert(true);
  }
}, []);
```

**`handleViolationAlertDismiss()`**
```typescript
// Đóng cảnh báo vi phạm
const handleViolationAlertDismiss = useCallback(() => {
  setShowViolationAlert(false);
  setCurrentViolation(null);
}, []);
```

**`handleExamStop()`**
```typescript
// Dừng bài thi do vi phạm
const handleExamStop = useCallback(() => {
  setExamStopped(true);
  setShowViolationAlert(false);
  
  // Redirect sau 2 giây
  setTimeout(() => {
    navigate('/exam/stopped');
  }, 2000);
}, [navigate]);
```

---

## 🛠️ Utility Functions

### `formatTime(seconds)` - Format thời gian

**Vị trị:** `src/hooks/useExamSession.ts`

```typescript
const formatTime = useCallback((seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}, []);

// Ví dụ:
formatTime(3661) // "01:01:01"
formatTime(300)  // "00:05:00"
```

---

## 📊 Data Flow Diagram

### Exam Taking Flow

```
User clicks "Start Exam"
  ↓
ExamPreCheckPage
  ↓
fetchExamDetails(examId)
  ├─ onlineExamApi.getQuizDetails()
  ├─ Adapter convert Quiz → ExamDetails
  └─ Update Redux: currentExam, questions
  ↓
startExamSession(examId)
  ├─ onlineExamApi.startQuiz()
  ├─ Create submission on backend
  └─ Update Redux: session, startTime
  ↓
ExamTakingPage
  ├─ useExamSession() hook
  ├─ useAICameraMonitor() hook
  ├─ Timer starts (tickTimer every 1s)
  └─ Auto-save every 30s
  ↓
User answers questions
  ├─ handleAnswerChange()
  ├─ updateAnswer() → Redux
  └─ Local state update
  ↓
User clicks "Submit"
  ├─ submitExam()
  ├─ onlineExamApi.submitQuiz()
  ├─ Backend calculates score
  └─ Return ExamResult
  ↓
ExamResultPage
  └─ Display score, statistics
```

---

**Tài liệu này được cập nhật lần cuối vào Nov 2024**
