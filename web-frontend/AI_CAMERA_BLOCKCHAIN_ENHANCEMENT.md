# 🎓 Hệ thống thi trực tuyến chống gian lận với AI Camera và Blockchain

## ✨ Tính năng mới đã được cải tiến

### 🤖 AI Camera Monitor với phát hiện gian lận thông minh

#### Tính năng chính:
- **Phát hiện khuôn mặt**: Theo dõi sự hiện diện của thí sinh
- **Theo dõi mắt**: Phát hiện khi thí sinh nhìn ra khỏi màn hình
- **Phát hiện nhiều người**: Cảnh báo khi có nhiều người trong khung hình
- **Phát hiện chuyển tab**: Giám sát khi thí sinh chuyển tab/cửa sổ
- **Phát hiện giọng nói**: Theo dõi hoạt động âm thanh bất thường
- **Phát hiện chuyển động**: Cảnh báo chuyển động bất thường

#### Cấp độ nghiêm trọng:
- **Low**: Cảnh báo nhẹ
- **Medium**: Cảnh báo trung bình
- **High**: Cảnh báo cao
- **Critical**: Cảnh báo nghiêm trọng

#### Metrics theo dõi:
- FPS camera
- Độ phân giải
- Độ sáng và độ tương phản
- Trạng thái ổn định

### 🔗 Smart Contract cho kết quả thi và log gian lận

#### ExamRecordContract.sol:
- **Lưu trữ kết quả thi**: Điểm số, thời gian, trạng thái đậu/rớt
- **Ghi log vi phạm**: Tất cả vi phạm gian lận được ghi on-chain
- **Session management**: Quản lý phiên thi từ bắt đầu đến kết thúc
- **Tính toàn vẹn dữ liệu**: Hash verification để đảm bảo không sửa đổi
- **Thống kê**: Tổng hợp số liệu về exams, violations, sessions

#### Tính năng bảo mật:
- **Immutable records**: Kết quả thi không thể sửa đổi sau khi ghi
- **Tamper-proof**: Hash verification cho mỗi kết quả
- **Access control**: Chỉ authorized minters mới có thể ghi dữ liệu
- **Emergency functions**: Pause/unpause contract khi cần

### 📊 AI Proctoring Dashboard

#### Dashboard chính:
- **Real-time monitoring**: Giám sát tất cả sessions đang hoạt động
- **AI Alerts**: Cảnh báo thông minh từ AI detection
- **Risk assessment**: Đánh giá mức độ rủi ro cho từng session
- **Statistics**: Thống kê tổng quan về violations và sessions

#### Tính năng quản lý:
- **Auto refresh**: Tự động cập nhật dữ liệu
- **Filter & Search**: Lọc và tìm kiếm sessions
- **Action controls**: Gửi cảnh báo, dừng session
- **Alert management**: Quản lý và đánh dấu alerts

### 🎯 Tích hợp Blockchain

#### Exam Taking Page:
- **Session initialization**: Tự động tạo session trên blockchain
- **Real-time violation recording**: Ghi vi phạm ngay khi phát hiện
- **Exam completion**: Ghi kết quả thi lên blockchain
- **Score calculation**: Tính điểm và ghi on-chain

#### Mock Services:
- **Development support**: Mock data cho development
- **Simulation**: Mô phỏng AI detection và blockchain events
- **Testing**: Dễ dàng test các tính năng mới

## 🛠️ Cấu trúc file mới

### Hooks:
- `src/hooks/useAICameraMonitor.ts` - AI camera monitoring hook
- `src/services/blockchain/examRecordService.ts` - Blockchain integration service

### Components:
- `src/components/molecules/AICameraMonitor.tsx` - AI Camera Monitor component
- `src/components/molecules/AIProctoringDashboard.tsx` - AI Proctoring Dashboard

### Smart Contracts:
- `contracts/ExamRecordContract.sol` - Smart contract cho exam records

### Data & Mock:
- `src/data/mockAIDetectionData.ts` - Mock data cho AI detection

### Styles:
- `src/components/molecules/AICameraMonitor.module.css`
- `src/components/molecules/AIProctoringDashboard.module.css`

## 🚀 Cách sử dụng

### 1. Khởi động AI Camera Monitor:
```typescript
const { startMonitoring, detections, metrics } = useAICameraMonitor();

// Bắt đầu giám sát
await startMonitoring();

// Xử lý vi phạm
const handleViolation = (detection: CheatingDetection) => {
  console.log('Vi phạm được phát hiện:', detection);
};
```

### 2. Sử dụng Blockchain Service:
```typescript
import { mockExamService } from '../services/blockchain/examRecordService';

// Bắt đầu session thi
const sessionId = await mockExamService.startExamSessionOnChain(
  examId, studentAddress, examTitle
);

// Ghi vi phạm
await mockExamService.recordCheatingViolationOnChain(
  sessionId, violationType, severity, confidence, description
);

// Hoàn thành session
await mockExamService.completeExamSessionOnChain(
  sessionId, score, maxScore, timeSpent, examTitle
);
```

### 3. AI Proctoring Dashboard:
```typescript
import { AIProctoringDashboard } from '../components/molecules/AIProctoringDashboard';

// Sử dụng trong admin panel
<AIProctoringDashboard />
```

## 🔧 Cấu hình

### Environment Variables:
```env
VITE_EXAM_RECORD_ADDRESS=0xYourContractAddress
VITE_LEARN_TOKEN_ADDRESS=0xYourTokenAddress
```

### Smart Contract Deployment:
```bash
cd contracts
npm install
npx hardhat run scripts/deploy.js --network sepolia
```

## 📈 Tính năng nổi bật

### 🎥 AI Camera Monitoring:
- **6 loại phát hiện**: Face, Eye, Multiple faces, Tab switch, Voice, Movement
- **4 mức độ nghiêm trọng**: Low, Medium, High, Critical
- **Real-time metrics**: FPS, Resolution, Brightness, Stability
- **Screenshot capture**: Tự động chụp ảnh khi có vi phạm nghiêm trọng

### 🔗 Blockchain Integration:
- **Immutable records**: Kết quả thi không thể sửa đổi
- **Tamper-proof**: Hash verification cho tính toàn vẹn
- **Event logging**: Tất cả events được ghi trên blockchain
- **Statistics**: Thống kê tổng quan từ blockchain

### 📊 Proctoring Dashboard:
- **Real-time monitoring**: Giám sát tất cả sessions
- **AI alerts**: Cảnh báo thông minh từ AI
- **Risk assessment**: Đánh giá mức độ rủi ro
- **Action controls**: Quản lý sessions và violations

## 🎯 Lợi ích

### Cho học sinh:
- **Công bằng**: Giảm gian lận trong thi cử
- **Minh bạch**: Kết quả thi được ghi trên blockchain
- **Tin cậy**: Không thể sửa đổi điểm số

### Cho giảng viên:
- **Giám sát hiệu quả**: AI tự động phát hiện gian lận
- **Dashboard trực quan**: Theo dõi real-time
- **Thống kê chi tiết**: Báo cáo đầy đủ

### Cho hệ thống:
- **Bảo mật cao**: Blockchain đảm bảo tính toàn vẹn
- **Scalable**: Có thể mở rộng cho nhiều users
- **Transparent**: Minh bạch tuyệt đối

## 🔮 Tương lai

### Phase 2 - Advanced AI:
- **Facial recognition**: Nhận diện khuôn mặt
- **Behavioral analysis**: Phân tích hành vi
- **Voice analysis**: Phân tích giọng nói
- **Eye tracking**: Theo dõi mắt chính xác

### Phase 3 - Machine Learning:
- **Pattern recognition**: Nhận diện mẫu gian lận
- **Predictive analysis**: Dự đoán gian lận
- **Adaptive detection**: Tự động điều chỉnh độ nhạy
- **Learning from data**: Học từ dữ liệu lịch sử

---

## 🎉 Kết luận

Hệ thống thi trực tuyến đã được cải tiến với:

✅ **AI Camera Monitor** - Phát hiện gian lận thông minh  
✅ **Smart Contract** - Lưu trữ kết quả thi on-chain  
✅ **Blockchain Integration** - Ghi điểm số và log gian lận  
✅ **Proctoring Dashboard** - Giám sát real-time với AI alerts  
✅ **Mock Data System** - Hỗ trợ development và testing  

Hệ thống đảm bảo **tính minh bạch tuyệt đối** và **chống gian lận hiệu quả** với công nghệ AI và Blockchain hiện đại.
