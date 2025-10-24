# 🪙 Hệ thống Token ERC-20 - Learn Platform

Hệ thống ví token blockchain tích hợp đầy đủ cho nền tảng học tập, cho phép người dùng kiếm token qua các hoạt động học tập và sử dụng token để đổi quà hoặc rút về ngân hàng.

## 📦 Cấu trúc dự án

```
web-frontend/
├── contracts/
│   └── LearnToken.sol                    # Smart contract ERC-20
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   │   └── TokenWallet.tsx           # Component hiển thị ví token
│   │   └── molecules/
│   │       ├── TokenTransferModal.tsx    # Modal rút token về ngân hàng
│   │       └── RewardStoreModal.tsx      # Modal đổi quà tặng
│   ├── services/
│   │   ├── blockchain/
│   │   │   └── walletService.ts          # Service tương tác blockchain
│   │   └── api/
│   │       ├── tokenApi.ts               # API calls cho token
│   │       └── mockData.ts               # Mock data (banks, gifts)
│   └── hooks/
│       └── useTokenRewards.ts            # Hook tự động thưởng token
```

## ✨ Tính năng chính

### 1. Smart Contract LearnToken (ERC-20)
- ✅ Token tiêu chuẩn ERC-20
- ✅ Phát thưởng tự động cho các hoạt động:
  - Hoàn thành bài học: 10 token
  - Vượt qua kỳ thi: 50 token (+ bonus nếu điểm cao)
  - Chuỗi ngày học tập: 5 token/ngày (+ bonus theo tuần)
  - Đạt chứng chỉ: 200 token
  - Thắng cuộc thi: 500 token (x2 nếu hạng 1)
- ✅ Rút token về ngân hàng (minimum 100 token)
- ✅ Chi tiêu token để mua khóa học/đổi quà
- ✅ Pause/unpause functions
- ✅ Access control (Owner, Minters)

### 2. TokenWallet Component
- ✅ Kết nối MetaMask
- ✅ Hiển thị số dư real-time từ blockchain
- ✅ Hiển thị tổng token đã kiếm
- ✅ Lịch sử giao dịch gần đây
- ✅ Nút "Đổi quà" và "Rút tiền"
- ✅ Auto-connect khi đã kết nối trước đó

### 3. TokenTransferModal
- ✅ Form rút token về ngân hàng
- ✅ Chọn ngân hàng từ 19 ngân hàng VN
- ✅ Nhập số tài khoản và tên chủ TK
- ✅ Tính phí giao dịch tự động (2%)
- ✅ Xác nhận và xử lý giao dịch
- ✅ Thông báo thành công

### 4. RewardStoreModal
- ✅ Danh sách 25+ quà tặng đa dạng:
  - Khóa học (Python, React, Data Science...)
  - Voucher (Shopee, Grab, Lazada, Starbucks, CGV...)
  - Điện tử (Tai nghe, chuột, bàn phím, webcam...)
  - Quà tặng vật lý (Áo, balo, sổ tay...)
  - Dịch vụ (GitHub Copilot, ChatGPT Plus, Udemy...)
- ✅ Tìm kiếm và lọc theo danh mục
- ✅ Chọn số lượng
- ✅ Nhập địa chỉ giao hàng (cho hàng vật lý)
- ✅ Xác nhận đổi quà

### 5. useTokenRewards Hook
- ✅ `awardForLessonCompletion()` - Thưởng khi hoàn thành bài học
- ✅ `awardForExamPass()` - Thưởng khi vượt qua kỳ thi
- ✅ `awardForDailyStreak()` - Thưởng chuỗi ngày học tập
- ✅ `awardForCertification()` - Thưởng khi đạt chứng chỉ
- ✅ `awardForContestWin()` - Thưởng khi thắng cuộc thi
- ✅ Callbacks: `onRewardEarned`, `onError`

## 🚀 Cách sử dụng

### 1. Sử dụng TokenWallet Component

```tsx
import TokenWallet from './components/atoms/TokenWallet'
import TokenTransferModal from './components/molecules/TokenTransferModal'
import RewardStoreModal from './components/molecules/RewardStoreModal'
import { useState } from 'react'

function Dashboard() {
    const [showWithdraw, setShowWithdraw] = useState(false)
    const [showRewards, setShowRewards] = useState(false)
    const [currentBalance, setCurrentBalance] = useState(1250)

    return (
        <div>
            <TokenWallet
                tokenBalance={currentBalance}
                totalEarned={5000}
                onWithdraw={() => setShowWithdraw(true)}
                onRedeemGifts={() => setShowRewards(true)}
                onViewTransactions={() => {/* Navigate to transactions page */}}
                userId="user123"
            />

            <TokenTransferModal
                isOpen={showWithdraw}
                onClose={() => setShowWithdraw(false)}
                currentBalance={currentBalance}
                walletAddress="0x..."
                userId="user123"
            />

            <RewardStoreModal
                isOpen={showRewards}
                onClose={() => setShowRewards(false)}
                currentBalance={currentBalance}
                walletAddress="0x..."
                userId="user123"
            />
        </div>
    )
}
```

### 2. Sử dụng useTokenRewards Hook

```tsx
import { useTokenRewards } from './hooks/useTokenRewards'
import { useState } from 'react'

function LessonPage({ lessonId, lessonName, userId, walletAddress }) {
    const [showReward, setShowReward] = useState(false)
    const [rewardAmount, setRewardAmount] = useState(0)

    const { isAwarding, awardForLessonCompletion } = useTokenRewards({
        userId,
        walletAddress,
        onRewardEarned: (amount, reason) => {
            setRewardAmount(amount)
            setShowReward(true)
        },
        onError: (error) => {
            console.error('Award error:', error)
        }
    })

    const handleCompletLesson = async () => {
        // Complete lesson logic...

        // Award token
        const success = await awardForLessonCompletion(lessonId, lessonName)
        if (success) {
            console.log('Token awarded!')
        }
    }

    return (
        <div>
            {/* Lesson content */}
            <button onClick={handleCompletLesson} disabled={isAwarding}>
                {isAwarding ? 'Đang xử lý...' : 'Hoàn thành bài học'}
            </button>

            {showReward && (
                <div className="reward-notification">
                    🎉 Bạn đã nhận {rewardAmount} token!
                </div>
            )}
        </div>
    )
}
```

### 3. Tích hợp vào ExamResultPage

```tsx
import { useTokenRewards } from '../hooks/useTokenRewards'

function ExamResultPage({ examResult, userId, walletAddress }) {
    const { awardForExamPass } = useTokenRewards({
        userId,
        walletAddress,
        onRewardEarned: (amount) => {
            alert(`Chúc mừng! Bạn nhận được ${amount} token!`)
        }
    })

    useEffect(() => {
        if (examResult.passed) {
            awardForExamPass(
                examResult.examId,
                examResult.examName,
                examResult.score
            )
        }
    }, [examResult])

    return (
        <div>
            {/* Exam result display */}
        </div>
    )
}
```

## 🔧 Cấu hình

### 1. Deploy Smart Contract

```bash
# Cài đặt Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Deploy contract
npx hardhat run scripts/deploy.js --network sepolia
```

### 2. Cập nhật Contract Address

Sau khi deploy, cập nhật địa chỉ contract trong `src/services/blockchain/walletService.ts`:

```typescript
const LEARN_TOKEN_ADDRESS = '0xYourContractAddressHere'
```

### 3. Environment Variables

Tạo file `.env`:

```env
REACT_APP_LEARN_TOKEN_ADDRESS=0xYourContractAddress
```

### 4. Kích hoạt Mock Data

Hiện tại hệ thống sử dụng mock data cho banks và gifts. Khi backend API sẵn sàng, các function trong `tokenApi.ts` sẽ tự động chuyển sang sử dụng API thật.

## 🎯 Luồng hoạt động

### Kiếm Token:
1. User hoàn thành hoạt động (bài học, thi, streak...)
2. Frontend gọi `useTokenRewards` hook
3. Hook gọi API backend
4. Backend verify và gọi smart contract để mint token
5. Token được cộng vào ví user
6. Frontend hiển thị thông báo nhận thưởng

### Đổi Quà:
1. User mở RewardStoreModal
2. Chọn quà muốn đổi
3. Xác nhận giao dịch
4. Backend verify số dư và burn token
5. Tạo order giao hàng
6. Thông báo thành công

### Rút Tiền:
1. User mở TokenTransferModal
2. Nhập thông tin ngân hàng
3. Xác nhận giao dịch (phí 2%)
4. Smart contract burn token
5. Backend tạo yêu cầu chuyển tiền
6. Xử lý chuyển khoản (1-3 ngày)

## 📝 TODO Backend API

Backend cần implement các endpoints sau:

```typescript
// Reward endpoints
POST /api/tokens/reward/lesson
POST /api/tokens/reward/exam
POST /api/tokens/reward/streak
POST /api/tokens/reward/certification
POST /api/tokens/reward/contest

// Redemption endpoints
GET  /api/tokens/gifts
GET  /api/tokens/gifts/:id
POST /api/tokens/redeem/gift
POST /api/tokens/redeem/course

// Withdrawal endpoints
POST /api/tokens/withdrawal/bank
GET  /api/tokens/withdrawal/:id
POST /api/tokens/withdrawal/calculate-fee

// Banks & Stats
GET  /api/tokens/banks
GET  /api/tokens/stats
GET  /api/tokens/transactions/:userId
GET  /api/tokens/balance/:userId
```

## 🔐 Bảo mật

- ✅ Smart contract có Pausable
- ✅ Access control với Owner và Minters
- ✅ Minimum withdrawal: 100 token
- ✅ Frontend validation
- ✅ Backend verification trước khi mint/burn
- ⚠️ TODO: Rate limiting
- ⚠️ TODO: KYC cho rút tiền lớn

## 📱 Responsive Design

Tất cả components đã được thiết kế responsive:
- ✅ Mobile-first approach
- ✅ Touch-friendly buttons
- ✅ Modal scrollable trên mobile
- ✅ Grid layout tự động điều chỉnh

## 🎨 Styling

Sử dụng CSS variables từ design system hiện có:
- `--primary`, `--accent`, `--destructive`
- `--card`, `--background`, `--foreground`
- `--border`, `--muted`, `--muted-foreground`
- `--radius-sm`, `--radius-md`, `--radius-lg`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`

## 🐛 Troubleshooting

### MetaMask không kết nối được:
- Kiểm tra đã cài đặt MetaMask extension
- Kiểm tra network đúng (Mainnet/Testnet)
- Refresh page và thử lại

### Không thấy số dư token:
- Kiểm tra contract address đã đúng
- Kiểm tra wallet đã connect
- Kiểm tra network đúng
- Xem console log để debug

### Lỗi khi đổi quà/rút tiền:
- Kiểm tra số dư đủ
- Kiểm tra đã nhập đầy đủ thông tin
- Xem console log để biết lỗi cụ thể

## 📞 Support

Nếu cần hỗ trợ:
1. Check console log
2. Check network tab
3. Kiểm tra contract address
4. Kiểm tra MetaMask

## 🎉 Hoàn thành!

Hệ thống token ERC-20 đã sẵn sàng sử dụng với đầy đủ tính năng:
- ✅ Smart Contract ERC-20
- ✅ Wallet Integration
- ✅ Reward System
- ✅ Gift Store
- ✅ Bank Withdrawal
- ✅ Mock Data
- ✅ Responsive UI

Chúc bạn triển khai thành công! 🚀
