import React from 'react'
import { RewardStats, TokenInfo, UserRewardSummary, RulePerformance } from '../../types/reward'
import StatCard from '../common/StatCard'
import { 
	TrendingUp, 
	Users, 
	Gift, 
	DollarSign,
	Award,
	Target,
	CheckCircle,
	Clock,
	AlertTriangle
} from 'lucide-react'
import '../../styles/common.css'

interface RewardDashboardProps {
	stats: RewardStats
	tokenInfo: TokenInfo
	topUsers: UserRewardSummary[]
	rulePerformance: RulePerformance[]
}

export default function RewardDashboard({ 
	stats, 
	tokenInfo, 
	topUsers, 
	rulePerformance 
}: RewardDashboardProps): JSX.Element {
	
	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
		return num.toString()
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'USD'
		}).format(amount)
	}

	const getSuccessRateColor = (rate: number) => {
		if (rate >= 95) return '#10b981'
		if (rate >= 90) return '#f59e0b'
		return '#ef4444'
	}

	return (
		<div className="reward-dashboard">
			{/* Stats Overview */}
			<div className="stats-grid">
				<StatCard
					title="Tổng luật thưởng"
					value={stats.totalRules}
					subtitle={`${stats.activeRules} đang hoạt động`}
					icon={<Target size={24} />}
					gradient="primary"
				/>
				
				<StatCard
					title="Giao dịch hôm nay"
					value={stats.todayTransactions}
					subtitle={`${stats.totalTransactions.toLocaleString()} tổng cộng`}
					icon={<TrendingUp size={24} />}
					gradient="accent"
				/>
				
				<StatCard
					title="Token đã phân phối"
					value={`${formatNumber(stats.totalTokensDistributed)}`}
					subtitle={`${formatNumber(stats.todayTokensDistributed)} hôm nay`}
					icon={<Gift size={24} />}
					gradient="primary"
				/>
				
				<StatCard
					title="Tỷ lệ thành công"
					value={`${stats.successRate}%`}
					subtitle={`${stats.pendingTransactions} đang chờ`}
					icon={<CheckCircle size={24} />}
					gradient="accent"
				/>
			</div>

			{/* Token Info & Performance */}
			<div className="dashboard-content-grid">
				{/* Token Information */}
				<div className="token-info-card">
					<div className="card-header">
						<h3 className="card-title">
							<DollarSign size={20} />
							Thông tin Token LEARN
						</h3>
					</div>
					<div className="token-details">
						<div className="token-main-info">
							<div className="token-symbol">{tokenInfo.symbol}</div>
							<div className="token-name">{tokenInfo.name}</div>
							<div className="token-price">{formatCurrency(tokenInfo.currentPrice)}</div>
						</div>
						
						<div className="token-metrics">
							<div className="metric-row">
								<span className="metric-label">Market Cap:</span>
								<span className="metric-value">{formatCurrency(tokenInfo.marketCap)}</span>
							</div>
							<div className="metric-row">
								<span className="metric-label">Holders:</span>
								<span className="metric-value">{tokenInfo.holders.toLocaleString()}</span>
							</div>
							<div className="metric-row">
								<span className="metric-label">Reward Pool:</span>
								<span className="metric-value">{formatNumber(tokenInfo.rewardPool)} tokens</span>
							</div>
							<div className="metric-row">
								<span className="metric-label">Distributed Today:</span>
								<span className="metric-value">{formatNumber(tokenInfo.distributedToday)} tokens</span>
							</div>
						</div>
						
						<div className="token-address">
							<span className="address-label">Contract:</span>
							<span className="address-value">{tokenInfo.contractAddress}</span>
						</div>
					</div>
				</div>

				{/* Top Performing Rules */}
				<div className="performance-card">
					<div className="card-header">
						<h3 className="card-title">
							<Award size={20} />
							Luật thưởng hiệu quả nhất
						</h3>
					</div>
					<div className="performance-list">
						{rulePerformance.slice(0, 5).map((rule, index) => (
							<div key={rule.ruleId} className="performance-item">
								<div className="performance-rank">#{index + 1}</div>
								<div className="performance-info">
									<div className="performance-name">{rule.ruleName}</div>
									<div className="performance-stats">
										<span className="stat">{rule.usageCount} lần</span>
										<span className="stat">{formatNumber(rule.totalTokensDistributed)} tokens</span>
										<span className="stat success-rate" style={{ color: getSuccessRateColor(rule.successRate) }}>
											{rule.successRate}%
										</span>
									</div>
								</div>
								<div className="performance-tokens">
									{rule.averageTokensPerUse} tokens/lần
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Top Users */}
			<div className="top-users-card">
				<div className="card-header">
					<h3 className="card-title">
						<Users size={20} />
						Học sinh có nhiều token nhất
					</h3>
				</div>
				<div className="users-list">
					{topUsers.slice(0, 5).map((user, index) => (
						<div key={user.userId} className="user-item">
							<div className="user-rank">#{index + 1}</div>
							<div className="user-avatar">
								{user.userName.charAt(0)}
							</div>
							<div className="user-info">
								<div className="user-name">{user.userName}</div>
								<div className="user-stats">
									<span className="stat">Earned: {formatNumber(user.totalEarned)}</span>
									<span className="stat">Balance: {formatNumber(user.currentBalance)}</span>
									<span className="stat">Rewards: {user.rewardCount}</span>
								</div>
							</div>
							<div className="user-balance">
								<div className="balance-amount">{formatNumber(user.currentBalance)}</div>
								<div className="balance-symbol">{user.tokenSymbol}</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Transaction Status Summary */}
			<div className="transaction-status-grid">
				<div className="status-card completed">
					<div className="status-icon">
						<CheckCircle size={24} />
					</div>
					<div className="status-info">
						<div className="status-count">{stats.totalTransactions - stats.pendingTransactions - stats.failedTransactions}</div>
						<div className="status-label">Hoàn thành</div>
					</div>
				</div>
				
				<div className="status-card pending">
					<div className="status-icon">
						<Clock size={24} />
					</div>
					<div className="status-info">
						<div className="status-count">{stats.pendingTransactions}</div>
						<div className="status-label">Đang chờ</div>
					</div>
				</div>
				
				<div className="status-card failed">
					<div className="status-icon">
						<AlertTriangle size={24} />
					</div>
					<div className="status-info">
						<div className="status-count">{stats.failedTransactions}</div>
						<div className="status-label">Thất bại</div>
					</div>
				</div>
			</div>
		</div>
	)
}
