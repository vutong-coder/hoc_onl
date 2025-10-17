import React from 'react'
import { CourseCategoryData, ChartData } from '../../types/dashboard'
import { BookOpen, Users, DollarSign, TrendingUp } from 'lucide-react'
import '../../styles/dashboard.css'

interface CourseCategoryChartProps {
	data: CourseCategoryData[]
	chartData: ChartData
	loading?: boolean
}

const CourseCategoryChart: React.FC<CourseCategoryChartProps> = ({ data, chartData, loading = false }) => {
	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
		return num.toString()
	}

	const formatCurrency = (amount: number) => {
		return `${(amount / 1000000).toFixed(1)}M LEARN`
	}

	// Tính toán tổng số
	const totalCourses = data.reduce((sum, item) => sum + item.courses, 0)
	const totalEnrollments = data.reduce((sum, item) => sum + item.enrollments, 0)
	const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)

	// Sắp xếp theo số khóa học
	const sortedData = [...data].sort((a, b) => b.courses - a.courses)

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
					<BookOpen size={20} />
					Phân bổ khóa học theo danh mục
				</div>
				<div className="chart-subtitle">
					Thống kê số lượng khóa học và hiệu suất theo từng danh mục
				</div>
			</div>

			<div className="chart-content">
				{/* Chart visualization - Bar chart */}
				<div className="chart-visualization">
					<div className="bar-chart">
						{/* Y-axis */}
						<div className="y-axis">
							{Array.from({ length: 5 }).map((_, i) => {
								const value = Math.max(...data.map(d => d.courses)) - (Math.max(...data.map(d => d.courses)) * (i / 4))
								return (
									<div key={i} className="y-label">
										{Math.floor(value)}
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

							{/* Bars */}
							<div className="bars-container">
								{sortedData.map((item, index) => {
									const maxCourses = Math.max(...data.map(d => d.courses))
									const height = (item.courses / maxCourses) * 100
									const percentage = ((item.courses / totalCourses) * 100).toFixed(1)
									
									return (
										<div key={item.category} className="bar-group">
											<div className="bar-wrapper">
												<div
													className="bar"
													style={{
														height: `${height}%`,
														backgroundColor: item.color,
														opacity: 0.8
													}}
													title={`${item.category}: ${item.courses} khóa học (${percentage}%)`}
												></div>
											</div>
											<div className="bar-label">
												{item.icon} {item.category}
											</div>
											<div className="bar-value">
												{item.courses}
											</div>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				</div>

				{/* Category details */}
				<div className="category-details">
					<div className="details-header">
						<h4>Chi tiết theo danh mục</h4>
					</div>
					<div className="details-list">
						{sortedData.map((item, index) => {
							const coursePercentage = ((item.courses / totalCourses) * 100).toFixed(1)
							const enrollmentPercentage = ((item.enrollments / totalEnrollments) * 100).toFixed(1)
							const revenuePercentage = ((item.revenue / totalRevenue) * 100).toFixed(1)
							
							return (
								<div key={item.category} className="detail-item">
									<div className="detail-header">
										<div className="detail-category">
											<span className="category-icon">{item.icon}</span>
											<span className="category-name">{item.category}</span>
										</div>
										<div className="detail-rank">
											#{index + 1}
										</div>
									</div>
									<div className="detail-stats">
										<div className="stat-row">
											<div className="stat-label">
												<BookOpen size={14} />
												Khóa học:
											</div>
											<div className="stat-value">
												{item.courses} ({coursePercentage}%)
											</div>
										</div>
										<div className="stat-row">
											<div className="stat-label">
												<Users size={14} />
												Đăng ký:
											</div>
											<div className="stat-value">
												{formatNumber(item.enrollments)} ({enrollmentPercentage}%)
											</div>
										</div>
										<div className="stat-row">
											<div className="stat-label">
												<DollarSign size={14} />
												Doanh thu:
											</div>
											<div className="stat-value">
												{formatCurrency(item.revenue)} ({revenuePercentage}%)
											</div>
										</div>
									</div>
									<div className="detail-progress">
										<div className="progress-bar">
											<div
												className="progress-fill"
												style={{
													width: `${coursePercentage}%`,
													backgroundColor: item.color
												}}
											></div>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>

				{/* Summary stats */}
				<div style={{ 
					display: 'grid', 
					gridTemplateColumns: 'repeat(3, 1fr)', 
					gap: '16px',
					marginTop: '20px'
				}}>
					{/* Card 1 - Tổng khóa học */}
					<div style={{ 
						background: 'var(--card)',
						borderRadius: 'var(--radius-lg)',
						padding: '16px',
						boxShadow: 'var(--shadow-sm)',
						border: '1px solid var(--border)',
						position: 'relative',
						overflow: 'hidden'
					}}>
						<div style={{ 
							position: 'absolute',
							top: '0',
							right: '0',
							width: '60px',
							height: '60px',
							background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)',
							borderRadius: '50%',
							transform: 'translate(15px, -15px)'
						}} />
						<div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', position: 'relative', zIndex: 1 }}>
							<div style={{ 
								width: '32px', 
								height: '32px', 
								borderRadius: 'var(--radius-md)', 
								display: 'flex', 
								alignItems: 'center', 
								justifyContent: 'center',
								background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
								color: 'white',
								flexShrink: 0
							}}>
								<BookOpen size={16} />
							</div>
							<div style={{ flex: 1 }}>
								<div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1, marginBottom: '2px' }}>
									{totalCourses}
								</div>
								<div style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontWeight: 500 }}>
									Tổng khóa học
								</div>
							</div>
						</div>
					</div>

					{/* Card 2 - Tổng đăng ký */}
					<div style={{ 
						background: 'var(--card)',
						borderRadius: 'var(--radius-lg)',
						padding: '16px',
						boxShadow: 'var(--shadow-sm)',
						border: '1px solid var(--border)',
						position: 'relative',
						overflow: 'hidden'
					}}>
						<div style={{ 
							position: 'absolute',
							top: '0',
							right: '0',
							width: '60px',
							height: '60px',
							background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
							borderRadius: '50%',
							transform: 'translate(15px, -15px)'
						}} />
						<div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', position: 'relative', zIndex: 1 }}>
							<div style={{ 
								width: '32px', 
								height: '32px', 
								borderRadius: 'var(--radius-md)', 
								display: 'flex', 
								alignItems: 'center', 
								justifyContent: 'center',
								background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
								color: 'white',
								flexShrink: 0
							}}>
								<Users size={16} />
							</div>
							<div style={{ flex: 1 }}>
								<div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1, marginBottom: '2px' }}>
									{formatNumber(totalEnrollments)}
								</div>
								<div style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontWeight: 500 }}>
									Tổng đăng ký
								</div>
							</div>
						</div>
					</div>

					{/* Card 3 - Tổng doanh thu */}
					<div style={{ 
						background: 'var(--card)',
						borderRadius: 'var(--radius-lg)',
						padding: '16px',
						boxShadow: 'var(--shadow-sm)',
						border: '1px solid var(--border)',
						position: 'relative',
						overflow: 'hidden'
					}}>
						<div style={{ 
							position: 'absolute',
							top: '0',
							right: '0',
							width: '60px',
							height: '60px',
							background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
							borderRadius: '50%',
							transform: 'translate(15px, -15px)'
						}} />
						<div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', position: 'relative', zIndex: 1 }}>
							<div style={{ 
								width: '32px', 
								height: '32px', 
								borderRadius: 'var(--radius-md)', 
								display: 'flex', 
								alignItems: 'center', 
								justifyContent: 'center',
								background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
								color: 'white',
								flexShrink: 0
							}}>
								<TrendingUp size={16} />
							</div>
							<div style={{ flex: 1 }}>
								<div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1, marginBottom: '2px' }}>
									{formatCurrency(totalRevenue)}
								</div>
								<div style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontWeight: 500 }}>
									Tổng doanh thu
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CourseCategoryChart
