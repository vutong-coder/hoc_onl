# 🎥 Hệ thống Camera Kép - ProctoringView + AI Camera Monitor

## ✨ Cách hoạt động

### 🎯 **Hai hệ thống camera song song:**

#### **1. ProctoringView (Camera hiển thị)**
- **Vị trí**: ExamSidebar - bên phải màn hình thi
- **Mục đích**: Thí sinh có thể thấy camera đang hoạt động
- **Tính năng**: 
  - Hiển thị video stream trực tiếp
  - Có thể thu nhỏ/phóng to
  - Status indicator (đang giám sát)
  - Error handling và retry

#### **2. AICameraMonitor (Camera phân tích)**
- **Vị trí**: Hidden (display: none)
- **Mục đích**: AI phân tích và phát hiện gian lận
- **Tính năng**:
  - Phân tích frame để phát hiện vi phạm
  - Ghi log vi phạm lên blockchain
  - Trigger cảnh báo khi có vi phạm
  - Không hiển thị UI

### 🔄 **Luồng hoạt động:**

```
1. Vào trang thi
   ↓
2. ProctoringView bật camera (hiển thị cho thí sinh)
   ↓
3. AICameraMonitor bật camera sau 2s (phân tích AI)
   ↓
4. Cả hai camera cùng hoạt động song song
   ↓
5. AI phát hiện vi phạm → Hiển thị cảnh báo
   ↓
6. Nộp bài → Cả hai camera tự động tắt
```

### ⚙️ **Cấu hình:**

#### **ProctoringView:**
- **Width**: 352px
- **Height**: 264px
- **Controls**: false (không có controls)
- **Minimize**: có thể thu nhỏ
- **Auto-start**: ngay khi vào trang thi

#### **AICameraMonitor:**
- **Hidden**: display: none
- **Auto-start**: sau 2 giây (để ProctoringView khởi động trước)
- **Analysis**: mỗi 1-2 giây
- **Detection**: 6 loại vi phạm

### 🎯 **Lợi ích:**

#### **Cho thí sinh:**
- ✅ **Thấy camera hoạt động** - Tăng tính minh bạch
- ✅ **Biết đang được giám sát** - Răn đe gian lận
- ✅ **Có thể thu nhỏ** - Không cản trở làm bài
- ✅ **Status indicator** - Biết camera có hoạt động không

#### **Cho hệ thống:**
- ✅ **AI phân tích chính xác** - Camera riêng cho AI
- ✅ **Không xung đột** - Hai camera độc lập
- ✅ **Performance tốt** - AI không ảnh hưởng UI
- ✅ **Reliability cao** - Backup camera

### 🔧 **Technical Details:**

#### **Camera Stream Management:**
```typescript
// ProctoringView sử dụng useCamera hook
const { stream, startCamera, stopCamera } = useCamera();

// AICameraMonitor sử dụng useAICameraMonitor hook  
const { startMonitoring, stopMonitoring } = useAICameraMonitor();
```

#### **Timing:**
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

#### **Error Handling:**
- ProctoringView: Hiển thị error UI cho thí sinh
- AICameraMonitor: Log error, không ảnh hưởng UI

### 📱 **Responsive Design:**

#### **Desktop:**
- ProctoringView: 352x264px trong sidebar
- AICameraMonitor: Hidden, không ảnh hưởng layout

#### **Mobile:**
- ProctoringView: Thu nhỏ phù hợp
- AICameraMonitor: Vẫn hoạt động ẩn

### 🎉 **Kết quả:**

- ✅ **Thí sinh thấy camera** - Minh bạch và răn đe
- ✅ **AI phân tích chính xác** - Phát hiện gian lận hiệu quả
- ✅ **Không xung đột** - Hai hệ thống hoạt động độc lập
- ✅ **UI/UX tốt** - Không cản trở làm bài
- ✅ **Performance cao** - Tối ưu cho cả hai camera

---

## 🎯 **Tóm tắt:**

Hệ thống camera kép cho phép:
- **ProctoringView**: Thí sinh thấy camera đang hoạt động
- **AICameraMonitor**: AI phân tích và phát hiện gian lận
- **Song song hoạt động**: Không xung đột, hiệu quả cao
- **Minh bạch**: Thí sinh biết đang được giám sát

**🚀 Giờ đây thí sinh vừa thấy camera hoạt động, vừa được AI giám sát chặt chẽ!**
