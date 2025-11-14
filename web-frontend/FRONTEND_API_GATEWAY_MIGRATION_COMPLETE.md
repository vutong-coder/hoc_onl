# ✅ Frontend API Gateway Migration - Hoàn thành

## Tổng quan

Tất cả các API calls từ frontend đã được cập nhật để đi qua **API Gateway** tại `http://localhost:8080` thay vì gọi trực tiếp tới các backend services.

---

## 📋 Danh sách files đã được cập nhật

### 1. **API Service Files** (đã sửa baseURL)

| File | Thay đổi | Status |
|------|----------|--------|
| `src/services/api/authApi.ts` | ✅ Dùng `VITE_API_BASE_URL/identity/api/v1/auth` | ✅ |
| `src/services/api/userApi.ts` | ✅ Dùng `VITE_API_BASE_URL/identity/api/v1` | ✅ |
| `src/services/api/courseApi.ts` | ✅ Dùng `VITE_API_BASE_URL/api/v1` | ✅ |
| `src/services/api/examApi.ts` | ✅ Dùng `VITE_API_BASE_URL/exam` | ✅ |
| `src/services/api/onlineExamApi.ts` | ✅ Dùng `VITE_API_BASE_URL/api/exam` + bỏ prefix `/api` | ✅ |
| `src/services/api/proctoringApi.ts` | ✅ Dùng `VITE_API_BASE_URL/api/proctoring` + bỏ prefix `/proctoring` | ✅ |
| `src/services/api/tokenRewardApi.ts` | ✅ Dùng `VITE_API_BASE_URL/api/tokens` | ✅ |
| `src/services/api/tokenApi.ts` | ✅ Dùng `VITE_API_BASE_URL/api/tokens` | ✅ |
| `src/services/api/multisigApi.ts` | ✅ Dùng `VITE_API_BASE_URL/api/v1/multisig` | ✅ |
| `src/services/api/copyrightApi.ts` | ✅ Dùng `VITE_API_BASE_URL/api/copyrights` | ✅ |
| `src/services/api/copyrightService.ts` | ✅ Dùng `VITE_API_BASE_URL/api/copyrights` | ✅ |
| `src/services/examService.ts` | ✅ Dùng `VITE_API_BASE_URL/api/exam` | ✅ |
| `src/admin/services/analyticsApi.ts` | ✅ Dùng `VITE_API_BASE_URL/analytics` + bỏ prefix `/analytics` | ✅ |
| `src/admin/services/tokenRewardApi.ts` | ✅ Dùng `VITE_API_BASE_URL/api/tokens` + thêm JWT token | ✅ |

### 2. **Hooks Files** (đã sửa direct calls)

| File | Thay đổi | Status |
|------|----------|--------|
| `src/hooks/useRecentSubmissions.ts` | ✅ Dùng `VITE_API_BASE_URL/api/exam` | ✅ |
| `src/hooks/useQuizzes.ts` | ✅ Health check qua Gateway, WebSocket qua Gateway | ✅ |
| `src/hooks/useAICameraMonitor.ts` | ✅ WebSocket qua Gateway | ✅ |
| `src/admin/hooks/useProctoring.ts` | ✅ WebSocket qua Gateway | ✅ |
| `src/admin/hooks/useProctoringStreams.ts` | ✅ WebSocket qua Gateway | ✅ |

### 3. **Utils Files**

| File | Thay đổi | Status |
|------|----------|--------|
| `src/utils/proctoringAdapter.ts` | ✅ Evidence URLs qua Gateway | ✅ |

---

## 🔧 Các sửa đổi chính

### 1. **Bỏ duplicate path prefixes**

**Vấn đề:** Frontend có `baseURL = '/api/exam'` nhưng endpoints lại có prefix `/api/...`, dẫn đến duplicate path.

**Sửa:**
- `onlineExamApi.ts`: Bỏ prefix `/api` trong tất cả endpoints
- `proctoringApi.ts`: Bỏ prefix `/proctoring` trong tất cả endpoints  
- `analyticsApi.ts`: Bỏ prefix `/analytics` trong tất cả endpoints

### 2. **WebSocket qua API Gateway**

**Vấn đề:** WebSocket connections đang gọi trực tiếp tới `http://localhost:8082`.

**Sửa:**
- Tất cả WebSocket URLs chuyển sang: `ws://localhost:8080/ws` (qua Gateway)
- Gateway route: `/ws/**` → `lb:ws://proctoring-service`

### 3. **Health checks qua Gateway**

**Vấn đề:** Health check đang gọi trực tiếp `HEAD http://localhost:8082/`.

**Sửa:**
- Health check chuyển sang: `GET http://localhost:8080/api/proctoring/test`

### 4. **Media URLs qua Gateway**

**Vấn đề:** Evidence URLs đang construct trực tiếp từ `http://localhost:8082`.

**Sửa:**
- Evidence URLs chuyển sang: `${VITE_API_BASE_URL}/api/proctoring${storagePath}`

---

## 📝 Environment Variables

### Cần thiết:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### Không cần nữa (có thể xóa):
```env
# ❌ Xóa các biến này
VITE_ANALYTICS_API_URL
VITE_USER_API_URL
VITE_EXAM_API_URL
VITE_ONLINE_EXAM_API_URL
VITE_TOKEN_REWARD_API_URL
VITE_PROCTORING_WS_URL (có thể giữ nếu muốn override)
```

---

## 🎯 API Gateway Routes Summary

| Service | Gateway Route | Backend Receives | Status |
|---------|---------------|------------------|--------|
| identity | `/identity/**` | `/api/v1/**` (StripPrefix=1) | ✅ |
| course | `/api/v1/courses/**` | `/api/v1/courses/**` (StripPrefix=0) | ✅ |
| exam | `/exam/**` | `/exams/**` (StripPrefix=1) | ✅ |
| online-exam | `/api/exam/**` | `/api/**` (RewritePath) | ✅ |
| token-reward | `/api/tokens/**` | `/api/tokens/**` (StripPrefix=0) | ✅ |
| multisig | `/api/v1/multisig/**` | `/api/v1/multisig/**` (StripPrefix=0) | ✅ |
| proctoring (HTTP) | `/api/proctoring/**` | `/proctoring/**` (StripPrefix=1) | ✅ |
| proctoring (WS) | `/ws/**` | `/ws/**` (StripPrefix=0) | ✅ |
| analytics | `/analytics/**` | `/analytics/**` (StripPrefix=0) | ✅ |
| copyright | `/api/copyrights/**` | `/copyrights/**` (StripPrefix=1) | ✅ |
| organization | `/api/organization/**` | `/api/v1/organization/**` (RewritePath) | ✅ |
| ai-service | `/api/v1/ai/**` | `/api/v1/ai/**` (StripPrefix=0) | ✅ |

---

## ✅ Verification Checklist

- [x] Tất cả API service files đã cập nhật baseURL
- [x] Tất cả hooks đã cập nhật để gọi qua Gateway
- [x] WebSocket connections đã chuyển qua Gateway
- [x] Health checks đã chuyển qua Gateway
- [x] Media/Evidence URLs đã chuyển qua Gateway
- [x] Bỏ duplicate path prefixes
- [x] Thêm JWT token cho admin endpoints
- [x] CORS chỉ xử lý ở API Gateway

---

## 🚀 Next Steps

1. **Cập nhật `.env` file:**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

2. **Xóa các biến không dùng** từ `.env`

3. **Restart frontend** để áp dụng thay đổi

4. **Kiểm tra tất cả chức năng:**
   - Login/Register
   - User management
   - Course management
   - Exam/Quiz
   - Proctoring
   - Token rewards
   - Analytics
   - Admin panels

---

## ⚠️ Lưu ý quan trọng

1. **Online-exam-service phải chạy** trên port 3000 để Gateway có thể kết nối
2. **Token-reward-service phải chạy** trên port 9009 (đã sửa từ 3001)
3. **Tất cả services phải tắt CORS** (chỉ Gateway xử lý)
4. **WebSocket qua Gateway** có thể cần test kỹ vì routing phức tạp hơn HTTP

---

## 📚 Documentation Files

- `API_ENDPOINTS.md` - Chi tiết endpoint mappings
- `MIGRATION_TO_API_GATEWAY.md` - Hướng dẫn migration
- `Code-spark/services/API_GATEWAY_ROUTES.md` - Gateway routes config
- `Code-spark/services/COMPLETE_API_MAPPING.md` - Complete mapping table

---

**✅ Migration hoàn tất! Tất cả frontend calls giờ đều đi qua API Gateway.**

