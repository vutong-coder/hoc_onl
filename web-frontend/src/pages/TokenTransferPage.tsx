import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, CreditCard, AlertCircle, CheckCircle, Loader2, DollarSign, ArrowLeft } from 'lucide-react'
import { mockBanks } from '../services/api/mockData'

interface Bank {
    code: string
    name: string
    shortName: string
    logo: string
}

export default function TokenTransferPage(): JSX.Element {
    const navigate = useNavigate()
    const [amount, setAmount] = useState('')
    const [bankAccount, setBankAccount] = useState('')
    const [accountHolder, setAccountHolder] = useState('')
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
    const [banks, setBanks] = useState<Bank[]>([])
    const [fee, setFee] = useState(0)
    const [netAmount, setNetAmount] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [step, setStep] = useState<'form' | 'confirm' | 'processing' | 'success'>('form')

    // Mock data - in real app, get from Redux/Context
    const currentBalance = 1250
    const userId = 'user-123'
    const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'

    useEffect(() => {
        loadBanks()
    }, [])

    useEffect(() => {
        if (amount) {
            calculateFee()
        }
    }, [amount])

    const loadBanks = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 200))
            setBanks(mockBanks)
        } catch (err) {
            console.error('Error loading banks:', err)
            setBanks(mockBanks)
        }
    }

    const calculateFee = async () => {
        const amountNum = parseFloat(amount)
        if (amountNum > 0) {
            try {
                const fee = amountNum * 0.02
                const net = amountNum - fee
                setFee(fee)
                setNetAmount(net)
            } catch (err) {
                setFee(amountNum * 0.02)
                setNetAmount(amountNum * 0.98)
            }
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const amountNum = parseFloat(amount)

        if (!amountNum || amountNum <= 0) {
            setError('Vui lòng nhập số tiền hợp lệ')
            return
        }

        if (amountNum < 100) {
            setError('Số tiền rút tối thiểu là 100 token')
            return
        }

        if (amountNum > currentBalance) {
            setError('Số dư không đủ')
            return
        }

        if (!selectedBank) {
            setError('Vui lòng chọn ngân hàng')
            return
        }

        if (!bankAccount.trim()) {
            setError('Vui lòng nhập số tài khoản')
            return
        }

        if (!accountHolder.trim()) {
            setError('Vui lòng nhập tên chủ tài khoản')
            return
        }

        setStep('confirm')
    }

    const handleConfirmWithdrawal = async () => {
        setStep('processing')
        setIsProcessing(true)
        setError(null)

        try {
            await new Promise(resolve => setTimeout(resolve, 2000))

            console.log('Mock withdrawal:', {
                userId,
                walletAddress,
                amount: parseFloat(amount),
                bankAccount,
                bankName: selectedBank?.name,
                accountHolder,
                fee,
                netAmount
            })

            setStep('success')
            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Không thể thực hiện giao dịch')
            setStep('form')
        } finally {
            setIsProcessing(false)
        }
    }

    const resetForm = () => {
        setAmount('')
        setBankAccount('')
        setAccountHolder('')
        setSelectedBank(null)
        setFee(0)
        setNetAmount(0)
        setError(null)
        setSuccess(false)
        setStep('form')
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--background)',
            padding: '24px'
        }}>
            <div style={{
                maxWidth: '900px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                    padding: '20px',
                    background: 'var(--card)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => navigate('/user/prepare')}
                            style={{
                                background: 'var(--muted)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--primary)'
                                e.currentTarget.style.transform = 'scale(1.05)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--muted)'
                                e.currentTarget.style.transform = 'scale(1)'
                            }}
                        >
                            <ArrowLeft style={{ width: '20px', height: '20px' }} />
                        </button>
                        <h1 style={{
                            margin: 0,
                            fontSize: '28px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <CreditCard style={{ width: '32px', height: '32px', color: 'var(--primary)' }} />
                            Rút token về ngân hàng
                        </h1>
                    </div>
                </div>

                {/* Content */}
                {step === 'form' && (
                    <div style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '32px',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <form onSubmit={handleSubmit}>
                            {/* Balance Info */}
                            <div style={{
                                padding: '20px',
                                background: 'var(--muted)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '24px',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginBottom: '8px' }}>
                                    Số dư khả dụng
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary)' }}>
                                    {currentBalance.toLocaleString()} LEARN
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    marginBottom: '8px'
                                }}>
                                    Số tiền rút (tối thiểu 100 token)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Nhập số token"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border)',
                                        fontSize: '16px',
                                        background: 'var(--background)'
                                    }}
                                />
                            </div>

                            {/* Bank Selection */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    marginBottom: '8px'
                                }}>
                                    Ngân hàng
                                </label>
                                <select
                                    value={selectedBank?.code || ''}
                                    onChange={(e) => {
                                        const bank = banks.find(b => b.code === e.target.value)
                                        setSelectedBank(bank || null)
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border)',
                                        fontSize: '16px',
                                        background: 'var(--background)'
                                    }}
                                >
                                    <option value="">Chọn ngân hàng</option>
                                    {banks.map(bank => (
                                        <option key={bank.code} value={bank.code}>
                                            {bank.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Bank Account */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    marginBottom: '8px'
                                }}>
                                    Số tài khoản
                                </label>
                                <input
                                    type="text"
                                    value={bankAccount}
                                    onChange={(e) => setBankAccount(e.target.value)}
                                    placeholder="Nhập số tài khoản"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border)',
                                        fontSize: '16px',
                                        background: 'var(--background)'
                                    }}
                                />
                            </div>

                            {/* Account Holder */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    marginBottom: '8px'
                                }}>
                                    Tên chủ tài khoản
                                </label>
                                <input
                                    type="text"
                                    value={accountHolder}
                                    onChange={(e) => setAccountHolder(e.target.value)}
                                    placeholder="Nhập tên chủ tài khoản"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border)',
                                        fontSize: '16px',
                                        background: 'var(--background)'
                                    }}
                                />
                            </div>

                            {/* Fee Info */}
                            {amount && parseFloat(amount) >= 100 && (
                                <div style={{
                                    padding: '20px',
                                    background: 'var(--muted)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '15px', color: 'var(--muted-foreground)' }}>Số tiền rút</span>
                                        <span style={{ fontSize: '15px', fontWeight: 500 }}>{parseFloat(amount).toLocaleString()} token</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '15px', color: 'var(--muted-foreground)' }}>Phí giao dịch (2%)</span>
                                        <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--destructive)' }}>-{fee.toLocaleString()} token</span>
                                    </div>
                                    <div style={{ height: '1px', background: 'var(--border)', margin: '12px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '16px', fontWeight: 600 }}>Số tiền nhận được</span>
                                        <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>{netAmount.toLocaleString()} token</span>
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div style={{
                                    padding: '12px',
                                    background: 'var(--destructive)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px'
                                }}>
                                    <AlertCircle style={{ width: '16px', height: '16px' }} />
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
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
                                Tiếp tục
                            </button>
                        </form>
                    </div>
                )}

                {step === 'confirm' && (
                    <div style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '32px',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
                            Xác nhận thông tin rút tiền
                        </h2>

                        <div style={{
                            padding: '24px',
                            background: 'var(--muted)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Ngân hàng</div>
                                    <div style={{ fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>{selectedBank?.name}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Số tài khoản</div>
                                    <div style={{ fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>{bankAccount}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Chủ tài khoản</div>
                                    <div style={{ fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>{accountHolder}</div>
                                </div>
                                <div style={{ height: '1px', background: 'var(--border)' }} />
                                <div>
                                    <div style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Số tiền nhận được</div>
                                    <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
                                        {netAmount.toLocaleString()} token
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setStep('form')}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    background: 'var(--muted)',
                                    color: 'var(--foreground)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={handleConfirmWithdrawal}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Xác nhận rút tiền
                            </button>
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '60px 32px',
                        boxShadow: 'var(--shadow-sm)',
                        textAlign: 'center'
                    }}>
                        <Loader2 style={{
                            width: '64px',
                            height: '64px',
                            color: 'var(--primary)',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 24px'
                        }} />
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: 600 }}>
                            Đang xử lý...
                        </h3>
                        <p style={{ margin: 0, fontSize: '16px', color: 'var(--muted-foreground)' }}>
                            Vui lòng không đóng cửa sổ này
                        </p>
                    </div>
                )}

                {step === 'success' && (
                    <div style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '60px 32px',
                        boxShadow: 'var(--shadow-sm)',
                        textAlign: 'center'
                    }}>
                        <CheckCircle style={{
                            width: '80px',
                            height: '80px',
                            color: 'var(--primary)',
                            margin: '0 auto 24px'
                        }} />
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '28px', fontWeight: 700 }}>
                            Yêu cầu rút tiền thành công!
                        </h3>
                        <p style={{ margin: '0 0 32px 0', fontSize: '16px', color: 'var(--muted-foreground)' }}>
                            Số tiền sẽ được chuyển vào tài khoản của bạn trong vòng 1-3 ngày làm việc
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={resetForm}
                                style={{
                                    padding: '12px 24px',
                                    background: 'var(--muted)',
                                    color: 'var(--foreground)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Rút tiền khác
                            </button>
                            <button
                                onClick={() => navigate('/user/prepare')}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
