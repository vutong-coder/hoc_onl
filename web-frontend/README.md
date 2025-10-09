# 🚀 NCKH Project - Modern Web Application

## 📋 Tổng quan dự án

Dự án NCKH là một ứng dụng web hiện đại được xây dựng với React + TypeScript, có giao diện đẹp mắt và chức năng đầy đủ cho cả admin và người dùng cuối.

## 🏗️ Cấu trúc dự án

```
nckh/
├── web-frontend/                 # Frontend React Application
│   ├── src/
│   │   ├── components/          # React Components
│   │   │   ├── atoms/           # Basic UI components
│   │   │   ├── molecules/       # Composite components
│   │   │   └── layouts/         # Layout components
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API & external services
│   │   ├── store/               # Redux store & slices
│   │   ├── routes/              # React Router configuration
│   │   ├── utils/                # Utility functions
│   │   └── assets/              # Static assets
│   │       ├── theme.css        # Main CSS file
│   │       └── css/             # Modular CSS files
│   │           ├── variables.css    # CSS Variables & Theme
│   │           ├── base.css         # Base styles
│   │           ├── typography.css   # Typography system
│   │           ├── animations.css   # Animations & keyframes
│   │           ├── components.css   # Component styles
│   │           └── utilities.css    # Utility classes
│   ├── public/                  # Public assets
│   ├── dist/                    # Build output
│   ├── package.json             # Dependencies
│   └── vite.config.ts           # Vite configuration
├── test.html                    # Design reference
└── README.md                    # This file
```

## 🎨 Giao diện & Design System

### Theme System
- **Dark Theme**: Mặc định, giống với test.html
- **Light Theme**: Tự động chuyển theo browser preference
- **Colors**: Sử dụng OKLCH color space cho độ chính xác cao
- **Typography**: Inter, Poppins, JetBrains Mono, Space Grotesk

### CSS Architecture
- **Modular Structure**: CSS được tách thành các file riêng biệt
- **CSS Variables**: Dynamic theming với CSS custom properties
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions và micro-interactions

### Components
- **Cards**: Glassmorphism effects với hover animations
- **Buttons**: Gradient backgrounds và shimmer effects
- **Icons**: Enhanced với glow effects
- **Grids**: Responsive layout systems

## 🔧 Công nghệ sử dụng

### Frontend Stack
- **React 18**: UI library với hooks
- **TypeScript**: Type safety và better DX
- **Vite**: Fast build tool và dev server
- **React Router**: Client-side routing
- **Redux Toolkit**: State management
- **Lucide React**: Icon library

### Styling
- **CSS Modules**: Scoped styling
- **CSS Variables**: Dynamic theming
- **OKLCH Colors**: Modern color space
- **Glassmorphism**: Modern UI effects

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 🚀 Cài đặt & Chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm >= 8.0.0

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd nckh

# Cài đặt dependencies
cd web-frontend
npm install
```

### Chạy development server
```bash
npm run dev
```

### Build production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 📱 Tính năng chính

### Admin Dashboard
- **Dashboard**: Tổng quan hệ thống
- **Exam Management**: Quản lý bài thi
- **Monitor**: Giám sát hệ thống
- **Reward**: Quản lý phần thưởng

### User Homepage
- **Welcome Banner**: Chào mừng người dùng
- **Continue Practice**: Tiếp tục luyện tập
- **Prepare by Topic**: Luyện tập theo chủ đề
- **Certification**: Chứng chỉ
- **Daily Streak**: Chuỗi ngày học

### Authentication
- **Login**: Đăng nhập
- **Register**: Đăng ký
- **Forgot Password**: Quên mật khẩu
- **Password Strength**: Kiểm tra độ mạnh mật khẩu

## 📹 Hệ thống Thi với Giám sát Camera

### Tổng quan
Hệ thống thi với giám sát camera được thiết kế để đảm bảo tính công bằng và minh bạch trong quá trình làm bài thi trực tuyến. Hệ thống sử dụng camera để giám sát người dùng trong suốt quá trình thi.

### Luồng hoạt động (Exam Flow)

```
Người dùng nhấn "Start Exam" từ Dashboard
    ↓
ExamPreCheckPage (/exam/:examId/pre-check)
    ↓ Kiểm tra camera và hướng dẫn
ExamTakingPage (/exam/:examId/take)
    ↓ Làm bài thi với giám sát
ExamResultPage (/exam/:examId/result)
```

### Các thành phần chi tiết

#### 1. ExamPreCheckPage
- Hiển thị hướng dẫn làm bài thi
- Yêu cầu quyền truy cập camera/microphone
- Kiểm tra camera hoạt động
- Xác nhận người dùng sẵn sàng
- **Components**: `CameraCheckSection`, `ExamInstructionsSection`, `ExamReadySection`

#### 2. ExamTakingPage
Giao diện chính gồm:
- **Main Content**: Hiển thị câu hỏi và các lựa chọn
- **Sidebar**:
  - Đồng hồ đếm ngược (`CountdownTimer`)
  - Navigation câu hỏi (`ExamProgressIndicator`)
  - Camera giám sát (`ProctoringView`)

**Tính năng tự động**:
- Auto-save câu trả lời mỗi 30 giây
- Chụp ảnh màn hình mỗi 10 giây
- Tự động nộp bài khi hết giờ
- Cảnh báo khi sắp hết giờ (5 phút, 1 phút)

#### 3. ExamResultPage
- Hiển thị điểm số với biểu đồ trực quan
- Thống kê chi tiết (số câu đúng, thời gian làm bài)
- Trạng thái đạt/không đạt
- Các bước tiếp theo (xem chi tiết, về dashboard)

### Components chi tiết

#### ProctoringView Component
```
┌─────────────────────────────────────┐
│          ProctoringView             │
├─────────────────────────────────────┤
│ [●] Camera giám sát    [⚙][-]      │
│                                     │
│         Video Stream                │
│      (User's Camera)                │
│                                     │
│ Camera đang được sử dụng để         │
│ giám sát quá trình làm bài thi      │
└─────────────────────────────────────┘
```
- Hiển thị video stream từ camera
- Điều khiển camera (bật/tắt, thu nhỏ/mở rộng)
- Hiển thị trạng thái camera (sẵn sàng/lỗi)

#### CountdownTimer Component
- Đồng hồ đếm ngược chính xác
- Thanh tiến trình thời gian
- Cảnh báo màu sắc khi sắp hết giờ
- Hiển thị phút:giây

#### ExamQuestion Component
```
┌─────────────────────────────────────┐
│ [C3/25] [4 điểm] [Trắc nghiệm] [🚩] │
│                                     │
│ Câu hỏi: ...                        │
│                                     │
│ ○ A. Đáp án 1                       │
│ ● B. Đáp án 2 (đã chọn)            │
│ ○ C. Đáp án 3                       │
│ ○ D. Đáp án 4                       │
│                                     │
│ [← Câu trước]  [Sau →]              │
└─────────────────────────────────────┘
```
- Hỗ trợ nhiều loại câu hỏi (trắc nghiệm, code, tự luận)
- Đánh dấu câu hỏi để xem lại
- Theo dõi thời gian làm từng câu
- Navigation giữa các câu

### Hooks & Services

#### useCamera Hook
Quản lý camera và microphone:
- Yêu cầu quyền truy cập camera/microphone
- Cung cấp stream video
- Chụp ảnh màn hình để giám sát
- Xử lý lỗi camera
- Dọn dẹp tài nguyên khi kết thúc

**Cấu hình camera**:
```typescript
const mediaStream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user'
  },
  audio: true
})
```

#### examService
Quản lý API liên quan đến bài thi:
- `fetchExamDetails(examId)`: Lấy thông tin bài thi
- `startExamSession(examId)`: Bắt đầu session thi
- `saveAnswer(questionId, answer)`: Lưu câu trả lời tạm thời
- `submitExam(examId, answers)`: Nộp bài thi
- `sendScreenshot(examId, imageData)`: Gửi ảnh giám sát

#### examSlice (Redux)
State management cho bài thi:
```typescript
{
  currentExam: ExamDetails
  questions: ExamQuestion[]
  currentQuestionIndex: number
  answers: Record<number, ExamAnswer>
  timeRemaining: number
  status: 'idle' | 'loading' | 'taking' | 'completed'
  isCameraReady: boolean
  visitedQuestions: Set<number>
  flaggedQuestions: Set<number>
}
```

### Tính năng bảo mật

#### 1. Giám sát camera
- Yêu cầu quyền truy cập camera và microphone
- Hiển thị video stream trực tiếp
- Chụp ảnh màn hình định kỳ (mỗi 10 giây)
- Gửi ảnh về server để phân tích

#### 2. Bảo mật dữ liệu
- Sử dụng HTTPS để truy cập camera
- Không lưu video stream, chỉ chụp ảnh
- Ảnh giám sát được mã hóa trước khi gửi
- Session timeout handling

#### 3. Chống gian lận
- Không cho phép rời khỏi tab
- Giám sát liên tục qua camera
- Ghi lại âm thanh
- Phát hiện hành vi bất thường
- Tab focus monitoring

### API Flow

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          │ fetchExamDetails     │
          ├─────────────────────►│
          │                      │
          │ startExamSession     │
          ├─────────────────────►│
          │                      │
          │ saveAnswer (30s)     │
          ├─────────────────────►│
          │                      │
          │ sendScreenshot (10s) │
          ├─────────────────────►│
          │                      │
          │ submitExam           │
          ├─────────────────────►│
          │                      │
          │ ◄────────────────────┤
          │    Result            │
```

### Xử lý lỗi (Error Handling)

#### Camera Errors
- **Permission denied**: Thông báo yêu cầu cấp quyền
- **Camera not found**: Hướng dẫn kiểm tra thiết bị
- **Stream failed**: Thử refresh trang

#### Network Errors
- **Save answer failed**: Retry mechanism
- **Submit exam failed**: Lưu local và sync sau
- **Screenshot upload failed**: Queue và retry

#### UI Errors
- **Timer sync issues**: Đồng bộ với server
- **Navigation problems**: Fallback navigation
- **State corruption**: Recovery mechanism

### Cách sử dụng

#### 1. Bắt đầu thi
```typescript
// Từ component UpcomingExams
const handleStartExam = (examId: string) => {
  navigate(`/exam/${examId}/pre-check`)
}
```

#### 2. Kiểm tra camera
```typescript
// Trong ExamPreCheckPage
const { startCamera, isCameraOn, error } = useCamera()

useEffect(() => {
  startCamera()
}, [])
```

#### 3. Làm bài thi
```typescript
// Trong ExamTakingPage
const handleAnswerChange = (answer: any) => {
  dispatch(updateAnswer({ questionId: currentQuestion.id, answer }))
}
```

#### 4. Nộp bài
```typescript
const handleSubmitExam = async () => {
  await dispatch(submitExam())
  navigate(`/exam/${examId}/result`)
}
```

### Troubleshooting

#### Camera không hoạt động
1. Kiểm tra quyền truy cập camera trong browser settings
2. Đảm bảo camera không bị ứng dụng khác sử dụng
3. Kiểm tra kết nối internet
4. Thử refresh trang hoặc restart browser

#### Lỗi khi lưu câu trả lời
1. Kiểm tra kết nối internet
2. Câu trả lời sẽ được lưu tự động khi kết nối ổn định
3. Liên hệ hỗ trợ nếu vấn đề tiếp tục

#### Hết giờ đột ngột
1. Kiểm tra đồng hồ hệ thống
2. Đảm bảo không có ứng dụng khác làm chậm máy
3. Liên hệ hỗ trợ để kiểm tra log

### Yêu cầu hệ thống cho thi

#### Browser hỗ trợ
- Chrome/Edge (khuyến nghị): 90+
- Firefox: 88+
- Safari: 14+

#### Thiết bị
- Camera: Độ phân giải tối thiểu 720p
- Microphone: Hoạt động tốt
- Internet: Tốc độ ổn định >= 2Mbps
- RAM: >= 4GB khuyến nghị

### Phát triển tiếp

#### Tính năng có thể thêm
1. Phát hiện gian lận bằng AI
2. Ghi âm toàn bộ quá trình thi
3. Theo dõi chuyển động mắt (eye tracking)
4. Phân tích hành vi bất thường
5. Tích hợp blockchain để xác thực kết quả

#### Cải tiến hiệu suất
1. WebRTC cho video streaming
2. Compression ảnh giám sát
3. Batch upload ảnh
4. Offline support với sync sau
5. Service Worker cho PWA

## 🎯 Routing Structure

```
/ (User Routes)
├── /home                    # User homepage
├── /exam                    # Exam page
├── /monitor                 # Monitor page
├── /reward                  # Reward page
└── /auth/*                  # Authentication pages

/admin (Admin Routes)
├── /admin/dashboard         # Admin dashboard
├── /admin/exam              # Exam management
├── /admin/monitor           # System monitoring
└── /admin/reward            # Reward management
```

## 🎨 CSS Architecture

### Modular CSS Structure
```
assets/css/
├── variables.css         # CSS Variables & Theme System
├── base.css              # Base HTML elements & reset
├── typography.css        # Typography system
├── animations.css        # Keyframes & animation classes
├── components.css        # Component styles
└── utilities.css         # Utility classes
```

### CSS Variables System
- **Colors**: Primary, secondary, accent, muted colors
- **Spacing**: Consistent spacing scale (4px to 96px)
- **Typography**: Font families, sizes, weights
- **Shadows**: Layered shadow system
- **Transitions**: Smooth animation timings
- **Gradients**: Modern gradient backgrounds
- **Glassmorphism**: Backdrop blur effects

### Utility Classes
- **Layout**: `.container`, `.flex`, `.grid`
- **Spacing**: `.p-*`, `.m-*`, `.gap-*`
- **Typography**: `.text-*`, `.font-*`
- **Hover Effects**: `.hover-lift`, `.hover-glow`
- **States**: `.loading`, `.success`, `.warning`

## 🔄 State Management

### Redux Store Structure
```
store/
├── index.ts               # Store configuration
├── hooks.ts               # Typed hooks
└── slices/
    ├── authSlice.ts       # Authentication state
    ├── examSlice.ts       # Exam state
    ├── monitorSlice.ts    # Monitor state
    └── walletSlice.ts     # Wallet state
```

## 🎭 Custom Hooks

### Available Hooks
- **useCameraMonitor**: Camera monitoring functionality
- **useExamTimer**: Exam timer management
- **useMultisigWallet**: Multi-signature wallet
- **usePlagiarismCheck**: Plagiarism detection
- **useRewardToken**: Reward token management

## 📊 Services

### API Services
- **examApi.ts**: Exam-related API calls
- **walletService.ts**: Blockchain wallet operations
- **monitorService.ts**: System monitoring

### External Integrations
- **Blockchain**: Wallet integration
- **Camera**: Monitoring capabilities
- **AI**: Plagiarism detection

## 🎨 Design System

### Color Palette
- **Primary**: Orange gradient (#FF6B35)
- **Secondary**: Light gray (#F5F5F5)
- **Accent**: Green (#00D4AA)
- **Success**: Green gradient
- **Warning**: Yellow gradient
- **Error**: Red gradient

### Typography Scale
- **Display**: Poppins (headings)
- **Body**: Inter (text content)
- **Mono**: JetBrains Mono (code)
- **Serif**: Space Grotesk (special text)

### Spacing System
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

## 🚀 Performance Optimizations

### Build Optimizations
- **Vite**: Fast HMR và build
- **Tree Shaking**: Loại bỏ code không sử dụng
- **Code Splitting**: Lazy loading components
- **Asset Optimization**: Image và font optimization

### Runtime Optimizations
- **CSS Variables**: Dynamic theming không cần re-render
- **Hardware Acceleration**: GPU-accelerated animations
- **Memoization**: React.memo cho components
- **Lazy Loading**: Route-based code splitting

## 🔧 Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb config
- **Prettier**: Consistent formatting
- **Conventional Commits**: Standardized commit messages

### Component Structure
```tsx
// Component template
interface ComponentProps {
  // Props interface
}

export default function Component({ }: ComponentProps): JSX.Element {
  // Component logic
  return (
    // JSX
  )
}
```

### CSS Guidelines
- **CSS Variables**: Sử dụng cho dynamic values
- **Utility Classes**: Cho layout và spacing
- **Component Classes**: Cho component-specific styles
- **Responsive**: Mobile-first approach

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Responsive Features
- **Flexible Grids**: Auto-fit grid layouts
- **Responsive Typography**: clamp() for font sizes
- **Adaptive Spacing**: CSS variables for spacing
- **Mobile Navigation**: Collapsible navigation

## 🎯 Future Enhancements

### Planned Features
- **PWA Support**: Progressive Web App capabilities
- **Offline Mode**: Service worker implementation
- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: User behavior tracking
- **Multi-language**: i18n support

### Technical Improvements
- **Testing**: Unit và integration tests
- **Storybook**: Component documentation
- **Performance Monitoring**: Real-time metrics
- **Error Tracking**: Sentry integration

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch
3. Make changes
4. Run tests
5. Submit pull request

### Code Review Process
- **Automated Checks**: ESLint, TypeScript, tests
- **Manual Review**: Code quality và architecture
- **Design Review**: UI/UX consistency

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Frontend Developer**: React + TypeScript expertise
- **UI/UX Designer**: Modern design system
- **Backend Developer**: API integration
- **DevOps**: Deployment và monitoring

## 📞 Support

For support and questions:
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@example.com

---

**Made with ❤️ using React + TypeScript + Modern CSS**