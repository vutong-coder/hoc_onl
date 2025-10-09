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
        { type: 'earn', amount: 100, description: 'Completed Python Basic', date: '2 hours ago' },
        { type: 'spend', amount: -50, description: 'Unlocked Advanced Course', date: '1 day ago' },
        { type: 'reward', amount: 200, description: 'Daily Streak Bonus', date: '2 days ago' },
        { type: 'earn', amount: 75, description: 'Quiz High Score', date: '3 days ago' }
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
                        Token Wallet
                    </h3>
                    <button 
                        onClick={onBuyTokens}
                        style={{ fontSize: '14px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Buy Tokens
                    </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                            Current Balance
                        </span>
                        <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>
                            <Coins style={{ width: '24px', height: '24px', marginRight: '4px' }} />
                            {tokenBalance.toLocaleString()}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                        <TrendingUp style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                        Total Earned: {totalEarned.toLocaleString()} tokens
                    </div>
                </div>
            </div>

            {/* --- PHẦN NỘI DUNG CUỘN --- */}
            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', minHeight: 0 }}>
                <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>
                        Recent Transactions
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
                                        background: transaction.type === 'earn' ? '#10b981' : transaction.type === 'spend' ? '#ef4444' : '#f59e0b'
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
                                    color: transaction.amount > 0 ? '#059669' : '#dc2626',
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
                        View All Transactions
                    </button>
                </div>
            </div>
        </div>
    )
}