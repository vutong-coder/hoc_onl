import React from 'react'
import { Wallet, TrendingUp, Gift, Coins } from 'lucide-react'

interface TokenWalletProps {
    tokenBalance?: number
    totalEarned?: number
    recentTransactions?: Array<{
        type: 'earn' | 'spend' | 'reward'
        amount: number
        description: string
        date: string
    }>
    onViewTransactions?: () => void
    onBuyTokens?: () => void
}

export default function TokenWallet({ 
    tokenBalance = 1250,
    totalEarned = 5000,
    recentTransactions = [
        { type: 'earn', amount: 100, description: 'Hoàn thành Python cơ bản', date: '2 giờ trước' },
        { type: 'spend', amount: -50, description: 'Mở khóa khóa học nâng cao', date: '1 ngày trước' },
        { type: 'reward', amount: 200, description: 'Thưởng chuỗi ngày', date: '2 ngày trước' },
        { type: 'earn', amount: 75, description: 'Điểm cao bài kiểm tra', date: '3 ngày trước' }
    ],
    onViewTransactions,
    onBuyTokens
}: TokenWalletProps): JSX.Element {
    return (
        <div className="card stagger-load hover-lift interactive" style={{ 
            animationDelay: '200ms', 
            height: '370px', 
            padding: '16px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* --- PHẦN NỘI DUNG TĨNH --- */}
            <div style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center' }}>
                        <Wallet style={{ width: '20px', height: '20px', marginRight: '8px', color: 'var(--accent)' }} />
                        Ví Token
                    </h3>
                    <button 
                        onClick={onBuyTokens}
                        style={{ fontSize: '14px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Mua Token
                    </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                            Số dư hiện tại
                        </span>
                        <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>
                            <Coins style={{ width: '24px', height: '24px', marginRight: '4px' }} />
                            {tokenBalance.toLocaleString()}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                        <TrendingUp style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                        Tổng đã kiếm: {totalEarned.toLocaleString()} token
                    </div>
                </div>
            </div>

            {/* --- PHẦN NỘI DUNG CUỘN --- */}
            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', minHeight: 0 }}>
                <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>
                        Giao dịch gần đây
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {recentTransactions.map((transaction, index) => (
                            <div key={index} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                padding: '8px 12px', 
                                borderRadius: 'var(--radius-md)', 
                                background: 'var(--card)',
                                border: '1px solid var(--border)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ 
                                        width: '8px', 
                                        height: '8px', 
                                        borderRadius: '50%', 
                                        marginRight: '12px',
                                        flexShrink: 0,
                                        background: transaction.type === 'earn' ? 'var(--primary)' : transaction.type === 'spend' ? 'var(--destructive)' : 'var(--accent)'
                                    }} />
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 500, margin: 0, color: 'var(--foreground)' }}>
                                            {transaction.description}
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: 0, marginTop: '2px' }}>
                                            {transaction.date}
                                        </p>
                                    </div>
                                </div>
                                <span style={{ 
                                    fontSize: '14px', 
                                    fontWeight: 600, 
                                    color: transaction.amount > 0 ? 'var(--primary)' : 'var(--destructive)',
                                    marginLeft: '8px'
                                }}>
                                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={onViewTransactions}
                        style={{ 
                            width: '100%', 
                            marginTop: '12px', 
                            fontSize: '14px', 
                            color: 'var(--accent)', 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            textDecoration: 'underline' 
                        }}
                    >
                        Xem tất cả giao dịch
                    </button>
                </div>
            </div>
        </div>
    )
}