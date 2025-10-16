import React from 'react'
import { ChartData, UserGrowthData } from '../../types/dashboard'
import { TrendingUp, Users, UserPlus, Activity } from 'lucide-react'
import '../../styles/dashboard.css'

interface UserGrowthChartProps {
	data: UserGrowthData[]
	chartData: ChartData
	loading?: boolean
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data, chartData, loading = false }) => {
	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
		return num.toString()
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit'
		})
	}

	// Tính toán các chỉ số
	const totalGrowth = data.length > 0 ? data[data.length - 1].users - data[0].users : 0
	const avgDailyGrowth = data.length > 0 ? totalGrowth / data.length : 0
	const maxUsers = Math.max(...data.map(d => d.users))
	const minUsers = Math.min(...data.map(d => d.users))

	if (loading) {
		return (
			<div className="chart-container">
				<div className="chart-header">
					<div className="chart-title-skeleton"></div>
					<div className="chart-subtitle-skeleton"></div>
				</div>
				<div className="chart-content-skeleton">
					<div className="chart-skeleton"></div>
				</div>
			</div>
		)
	}

	return (
		<div className="chart-container">
			<div className="chart-header">
				<div className="chart-title">
					<TrendingUp size={20} />
					Tăng trưởng người dùng
				</div>
				<div className="chart-subtitle">
					Theo dõi xu hướng tăng trưởng trong 30 ngày qua
				</div>
			</div>

			<div className="chart-content">
				{/* Chart visualization - Simplified version */}
				<div className="chart-visualization">
					<div className="chart-grid">
						{/* Y-axis labels */}
						<div className="y-axis">
							{Array.from({ length: 5 }).map((_, i) => {
								const value = maxUsers - (maxUsers - minUsers) * (i / 4)
								return (
									<div key={i} className="y-label">
										{formatNumber(value)}
									</div>
								)
							})}
						</div>

						{/* Chart area */}
						<div className="chart-area">
							{/* Grid lines */}
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="grid-line" style={{ top: `${i * 20}%` }}></div>
							))}

							{/* Data points and lines */}
							<svg className="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
								{/* Total users line */}
								<polyline
									points={data.map((d, i) => {
										const x = (i / (data.length - 1)) * 100
										const y = 100 - ((d.users - minUsers) / (maxUsers - minUsers)) * 100
										return `${x},${y}`
									}).join(' ')}
									fill="none"
									stroke="rgba(59, 130, 246, 1)"
									strokeWidth="0.5"
								/>
								
								{/* New users line */}
								<polyline
									points={data.map((d, i) => {
										const x = (i / (data.length - 1)) * 100
										const maxNewUsers = Math.max(...data.map(d => d.newUsers))
										const y = 100 - ((d.newUsers / maxNewUsers) * 100)
										return `${x},${y}`
									}).join(' ')}
									fill="none"
									stroke="rgba(16, 185, 129, 1)"
									strokeWidth="0.5"
								/>
							</svg>

							{/* Data points */}
							{data.map((d, i) => {
								const x = (i / (data.length - 1)) * 100
								const y = 100 - ((d.users - minUsers) / (maxUsers - minUsers)) * 100
								return (
									<div
										key={i}
										className="data-point"
										style={{ left: `${x}%`, top: `${y}%` }}
										title={`${formatDate(d.date)}: ${formatNumber(d.users)} người dùng`}
									></div>
								)
							})}
						</div>

						{/* X-axis labels */}
						<div className="x-axis">
							{data.filter((_, i) => i % 5 === 0).map((d, i) => (
								<div key={i} className="x-label">
									{formatDate(d.date)}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Chart legend */}
				<div className="chart-legend">
					<div className="legend-item">
						<div className="legend-color" style={{ backgroundColor: 'rgba(59, 130, 246, 1)' }}></div>
						<span>Tổng người dùng</span>
					</div>
					<div className="legend-item">
						<div className="legend-color" style={{ backgroundColor: 'rgba(16, 185, 129, 1)' }}></div>
						<span>Người dùng mới</span>
					</div>
				</div>

				{/* Chart stats */}
				<div className="chart-stats">
					<div className="stat-item">
						<div className="stat-icon">
							<Users size={16} />
						</div>
						<div className="stat-content">
							<div className="stat-value">{formatNumber(maxUsers)}</div>
							<div className="stat-label">Người dùng cao nhất</div>
						</div>
					</div>
					<div className="stat-item">
						<div className="stat-icon">
							<UserPlus size={16} />
						</div>
						<div className="stat-content">
							<div className="stat-value">{formatNumber(Math.floor(avgDailyGrowth))}</div>
							<div className="stat-label">Tăng trưởng TB/ngày</div>
						</div>
					</div>
					<div className="stat-item">
						<div className="stat-icon">
							<Activity size={16} />
						</div>
						<div className="stat-content">
							<div className="stat-value">{formatNumber(totalGrowth)}</div>
							<div className="stat-label">Tăng trưởng tổng</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserGrowthChart
