// Copyright Stats Component

import React from 'react'
import { 
	FileText, 
	Shield, 
	CheckCircle, 
	AlertTriangle, 
	Clock, 
	Hash, 
	TrendingUp,
	Database,
	Zap,
	BarChart3
} from 'lucide-react'
import StatCard from '../common/StatCard'
import { CopyrightStats, BlockchainStatus } from '../../types/copyright'

interface CopyrightStatsProps {
	stats: CopyrightStats
	blockchainStatus: BlockchainStatus
	loading?: boolean
}

export const CopyrightStatsComponent: React.FC<CopyrightStatsProps> = ({
	stats,
	blockchainStatus,
	loading = false
}) => {
	const formatNumber = (num: number): string => {
		return num.toLocaleString('vi-VN')
	}

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const getSuccessRateColor = (rate: number): string => {
		if (rate >= 90) return '#10b981'
		if (rate >= 70) return '#f59e0b'
		return '#ef4444'
	}

	const getNetworkStatusColor = (congestion: BlockchainStatus['networkCongestion']): string => {
		switch (congestion) {
			case 'low': return '#10b981'
			case 'medium': return '#f59e0b'
			case 'high': return '#ef4444'
			default: return '#6b7280'
		}
	}

	const getNetworkStatusText = (congestion: BlockchainStatus['networkCongestion']): string => {
		switch (congestion) {
			case 'low': return 'Thấp'
			case 'medium': return 'Trung bình'
			case 'high': return 'Cao'
			default: return 'Không xác định'
		}
	}

	const statCards = [
		{
			title: 'Tổng tài liệu',
			value: formatNumber(stats.totalDocuments),
			subtitle: 'Tài liệu đã đăng ký',
			icon: <FileText className="stat-icon" />,
			color: '#3b82f6',
			trend: {
				value: stats.registeredToday,
				isPositive: true,
				label: 'hôm nay'
			}
		},
		{
			title: 'Đã xác minh',
			value: formatNumber(stats.verifiedDocuments),
			subtitle: `${((stats.verifiedDocuments / stats.totalDocuments) * 100).toFixed(1)}% tổng số`,
			icon: <CheckCircle className="stat-icon" />,
			color: '#10b981',
			trend: {
				value: stats.pendingVerification,
				isPositive: false,
				label: 'chờ xác minh'
			}
		},
		{
			title: 'Có tranh chấp',
			value: formatNumber(stats.disputedDocuments),
			subtitle: `${((stats.disputedDocuments / stats.totalDocuments) * 100).toFixed(1)}% tổng số`,
			icon: <AlertTriangle className="stat-icon" />,
			color: '#ef4444',
			trend: {
				value: stats.disputedDocuments,
				isPositive: false,
				label: 'cần giải quyết'
			}
		},
		{
			title: 'Tổng dung lượng',
			value: formatFileSize(stats.totalHashSize),
			subtitle: 'Dữ liệu đã lưu trữ',
			icon: <Database className="stat-icon" />,
			color: '#8b5cf6',
			trend: {
				value: stats.blockchainTransactions,
				isPositive: true,
				label: 'giao dịch'
			}
		}
	]

	const blockchainCards = [
		{
			title: 'Giao dịch Blockchain',
			value: formatNumber(stats.blockchainTransactions),
			subtitle: 'Tổng số giao dịch',
			icon: <Hash className="stat-icon" />,
			color: '#06b6d4',
			trend: {
				value: stats.averageGasUsed,
				isPositive: true,
				label: 'gas trung bình'
			}
		},
		{
			title: 'Tỷ lệ thành công',
			value: `${stats.successRate.toFixed(1)}%`,
			subtitle: 'Đăng ký thành công',
			icon: <TrendingUp className="stat-icon" />,
			color: getSuccessRateColor(stats.successRate),
			trend: {
				value: stats.successRate,
				isPositive: stats.successRate >= 90,
				label: 'hiệu suất'
			}
		},
		{
			title: 'Gas trung bình',
			value: formatNumber(stats.averageGasUsed),
			subtitle: 'Gas sử dụng trung bình',
			icon: <Zap className="stat-icon" />,
			color: '#f59e0b',
			trend: {
				value: blockchainStatus.averageGasPrice,
				isPositive: false,
				label: 'Gwei hiện tại'
			}
		},
		{
			title: 'Tình trạng mạng',
			value: getNetworkStatusText(blockchainStatus.networkCongestion),
			subtitle: `Block ${formatNumber(blockchainStatus.lastBlock)}`,
			icon: <BarChart3 className="stat-icon" />,
			color: getNetworkStatusColor(blockchainStatus.networkCongestion),
			trend: {
				value: blockchainStatus.pendingTransactions,
				isPositive: false,
				label: 'giao dịch chờ'
			}
		}
	]

	return (
		<div className="copyright-stats">
			<div className="stats-header">
				<h3>Thống kê bản quyền</h3>
				<div className="stats-summary">
					<div className="summary-item">
						<span className="summary-label">Tổng tài liệu:</span>
						<span className="summary-value">{formatNumber(stats.totalDocuments)}</span>
					</div>
					<div className="summary-item">
						<span className="summary-label">Đã xác minh:</span>
						<span className="summary-value success">{formatNumber(stats.verifiedDocuments)}</span>
					</div>
					<div className="summary-item">
						<span className="summary-label">Có tranh chấp:</span>
						<span className="summary-value danger">{formatNumber(stats.disputedDocuments)}</span>
					</div>
					<div className="summary-item">
						<span className="summary-label">Tỷ lệ thành công:</span>
						<span className="summary-value" style={{ color: getSuccessRateColor(stats.successRate) }}>
							{stats.successRate.toFixed(1)}%
						</span>
					</div>
				</div>
			</div>

			{/* Tài liệu Section */}
			<div className="stats-section" style={{ marginBottom: '32px' }}>
				<h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: 'var(--foreground)' }}>Tài liệu</h4>
				<div style={{ 
					display: 'grid', 
					gridTemplateColumns: 'repeat(4, 1fr)', 
					gap: '20px'
				}}>
					{statCards.map((card, index) => {
						const colors = [
							{ bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', circle: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)' },
							{ bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', circle: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)' },
							{ bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', circle: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)' },
							{ bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', circle: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)' }
						]
						const cardColor = colors[index % colors.length]
						
						return (
							<div key={index} style={{ 
								background: 'var(--card)',
								borderRadius: 'var(--radius-lg)',
								padding: '20px',
								boxShadow: 'var(--shadow-sm)',
								border: '1px solid var(--border)',
								position: 'relative',
								overflow: 'hidden'
							}}>
								<div style={{ 
									position: 'absolute',
									top: '0',
									right: '0',
									width: '80px',
									height: '80px',
									background: cardColor.circle,
									borderRadius: '50%',
									transform: 'translate(20px, -20px)'
								}} />
								<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
									<div style={{ 
										width: '40px', 
										height: '40px', 
										borderRadius: 'var(--radius-md)', 
										display: 'flex', 
										alignItems: 'center', 
										justifyContent: 'center',
										background: cardColor.bg,
										color: 'white',
										flexShrink: 0
									}}>
										{React.cloneElement(card.icon, { size: 20 })}
									</div>
									<div style={{ flex: 1 }}>
										<div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1, marginBottom: '4px' }}>
											{card.value}
										</div>
										<div style={{ fontSize: '13px', color: 'var(--muted-foreground)', fontWeight: 500 }}>
											{card.title}
										</div>
										{card.subtitle && (
											<div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '2px' }}>
												{card.subtitle}
											</div>
										)}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>

			{/* Blockchain Section */}
			<div className="stats-section" style={{ marginBottom: '32px' }}>
				<h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: 'var(--foreground)' }}>Blockchain</h4>
				<div style={{ 
					display: 'grid', 
					gridTemplateColumns: 'repeat(4, 1fr)', 
					gap: '20px'
				}}>
					{blockchainCards.map((card, index) => {
						const colors = [
							{ bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', circle: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(8, 145, 178, 0.05) 100%)' },
							{ bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', circle: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)' },
							{ bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', circle: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)' },
							{ bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', circle: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)' }
						]
						const cardColor = colors[index % colors.length]
						
						return (
							<div key={index} style={{ 
								background: 'var(--card)',
								borderRadius: 'var(--radius-lg)',
								padding: '20px',
								boxShadow: 'var(--shadow-sm)',
								border: '1px solid var(--border)',
								position: 'relative',
								overflow: 'hidden'
							}}>
								<div style={{ 
									position: 'absolute',
									top: '0',
									right: '0',
									width: '80px',
									height: '80px',
									background: cardColor.circle,
									borderRadius: '50%',
									transform: 'translate(20px, -20px)'
								}} />
								<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
									<div style={{ 
										width: '40px', 
										height: '40px', 
										borderRadius: 'var(--radius-md)', 
										display: 'flex', 
										alignItems: 'center', 
										justifyContent: 'center',
										background: cardColor.bg,
										color: 'white',
										flexShrink: 0
									}}>
										{React.cloneElement(card.icon, { size: 20 })}
									</div>
									<div style={{ flex: 1 }}>
										<div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1, marginBottom: '4px' }}>
											{card.value}
										</div>
										<div style={{ fontSize: '13px', color: 'var(--muted-foreground)', fontWeight: 500 }}>
											{card.title}
										</div>
										{card.subtitle && (
											<div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '2px' }}>
												{card.subtitle}
											</div>
										)}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>

			{/* Blockchain Status */}
			<div className="blockchain-status">
				<div className="status-header">
					<h4>Trạng thái Blockchain</h4>
					<div className={`connection-status ${blockchainStatus.isConnected ? 'connected' : 'disconnected'}`}>
						<div className="status-indicator"></div>
						<span>{blockchainStatus.isConnected ? 'Đã kết nối' : 'Mất kết nối'}</span>
					</div>
				</div>
				
				<div className="status-grid">
					<div className="status-item">
						<span className="status-label">Block cuối:</span>
						<span className="status-value">{formatNumber(blockchainStatus.lastBlock)}</span>
					</div>
					<div className="status-item">
						<span className="status-label">Giao dịch chờ:</span>
						<span className="status-value">{formatNumber(blockchainStatus.pendingTransactions)}</span>
					</div>
					<div className="status-item">
						<span className="status-label">Gas price:</span>
						<span className="status-value">{blockchainStatus.averageGasPrice} Gwei</span>
					</div>
					<div className="status-item">
						<span className="status-label">Tắc nghẽn mạng:</span>
						<span 
							className="status-value"
							style={{ color: getNetworkStatusColor(blockchainStatus.networkCongestion) }}
						>
							{getNetworkStatusText(blockchainStatus.networkCongestion)}
						</span>
					</div>
					<div className="status-item">
						<span className="status-label">Thời gian xác nhận:</span>
						<span className="status-value">{blockchainStatus.estimatedConfirmationTime} phút</span>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="quick-actions">
				<h4>Hành động nhanh</h4>
				<div className="actions-grid">
					<button className="action-card">
						<FileText className="action-icon" />
						<span>Đăng ký mới</span>
					</button>
					<button className="action-card">
						<CheckCircle className="action-icon" />
						<span>Xác minh hàng loạt</span>
					</button>
					<button className="action-card">
						<AlertTriangle className="action-icon" />
						<span>Giải quyết tranh chấp</span>
					</button>
					<button className="action-card">
						<BarChart3 className="action-icon" />
						<span>Báo cáo chi tiết</span>
					</button>
				</div>
			</div>
		</div>
	)
}
