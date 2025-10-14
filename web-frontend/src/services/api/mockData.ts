// Mock bank data for Vietnam
export const mockBanks = [
    {
        code: 'VCB',
        name: 'Ngân hàng TMCP Ngoại thương Việt Nam',
        shortName: 'Vietcombank',
        logo: '/images/banks/vcb.png'
    },
    {
        code: 'TCB',
        name: 'Ngân hàng TMCP Kỹ thương Việt Nam',
        shortName: 'Techcombank',
        logo: '/images/banks/tcb.png'
    },
    {
        code: 'MB',
        name: 'Ngân hàng TMCP Quân đội',
        shortName: 'MB Bank',
        logo: '/images/banks/mb.png'
    },
    {
        code: 'VPB',
        name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng',
        shortName: 'VPBank',
        logo: '/images/banks/vpb.png'
    },
    {
        code: 'ACB',
        name: 'Ngân hàng TMCP Á Châu',
        shortName: 'ACB',
        logo: '/images/banks/acb.png'
    },
    {
        code: 'VIB',
        name: 'Ngân hàng TMCP Quốc tế',
        shortName: 'VIB',
        logo: '/images/banks/vib.png'
    },
    {
        code: 'TPB',
        name: 'Ngân hàng TMCP Tiên Phong',
        shortName: 'TPBank',
        logo: '/images/banks/tpb.png'
    },
    {
        code: 'STB',
        name: 'Ngân hàng TMCP Sài Gòn Thương Tín',
        shortName: 'Sacombank',
        logo: '/images/banks/stb.png'
    },
    {
        code: 'HDB',
        name: 'Ngân hàng TMCP Phát triển TP HCM',
        shortName: 'HDBank',
        logo: '/images/banks/hdb.png'
    },
    {
        code: 'SHB',
        name: 'Ngân hàng TMCP Sài Gòn - Hà Nội',
        shortName: 'SHB',
        logo: '/images/banks/shb.png'
    },
    {
        code: 'BIDV',
        name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
        shortName: 'BIDV',
        logo: '/images/banks/bidv.png'
    },
    {
        code: 'VTB',
        name: 'Ngân hàng TMCP Việt Nam Thương Tín',
        shortName: 'VietinBank',
        logo: '/images/banks/vtb.png'
    },
    {
        code: 'ABB',
        name: 'Ngân hàng TMCP An Bình',
        shortName: 'ABBANK',
        logo: '/images/banks/abb.png'
    },
    {
        code: 'NAB',
        name: 'Ngân hàng TMCP Nam Á',
        shortName: 'Nam A Bank',
        logo: '/images/banks/nab.png'
    },
    {
        code: 'OCB',
        name: 'Ngân hàng TMCP Phương Đông',
        shortName: 'OCB',
        logo: '/images/banks/ocb.png'
    },
    {
        code: 'MSB',
        name: 'Ngân hàng TMCP Hàng Hải',
        shortName: 'MSB',
        logo: '/images/banks/msb.png'
    },
    {
        code: 'SCB',
        name: 'Ngân hàng TMCP Sài Gòn',
        shortName: 'SCB',
        logo: '/images/banks/scb.png'
    },
    {
        code: 'SEA',
        name: 'Ngân hàng TMCP Đông Nam Á',
        shortName: 'SeABank',
        logo: '/images/banks/sea.png'
    },
    {
        code: 'VBA',
        name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn',
        shortName: 'Agribank',
        logo: '/images/banks/vba.png'
    }
]

// Mock gift items for reward store
export const mockGifts = [
    // Courses
    {
        id: 'course-1',
        name: 'Khóa học Python từ Zero đến Hero',
        description: 'Khóa học Python toàn diện với 200+ bài giảng, bài tập thực hành và dự án thực tế',
        imageUrl: '/images/gifts/python-course.jpg',
        tokenPrice: 500,
        stockQuantity: 100,
        category: 'course' as const
    },
    {
        id: 'course-2',
        name: 'React & Node.js Fullstack',
        description: 'Xây dựng ứng dụng web fullstack với React, Node.js, MongoDB',
        imageUrl: '/images/gifts/fullstack-course.jpg',
        tokenPrice: 800,
        stockQuantity: 80,
        category: 'course' as const
    },
    {
        id: 'course-3',
        name: 'Data Science Master',
        description: 'Machine Learning, Deep Learning, và Data Analysis với Python',
        imageUrl: '/images/gifts/datascience-course.jpg',
        tokenPrice: 1000,
        stockQuantity: 50,
        category: 'course' as const
    },
    {
        id: 'course-4',
        name: 'Mobile App với React Native',
        description: 'Phát triển ứng dụng di động đa nền tảng với React Native',
        imageUrl: '/images/gifts/mobile-course.jpg',
        tokenPrice: 700,
        stockQuantity: 60,
        category: 'course' as const
    },

    // Vouchers
    {
        id: 'voucher-1',
        name: 'Voucher Shopee 100K',
        description: 'Mã giảm giá Shopee trị giá 100.000đ cho đơn từ 200K',
        imageUrl: '/images/gifts/shopee-voucher.jpg',
        tokenPrice: 200,
        stockQuantity: 200,
        category: 'voucher' as const
    },
    {
        id: 'voucher-2',
        name: 'Voucher Grab Food 50K',
        description: 'Mã giảm giá Grab Food 50.000đ cho đơn từ 100K',
        imageUrl: '/images/gifts/grab-voucher.jpg',
        tokenPrice: 100,
        stockQuantity: 300,
        category: 'voucher' as const
    },
    {
        id: 'voucher-3',
        name: 'Voucher Lazada 200K',
        description: 'Mã giảm giá Lazada 200.000đ cho đơn từ 500K',
        imageUrl: '/images/gifts/lazada-voucher.jpg',
        tokenPrice: 400,
        stockQuantity: 150,
        category: 'voucher' as const
    },
    {
        id: 'voucher-4',
        name: 'Starbucks 75K',
        description: 'Voucher Starbucks trị giá 75.000đ',
        imageUrl: '/images/gifts/starbucks-voucher.jpg',
        tokenPrice: 150,
        stockQuantity: 100,
        category: 'voucher' as const
    },
    {
        id: 'voucher-5',
        name: 'CGV Cinema 100K',
        description: 'Voucher xem phim CGV trị giá 100.000đ',
        imageUrl: '/images/gifts/cgv-voucher.jpg',
        tokenPrice: 200,
        stockQuantity: 120,
        category: 'voucher' as const
    },

    // Electronics
    {
        id: 'electronic-1',
        name: 'Tai nghe Bluetooth Sony WH-1000XM4',
        description: 'Tai nghe chống ồn cao cấp, pin 30h, chất âm tuyệt hảo',
        imageUrl: '/images/gifts/sony-headphone.jpg',
        tokenPrice: 1500,
        stockQuantity: 20,
        category: 'electronics' as const
    },
    {
        id: 'electronic-2',
        name: 'Chuột gaming Logitech G502',
        description: 'Chuột gaming cao cấp với nhiều nút lập trình được',
        imageUrl: '/images/gifts/gaming-mouse.jpg',
        tokenPrice: 400,
        stockQuantity: 50,
        category: 'electronics' as const
    },
    {
        id: 'electronic-3',
        name: 'Bàn phím cơ Keychron K2',
        description: 'Bàn phím cơ 75%, kết nối Bluetooth/USB-C, hot-swap',
        imageUrl: '/images/gifts/keyboard.jpg',
        tokenPrice: 800,
        stockQuantity: 30,
        category: 'electronics' as const
    },
    {
        id: 'electronic-4',
        name: 'Webcam Logitech C920',
        description: 'Webcam Full HD 1080p cho học online, streaming',
        imageUrl: '/images/gifts/webcam.jpg',
        tokenPrice: 500,
        stockQuantity: 40,
        category: 'electronics' as const
    },
    {
        id: 'electronic-5',
        name: 'Loa Bluetooth JBL Flip 5',
        description: 'Loa di động chống nước IPX7, pin 12h',
        imageUrl: '/images/gifts/jbl-speaker.jpg',
        tokenPrice: 600,
        stockQuantity: 35,
        category: 'electronics' as const
    },
    {
        id: 'electronic-6',
        name: 'Đồng hồ thông minh Xiaomi Mi Band 7',
        description: 'Theo dõi sức khỏe, màn hình AMOLED, pin 14 ngày',
        imageUrl: '/images/gifts/miband.jpg',
        tokenPrice: 300,
        stockQuantity: 60,
        category: 'electronics' as const
    },

    // Physical Gifts
    {
        id: 'physical-1',
        name: 'Áo thun CODE4FUN Premium',
        description: 'Áo thun cotton cao cấp với thiết kế dành cho developer',
        imageUrl: '/images/gifts/tshirt.jpg',
        tokenPrice: 300,
        stockQuantity: 100,
        category: 'physical' as const
    },
    {
        id: 'physical-2',
        name: 'Balo Laptop 15.6 inch',
        description: 'Balo chống sốc, chống nước, nhiều ngăn tiện dụng',
        imageUrl: '/images/gifts/backpack.jpg',
        tokenPrice: 400,
        stockQuantity: 50,
        category: 'physical' as const
    },
    {
        id: 'physical-3',
        name: 'Bình giữ nhiệt Inox 500ml',
        description: 'Bình inox cao cấp, giữ nhiệt 12h, giữ lạnh 24h',
        imageUrl: '/images/gifts/bottle.jpg',
        tokenPrice: 150,
        stockQuantity: 80,
        category: 'physical' as const
    },
    {
        id: 'physical-4',
        name: 'Sổ tay Moleskine Classic',
        description: 'Sổ tay cao cấp, bìa cứng, giấy dày 100gsm',
        imageUrl: '/images/gifts/notebook.jpg',
        tokenPrice: 200,
        stockQuantity: 70,
        category: 'physical' as const
    },
    {
        id: 'physical-5',
        name: 'Mô hình Gundam RX-78',
        description: 'Mô hình lắp ráp Gundam Master Grade tỉ lệ 1:100',
        imageUrl: '/images/gifts/gundam.jpg',
        tokenPrice: 350,
        stockQuantity: 40,
        category: 'physical' as const
    },

    // Other
    {
        id: 'other-1',
        name: 'GitHub Copilot 3 tháng',
        description: 'Gói đăng ký GitHub Copilot 3 tháng - AI coding assistant',
        imageUrl: '/images/gifts/github-copilot.jpg',
        tokenPrice: 600,
        stockQuantity: 100,
        category: 'other' as const
    },
    {
        id: 'other-2',
        name: 'ChatGPT Plus 1 tháng',
        description: 'Đăng ký ChatGPT Plus 1 tháng - GPT-4 không giới hạn',
        imageUrl: '/images/gifts/chatgpt.jpg',
        tokenPrice: 450,
        stockQuantity: 150,
        category: 'other' as const
    },
    {
        id: 'other-3',
        name: 'Udemy Business',
        description: 'Truy cập 7000+ khóa học Udemy trong 1 tháng',
        imageUrl: '/images/gifts/udemy.jpg',
        tokenPrice: 800,
        stockQuantity: 80,
        category: 'other' as const
    }
]

// Mock token transaction history
export const mockTransactions = [
    {
        id: 'txn-1',
        userId: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        type: 'earn' as const,
        amount: 100,
        description: 'Hoàn thành khóa học Python cơ bản',
        transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        status: 'completed' as const,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 giờ trước
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'txn-2',
        userId: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        type: 'spend' as const,
        amount: -50,
        description: 'Mở khóa khóa học React nâng cao',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        status: 'completed' as const,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 ngày trước
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'txn-3',
        userId: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        type: 'reward' as const,
        amount: 200,
        description: 'Thưởng chuỗi 7 ngày học liên tục',
        transactionHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
        status: 'completed' as const,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 ngày trước
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'txn-4',
        userId: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        type: 'earn' as const,
        amount: 75,
        description: 'Đạt 85% bài kiểm tra JavaScript',
        transactionHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
        status: 'completed' as const,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 ngày trước
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'txn-5',
        userId: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        type: 'earn' as const,
        amount: 150,
        description: 'Hoàn thành khóa học Node.js API',
        transactionHash: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
        status: 'completed' as const,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 ngày trước
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'txn-6',
        userId: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        type: 'spend' as const,
        amount: -200,
        description: 'Đổi Voucher Shopee 100K',
        transactionHash: '0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
        status: 'completed' as const,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 ngày trước
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'txn-7',
        userId: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        type: 'reward' as const,
        amount: 300,
        description: 'Giành hạng 1 cuộc thi Code Challenge',
        transactionHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
        status: 'completed' as const,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 ngày trước
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'txn-8',
        userId: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        type: 'earn' as const,
        amount: 50,
        description: 'Hoàn thành 5 bài tập HTML/CSS',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        status: 'completed' as const,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 ngày trước
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'txn-9',
        userId: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        type: 'withdrawal' as const,
        amount: -500,
        description: 'Rút tiền về tài khoản Vietcombank',
        transactionHash: '0x1111567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        status: 'processing' as const,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 giờ trước
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'txn-10',
        userId: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        type: 'earn' as const,
        amount: 250,
        description: 'Nhận chứng chỉ JavaScript Advanced',
        transactionHash: '0x2222567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        status: 'completed' as const,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 ngày trước
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    }
]

// Mock token balance data
export const mockTokenBalance = {
    userId: 'user-123',
    balance: 1250,
    totalEarned: 5000,
    totalSpent: 3750,
    pendingWithdrawal: 500
}

// Mock withdrawal history
export const mockWithdrawals = [
    {
        id: 'wd-1',
        userId: 'user-123',
        amount: 500,
        bankName: 'Vietcombank',
        accountNumber: '1234567890',
        accountHolder: 'NGUYEN VAN A',
        status: 'processing' as const,
        transactionHash: '0x1111567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        processedAt: null
    },
    {
        id: 'wd-2',
        userId: 'user-123',
        amount: 1000,
        bankName: 'Techcombank',
        accountNumber: '0987654321',
        accountHolder: 'NGUYEN VAN A',
        status: 'completed' as const,
        transactionHash: '0x3333567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        processedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'wd-3',
        userId: 'user-123',
        amount: 800,
        bankName: 'MB Bank',
        accountNumber: '5555666677',
        accountHolder: 'NGUYEN VAN A',
        status: 'completed' as const,
        transactionHash: '0x4444567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        processedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString()
    }
]

// Mock redemption history
export const mockRedemptions = [
    {
        id: 'rd-1',
        userId: 'user-123',
        giftId: 'voucher-1',
        giftName: 'Voucher Shopee 100K',
        quantity: 1,
        tokenPrice: 200,
        totalCost: 200,
        status: 'completed' as const,
        deliveryAddress: null,
        trackingNumber: 'SHOP-123456789',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'rd-2',
        userId: 'user-123',
        giftId: 'course-1',
        giftName: 'Khóa học Python từ Zero đến Hero',
        quantity: 1,
        tokenPrice: 500,
        totalCost: 500,
        status: 'completed' as const,
        deliveryAddress: null,
        trackingNumber: null,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'rd-3',
        userId: 'user-123',
        giftId: 'physical-1',
        giftName: 'Áo thun CODE4FUN Premium',
        quantity: 2,
        tokenPrice: 300,
        totalCost: 600,
        status: 'shipping' as const,
        deliveryAddress: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
        trackingNumber: 'VNP-987654321',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null
    }
]

// Helper function to format date for display
export function formatTransactionDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
        return `${diffMins} phút trước`
    } else if (diffHours < 24) {
        return `${diffHours} giờ trước`
    } else if (diffDays < 7) {
        return `${diffDays} ngày trước`
    } else {
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }
}

// Helper function to get recent transactions for display
export function getRecentTransactions(limit: number = 4) {
    return mockTransactions
        .slice(0, limit)
        .map(txn => ({
            type: txn.type,
            amount: txn.amount,
            description: txn.description,
            date: formatTransactionDate(txn.createdAt)
        }))
}
