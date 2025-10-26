# Hướng dẫn tích hợp Proctoring Service với Frontend

## Tổng quan

Hệ thống giám sát thi cử sử dụng AI đã được tích hợp hoàn chỉnh giữa frontend (React) và backend (Node.js + Python AI).

## Kiến trúc hệ thống

```
┌─────────────────┐
│   Frontend      │
│   React App     │
│  (Port 3000)    │
└────────┬────────┘
         │
         │ HTTP POST /api/proctoring/analyze-frame
         │ (Base64 image)
         ↓
┌─────────────────┐
│  Node.js        │
│  Backend        │ ← WebSocket, Database
│  (Port 8082)    │
└────────┬────────┘
         │
         │ HTTP POST /analyze_frame
         │ (Form data với image)
         ↓
┌─────────────────┐
│  Python AI      │
│  FastAPI        │
│  (Port 8000)    │
└─────────────────┘
  YOLOv8 + MediaPipe
```

## Các file đã được tạo/sửa

### Backend (Code-spark/services/proctoring-service)

1. **src/controllers/proctoring.controller.js**
   - Thêm function `analyzeFrame()` để nhận frame từ frontend
   - Convert base64 → buffer → gọi Python AI service
   - Map kết quả từ Python về format frontend

2. **src/routes/proctoring.routes.js**
   - Thêm route: `POST /api/proctoring/analyze-frame`

3. **src/services/ai.service.js**
   - Đã có sẵn function gọi Python AI service

4. **Scripts khởi động:**
   - `start-all.bat` (Windows)
   - `start-all.sh` (Linux/Mac)

5. **Tài liệu:**
   - `README-SETUP.md`: Hướng dẫn cài đặt và chạy chi tiết
   - `.env.example`: Ví dụ cấu hình

### Frontend (web-frontend)

1. **src/services/proctoringService.ts** (MỚI)
   - Service để gọi API backend
   - Function `analyzeFrame()` gửi base64 image đến backend
   - Function `getSessionEvents()` lấy danh sách vi phạm

2. **src/hooks/useAICameraMonitor.ts**
   - Thêm props: `examId`, `studentId`, `useRealAI`
   - Thêm logic gọi API thật khi `useRealAI = true`
   - Giữ nguyên mock data khi `useRealAI = false`

3. **src/components/molecules/AICameraMonitor.tsx**
   - Thêm prop `useRealAI` để bật/tắt AI thật
   - Truyền props xuống hook

4. **src/pages/ExamTakingPage.tsx**
   - Thêm state `useRealAI` để control AI mode
   - Truyền prop xuống `AICameraMonitor`

## Cách sử dụng

### Bước 1: Khởi động Backend

#### Windows:
```bash
cd Code-spark/services/proctoring-service
start-all.bat
```

#### Linux/Mac:
```bash
cd Code-spark/services/proctoring-service
chmod +x start-all.sh
./start-all.sh
```

Script sẽ tự động:
1. Kiểm tra và cài đặt dependencies
2. Khởi động Python AI Service (port 8000)
3. Khởi động Node.js Service (port 8082)

### Bước 2: Tạo file .env

Tạo file `.env` trong `Code-spark/services/proctoring-service/`:
```bash
cp .env.example .env
```

Hoặc tạo thủ công với nội dung:
```env
PORT=8082
NODE_ENV=development
AI_SERVICE_URL=http://localhost:8000
```

### Bước 3: Kiểm tra Services đang chạy

```bash
# Test Python AI Service
curl http://localhost:8000/docs

# Test Node.js Service
curl http://localhost:8082/
```

### Bước 4: Bật AI thật trong Frontend

Trong file `src/pages/ExamTakingPage.tsx`, dòng 24:

```typescript
// Đổi từ false sang true
const [useRealAI, setUseRealAI] = useState(true);
```

### Bước 5: Chạy Frontend

```bash
cd web-frontend
npm install  # nếu chưa cài
npm run dev
```

## Chế độ hoạt động

### Mock Mode (useRealAI = false)
- Sử dụng dữ liệu giả trong frontend
- Không gọi backend API
- Dùng để test giao diện nhanh
- Không cần khởi động backend

### Real AI Mode (useRealAI = true)
- Gọi API backend để phân tích frame
- Backend gọi Python AI service
- Sử dụng YOLOv8 và MediaPipe thật
- Cần cả 2 backend services chạy

## Flow xử lý

1. **Frontend**: Camera chụp frame mỗi giây
2. **Frontend**: Convert frame → base64
3. **Frontend**: POST đến `/api/proctoring/analyze-frame`
4. **Node.js Backend**: Nhận base64, convert → Buffer
5. **Node.js Backend**: POST Buffer đến Python AI Service
6. **Python AI**: Phân tích bằng YOLOv8 + MediaPipe
7. **Python AI**: Trả về danh sách vi phạm
8. **Node.js Backend**: Map kết quả sang format frontend
9. **Frontend**: Nhận kết quả, hiển thị alerts nếu có vi phạm

## API Endpoints

### POST /api/proctoring/analyze-frame

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "examId": "exam-123",
  "studentId": "student-456"
}
```

**Response:**
```json
{
  "detections": [
    {
      "type": "face_detection",
      "severity": "high",
      "confidence": 85,
      "timestamp": 1698765432000,
      "description": "Không phát hiện khuôn mặt trong khung hình",
      "metadata": {}
    }
  ]
}
```

## Các loại vi phạm (Detection Types)

| Type | Mô tả | AI Model |
|------|-------|----------|
| `face_detection` | Không phát hiện khuôn mặt | MediaPipe Face Mesh |
| `multiple_faces` | Nhiều người trong frame | YOLOv8 Person Detection |
| `eye_tracking` | Nhìn ra khỏi màn hình | MediaPipe + Head Pose |
| `tab_switch` | Chuyển tab/cửa sổ | Browser API |
| `voice_detection` | Phát hiện giọng nói | Audio Analysis |
| `movement_anomaly` | Chuyển động bất thường | Motion Detection |

## Severity Levels

- **low**: Cảnh báo nhẹ (màu xanh)
- **medium**: Cảnh báo trung bình (màu vàng)
- **high**: Cảnh báo cao (màu đỏ)
- **critical**: Nghiêm trọng (màu đỏ đậm) - Có thể dừng thi

## Troubleshooting

### Lỗi: "Cannot connect to backend"
**Nguyên nhân**: Backend chưa chạy
**Giải pháp**: 
```bash
cd Code-spark/services/proctoring-service
start-all.bat  # Windows
./start-all.sh # Linux/Mac
```

### Lỗi: "ECONNREFUSED localhost:8000"
**Nguyên nhân**: Python AI Service chưa chạy
**Giải pháp**:
```bash
cd Code-spark/services/proctoring-service/ai-service
venv\Scripts\activate.bat  # Windows
source venv/bin/activate   # Linux/Mac
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Lỗi: "Module not found" trong Python
**Giải pháp**:
```bash
cd Code-spark/services/proctoring-service/ai-service
pip install -r requirements.txt
```

### Camera không hoạt động
**Giải pháp**:
- Kiểm tra trình duyệt đã cho phép camera
- Chạy trên HTTPS hoặc localhost
- Kiểm tra không có app khác đang dùng camera

### Không thấy detection nào
**Kiểm tra**:
1. Console browser có lỗi không?
2. Backend có log lỗi không?
3. Python AI service có chạy không?
4. Check Network tab trong DevTools

## Demo và Testing

### Test với Postman/curl

```bash
# Tạo base64 image từ file
base64 test-image.jpg > image.txt

# Gọi API
curl -X POST http://localhost:8082/api/proctoring/analyze-frame \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,<paste base64 here>",
    "examId": "test-exam",
    "studentId": "test-student"
  }'
```

### Xem logs

**Backend logs:**
```
✅ Kết nối database thành công
🌐 Service Giám sát đang chạy trên cổng 8082
```

**Python AI logs:**
```
INFO:     Tải model 'violation_model.pkl' thành công
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Tối ưu hóa

### Giảm tần suất phân tích
Trong `useAICameraMonitor.ts`, dòng 326:
```typescript
const analysisInterval = setInterval(analyzeFrame, 2000); // 2 giây thay vì 1 giây
```

### Chỉ gửi khi có thay đổi
Có thể thêm logic so sánh frame trước khi gửi.

## Tham khảo thêm

- Backend README: `Code-spark/services/proctoring-service/README-SETUP.md`
- API Documentation: http://localhost:8000/docs (khi Python service chạy)
- FastAPI Docs: https://fastapi.tiangolo.com/
- YOLOv8 Docs: https://docs.ultralytics.com/

