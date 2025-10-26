# 🎥 Hệ thống Camera Kép - ExamPreCheckPage + ExamTakingPage

## ✨ Áp dụng cho cả hai trang

### 🎯 **ExamPreCheckPage (Kiểm tra camera)**

#### **Luồng hoạt động:**
```
1. Vào trang kiểm tra camera
   ↓
2. ProctoringView bật camera (hiển thị cho thí sinh)
   ↓
3. AICameraMonitor bật camera sau 2s (phân tích AI)
   ↓
4. Thí sinh thấy camera hoạt động + AI đang phân tích
   ↓
5. Hiển thị AI metrics (FPS, Resolution, Brightness)
   ↓
6. Chuyển sang trang thi → Cả hai camera tiếp tục hoạt động
```

#### **Tính năng:**
- **ProctoringView**: Camera hiển thị 450x338px với controls
- **AICameraMonitor**: Hidden, phân tích và hiển thị metrics
- **AI Status**: Hiển thị trạng thái AI monitoring
- **Hướng dẫn**: Thông tin về AI monitoring và quy tắc thi

### 🎯 **ExamTakingPage (Làm bài thi)**

#### **Luồng hoạt động:**
```
1. Vào trang thi
   ↓
2. ProctoringView bật camera (hiển thị trong sidebar)
   ↓
3. AICameraMonitor bật camera sau 2s (phân tích AI)
   ↓
4. AI phát hiện vi phạm → Hiển thị cảnh báo
   ↓
5. Countdown 15s → Auto-stop nếu không phản hồi
   ↓
6. Nộp bài → Cả hai camera tự động tắt
```

#### **Tính năng:**
- **ProctoringView**: Camera hiển thị 352x264px trong sidebar
- **AICameraMonitor**: Hidden, phân tích và trigger alerts
- **ExamViolationAlert**: Cảnh báo vi phạm với countdown
- **Blockchain**: Ghi vi phạm và kết quả thi

## 🔄 **Tích hợp liền mạch**

### **Camera Stream Management:**
```typescript
// ExamPreCheckPage
<ProctoringView width={450} height={338} showControls={true} />
<AICameraMonitor examId="camera-check" studentId="pre-check-student" />

// ExamTakingPage  
<ProctoringView width={352} height={264} showControls={false} />
<AICameraMonitor examId={currentExam.id} studentId="mock-student-id" />
```

### **Timing Strategy:**
```typescript
// ProctoringView: Start immediately
useEffect(() => {
  startCamera();
}, [startCamera]);

// AICameraMonitor: Start after 2s delay
useEffect(() => {
  const timer = setTimeout(autoStartCamera, 2000);
  return () => clearTimeout(timer);
}, []);
```

### **State Management:**
```typescript
// ExamPreCheckPage
const [aiViolations, setAiViolations] = useState<CheatingDetection[]>([]);
const [aiMetrics, setAiMetrics] = useState<any>(null);

// ExamTakingPage
const [currentViolation, setCurrentViolation] = useState<CheatingDetection | null>(null);
const [showViolationAlert, setShowViolationAlert] = useState(false);
```

## 🎨 **UI/UX Design**

### **ExamPreCheckPage:**
- **Layout**: 2 columns (Camera Check | Instructions)
- **ProctoringView**: Large size với controls
- **AI Status**: Small indicator với metrics
- **Instructions**: Chi tiết về AI monitoring

### **ExamTakingPage:**
- **Layout**: 2 columns (Questions | Sidebar + Camera)
- **ProctoringView**: Compact size trong sidebar
- **AI Monitor**: Hidden, không ảnh hưởng UI
- **Alerts**: Full-screen modal với countdown

## 🔧 **Technical Implementation**

### **Component Structure:**
```
ExamPreCheckPage
├── CameraCheckSection
│   ├── ProctoringView (visible)
│   └── AICameraMonitor (hidden)
│
ExamTakingPage
├── ExamSidebar
│   └── ProctoringView (visible)
└── AICameraMonitor (hidden)
```

### **Error Handling:**
- **ProctoringView**: Hiển thị error UI cho thí sinh
- **AICameraMonitor**: Log error, không ảnh hưởng UI
- **Fallback**: Nếu một camera lỗi, camera kia vẫn hoạt động

### **Performance Optimization:**
- **Delayed Start**: AICameraMonitor khởi động sau 2s
- **Hidden Rendering**: AI Monitor không render UI
- **Stream Sharing**: Có thể tối ưu để dùng chung stream

## 🎯 **Lợi ích**

### **Cho thí sinh:**
- ✅ **Thấy camera hoạt động** từ bước kiểm tra
- ✅ **Hiểu về AI monitoring** trước khi thi
- ✅ **Quen với giao diện** camera
- ✅ **Tăng tính minh bạch** và răn đe

### **Cho hệ thống:**
- ✅ **Consistent experience** giữa các trang
- ✅ **Early detection** từ bước kiểm tra
- ✅ **Smooth transition** từ pre-check sang exam
- ✅ **Comprehensive monitoring** toàn bộ quá trình

### **Cho giảng viên:**
- ✅ **Full audit trail** từ kiểm tra đến thi
- ✅ **Early warning** về vấn đề camera
- ✅ **Comprehensive data** về hành vi thí sinh
- ✅ **Reliable system** với backup camera

## 📱 **Responsive Design**

### **Desktop:**
- ExamPreCheckPage: 2 columns với camera lớn
- ExamTakingPage: Sidebar với camera compact

### **Tablet:**
- ExamPreCheckPage: Stacked layout
- ExamTakingPage: Responsive sidebar

### **Mobile:**
- ExamPreCheckPage: Single column
- ExamTakingPage: Camera thu nhỏ phù hợp

## 🎉 **Kết quả**

### ✅ **Trước khi có hệ thống kép:**
- Camera chỉ hiển thị trong trang thi
- Thí sinh không biết về AI monitoring
- Không có cảnh báo sớm về vấn đề camera

### ✅ **Sau khi có hệ thống kép:**
- **Camera hiển thị** từ bước kiểm tra
- **AI monitoring** hoạt động liên tục
- **Thí sinh hiểu rõ** về hệ thống giám sát
- **Trải nghiệm mượt mà** giữa các trang
- **Giám sát toàn diện** từ đầu đến cuối

---

## 🎯 **Tóm tắt:**

Hệ thống camera kép đã được áp dụng cho cả:
- **ExamPreCheckPage**: Kiểm tra camera với AI monitoring
- **ExamTakingPage**: Làm bài thi với AI alerts

**🚀 Thí sinh giờ đây có trải nghiệm camera nhất quán và hiểu rõ về hệ thống AI giám sát từ bước kiểm tra!**
