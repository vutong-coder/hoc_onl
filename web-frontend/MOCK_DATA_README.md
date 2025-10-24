# Mock Data cho Token Wallet System

Hệ thống Token Wallet hiện đang sử dụng mock data để phát triển frontend mà không cần backend.

## Cấu trúc Mock Data

### 1. Mock Gifts (`mockGifts`)
**File**: `src/services/api/mockData.ts`

Danh sách quà tặng có sẵn trong Reward Store với các danh mục:
- **Courses** (Khóa học): Python, React/Node, Data Science, Mobile App
- **Vouchers**: Shopee, Grab Food, Lazada, Starbucks, CGV
- **Electronics** (Đồ điện tử): Tai nghe, chuột gaming, bàn phím, webcam, loa, đồng hồ
- **Physical Gifts** (Quà vật lý): Áo thun, balo, bình nước, sổ tay, mô hình
- **Other** (Khác): GitHub Copilot, ChatGPT Plus, Udemy Business

Mỗi gift có:
```typescript
{
    id: string
    name: string
    description: string
    imageUrl: string
    tokenPrice: number
    stockQuantity: number
    category: 'course' | 'voucher' | 'electronics' | 'physical' | 'other'
}
```

### 2. Mock Transactions (`mockTransactions`)
**File**: `src/services/api/mockData.ts`

Lịch sử 10 giao dịch token gần nhất, bao gồm:
- **Earn**: Hoàn thành khóa học, bài kiểm tra (+token)
- **Spend**: Mở khóa khóa học, đổi quà (-token)
- **Reward**: Thưởng streak, giải cuộc thi (+token)
- **Withdrawal**: Rút tiền về ngân hàng (-token)

Mỗi transaction có:
```typescript
{
    id: string
    userId: string
    walletAddress: string
    type: 'earn' | 'spend' | 'reward' | 'withdrawal'
    amount: number
    description: string
    transactionHash: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    createdAt: string (ISO)
    updatedAt: string (ISO)
}
```

### 3. Mock Token Balance (`mockTokenBalance`)
**File**: `src/services/api/mockData.ts`

Số dư token hiện tại của user:
```typescript
{
    userId: 'user-123'
    balance: 1250           // Số dư hiện tại
    totalEarned: 5000       // Tổng đã kiếm
    totalSpent: 3750        // Tổng đã tiêu
    pendingWithdrawal: 500  // Đang chờ rút
}
```

### 4. Mock Banks (`mockBanks`)
**File**: `src/services/api/mockData.ts`

Danh sách 19 ngân hàng Việt Nam hỗ trợ rút tiền:
- Vietcombank, Techcombank, MB Bank, VPBank, ACB
- VIB, TPBank, Sacombank, HDBank, SHB
- BIDV, VietinBank, ABBANK, Nam A Bank, OCB
- MSB, SCB, SeABank, Agribank

### 5. Mock Withdrawals (`mockWithdrawals`)
**File**: `src/services/api/mockData.ts`

Lịch sử rút tiền với các trạng thái khác nhau (processing, completed).

### 6. Mock Redemptions (`mockRedemptions`)
**File**: `src/services/api/mockData.ts`

Lịch sử đổi quà với tracking number và địa chỉ giao hàng.

## Các Component Đã Được Cập Nhật

### 1. RewardStoreModal
**File**: `src/components/molecules/RewardStoreModal.tsx`

- ✅ Import `mockGifts` trực tiếp
- ✅ `loadGifts()` sử dụng mock data với simulated delay (300ms)
- ✅ `handleConfirmRedeem()` mô phỏng redemption process (1500ms delay)
- ✅ Filter và search hoạt động với mock data
- ✅ Console.log để theo dõi mock redemption

### 2. TokenTransferModal
**File**: `src/components/molecules/TokenTransferModal.tsx`

- ✅ Import `mockBanks` trực tiếp
- ✅ `loadBanks()` sử dụng mock data với simulated delay (200ms)
- ✅ `calculateFee()` tính phí 2% trên mock data
- ✅ `handleConfirmWithdrawal()` mô phỏng withdrawal process (2000ms delay)
- ✅ Console.log để theo dõi mock withdrawal

### 3. TokenWallet
**File**: `src/components/atoms/TokenWallet.tsx`

- ✅ Đã có mock data sẵn trong props default
- ✅ Hiển thị balance, totalEarned, recentTransactions
- ✅ Tích hợp với blockchain wallet service (MetaMask)

## Helper Functions

### `formatTransactionDate(dateString)`
Format ngày giờ thành dạng người dùng dễ đọc:
- "X phút trước"
- "X giờ trước"
- "X ngày trước"
- "DD/MM/YYYY" (nếu > 7 ngày)

### `getRecentTransactions(limit)`
Lấy danh sách transactions gần nhất với format phù hợp để hiển thị:
```typescript
{
    type: 'earn' | 'spend' | 'reward'
    amount: number
    description: string
    date: string (formatted)
}
```

## Cách Sử Dụng

### 1. Xem danh sách quà tặng
```typescript
import { mockGifts } from '@/services/api/mockData'

// Lọc theo category
const courses = mockGifts.filter(g => g.category === 'course')
```

### 2. Hiển thị transactions
```typescript
import { getRecentTransactions } from '@/services/api/mockData'

const recentTxns = getRecentTransactions(4) // Lấy 4 transactions gần nhất
```

### 3. Kiểm tra balance
```typescript
import { mockTokenBalance } from '@/services/api/mockData'

console.log(`Balance: ${mockTokenBalance.balance} tokens`)
```

## Testing

Tất cả mock data được thiết kế để:
- ✅ Có timestamps thực tế (relative dates)
- ✅ Có validation logic đầy đủ
- ✅ Simulated delays để giống real API
- ✅ Console logging để debug
- ✅ Error handling

## Chuyển Sang Backend

Khi backend đã sẵn sàng, chỉ cần:

1. **RewardStoreModal**: Uncomment API calls trong `loadGifts()` và `handleConfirmRedeem()`
2. **TokenTransferModal**: Uncomment API calls trong `loadBanks()`, `calculateFee()`, và `handleConfirmWithdrawal()`
3. **Token API**: File `tokenApi.ts` đã có sẵn các functions, chỉ cần backend endpoint hoạt động

Mock data sẽ tự động làm fallback nếu API fails.

## Notes

- User ID mặc định: `user-123`
- Wallet address mẫu: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
- Conversion rate: 1 token ≈ 1,000 VNĐ (có thể thay đổi)
- Withdrawal fee: 2%
- Minimum withdrawal: 100 tokens
