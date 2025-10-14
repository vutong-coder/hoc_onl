import { useState, useEffect } from 'react'
import { Wallet, TrendingUp, Gift, Coins, CreditCard, Loader2, AlertCircle } from 'lucide-react'
import {
    connectWallet,
    getWalletInfo,
    isMetaMaskInstalled,
    formatAddress,
    formatTokenAmount,
    onAccountsChanged,
    removeAccountsListener,
    type WalletInfo
} from '../../services/blockchain/walletService'

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
    onWithdraw?: () => void
    onRedeemGifts?: () => void
    userId?: string
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
    onBuyTokens,
    onWithdraw,
    onRedeemGifts,
    userId
}: TokenWalletProps): JSX.Element {
    const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
    const [isConnecting, setIsConnecting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Load wallet info on mount
    useEffect(() => {
        loadWalletInfo()

        // Listen for account changes
        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length > 0) {
                loadWalletInfo()
            } else {
                setWalletInfo(null)
            }
        }

        onAccountsChanged(handleAccountsChanged)

        return () => {
            removeAccountsListener(handleAccountsChanged)
        }
    }, [])

    const loadWalletInfo = async () => {
        try {
            // Try to get current wallet without prompting user
            if (!isMetaMaskInstalled()) return

            const accounts: string[] = await (window as any).ethereum.request({
                method: 'eth_accounts'
            })

            if (accounts.length > 0 && accounts[0]) {
                const info = await getWalletInfo(accounts[0])
                setWalletInfo(info)
            }
        } catch (err) {
            console.error('Error loading wallet:', err)
        }
    }

    const handleConnectWallet = async () => {
        if (!isMetaMaskInstalled()) {
            setError('MetaMask chưa được cài đặt. Vui lòng cài đặt MetaMask extension.')
            return
        }

        setIsConnecting(true)
        setError(null)

        try {
            const address = await connectWallet()
            if (address) {
                const info = await getWalletInfo(address)
                setWalletInfo(info)
            }
        } catch (err: any) {
            setError(err.message || 'Không thể kết nối ví')
        } finally {
            setIsConnecting(false)
        }
    }

    const displayBalance = walletInfo ? parseFloat(walletInfo.balance) : tokenBalance
    const displayEarned = walletInfo ? parseFloat(walletInfo.totalEarned) : totalEarned

    return (
        <div className="card stagger-load hover-lift interactive" style={{
            animationDelay: '200ms',
            height: '370px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            {/* --- HEADER --- */}
            <div style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center' }}>
                        <Wallet style={{ width: '20px', height: '20px', marginRight: '8px', color: 'var(--accent)' }} />
                        Ví Token
                    </h3>
                    {!walletInfo ? (
                        <button
                            onClick={handleConnectWallet}
                            disabled={isConnecting}
                            style={{
                                fontSize: '13px',
                                color: 'white',
                                background: 'var(--accent)',
                                border: 'none',
                                cursor: isConnecting ? 'not-allowed' : 'pointer',
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                opacity: isConnecting ? 0.7 : 1
                            }}
                        >
                            {isConnecting ? (
                                <>
                                    <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                                    Đang kết nối...
                                </>
                            ) : (
                                <>
                                    <Wallet style={{ width: '14px', height: '14px' }} />
                                    Kết nối ví
                                </>
                            )}
                        </button>
                    ) : (
                        <div style={{
                            fontSize: '12px',
                            color: 'var(--muted-foreground)',
                            background: 'var(--muted)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: 'var(--primary)'
                            }} />
                            {formatAddress(walletInfo.address)}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: '8px 12px',
                        background: 'var(--destructive)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                        {error}
                    </div>
                )}

                {/* Balance Section */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                            Số dư hiện tại
                        </span>
                        <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>
                            <Coins style={{ width: '24px', height: '24px', marginRight: '4px' }} />
                            {formatTokenAmount(displayBalance)}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                        <TrendingUp style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                        Tổng đã kiếm: {formatTokenAmount(displayEarned)} token
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginBottom: '20px'
                }}>
                    <button
                        onClick={onRedeemGifts}
                        style={{
                            padding: '10px',
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    >
                        <Gift style={{ width: '16px', height: '16px' }} />
                        Đổi quà
                    </button>
                    <button
                        onClick={onWithdraw}
                        style={{
                            padding: '10px',
                            background: 'var(--card)',
                            color: 'var(--foreground)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'transform 0.2s, border-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.borderColor = 'var(--primary)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.borderColor = 'var(--border)'
                        }}
                    >
                        <CreditCard style={{ width: '16px', height: '16px' }} />
                        Rút tiền
                    </button>
                </div>
            </div>

            {/* --- TRANSACTIONS LIST --- */}
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
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(4px)'
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0)'
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                            }}
                            >
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
                            textDecoration: 'underline',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--primary)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--accent)'
                        }}
                    >
                        Xem tất cả giao dịch
                    </button>
                </div>
            </div>

            {/* Add spin animation */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}