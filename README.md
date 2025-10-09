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