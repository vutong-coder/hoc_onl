# 🎓 NCKH Online Examination System

> Hệ thống thi trực tuyến hiện đại với giám sát camera và xác thực blockchain

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.9-646cff?logo=vite)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.9.0-764abc?logo=redux)](https://redux-toolkit.js.org/)

## ✨ Tính năng nổi bật

- 🎥 **Giám sát camera thời gian thực** - Đảm bảo tính công bằng trong thi cử
- ⏱️ **Quản lý thời gian thông minh** - Đồng hồ đếm ngược và cảnh báo
- 🔒 **Bảo mật cao** - Chống gian lận với nhiều lớp bảo mật
- 📊 **Dashboard trực quan** - Theo dõi tiến độ và kết quả
- 🎨 **Giao diện hiện đại** - Dark/Light theme với Glassmorphism
- 🔗 **Blockchain integration** - Xác thực kết quả thi bằng smart contract
- 📱 **Responsive design** - Hoạt động mượt mà trên mọi thiết bị
- 💾 **Auto-save** - Tự động lưu câu trả lời mỗi 30 giây

## 🚀 Bắt đầu nhanh

### Yêu cầu hệ thống

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **Camera** (để sử dụng tính năng giám sát)
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+

### Cài đặt

```bash
# Clone repository
git clone https://github.com/vutong-coder/hoc_onl.git
cd hoc_onl/web-frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở trình duyệt và truy cập: `http://localhost:5173`

### Build cho production

```bash
# Build project
npm run build

# Preview production build
npm run preview
```

## 📁 Cấu trúc dự án

```
web-frontend/
├── src/
│   ├── components/           # React Components
│   │   ├── atoms/           # UI cơ bản (Button, Input, Card...)
│   │   ├── molecules/       # Components kết hợp (ExamQuestion, Timer...)
│   │   ├── sections/        # Các section lớn (Hero, Features...)
│   │   └── layouts/         # Layout components (Header, Sidebar...)
│   ├── pages/               # Pages
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ExamPreCheckPage.tsx
│   │   ├── ExamTakingPage.tsx
│   │   └── ExamResultPage.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useCamera.ts
│   │   ├── useExamTimer.ts
│   │   └── usePlagiarismCheck.ts
│   ├── store/               # Redux store
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── examSlice.ts
│   │       └── walletSlice.ts
│   ├── services/            # API services
│   │   ├── examService.ts
│   │   ├── monitorService.ts
│   │   └── blockchain/
│   ├── routes/              # Routing configuration
│   ├── utils/               # Utilities & helpers
│   └── assets/              # CSS & static files
├── public/                  # Public assets
└── dist/                    # Build output
```

## 🎯 Luồng hoạt động hệ thống thi

```
┌─────────────────┐
│   Dashboard     │  User xem danh sách bài thi
└────────┬────────┘
         │ Click "Start Exam"
         ▼
┌─────────────────┐
│ Pre-Check Page  │  Kiểm tra camera & hướng dẫn
└────────┬────────┘
         │ Camera Ready
         ▼
┌─────────────────┐
│ Exam Taking     │  Làm bài thi với giám sát
│    Page         │  • Auto-save mỗi 30s
│                 │  • Screenshot mỗi 10s
│                 │  • Timer countdown
└────────┬────────┘
         │ Submit hoặc hết giờ
         ▼
┌─────────────────┐
│ Result Page     │  Hiển thị kết quả và thống kê
└─────────────────┘
```

## 🔑 Tính năng chính

### 1. 🎥 Hệ thống giám sát

**Camera Monitoring**
- Yêu cầu quyền camera/microphone
- Video stream trực tiếp
- Chụp ảnh giám sát định kỳ (10s)
- Mã hóa và gửi lên server

**Anti-Cheating**
- Phát hiện rời khỏi tab
- Theo dõi focus window
- Phát hiện nhiều người
- Ghi âm môi trường

### 2. ⏰ Quản lý thời gian

- Đồng hồ đếm ngược chính xác
- Thanh tiến trình trực quan
- Cảnh báo trước khi hết giờ (5 phút, 1 phút)
- Tự động nộp bài khi timeout

### 3. 📝 Quản lý câu hỏi

- Hỗ trợ nhiều loại: trắc nghiệm, code, tự luận
- Navigation linh hoạt giữa câu hỏi
- Đánh dấu để xem lại
- Theo dõi trạng thái (đã làm/chưa làm)

### 4. 💾 Lưu trữ thông minh

- Auto-save câu trả lời (30s)
- Lưu khi chuyển câu hỏi
- Sync với server real-time
- Backup local storage

### 5. 🔐 Bảo mật

- HTTPS required cho camera
- JWT authentication
- Session management
- Blockchain verification (Ethers.js)
- Encryption for screenshots

## 🛠️ Tech Stack

### Frontend Core
- **React 18** - UI library với hooks
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router v6** - Client-side routing

### State Management
- **Redux Toolkit** - Global state
- **React Context** - Local state

### Styling
- **CSS Modules** - Scoped styling
- **CSS Variables** - Dynamic theming
- **OKLCH Color Space** - Modern color system

### HTTP & API
- **Axios** - HTTP client
- **REST API** - Backend communication

### Blockchain
- **Ethers.js** - Web3 integration
- **MetaMask** - Wallet connection

### Icons & UI
- **Lucide React** - Icon library
- **Custom Components** - Design system

## 📚 API Services

### examService
```typescript
// Lấy thông tin bài thi
fetchExamDetails(examId: string): Promise<ExamDetails>

// Bắt đầu session thi
startExamSession(examId: string): Promise<SessionData>

// Lưu câu trả lời
saveAnswer(questionId: number, answer: any): Promise<void>

// Nộp bài thi
submitExam(examId: string, answers: Answer[]): Promise<Result>

// Gửi ảnh giám sát
sendScreenshot(examId: string, image: Blob): Promise<void>
```

### monitorService
```typescript
// Ghi lại hành vi
logBehavior(event: BehaviorEvent): Promise<void>

// Phát hiện gian lận
detectCheating(data: MonitorData): Promise<CheatingAlert>
```

## 🎨 Design System

### Colors
- **Primary**: `oklch(0.65 0.25 30)` - Orange gradient
- **Secondary**: `oklch(0.95 0.01 60)` - Light gray
- **Accent**: `oklch(0.70 0.20 180)` - Cyan
- **Success**: `oklch(0.70 0.20 140)` - Green
- **Warning**: `oklch(0.75 0.20 80)` - Yellow
- **Error**: `oklch(0.60 0.25 20)` - Red

### Typography
- **Display**: Poppins (headings)
- **Body**: Inter (content)
- **Mono**: JetBrains Mono (code)
- **Accent**: Space Grotesk (special)

### Spacing Scale
```
xs: 4px, sm: 8px, md: 16px, lg: 24px,
xl: 32px, 2xl: 48px, 3xl: 64px, 4xl: 96px
```

## 🔧 Scripts

```bash
npm run dev        # Start dev server (localhost:5173)
npm run build      # Build cho production
npm run preview    # Preview production build
npm run lint       # Chạy ESLint
```

## 📖 Hướng dẫn sử dụng

### Cho học sinh

1. **Đăng ký/Đăng nhập**
   - Tạo tài khoản mới hoặc đăng nhập
   - Xác thực email (nếu cần)

2. **Xem danh sách bài thi**
   - Truy cập Dashboard
   - Chọn bài thi cần làm

3. **Chuẩn bị thi**
   - Đọc kỹ hướng dẫn
   - Cho phép quyền camera/microphone
   - Kiểm tra camera hoạt động

4. **Làm bài thi**
   - Đọc và trả lời câu hỏi
   - Sử dụng navigation để di chuyển
   - Đánh dấu câu cần xem lại
   - Nộp bài hoặc chờ hết giờ

5. **Xem kết quả**
   - Kiểm tra điểm số
   - Xem phân tích chi tiết
   - Lưu chứng chỉ (nếu đạt)

### Cho giám thị

1. **Giám sát real-time**
   - Theo dõi camera của thí sinh
   - Nhận cảnh báo gian lận
   - Xem hành vi bất thường

2. **Quản lý bài thi**
   - Tạo bài thi mới
   - Cấu hình thời gian
   - Thêm câu hỏi

3. **Xem báo cáo**
   - Thống kê kết quả
   - Phân tích dữ liệu
   - Export reports

## 🔍 Troubleshooting

### Camera không hoạt động
```
✓ Kiểm tra quyền truy cập trong browser
✓ Đảm bảo không có app khác dùng camera
✓ Thử refresh hoặc restart browser
✓ Kiểm tra HTTPS (camera chỉ hoạt động trên HTTPS)
```

### Lỗi kết nối
```
✓ Kiểm tra internet connection
✓ Xem console log để debug
✓ Clear cache và reload
✓ Thử browser khác
```

### Bài thi không load
```
✓ Kiểm tra API endpoint
✓ Xem network tab trong DevTools
✓ Kiểm tra authentication token
✓ Liên hệ support
```

## 🚦 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Supported |
| Firefox | 88+     | ✅ Supported |
| Safari  | 14+     | ✅ Supported |
| Edge    | 90+     | ✅ Supported |

## 🎯 Roadmap

### Phase 1 - Core Features ✅
- [x] Authentication system
- [x] Exam management
- [x] Camera monitoring
- [x] Timer & auto-submit

### Phase 2 - Advanced Features 🚧
- [ ] AI-powered cheat detection
- [ ] Eye tracking
- [ ] Facial recognition
- [ ] Voice analysis

### Phase 3 - Ecosystem 📋
- [ ] Mobile app (React Native)
- [ ] AI question generation
- [ ] Analytics dashboard
- [ ] Multi-language support

### Phase 4 - Enterprise 🔮
- [ ] SSO integration
- [ ] Advanced reporting
- [ ] API for third-party
- [ ] White-label solution

## 🤝 Contributing

Chúng tôi rất hoan nghênh mọi đóng góp! Vui lòng làm theo các bước:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Style
- Sử dụng TypeScript strict mode
- Follow ESLint rules
- Write meaningful commit messages
- Add comments cho logic phức tạp
- Update documentation

## 📄 License

Dự án này được cấp phép theo giấy phép **MIT License** - xem file [LICENSE](LICENSE) để biết chi tiết.

## 👥 Team

- **Vũ Tống** - *Lead Developer* - [@vutong-coder](https://github.com/vutong-coder)

## 📞 Liên hệ & Hỗ trợ

- **GitHub Issues**: [Create an issue](https://github.com/vutong-coder/hoc_onl/issues)
- **Email**: support@nckh-exam.com
- **Documentation**: [Wiki](https://github.com/vutong-coder/hoc_onl/wiki)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework tuyệt vời
- [Vite](https://vitejs.dev/) - Build tool siêu nhanh
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management đơn giản
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Ethers.js](https://docs.ethers.org/) - Web3 integration

---

<div align="center">
  <strong>Made with ❤️ using React + TypeScript</strong>
  <br>
  <sub>© 2024 NCKH Online Examination System</sub>
</div>
