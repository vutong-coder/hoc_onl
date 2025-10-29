# Hướng dẫn sử dụng Token Reward System

## ✅ Đã hoàn thành

### 1. Backend Setup
- ✅ Token-reward-service đã chạy (port 9009)
- ✅ Database `token_reward_db` đã được tạo
- ✅ Seed data với user ID 1 và 2:
  - User ID 1: 100 tokens
  - User ID 2: 50 tokens

### 2. Frontend Integration
- ✅ TokenWallet component tích hợp API thật (không còn mock data)
- ✅ Tự động fetch balance và history từ backend
- ✅ Buttons đầy đủ chức năng:
  - **Rút Token**: Rút về blockchain wallet
  - **Chi tiết**: Xem trang rewards đầy đủ
  - **Đổi quà**: Vào cửa hàng đổi quà
- ✅ RewardPage với balance card, history table, withdraw modal
- ✅ Admin RewardPage với grant token modal
- ✅ RewardStorePage tích hợp API spend tokens

---

## 🚀 Test ngay

### 1. Đăng nhập với User

**Tài khoản:**
- Email: `user@codespark.com`
- Password: `user123`
- User ID: `2` (đã có 50 tokens trong database)

**Xem token trong ảnh:**
1. Vào trang Home (`/user` hoặc `/user/prepare`)
2. Nhìn sang **Ví Token** bên phải
3. Sẽ thấy:
   - ✅ **Số dư hiện tại: 50** (từ database thật!)
   - ✅ **Tổng đã kiếm: 50 tokens**
   - ✅ **Giao dịch gần đây:**
     - `COMPLETE_CHALLENGE` +20 tokens

### 2. Test chức năng đầy đủ

**Xem chi tiết:**
- Click button **"Chi tiết"** trong Ví Token
- Chuyển đến `/user/rewards`
- Thấy balance card gradient đẹp + lịch sử đầy đủ

**Rút token:**
- Click button **"Rút Token"** 
- Nhập số lượng (max 50)
- Nhập địa chỉ ví Ethereum (ví dụ: `0x1234567890123456789012345678901234567890`)
- Xác nhận rút
- Token sẽ được trừ khỏi database

**Đổi quà:**
- Click button **"Đổi quà"**
- Chuyển đến `/user/rewards/store`
- Chọn quà → Xác nhận
- Token sẽ bị trừ từ balance

### 3. Test Admin cấp token

**Đăng nhập Admin:**
- Email: `admin@codespark.com`
- Password: `admin123`

**Cấp token cho user:**
1. Vào `/admin/rewards`
2. Click nút **"Cấp Token"** (màu xám, bên cạnh "Thêm luật thưởng")
3. Nhập:
   - **ID Học viên**: `2`
   - **Số lượng token**: `100`
   - **Lý do**: Chọn "Thưởng từ Admin" hoặc khác
   - **ID liên quan**: (tùy chọn) `test-123`
4. Click **"Xác nhận cấp token"**
5. Thấy thông báo thành công

**Verify:**
- Đăng xuất admin
- Đăng nhập lại với user
- Vào `/user` → Ví Token
- Số dư tăng từ 50 lên 150!
- Lịch sử có giao dịch mới

---

## 📡 API Endpoints đang hoạt động

### Direct Access (Port 9009)
Frontend hiện đang gọi trực tiếp (tạm thời):

```
GET  http://localhost:9009/api/tokens/balance/:studentId
GET  http://localhost:9009/api/tokens/history/:studentId?page=1&limit=10
POST http://localhost:9009/api/tokens/grant
POST http://localhost:9009/api/tokens/spend
POST http://localhost:9009/api/tokens/withdraw
```

### Via API Gateway (Port 8080) - Đang cấu hình
Sau khi API Gateway khởi động xong:

```
GET  http://localhost:8080/token-reward/api/tokens/balance/:studentId
GET  http://localhost:8080/token-reward/api/tokens/history/:studentId
POST http://localhost:8080/token-reward/api/tokens/grant
POST http://localhost:8080/token-reward/api/tokens/spend
POST http://localhost:8080/token-reward/api/tokens/withdraw
```

---

## 🗄️ Database Schema

### Table: cm_users
```sql
SELECT * FROM cm_users;
 id | token_balance |         createdAt          |         updatedAt
----+---------------+----------------------------+----------------------------  
  1 |           100 | 2025-10-29 18:16:17.612+07 | 2025-10-29 18:16:17.612+07   
  2 |            50 | 2025-10-29 18:16:17.612+07 | 2025-10-29 18:16:17.612+07   
```

### Table: cm_rewards
```sql
SELECT * FROM cm_rewards;
 id | student_id | tokens_awarded | reason_code        | transaction_type
----+------------+----------------+--------------------+------------------
  1 |          1 |             10 | COMPLETE_LESSON    | EARN
  2 |          2 |             20 | COMPLETE_CHALLENGE | EARN
```

---

## 🎨 UI Components trong ảnh

Khi bạn vào `/user/prepare`, sẽ thấy:

```
┌─────────────────────────────────────────────────────┐
│  🎓 EduPlatform                        🔔 💬 🌙 👤  │
│  ──────────────────────────────────────────────────  │
│  Chuẩn bị  │  Chứng chỉ  │  Thi đấu                 │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📝 Phỏng vấn mô phỏng AI     │  💰 Ví Token         │
│  ─────────────────────────    │  ──────────────      │
│  • Kỹ sư phần mềm             │  0x90eb...2050       │
│  • Frontend Developer         │                       │
│  • Backend Developer          │  Số dư: 50 LEARN ✅  │
│  • System Design              │  Tổng kiếm: 50       │
│                                │                       │
│                                │  [Rút Token]          │
│                                │  [Chi tiết][Đổi quà] │
│                                │                       │
│                                │  Giao dịch gần đây:  │
│                                │  ✅ +20 COMPLETE_... │
│                                │     Vừa xong         │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Lỗi "User not found"
**Nguyên nhân**: User ID không tồn tại trong `cm_users`

**Giải pháp:**
```bash
# Tạo user mới trong database
docker exec postgres-db psql -U postgres -d token_reward_db -c \
  "INSERT INTO cm_users (id, token_balance, \"createdAt\", \"updatedAt\") \
   VALUES (2, 0, NOW(), NOW()) ON CONFLICT DO NOTHING;"
```

### Token-reward-service không chạy
```bash
# Khởi động service
docker start token-reward-service

# Kiểm tra log
docker logs token-reward-service --tail 20

# Nếu thiếu database, tạo:
docker exec postgres-db psql -U postgres -c "CREATE DATABASE token_reward_db;"

# Seed data:
docker exec token-reward-service node scripts/populate-db.js
```

### API Gateway không route
Frontend hiện đang gọi trực tiếp port 9009 (đã cấu hình).
Khi API Gateway hoạt động, đổi lại:
```typescript
// In tokenRewardApi.ts
const API_BASE_URL = 'http://localhost:8080/token-reward/api/tokens';
```

---

## ✨ Chức năng đang hoạt động

### User
- [x] Xem số dư token real-time
- [x] Xem lịch sử giao dịch (4 giao dịch gần nhất)
- [x] Rút token về blockchain wallet
- [x] Đổi quà bằng token (spend API)
- [x] Xem trang rewards đầy đủ
- [x] Loading states & empty states

### Admin
- [x] Cấp token cho bất kỳ user nào
- [x] Chọn lý do thưởng
- [x] Quick amount buttons (10, 50, 100, 500)
- [x] View token statistics dashboard

---

Bây giờ refresh lại trang `/user/rewards` hoặc `/user` để thấy dữ liệu thật từ backend! 🎉

