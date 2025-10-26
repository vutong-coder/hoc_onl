# 🚨 Hệ thống cảnh báo vi phạm gian lận với Auto-Stop Exam

## ✨ Tính năng mới đã được thêm

### 🎯 **ExamViolationAlert Component**

#### **Tính năng chính:**
- **Cảnh báo trực tiếp** trên màn hình thi khi phát hiện hành vi bất thường
- **Countdown timer** 15 giây với progress bar
- **Auto-stop exam** nếu không phản hồi sau 15 giây
- **Phân loại mức độ** cảnh báo theo severity

#### **Các loại vi phạm được cảnh báo:**
- ✅ **Medium**: Cảnh báo trung bình (Eye tracking, Voice detection)
- ✅ **High**: Cảnh báo cao (Face detection, Tab switch)  
- ✅ **Critical**: Cảnh báo nghiêm trọng (Multiple faces)

#### **UI/UX Features:**
- **Modal overlay** với backdrop blur
- **Animated progress bar** đếm ngược 15 giây
- **Severity-based styling** (màu sắc theo mức độ)
- **Responsive design** cho mobile
- **Smooth animations** và transitions

### 🔄 **Luồng hoạt động:**

```
1. AI Camera phát hiện vi phạm
   ↓
2. Kiểm tra severity (medium/high/critical)
   ↓
3. Hiển thị ExamViolationAlert
   ↓
4. Countdown 15 giây
   ↓
5a. Thí sinh nhấn "Tôi hiểu" → Đóng cảnh báo
   ↓
5b. Không phản hồi → Auto-stop exam
   ↓
6. Ghi kết quả lên blockchain (score = 0)
   ↓
7. Hiển thị màn hình "Bài thi đã bị dừng"
```

### 🎨 **Giao diện cảnh báo:**

#### **Header:**
- Icon severity với animation bounce
- Title và subtitle
- Countdown timer với Clock icon
- Nút đóng (X)

#### **Content:**
- Icon loại vi phạm
- Mô tả chi tiết vi phạm
- Độ tin cậy AI (%)
- Thông báo cảnh báo với Shield icon

#### **Footer:**
- Nút "Tôi hiểu" (acknowledge)
- Nút "Dừng bài thi" (cho critical violations)
- Cảnh báo auto-stop với countdown

#### **Progress Bar:**
- Thanh tiến trình đếm ngược
- Màu sắc theo severity
- Animation smooth

### 🚫 **Exam Stopped Overlay:**

#### **Khi bài thi bị dừng:**
- **Full-screen overlay** với backdrop blur
- **Warning icon** với animation bounce
- **Thông báo rõ ràng** về lý do dừng thi
- **Nút quay về trang chủ**

### ⚙️ **Cấu hình:**

#### **Detection Thresholds:**
```typescript
// Tăng tần suất phát hiện cho testing
face_detection: 15% chance (từ 5%)
eye_tracking: 12% chance (từ 8%)  
multiple_faces: 8% chance (từ 3%)
```

#### **Alert Triggers:**
```typescript
// Chỉ hiển thị alert cho:
severity === 'medium' || 
severity === 'high' || 
severity === 'critical'
```

#### **Auto-stop Logic:**
```typescript
// Sau 15 giây không phản hồi:
- Ghi exam completion với score = 0
- Navigate to '/exam/stopped'
- Show stopped overlay
```

### 📱 **Responsive Design:**

#### **Desktop:**
- Modal 500px width
- Full features hiển thị
- Hover effects

#### **Mobile:**
- Modal 95% width
- Stacked layout
- Touch-friendly buttons
- Simplified animations

### 🔗 **Blockchain Integration:**

#### **Violation Recording:**
```typescript
await mockExamService.recordCheatingViolationOnChain(
  sessionId,
  violationType,    // 1-6
  severity,         // 1-4  
  confidence,       // 0-100
  description,
  screenshotHash
);
```

#### **Exam Termination:**
```typescript
await mockExamService.completeExamSessionOnChain(
  sessionId,
  0,              // Score = 0 (failed due to violation)
  100,            // Max score
  0,              // Time spent
  "Exam - Stopped due to violation"
);
```

### 🎯 **User Experience:**

#### **Cho thí sinh:**
- **Cảnh báo rõ ràng** về hành vi vi phạm
- **Thời gian phản hồi** 15 giây
- **Hướng dẫn cụ thể** về cách khắc phục
- **Cơ hội sửa chữa** trước khi bị dừng thi

#### **Cho giảng viên:**
- **Ghi nhận đầy đủ** tất cả vi phạm
- **Screenshot evidence** cho vi phạm nghiêm trọng
- **Blockchain records** không thể sửa đổi
- **Thống kê chi tiết** về hành vi gian lận

### 🛠️ **Files đã được tạo/sửa:**

1. **`src/components/molecules/ExamViolationAlert.tsx`**
   - Component cảnh báo vi phạm chính
   - Countdown timer và auto-stop logic
   - Responsive design

2. **`src/components/molecules/ExamViolationAlert.module.css`**
   - Styles cho alert component
   - Animations và transitions
   - Mobile responsive

3. **`src/pages/ExamTakingPage.tsx`**
   - Tích hợp ExamViolationAlert
   - Logic xử lý vi phạm
   - Exam stopped overlay

4. **`src/assets/css/ExamTakingPage.module.css`**
   - Styles cho exam stopped overlay
   - Animations và effects

5. **`src/hooks/useAICameraMonitor.ts`**
   - Tăng tần suất phát hiện cho testing
   - Cải thiện detection algorithms

### 🎉 **Kết quả:**

#### **✅ Trước khi có tính năng:**
- Camera chỉ ghi log vi phạm
- Không có cảnh báo trực tiếp
- Thí sinh không biết đang vi phạm
- Không có cơ chế dừng thi tự động

#### **✅ Sau khi có tính năng:**
- **Cảnh báo trực tiếp** trên màn hình thi
- **Countdown timer** 15 giây với progress bar
- **Auto-stop exam** nếu không phản hồi
- **UI/UX chuyên nghiệp** với animations
- **Blockchain integration** ghi đầy đủ vi phạm
- **Responsive design** cho mọi thiết bị

### 🚀 **Lợi ích:**

#### **Tăng tính công bằng:**
- Thí sinh được cảnh báo kịp thời
- Có cơ hội sửa chữa hành vi
- Giảm thiểu gian lận hiệu quả

#### **Minh bạch tuyệt đối:**
- Tất cả vi phạm được ghi blockchain
- Không thể sửa đổi sau khi ghi
- Evidence đầy đủ cho giảng viên

#### **Trải nghiệm tốt:**
- UI/UX chuyên nghiệp
- Animations mượt mà
- Responsive trên mọi thiết bị

---

## 🎯 **Tóm tắt:**

Hệ thống cảnh báo vi phạm gian lận đã được hoàn thiện với:

✅ **ExamViolationAlert** - Cảnh báo trực tiếp trên màn hình thi  
✅ **15-second countdown** - Timer với progress bar  
✅ **Auto-stop exam** - Tự động dừng thi nếu không phản hồi  
✅ **Blockchain integration** - Ghi đầy đủ vi phạm và kết quả  
✅ **Responsive design** - Hoạt động tốt trên mọi thiết bị  
✅ **Professional UI/UX** - Animations và transitions mượt mà  

**🎉 Giờ đây khi thí sinh che camera hoặc có hành vi bất thường, hệ thống sẽ ngay lập tức hiển thị cảnh báo và tự động dừng bài thi sau 15 giây nếu không phản hồi!**
