import React, { useState, useEffect } from 'react'
import { X, CreditCard, AlertCircle, CheckCircle, Loader2, DollarSign } from 'lucide-react'
import { mockBanks } from '../../services/api/mockData'

interface Bank {
    code: string
    name: string
    shortName: string
    logo: string
}

interface TokenTransferModalProps {
    isOpen: boolean
    onClose: () => void
    currentBalance: number
    walletAddress?: string
    userId?: string
}

export default function TokenTransferModal({
    isOpen,
    onClose,
    currentBalance,
    walletAddress,
    userId
}: TokenTransferModalProps): JSX.Element | null {
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

    useEffect(() => {
        if (isOpen) {
            loadBanks()
        }
    }, [isOpen])

    useEffect(() => {
        if (amount) {
            calculateFee()
        }
    }, [amount])

    const loadBanks = async () => {
        try {
            // Simulate API delay for realism
            await new Promise(resolve => setTimeout(resolve, 200))
            setBanks(mockBanks)
        } catch (err) {
            console.error('Error loading banks:', err)
            setBanks(mockBanks) // Fallback to mock data
        }
    }

    const calculateFee = async () => {
        const amountNum = parseFloat(amount)
        if (amountNum > 0) {
            try {
                // Mock fee calculation: 2% fee
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
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Mock successful withdrawal
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

    const handleClose = () => {
        resetForm()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
        }}>
            <div style={{
                background: 'var(--card)',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    background: 'var(--card)',
                    zIndex: 1
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <CreditCard style={{ width: '24px', height: '24px', color: 'var(--primary)' }} />
                        Rút token về ngân hàng
                    </h2>
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: 'var(--muted-foreground)'
                        }}
                    >
                        <X style={{ width: '20px', height: '20px' }} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                    {step === 'form' && (
                        <form onSubmit={handleSubmit}>
                            {/* Balance Info */}
                            <div style={{
                                padding: '16px',
                                background: 'var(--muted)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '20px'
                            }}>
                                <div style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>
                                    Số dư khả dụng
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>
                                    {currentBalance.toLocaleString()} LEARN
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
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
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border)',
                                        fontSize: '14px',
                                        background: 'var(--background)',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Bank Selection */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
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
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border)',
                                        fontSize: '14px',
                                        background: 'var(--background)',
                                        boxSizing: 'border-box'
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
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
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
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border)',
                                        fontSize: '14px',
                                        background: 'var(--background)',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Account Holder */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
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
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border)',
                                        fontSize: '14px',
                                        background: 'var(--background)',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Fee Info */}
                            {amount && parseFloat(amount) >= 100 && (
                                <div style={{
                                    padding: '16px',
                                    background: 'var(--muted)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Số tiền rút</span>
                                        <span style={{ fontSize: '14px', fontWeight: 500 }}>{parseFloat(amount).toLocaleString()} token</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Phí giao dịch (2%)</span>
                                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--destructive)' }}>-{fee.toLocaleString()} token</span>
                                    </div>
                                    <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 600 }}>Số tiền nhận được</span>
                                        <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>{netAmount.toLocaleString()} token</span>
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
                                    marginBottom: '16px',
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
                                    padding: '12px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Tiếp tục
                            </button>
                        </form>
                    )}

                    {step === 'confirm' && (
                        <div>
                            <div style={{
                                padding: '20px',
                                background: 'var(--muted)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>
                                    Xác nhận thông tin rút tiền
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Ngân hàng</div>
                                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{selectedBank?.name}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Số tài khoản</div>
                                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{bankAccount}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Chủ tài khoản</div>
                                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{accountHolder}</div>
                                    </div>
                                    <div style={{ height: '1px', background: 'var(--border)' }} />
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Số tiền nhận được</div>
                                        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
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
                                        padding: '12px',
                                        background: 'var(--muted)',
                                        color: 'var(--foreground)',
                                        border: 'none',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
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
                                        padding: '12px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
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
                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <Loader2 style={{
                                width: '48px',
                                height: '48px',
                                color: 'var(--primary)',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 16px'
                            }} />
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>
                                Đang xử lý...
                            </h3>
                            <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted-foreground)' }}>
                                Vui lòng không đóng cửa sổ này
                            </p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <CheckCircle style={{
                                width: '64px',
                                height: '64px',
                                color: 'var(--primary)',
                                margin: '0 auto 16px'
                            }} />
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>
                                Yêu cầu rút tiền thành công!
                            </h3>
                            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--muted-foreground)' }}>
                                Số tiền sẽ được chuyển vào tài khoản của bạn trong vòng 1-3 ngày làm việc
                            </p>
                            <button
                                onClick={handleClose}
                                style={{
                                    padding: '12px 24px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Đóng
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                /* Hide scrollbar */
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    )
}
