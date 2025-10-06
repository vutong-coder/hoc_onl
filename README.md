# EduPlatform - Hệ Thống Học Tập Trực Tuyến

## 📖 Giới Thiệu

EduPlatform là một hệ thống học tập trực tuyến hiện đại được xây dựng với React và TypeScript. Hệ thống cung cấp các tính năng quản lý khóa học, thi trực tuyến, chống gian lận và phần thưởng token.

## ✨ Tính Năng Chính

### 🔐 Hệ Thống Xác Thực
- **Đăng nhập/Đăng ký**: Giao diện thân thiện với validation đầy đủ
- **Quên mật khẩu**: Khôi phục mật khẩu qua email
- **Bảo mật mật khẩu**: 
  - Không cho phép chữ có dấu tiếng Việt
  - Không cho phép dấu cách
  - Chỉ thị độ mạnh mật khẩu real-time
  - Toggle hiển thị/ẩn mật khẩu

### 🎨 Giao Diện & Theme
- **Dark/Light Mode**: Tự động chuyển đổi theo cài đặt trình duyệt
- **Responsive Design**: Tương thích mọi thiết bị
- **Smooth Animations**: Hiệu ứng chuyển động mượt mà
- **Theme Notification**: Thông báo theme tự động ẩn sau 5 giây

### 🏗️ Kiến Trúc Code
- **Atomic Design**: Tổ chức components theo nguyên tắc atomic
- **TypeScript**: Type safety và IntelliSense
- **Reusable Components**: Components tái sử dụng cao
- **Clean Architecture**: Cấu trúc code rõ ràng, dễ bảo trì

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **CSS Variables** - Theme System
- **React Router** - Navigation

### Styling
- **CSS Custom Properties** - Theme variables
- **CSS Animations** - Smooth transitions
- **Responsive Design** - Mobile-first approach

## 📁 Cấu Trúc Dự Án

```
web-frontend/
├── src/
│   ├── components/
│   │   ├── atoms/           # Components cơ bản
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   └── ...
│   │   ├── molecules/       # Components phức tạp
│   │   │   └── AuthForm.tsx
│   │   └── layouts/         # Layout components
│   │       ├── AuthLayout.tsx
│   │       ├── DashboardLayout.tsx
│   │       └── ...
│   ├── pages/              # Trang chính
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   └── ...
│   ├── utils/              # Utilities
│   │   └── authValidation.ts
│   ├── assets/             # Static assets
│   │   └── theme.css
│   └── routes/             # Routing
│       └── AppRoutes.tsx
└── public/                 # Public assets
```

## 🚀 Cài Đặt & Chạy

### Yêu Cầu Hệ Thống
- Node.js >= 16.0.0
- npm >= 8.0.0

### Cài Đặt Dependencies
```bash
cd web-frontend
npm install
```

### Chạy Development Server
```bash
npm run dev
```

### Build Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎯 Tính Năng Chi Tiết

### 🔐 Authentication Pages

#### Login Page
- Email và password validation
- Checkbox "Remember me"
- Link "Forgot Password?" cùng hàng với checkbox
- Button "Login" màu xanh
- Footer với link đăng ký

#### Register Page
- Form đăng ký với validation đầy đủ
- Password strength indicator
- Confirm password validation
- Real-time feedback

#### Forgot Password Page
- Email validation
- Success message với auto-hide
- Clean interface

### 🎨 Theme System

#### Auto Theme Switching
```css
/* Light Theme (Default) */
:root {
  --background: oklch(0.98 0 0);
  --foreground: oklch(0.15 0 0);
  /* ... */
}

/* Dark Theme */
@media (prefers-color-scheme: dark) {
  :root {
    --background: oklch(0.1450 0 0);
    --foreground: oklch(0.9850 0 0);
    /* ... */
  }
}
```

#### Theme Notification
- Hiển thị theme hiện tại (🌙 Dark / ☀️ Light)
- Tự động ẩn sau 5 giây
- Hiện lại khi theme thay đổi

### 🔒 Password Validation

#### Rules
- Tối thiểu 6 ký tự
- Không có chữ có dấu tiếng Việt
- Không có dấu cách
- Chỉ thị độ mạnh real-time

#### Strength Levels
- **Weak**: Score ≤ 2
- **Fair**: Score 3-4  
- **Good**: Score 5
- **Strong**: Score 6+

## 🎨 UI/UX Features

### Animations
- **fadeInUp**: Hiệu ứng xuất hiện từ dưới lên
- **shake**: Hiệu ứng rung khi có lỗi
- **fadeOut**: Hiệu ứng biến mất mượt mà

### Responsive Design
- Mobile-first approach
- Breakpoints tương thích
- Touch-friendly interface

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators

## 🔧 Development

### Code Style
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Component documentation

### Git Workflow
- Feature branches
- Conventional commits
- Code review process
- Automated testing

## 📝 Commit History

### Recent Updates
- ✅ Complete authentication system
- ✅ Theme switching implementation
- ✅ Password validation system
- ✅ Component refactoring
- ✅ Responsive design improvements

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 👥 Contributors

- **@vutong-coder** - Project Lead
- **@xuanquyett** - Developer

## 📞 Liên Hệ

- **Repository**: [https://github.com/vutong-coder/hoc_onl](https://github.com/vutong-coder/hoc_onl)
- **Issues**: [GitHub Issues](https://github.com/vutong-coder/hoc_onl/issues)

---

⭐ **Nếu dự án này hữu ích, hãy cho chúng tôi một star!** ⭐