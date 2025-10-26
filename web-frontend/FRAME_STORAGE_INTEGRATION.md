# 🎯 Frame Storage Integration Complete

## ✅ Đã hoàn thành

### 1. **Hook useFrameStorage** (`src/hooks/useFrameStorage.ts`)

Hook mới để lưu trữ và quản lý frames + API responses:

**Tính năng:**
- ✅ Lưu trữ frames (base64 images) với metadata
- ✅ Lưu trữ AI detection responses
- ✅ Tính toán statistics (violation types, severity counts, avg processing time)
- ✅ Auto cleanup old data (configurable)
- ✅ Export data as JSON
- ✅ Storage size tracking
- ✅ Get frames with violations
- ✅ Get recent frames/responses

**API:**
```typescript
const {
  // State
  frames,
  responses,
  totalFramesCaptured,
  totalDetections,
  storageSize,
  
  // Actions
  addFrame,
  addResponse,
  getFrame,
  getResponse,
  getResponsesForFrame,
  getRecentFrames,
  getRecentResponses,
  getFramesWithViolations,
  getStatistics,
  clearAll,
  cleanup,
  exportData
} = useFrameStorage({
  maxFrames: 100,
  maxResponses: 200,
  autoCleanup: true,
  cleanupInterval: 60000 // 1 minute
});
```

### 2. **Tích hợp vào useAICameraMonitor**

**Thay đổi:**
- ✅ Import và khởi tạo `useFrameStorage`
- ✅ Lưu frame vào storage khi capture
- ✅ Lưu AI response vào storage với processing time
- ✅ Expose frameStorage qua return value

**Code:**
```typescript
// Trong analyzeFrame()
const frameId = frameStorage.addFrame(screenshot, examId, studentId);
const response = await proctoringService.analyzeFrame(...);
const processingTime = Date.now() - startTime;
frameStorage.addResponse(frameId, response.detections, processingTime);

// Return value
return {
  // ... existing fields
  frameStorage: {
    totalFramesCaptured,
    totalDetections,
    storageSize,
    getStatistics,
    exportData,
    clearAll
  }
};
```

### 3. **UI hiển thị Statistics**

**Thêm vào AICameraMonitor.tsx:**
```tsx
{/* Frame Storage Statistics */}
<div className={styles.storageStats}>
  <h4 className={styles.storageTitle}>📊 Thống kê lưu trữ</h4>
  <div className={styles.statsGrid}>
    <div className={styles.statItem}>
      <span className={styles.statLabel}>Frames đã chụp:</span>
      <span className={styles.statValue}>{frameStorage.totalFramesCaptured}</span>
    </div>
    <div className={styles.statItem}>
      <span className={styles.statLabel}>Vi phạm phát hiện:</span>
      <span className={styles.statValue}>{frameStorage.totalDetections}</span>
    </div>
    <div className={styles.statItem}>
      <span className={styles.statLabel}>Dung lượng:</span>
      <span className={styles.statValue}>
        {(frameStorage.storageSize / (1024 * 1024)).toFixed(2)} MB
      </span>
    </div>
    <div className={styles.statItem}>
      <Button onClick={() => frameStorage.exportData()}>
        Xuất dữ liệu
      </Button>
    </div>
  </div>
</div>
```

**CSS mới:** `AICameraMonitor.module.css`
- `.storageStats` - Container cho statistics
- `.storageTitle` - Tiêu đề
- `.statsGrid` - Grid layout responsive
- `.statItem` - Mỗi stat item
- `.statLabel` - Label của stat
- `.statValue` - Value của stat (monospace font)

### 4. **Cập nhật Type Definitions**

**Sửa lỗi types cũ:**
- ❌ `'face_detection' | 'eye_tracking' | 'multiple_faces'`
- ✅ `'FACE_NOT_DETECTED' | 'MULTIPLE_FACES' | 'MOBILE_PHONE_DETECTED' | 'CAMERA_TAMPERED' | 'LOOKING_AWAY' | 'tab_switch'`

**Files đã update:**
- `src/services/proctoringService.ts` - Detection interface
- `src/hooks/useAICameraMonitor.ts` - CheatingDetection interface
- `src/components/molecules/AICameraMonitor.tsx` - Detection type names & icons
- `src/pages/ExamTakingPage.tsx` - Violation type mapping

### 5. **Enhanced Logging**

**ExamTakingPage.tsx:**
```typescript
console.log('[ExamTakingPage] Violation detected:', {
  type: detection.type,
  severity: detection.severity,
  confidence: detection.confidence,
  description: detection.description,
  metadata: detection.metadata,
  timestamp: new Date(detection.timestamp).toISOString()
});
```

**useAICameraMonitor.ts:**
```typescript
console.log('analyzeFrame: Frame saved to storage, ID:', frameId);
console.log('analyzeFrame: AI response:', response.detections.length, 
  'detections, processing time:', processingTime, 'ms');
```

## 📊 Statistics Example

Khi gọi `frameStorage.getStatistics()`:

```json
{
  "totalFrames": 45,
  "totalResponses": 45,
  "totalFramesCaptured": 45,
  "totalDetections": 12,
  "violationTypes": {
    "FACE_NOT_DETECTED": 3,
    "CAMERA_TAMPERED": 5,
    "LOOKING_AWAY": 4
  },
  "severityCounts": {
    "high": 8,
    "medium": 4
  },
  "avgProcessingTime": 156,
  "storageSize": 15728640,
  "storageSizeMB": "15.00"
}
```

## 🚀 Cách sử dụng

### 1. **Trong Component**

```typescript
import { useAICameraMonitor } from '../hooks/useAICameraMonitor';

const MyComponent = () => {
  const { frameStorage, detections } = useAICameraMonitor({
    examId: 'exam-123',
    studentId: 'student-456'
  });
  
  // Xem statistics
  const stats = frameStorage.getStatistics();
  console.log('Violation breakdown:', stats.violationTypes);
  
  // Export data
  const handleExport = () => {
    frameStorage.exportData(); // Downloads JSON file
  };
  
  // Clear storage
  const handleClear = () => {
    frameStorage.clearAll();
  };
  
  return (
    <div>
      <p>Total Frames: {frameStorage.totalFramesCaptured}</p>
      <p>Total Violations: {frameStorage.totalDetections}</p>
      <p>Storage: {(frameStorage.storageSize / 1024 / 1024).toFixed(2)} MB</p>
      <button onClick={handleExport}>Export Data</button>
    </div>
  );
};
```

### 2. **Export Data Format**

Khi click "Xuất dữ liệu", file JSON sẽ chứa:

```json
{
  "exportDate": "2024-10-24T12:34:56.789Z",
  "statistics": {
    "totalFrames": 45,
    "totalDetections": 12,
    "violationTypes": {...},
    "avgProcessingTime": 156
  },
  "frames": [
    {
      "id": "frame_1729772096789_abc123",
      "timestamp": 1729772096789,
      "frameDataUrl": "data:image/jpeg;base64,/9j/4AAQ... (truncated)",
      "examId": "exam-123",
      "studentId": "student-456"
    }
  ],
  "responses": [
    {
      "id": "response_1729772096890_def456",
      "timestamp": 1729772096890,
      "frameId": "frame_1729772096789_abc123",
      "detections": [
        {
          "event_type": "LOOKING_AWAY",
          "severity": "medium",
          "metadata": { "direction": "side", "yaw": 38.5 }
        }
      ],
      "processingTime": 156
    }
  ]
}
```

## 🎨 UI Preview

```
┌─────────────────────────────────────────────┐
│ 📹 AI Camera Monitor            [⚙️] [⏹️]  │
├─────────────────────────────────────────────┤
│ FPS: 25.3 │ Resolution: 640x480            │
│ Brightness: 72% │ Status: Ổn định          │
├─────────────────────────────────────────────┤
│ 📊 Thống kê lưu trữ                        │
│ ┌─────────────┬─────────────┬─────────────┐│
│ │ Frames đã   │ Vi phạm     │ Dung lượng  ││
│ │ chụp:       │ phát hiện:  │             ││
│ │ 45          │ 12          │ 15.00 MB    ││
│ └─────────────┴─────────────┴─────────────┘│
│ [Xuất dữ liệu]                             │
├─────────────────────────────────────────────┤
│ Phát hiện gian lận (3)                     │
│ ┌─────────────────────────────────────────┐│
│ │ 👁️ Nhìn ra ngoài         MEDIUM        ││
│ │ Phát hiện nhìn ra khỏi màn hình        ││
│ │ Độ tin cậy: 95% │ 12:34:56             ││
│ └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

## 🔥 Features Highlights

1. **Real-time Storage**: Mỗi frame được capture đều được lưu ngay lập tức
2. **Smart Cleanup**: Auto cleanup old data để tránh memory leak
3. **Performance Tracking**: Tracking processing time của mỗi AI request
4. **Export Capability**: Export toàn bộ data để phân tích offline
5. **Memory Efficient**: Configurable max frames/responses để control memory usage
6. **Type Safe**: Full TypeScript support với proper typing

## 📝 Notes

- Frame data URLs có thể rất lớn (100KB - 500KB mỗi frame)
- Default max 100 frames = ~10-50MB memory
- Auto cleanup chạy mỗi 1 phút
- Export data sẽ truncate frame URLs để file không quá lớn
- Statistics được tính real-time, không cần re-fetch

## 🎯 Next Steps (Optional)

- [ ] Thêm IndexedDB storage cho persistence
- [ ] Compress frames trước khi lưu
- [ ] Add pagination cho frames list
- [ ] Realtime chart visualization
- [ ] Advanced filtering (by type, severity, date range)
- [ ] Comparison view (before/after violation)
- [ ] Auto-detect patterns in violations

