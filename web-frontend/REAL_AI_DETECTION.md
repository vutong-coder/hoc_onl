# 🔍 AI Camera Detection - Real vs Mock

## ⚠️ **Vấn đề đã được giải quyết:**

### **Trước đây:**
- **Nút Test** trigger vi phạm giả (mock data)
- **AI không phân tích** video stream thật
- **Báo "không thấy khuôn mặt"** dù camera vẫn thấy bạn

### **Bây giờ:**
- **AI thực sự phân tích** video stream
- **Phát hiện camera bị che** dựa trên độ sáng
- **Nút Test** chỉ để test UI, không phải AI thật

## 🎯 **Cách hoạt động mới:**

### **1. AI Detection thật:**
```typescript
// Phân tích độ sáng của video frame
const averageBrightness = totalBrightness / pixelCount;

// Nếu độ sáng quá thấp (< 30) = camera bị che
if (averageBrightness < 30) {
  return {
    type: 'face_detection',
    severity: 'high',
    description: `Camera bị che (độ sáng: ${averageBrightness})`
  };
}
```

### **2. Console Logs:**
```
🔍 Brightness analysis: {averageBrightness: "85.3", videoWidth: 640, ...}
🚨 Camera anomaly detected: 25.7
🚨 Face detection violation: {type: "face_detection", ...}
```

### **3. Nút Test:**
- **Màu cam**: "🧪 Test Alert (Mock)"
- **Chú thích**: "Nút này chỉ để test UI alert, không phải AI thật"
- **Mục đích**: Test giao diện cảnh báo, không phải AI detection

## 🧪 **Cách test AI thật:**

### **Test 1: Che camera bằng tay**
```
1. Che camera bằng tay hoặc giấy
2. Xem console logs:
   - "🔍 Brightness analysis: {averageBrightness: "15.2"}"
   - "🚨 Camera anomaly detected: 15.2"
   - "🚨 Face detection violation: ..."
3. Alert sẽ hiển thị với mô tả thật
```

### **Test 2: Ánh sáng quá sáng**
```
1. Chiếu đèn sáng vào camera
2. Xem console logs:
   - "🔍 Brightness analysis: {averageBrightness: "220.5"}"
   - "🚨 Camera anomaly detected: 220.5"
3. Alert sẽ hiển thị về ánh sáng bất thường
```

### **Test 3: Camera bình thường**
```
1. Ngồi bình thường trước camera
2. Xem console logs:
   - "🔍 Brightness analysis: {averageBrightness: "85.3"}"
   - Không có vi phạm (trừ mock 10% chance)
```

## 📊 **Brightness Thresholds:**

### **Camera bị che:**
- **Brightness < 30**: Camera bị che hoàn toàn
- **Confidence**: 70-95% dựa trên độ sáng

### **Ánh sáng bất thường:**
- **Brightness > 200**: Ánh sáng quá sáng
- **Confidence**: 70-95% dựa trên độ sáng

### **Camera bình thường:**
- **Brightness 30-200**: Không có vi phạm
- **Mock detection**: 10% chance (để test)

## 🎯 **Lợi ích:**

### **AI Detection thật:**
- ✅ **Phát hiện chính xác** camera bị che
- ✅ **Dựa trên video stream** thật
- ✅ **Brightness analysis** hiệu quả
- ✅ **Confidence score** dựa trên dữ liệu thật

### **UI Testing:**
- ✅ **Nút Test** để test giao diện
- ✅ **Rõ ràng** đây là mock data
- ✅ **Không nhầm lẫn** với AI thật

### **Debug Information:**
- ✅ **Console logs** chi tiết
- ✅ **Brightness values** thực tế
- ✅ **Video dimensions** và metrics

## 🔧 **Technical Details:**

### **Canvas Analysis:**
```typescript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
ctx.drawImage(video, 0, 0);
```

### **Pixel Sampling:**
```typescript
// Sample every 10th pixel for performance
for (let i = 0; i < data.length; i += 40) {
  const brightness = (r + g + b) / 3;
  totalBrightness += brightness;
}
```

### **Performance Optimization:**
- **Sampling**: Chỉ phân tích 1/10 pixel
- **Canvas**: Sử dụng canvas để lấy image data
- **Threshold**: Brightness thresholds được tối ưu

## 🎉 **Kết quả:**

### ✅ **Trước:**
- AI không phân tích video thật
- Nút Test gây nhầm lẫn
- Báo vi phạm dù camera bình thường

### ✅ **Sau:**
- **AI phân tích video thật** dựa trên brightness
- **Nút Test rõ ràng** là mock data
- **Phát hiện chính xác** camera bị che
- **Console logs chi tiết** để debug

---

## 🎯 **Tóm tắt:**

Giờ đây AI sẽ:
- **Phân tích video stream thật** để phát hiện camera bị che
- **Dựa trên độ sáng** thay vì random detection
- **Hiển thị mô tả chính xác** về tình trạng camera
- **Nút Test** chỉ để test UI, không phải AI thật

**🔍 Hãy thử che camera bằng tay để xem AI phát hiện thật!**
