# Token Reward System Integration

## Tổng quan

Token Reward Service đã được tích hợp đầy đủ vào frontend với các chức năng:

### Backend API (token-reward-service)

Port: 3000 (standalone) hoặc qua API Gateway tại `/token-reward`

**Endpoints:**

1. **POST** `/api/tokens/grant` - Cấp token cho học viên
   ```json
   {
     "studentId": 1,
     "amount": 100,
     "reasonCode": "COURSE_COMPLETION",
     "relatedId": "course-123"
   }
   ```

2. **POST** `/api/tokens/spend` - Tiêu token
   ```json
   {
     "studentId": 1,
     "amount": 50,
     "reasonCode": "PURCHASE",
     "relatedId": "product-456"
   }
   ```

3. **GET** `/api/tokens/balance/:studentId` - Lấy số dư token
   ```json
   {
     "tokenBalance": 500
   }
   ```

4. **GET** `/api/tokens/history/:studentId?page=1&limit=10` - Lịch sử giao dịch
   ```json
   {
     "totalItems": 25,
     "totalPages": 3,
     "currentPage": 1,
     "rewards": [...]
   }
   ```

5. **POST** `/api/tokens/withdraw` - Rút token về blockchain
   ```json
   {
     "studentId": 1,
     "amount": 100,
     "toAddress": "0x..."
   }
   ```

---

## Frontend Implementation

### User Features (Student)

#### 1. Token Reward Page (`/user/rewards`)
Location: `web-frontend/src/pages/RewardPage.tsx`

**Features:**
- Hiển thị số dư token hiện tại
- Lịch sử giao dịch với phân trang
- Rút token về ví blockchain
- Làm mới dữ liệu theo thời gian thực

**Components sử dụng:**
- `TokenBalanceCard` - Card hiển thị số dư với gradient đẹp
- `TokenHistoryTable` - Bảng lịch sử với phân trang
- `TokenWithdrawModal` - Modal rút token về blockchain

**Hook:**
- `useTokenBalance` - Quản lý state và API calls

#### 2. Token Wallet Component
Location: `web-frontend/src/components/atoms/TokenWallet.tsx`

Hiển thị số dư token trong navbar/header (đã có sẵn).

---

### Admin Features

#### 1. Admin Reward Management (`/admin/rewards`)
Location: `web-frontend/src/admin/pages/RewardPage.tsx`

**New Features Added:**
- **Nút "Cấp Token"** - Mở modal để admin cấp token cho học viên
- **Grant Token Modal** - Form nhập ID học viên, số lượng, lý do

**Components sử dụng:**
- `GrantTokenModal` - Modal cấp token cho học viên
- `RewardDashboard` - Dashboard tổng quan (đã có)
- `RewardRulesTable` - Quản lý luật thưởng tự động (đã có)
- `TransactionLog` - Nhật ký giao dịch (đã có)

---

## API Service Layer

### Main API: `tokenRewardApi.ts`
Location: `web-frontend/src/services/api/tokenRewardApi.ts`

**Functions:**
```typescript
grantTokens(request: GrantTokenRequest): Promise<Transaction>
spendTokens(request: SpendTokenRequest): Promise<Transaction>
withdrawTokens(request: WithdrawTokenRequest): Promise<WithdrawResponse>
getBalance(studentId: number | string): Promise<BalanceResponse>
getHistory(studentId: number | string, page: number, limit: number): Promise<HistoryResponse>
```

### Admin API: `admin/services/tokenRewardApi.ts`
Location: `web-frontend/src/admin/services/tokenRewardApi.ts`

Wrapper around main API với thêm helper functions cho admin.

---

## Reason Codes

Các mã lý do thưởng/tiêu token:

### Earning (EARN)
- `COURSE_COMPLETION` - Hoàn thành khóa học
- `EXAM_PASS` - Đạt kỳ thi
- `ASSIGNMENT_SUBMIT` - Nộp bài tập
- `DAILY_LOGIN` - Đăng nhập hàng ngày
- `QUIZ_PERFECT` - Quiz hoàn hảo
- `ACHIEVEMENT` - Thành tích đặc biệt
- `REFERRAL` - Giới thiệu bạn bè
- `ADMIN_BONUS` - Thưởng từ Admin
- `CUSTOM` - Khác

### Spending (SPEND)
- `WITHDRAW` - Rút token
- `WITHDRAW_FAILED_REFUND` - Hoàn tiền (rút thất bại)
- `PURCHASE` - Mua sắm
- `SPEND` - Tiêu token chung

---

## Usage Examples

### User: Rút token về blockchain wallet

```typescript
import { useTokenBalance } from '../hooks/useTokenBalance';

function MyComponent() {
  const { balance, handleWithdraw } = useTokenBalance();
  
  const withdraw = async () => {
    const result = await handleWithdraw(100, '0x1234...');
    if (result.success) {
      console.log('Tx hash:', result.txHash);
    }
  };
  
  return <button onClick={withdraw}>Rút 100 LEARN</button>;
}
```

### Admin: Cấp token cho học viên

```typescript
import { grantTokens } from '../services/api/tokenRewardApi';

async function rewardStudent() {
  const result = await grantTokens({
    studentId: 123,
    amount: 50,
    reasonCode: 'EXAM_PASS',
    relatedId: 'exam-456'
  });
  
  console.log('Granted:', result);
}
```

---

## Environment Variables

Thêm vào `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

Token Reward Service sẽ được truy cập qua: `http://localhost:8080/token-reward/api/tokens`

---

## Database Schema

### Table: `cm_rewards`

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| student_id | INTEGER | ID học viên |
| tokens_awarded | INTEGER | Số token (luôn dương) |
| reason_code | VARCHAR | Mã lý do |
| related_id | UUID | ID liên quan |
| awarded_at | TIMESTAMP | Thời gian |
| transaction_type | VARCHAR(10) | 'EARN' hoặc 'SPEND' |

### Table: `cm_users`

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| token_balance | INTEGER | Số dư token hiện tại |

---

## Testing

### 1. Khởi động services

```bash
# Terminal 1: Start backend services
cd Code-spark
docker-compose up -d postgres-db token-reward-service

# Terminal 2: Start frontend
cd web-frontend
npm run dev
```

### 2. Test User Flow

1. Đăng nhập với user: `user@codespark.com` / `user123`
2. Vào trang **Phần thưởng** (`/user/rewards`)
3. Xem số dư token
4. Xem lịch sử giao dịch
5. Thử rút token (cần có số dư)

### 3. Test Admin Flow

1. Đăng nhập với admin: `admin@codespark.com` / `admin123`
2. Vào trang **Hệ thống thưởng Token** (`/admin/rewards`)
3. Click nút **"Cấp Token"**
4. Nhập ID học viên (ví dụ: 2 cho user)
5. Nhập số lượng token
6. Chọn lý do
7. Xác nhận

### 4. Verify

Sau khi admin cấp token:
- User refresh trang reward sẽ thấy số dư tăng
- Lịch sử giao dịch có bản ghi mới
- User có thể rút token về blockchain

---

## Troubleshooting

### Lỗi 404 - Service not found
- Kiểm tra token-reward-service đã chạy chưa
- Kiểm tra API Gateway đã route đúng chưa

### Lỗi CORS
- Thêm origin frontend vào CORS config của token-reward-service
- Kiểm tra headers trong request

### Lỗi User not found
- Kiểm tra student_id có tồn tại trong table `cm_users` chưa
- Run seed script: `node scripts/populate-db.js`

### Balance không cập nhật
- Kiểm tra transaction đã commit chưa
- Xem logs của tokenService.js
- Verify database connection

---

## Next Steps

### Planned Features

1. **Gift Store Integration** - Đổi token lấy quà
2. **Token Leaderboard** - Bảng xếp hạng người có nhiều token
3. **Referral System** - Giới thiệu bạn bè nhận token
4. **Automated Rewards** - Tự động thưởng theo luật đã cài đặt
5. **Token Analytics** - Thống kê phân phối token

---

## Architecture

```
┌─────────────────────────────────────────────┐
│          Frontend (React/TypeScript)         │
├─────────────────────────────────────────────┤
│  User Pages         │  Admin Pages          │
│  - RewardPage       │  - RewardPage         │
│  - TokenWallet      │  - GrantTokenModal    │
└─────────────┬───────────────────────────────┘
              │
              │ HTTP Requests
              ↓
┌─────────────────────────────────────────────┐
│         API Gateway (Port 8080)              │
│         Route: /token-reward/*               │
└─────────────┬───────────────────────────────┘
              │
              │ Forward to
              ↓
┌─────────────────────────────────────────────┐
│    Token Reward Service (Port 3000)         │
│    - Express.js + Sequelize                 │
│    - PostgreSQL (Off-chain balance)         │
│    - Hardhat + Ganache (On-chain)           │
└─────────────┬───────────────────────────────┘
              │
              │ Write/Read
              ↓
┌─────────────────────────────────────────────┐
│         PostgreSQL Database                  │
│         - cm_users (token_balance)          │
│         - cm_rewards (transaction log)      │
└─────────────────────────────────────────────┘
```

---

## Summary

✅ **User can:**
- View token balance
- See transaction history (paginated)
- Withdraw tokens to blockchain wallet
- Real-time balance updates

✅ **Admin can:**
- Grant tokens to any student
- View all token rules
- Monitor all transactions
- Track token distribution stats

✅ **System:**
- Off-chain balance management (fast)
- On-chain withdrawal (when needed)
- Transaction logging
- Refund mechanism if withdrawal fails

