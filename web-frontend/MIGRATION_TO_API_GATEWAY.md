# Migration to API Gateway - Hướng dẫn

## Tóm tắt thay đổi

Đã cập nhật toàn bộ frontend để gọi API qua **API Gateway** thay vì kết nối trực tiếp đến từng service.

---

## ✅ Các file đã được cập nhật

### User & Authentication
- ✅ `src/services/api/userApi.ts` - Đổi từ port 9010 → Gateway `/identity/api/v1`
- ✅ `src/services/api/authApi.ts` - Đã dùng gateway từ trước

### Course & Materials
- ✅ `src/services/api/courseApi.ts` - Đã dùng gateway từ trước

### Exam & Quiz
- ✅ `src/services/api/examApi.ts` - Đổi từ port 9005 → Gateway `/exam`
- ✅ `src/services/api/onlineExamApi.ts` - Đổi từ port 9003 → Gateway `/api/exam`

### Token & Rewards
- ✅ `src/services/api/tokenRewardApi.ts` - Đổi từ port 9009 → Gateway `/api/tokens`
- ✅ `src/services/api/tokenApi.ts` - Đổi từ port 9009 → Gateway `/api/tokens`

### Blockchain
- ✅ `src/services/api/multisigApi.ts` - Đổi từ port 3001 → Gateway `/api/v1/multisig`

### Monitoring
- ✅ `src/services/api/proctoringApi.ts` - Đổi từ port 8082 → Gateway `/api/proctoring`
- ✅ `src/admin/services/analyticsApi.ts` - Đổi từ port 9004 → Gateway `/analytics`

### Copyright
- ✅ `src/services/api/copyrightApi.ts` - Cập nhật path đúng với gateway
- ✅ `src/services/api/copyrightService.ts` - Đã dùng gateway từ trước

---

## Cấu hình Environment Variables

### ✅ File `.env` mới (chỉ cần 1 biến cho API):
```env
# API Gateway - Single entry point
VITE_API_BASE_URL=http://localhost:8080

# Blockchain Configuration
VITE_REWARD_TOKEN_NETWORK_NAME=Localhost 7545
VITE_REWARD_TOKEN_CHAIN_ID=0x539
VITE_REWARD_TOKEN_DEPOSIT_ADDRESS=0xBd289d6b07Ad6A7A267F6acc9bC9f1C33E803D17
VITE_REWARD_TOKEN_ESCROW_ADDRESS=0xa7FBAc24452dA656AEdE23279993DC90D5105239
VITE_LEARN_TOKEN_ADDRESS=0x217395230cC8Fa9Cad73e1DF3732E6a32F979787
VITE_COURSE_COMPLETION_REWARD=100
```

### ❌ Các biến KHÔNG còn cần thiết (có thể xóa):
```env
VITE_USER_API_URL=http://localhost:9010/api/v1
VITE_COURSE_API_URL=http://localhost:9001/api/v1
VITE_EXAM_API_URL=http://localhost:9005
VITE_ONLINE_EXAM_API_URL=http://localhost:9003
VITE_TOKEN_REWARD_API_URL=http://localhost:9009
VITE_TOKEN_API_URL=http://localhost:9009
VITE_ANALYTICS_API_URL=http://localhost:9004
VITE_MULTISIG_SERVICE_URL=http://localhost:3001
```

---

## Mapping URL từ Frontend → Backend

### Pattern chung:
```
Frontend Request → API Gateway (8080) → Backend Service
```

### Chi tiết:

#### 1. Authentication & Users
```
Frontend: userApi.post('/users')
→ http://localhost:8080/identity/api/v1/users
→ identity-service:9010/api/v1/users
```

#### 2. Courses
```
Frontend: courseApi.get('/courses')
→ http://localhost:8080/api/v1/courses
→ course-service:9001/api/v1/courses
```

#### 3. Exams (exam-service)
```
Frontend: examApi.get('/exams')
→ http://localhost:8080/exam/exams
→ exam-service:9003/exams
```

#### 4. Online Exams (online_exam_service)
```
Frontend: onlineExamApi.get('/api/quizzes/:id')
→ http://localhost:8080/api/exam/api/quizzes/:id
→ online-exam-service:3000/api/quizzes/:id
```

#### 5. Tokens
```
Frontend: tokenRewardApi.get('/balance/:id')
→ http://localhost:8080/api/tokens/balance/:id
→ token-reward-service:3001/api/tokens/balance/:id
```

#### 6. Multisig
```
Frontend: multisigApi.get('/')
→ http://localhost:8080/api/v1/multisig/
→ multisig-service:3003/api/v1/multisig/
```

#### 7. Proctoring
```
Frontend: proctoringApi.get('/sessions')
→ http://localhost:8080/api/proctoring/sessions
→ proctoring-service:8082/api/proctoring/sessions
```

#### 8. Analytics
```
Frontend: analyticsApi.get('/...')
→ http://localhost:8080/analytics/...
→ analytics-service:9004/analytics/...
```

#### 9. Copyright
```
Frontend: copyrightApi.post('/register')
→ http://localhost:8080/api/copyrights/register
→ copyright-service:8009/api/copyrights/register
```

---

## WebSocket Connections

WebSocket cũng đi qua API Gateway:

```typescript
// Proctoring WebSocket
ws://localhost:8080/ws

// Socket.io
const socket = io('http://localhost:8080', {
  path: '/ws/socket.io',
  transports: ['websocket', 'polling']
});
```

---

## Testing Checklist

### 1. ✅ Khởi động services theo thứ tự:
```bash
# 1. Infrastructure
cd Code-spark/services/discovery-service && mvn spring-boot:run

# 2. API Gateway
cd Code-spark/services/api-gateway && mvn spring-boot:run

# 3. Backend Services (parallel)
cd Code-spark/services/identity-service && mvn spring-boot:run
cd Code-spark/services/course-service && mvn spring-boot:run
cd Code-spark/services/exam-service && mvn spring-boot:run
# ... other services

# 4. Frontend
cd web-frontend && npm run dev
```

### 2. ✅ Test các chức năng:
- [ ] Login/Register
- [ ] Get courses
- [ ] Get token balance
- [ ] Create exam
- [ ] View analytics
- [ ] Multisig wallet operations
- [ ] Proctoring sessions
- [ ] Copyright registration

### 3. ✅ Kiểm tra:
- [ ] Không có CORS errors
- [ ] Tất cả API calls thành công
- [ ] JWT token được truyền đúng
- [ ] Responses trả về đúng format

---

## Troubleshooting

### Lỗi CORS
**Vấn đề**: Vẫn gặp CORS error
**Giải pháp**: 
- Kiểm tra tất cả backend services đã **TẮT CORS**
- Chỉ API Gateway có CORS enabled
- Khởi động lại services sau khi thay đổi

### Lỗi 401 Unauthorized
**Vấn đề**: API trả về 401
**Giải pháp**:
- Kiểm tra JWT token trong localStorage
- Đăng nhập lại để lấy token mới
- Kiểm tra SecurityConfig của service cho phép endpoint đó

### Lỗi 404 Not Found
**Vấn đề**: Endpoint không tìm thấy
**Giải pháp**:
- Kiểm tra route trong `api-gateway/application.yml`
- Xác nhận service đang chạy và đã đăng ký với Eureka
- Kiểm tra path mapping đúng chưa

### Service không kết nối được
**Vấn đề**: Gateway không forward được request
**Giải pháp**:
- Kiểm tra service đã đăng ký với Eureka: http://localhost:9999
- Kiểm tra port của service có đúng không
- Xem logs của API Gateway

---

## Rollback (nếu cần)

Nếu gặp vấn đề và cần rollback:

1. Revert các file API đã thay đổi
2. Khôi phục lại các `VITE_*_API_URL` trong `.env`
3. Khởi động lại frontend

---

## Next Steps

1. ✅ Xóa các biến environment không dùng trong `.env`
2. ✅ Test toàn bộ chức năng
3. ✅ Update documentation nếu có thay đổi
4. ✅ Deploy lên production với API Gateway URL thực tế

