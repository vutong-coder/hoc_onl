# Hệ thống thi với giám sát camera

## Tổng quan

Hệ thống thi với giám sát camera được thiết kế để đảm bảo tính công bằng và minh bạch trong quá trình làm bài thi trực tuyến. Hệ thống sử dụng camera để giám sát người dùng trong suốt quá trình thi.

## Cấu trúc hệ thống

### 1. Luồng hoạt động (Flow)

```
Người dùng nhấn "Start Exam" 
    ↓
ExamPreCheckPage (/exam/:examId/pre-check)
    ↓ (Kiểm tra camera và hướng dẫn)
ExamTakingPage (/exam/:examId/take)
    ↓ (Làm bài thi với giám sát)
ExamResultPage (/exam/:examId/result)
```

### 2. Các thành phần chính

#### Hooks
- **`useCamera.ts`**: Quản lý camera và microphone
  - Yêu cầu quyền truy cập camera/microphone
  - Cung cấp stream video
  - Chụp ảnh màn hình để giám sát
  - Xử lý lỗi camera

#### Services
- **`examService.ts`**: Quản lý API liên quan đến bài thi
  - Lấy thông tin bài thi
  - Bắt đầu session thi
  - Lưu câu trả lời tạm thời
  - Nộp bài thi
  - Gửi ảnh giám sát

#### Redux Store
- **`examSlice.ts`**: Quản lý trạng thái bài thi
  - Thông tin bài thi hiện tại
  - Câu hỏi và câu trả lời
  - Thời gian còn lại
  - Trạng thái camera
  - Navigation giữa các câu hỏi

#### Components
- **`ProctoringView.tsx`**: Hiển thị camera giám sát
  - Video stream từ camera
  - Điều khiển camera (bật/tắt)
  - Thu nhỏ/mở rộng
  - Trạng thái camera (sẵn sàng/lỗi)

- **`CountdownTimer.tsx`**: Đồng hồ đếm ngược
  - Hiển thị thời gian còn lại
  - Cảnh báo khi sắp hết giờ
  - Thanh tiến trình

- **`ExamQuestion.tsx`**: Hiển thị câu hỏi
  - Hỗ trợ nhiều loại câu hỏi (trắc nghiệm, code, tự luận)
  - Đánh dấu câu hỏi
  - Theo dõi thời gian làm từng câu

#### Pages
- **`ExamPreCheckPage.tsx`**: Trang kiểm tra trước khi thi
  - Hiển thị hướng dẫn
  - Kiểm tra camera
  - Xác nhận sẵn sàng

- **`ExamTakingPage.tsx`**: Trang làm bài thi chính
  - Giao diện thi với camera giám sát
  - Navigation giữa các câu hỏi
  - Auto-save câu trả lời
  - Chụp ảnh giám sát định kỳ

- **`ExamResultPage.tsx`**: Trang kết quả thi
  - Hiển thị điểm số
  - Thống kê chi tiết
  - Trạng thái đạt/không đạt

## Tính năng chính

### 1. Giám sát camera
- Yêu cầu quyền truy cập camera và microphone
- Hiển thị video stream trực tiếp
- Chụp ảnh màn hình định kỳ (mỗi 10 giây)
- Gửi ảnh về server để phân tích

### 2. Quản lý thời gian
- Đồng hồ đếm ngược chính xác
- Cảnh báo khi sắp hết giờ (5 phút, 1 phút)
- Tự động nộp bài khi hết giờ

### 3. Navigation câu hỏi
- Danh sách câu hỏi với trạng thái rõ ràng
- Điều hướng tự do giữa các câu hỏi
- Đánh dấu câu hỏi để xem lại
- Theo dõi câu hỏi đã trả lời/chưa trả lời

### 4. Auto-save
- Tự động lưu câu trả lời mỗi 30 giây
- Lưu khi chuyển câu hỏi
- Đảm bảo không mất dữ liệu

### 5. Bảo mật
- Không cho phép rời khỏi tab
- Giám sát liên tục qua camera
- Ghi lại âm thanh
- Phát hiện hành vi bất thường

## Cách sử dụng

### 1. Bắt đầu thi
```typescript
// Từ component UpcomingExams
const handleStartExam = (examId: string) => {
  navigate(`/exam/${examId}/pre-check`)
}
```

### 2. Kiểm tra camera
```typescript
// Trong ExamPreCheckPage
const { startCamera, isCameraOn, error } = useCamera()

useEffect(() => {
  startCamera()
}, [])
```

### 3. Làm bài thi
```typescript
// Trong ExamTakingPage
const handleAnswerChange = (answer: any) => {
  dispatch(updateAnswer({ questionId: currentQuestion.id, answer }))
}
```

### 4. Nộp bài
```typescript
const handleSubmitExam = async () => {
  await dispatch(submitExam())
  navigate(`/exam/${examId}/result`)
}
```

## Cấu hình

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Camera Settings
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

## Lưu ý quan trọng

### 1. Quyền truy cập
- Người dùng phải cấp quyền camera và microphone
- Không thể thi nếu không có camera
- Camera phải hoạt động ổn định

### 2. Bảo mật
- Sử dụng HTTPS để truy cập camera
- Không lưu video stream, chỉ chụp ảnh
- Ảnh giám sát được mã hóa trước khi gửi

### 3. Hiệu suất
- Tối ưu hóa cho trình duyệt Chrome/Edge
- Hỗ trợ fallback cho Firefox/Safari
- Giảm thiểu sử dụng CPU khi thi

### 4. Trải nghiệm người dùng
- Giao diện thân thiện, dễ sử dụng
- Hướng dẫn rõ ràng từng bước
- Thông báo lỗi chi tiết và hữu ích

## Troubleshooting

### Camera không hoạt động
1. Kiểm tra quyền truy cập camera
2. Đảm bảo camera không bị ứng dụng khác sử dụng
3. Kiểm tra kết nối internet
4. Thử refresh trang

### Lỗi khi lưu câu trả lời
1. Kiểm tra kết nối internet
2. Thử làm lại câu hỏi
3. Liên hệ hỗ trợ nếu vấn đề tiếp tục

### Hết giờ đột ngột
1. Kiểm tra đồng hồ hệ thống
2. Đảm bảo không có ứng dụng khác làm chậm máy
3. Liên hệ hỗ trợ để kiểm tra log

## Phát triển tiếp

### Tính năng có thể thêm
1. Phát hiện gian lận bằng AI
2. Ghi âm toàn bộ quá trình thi
3. Theo dõi chuyển động mắt
4. Phân tích hành vi bất thường
5. Tích hợp blockchain để xác thực kết quả

### Cải tiến hiệu suất
1. WebRTC cho video streaming
2. Compression ảnh giám sát
3. Batch upload ảnh
4. Offline support với sync sau

