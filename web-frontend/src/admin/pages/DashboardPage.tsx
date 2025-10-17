import React, { useState } from 'react'
import {
	BarChart3,
	RefreshCw,
	Settings,
	Filter,
	Download,
	Eye,
	EyeOff,
	Activity,
	TrendingUp,
	Users,
	BookOpen,
	DollarSign,
	AlertTriangle,
	CheckCircle,
	Clock,
	FileSpreadsheet,
	Table
} from 'lucide-react'
import useDashboard from '../hooks/useDashboard'
import StatCardsGrid from '../components/dashboard/StatCardsGrid'
import UserGrowthChart from '../components/dashboard/UserGrowthChart'
import CourseCategoryChart from '../components/dashboard/CourseCategoryChart'
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed'
import Badge from '../components/common/Badge'
import DashboardSettingsModal from '../modal/Dashboard/DashboardSettingsModal'
import DashboardFiltersModal from '../modal/Dashboard/DashboardFiltersModal'
import DashboardExportModal from '../modal/Dashboard/DashboardExportModal'
import ActivityDetailModal from '../modal/Dashboard/ActivityDetailModal'
import { 
	exportCompleteDashboardToExcel,
	exportDashboardStatsToExcel,
	exportUserGrowthToExcel,
	exportCourseCategoriesToExcel,
	exportRecentActivitiesToExcel,
	exportTopPerformersToExcel,
	exportSystemHealthToExcel
} from '../utils/dashboardExcelHelpers'
import '../styles/common.css'
import '../styles/dashboard.css'

export default function DashboardPage(): JSX.Element {
	const {
		data,
		stats,
		userGrowth,
		courseCategories,
		recentActivities,
		topPerformers,
		systemHealth,
		chartData,
		loading,
		filters,
		settings,
		updateFilter,
		clearFilters,
		updateSettings,
		refreshData,
		getActivitySummary
	} = useDashboard()

	const [showSettings, setShowSettings] = useState(false)
	const [showFilters, setShowFilters] = useState(false)
	const [showExportOptions, setShowExportOptions] = useState(false)
	const [selectedActivity, setSelectedActivity] = useState<any>(null)

	const handleActivityClick = (activity: any) => {
		setSelectedActivity(activity)
	}

	const handleExportData = () => {
		setShowExportOptions(true)
	}

	const handleExportComplete = () => {
		try {
			const filename = `dashboard-complete-${new Date().toISOString().split('T')[0]}.xlsx`
			exportCompleteDashboardToExcel(data, filename)
			alert('Đã xuất dữ liệu dashboard hoàn chỉnh thành công!')
			setShowExportOptions(false)
		} catch (error) {
			console.error('Export error:', error)
			alert('Có lỗi xảy ra khi xuất dữ liệu')
		}
	}

	const handleExportStats = () => {
		try {
			const filename = `dashboard-stats-${new Date().toISOString().split('T')[0]}.xlsx`
			exportDashboardStatsToExcel(stats, filename)
			alert('Đã xuất thống kê tổng quan thành công!')
			setShowExportOptions(false)
		} catch (error) {
			console.error('Export error:', error)
			alert('Có lỗi xảy ra khi xuất thống kê')
		}
	}

	const handleExportUserGrowth = () => {
		try {
			const filename = `user-growth-${new Date().toISOString().split('T')[0]}.xlsx`
			exportUserGrowthToExcel(userGrowth, filename)
			alert('Đã xuất dữ liệu tăng trưởng người dùng thành công!')
			setShowExportOptions(false)
		} catch (error) {
			console.error('Export error:', error)
			alert('Có lỗi xảy ra khi xuất dữ liệu tăng trưởng')
		}
	}

	const handleExportCategories = () => {
		try {
			const filename = `course-categories-${new Date().toISOString().split('T')[0]}.xlsx`
			exportCourseCategoriesToExcel(courseCategories, filename)
			alert('Đã xuất dữ liệu danh mục khóa học thành công!')
			setShowExportOptions(false)
		} catch (error) {
			console.error('Export error:', error)
			alert('Có lỗi xảy ra khi xuất dữ liệu danh mục')
		}
	}

	const handleExportActivities = () => {
		try {
			const filename = `recent-activities-${new Date().toISOString().split('T')[0]}.xlsx`
			exportRecentActivitiesToExcel(recentActivities, filename)
			alert('Đã xuất dữ liệu hoạt động gần đây thành công!')
			setShowExportOptions(false)
		} catch (error) {
			console.error('Export error:', error)
			alert('Có lỗi xảy ra khi xuất dữ liệu hoạt động')
		}
	}

	const handleExportPerformers = () => {
		try {
			const filename = `top-performers-${new Date().toISOString().split('T')[0]}.xlsx`
			exportTopPerformersToExcel(topPerformers, filename)
			alert('Đã xuất dữ liệu top performers thành công!')
			setShowExportOptions(false)
		} catch (error) {
			console.error('Export error:', error)
			alert('Có lỗi xảy ra khi xuất dữ liệu top performers')
		}
	}

	const handleExportSystemHealth = () => {
		try {
			const filename = `system-health-${new Date().toISOString().split('T')[0]}.xlsx`
			exportSystemHealthToExcel(systemHealth, filename)
			alert('Đã xuất dữ liệu tình trạng hệ thống thành công!')
			setShowExportOptions(false)
		} catch (error) {
			console.error('Export error:', error)
			alert('Có lỗi xảy ra khi xuất dữ liệu hệ thống')
		}
	}

	const getSystemHealthColor = (status: string) => {
		switch (status) {
			case 'healthy': return 'var(--success)'
			case 'warning': return 'var(--warning)'
			case 'critical': return 'var(--danger)'
			default: return 'var(--muted-foreground)'
		}
	}

	const getSystemHealthIcon = (status: string) => {
		switch (status) {
			case 'healthy': return <CheckCircle size={16} />
			case 'warning': return <AlertTriangle size={16} />
			case 'critical': return <AlertTriangle size={16} />
			default: return <Clock size={16} />
		}
	}

	const activitySummary = getActivitySummary()

	return (
		<div style={{ padding: '24px' }}>
			{/* Header */}
			<div style={{ marginBottom: '32px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
					<div>
						<h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>
							<BarChart3 size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
							Dashboard Tổng quan
						</h1>
						<p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
							Theo dõi hiệu suất và hoạt động của hệ thống học trực tuyến
						</p>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						{/* System Health Indicator */}
						<div style={{ 
							display: 'flex', 
							alignItems: 'center', 
							gap: '8px',
							padding: '8px 12px',
							background: 'var(--muted)',
							borderRadius: 'var(--radius-md)',
							border: `1px solid ${getSystemHealthColor(systemHealth.status)}`
						}}>
							<div style={{ color: getSystemHealthColor(systemHealth.status) }}>
								{getSystemHealthIcon(systemHealth.status)}
							</div>
							<div>
								<div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>
									Hệ thống {systemHealth.status === 'healthy' ? 'Hoạt động tốt' : 
												systemHealth.status === 'warning' ? 'Cảnh báo' : 'Lỗi'}
								</div>
								<div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>
									Uptime: {systemHealth.uptime}%
								</div>
							</div>
						</div>

						<button
							className="btn btn-secondary"
							onClick={() => setShowFilters(true)}
							title="Bộ lọc"
						>
							<Filter size={18} />
						</button>
						<button
							className="btn btn-secondary"
							onClick={handleExportData}
							title="Xuất dữ liệu Excel"
						>
							<FileSpreadsheet size={18} />
						</button>
						<button
							className="btn btn-secondary"
							onClick={refreshData}
							disabled={loading}
							title="Làm mới"
						>
							<RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
						</button>
						<button
							className="btn btn-secondary"
							onClick={() => setShowSettings(true)}
							title="Cài đặt"
						>
							<Settings size={18} />
						</button>
					</div>
				</div>

				{/* Quick Stats */}
				<div style={{ 
					display: 'grid', 
					gridTemplateColumns: 'repeat(4, 1fr)', 
					gap: '16px',
					marginBottom: '24px'
				}}>
					{/* Card 1 - Hoạt động hôm nay */}
					<div style={{ 
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
							background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)',
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
								background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
								color: 'white',
								flexShrink: 0
							}}>
								<Activity size={20} />
							</div>
							<div style={{ flex: 1 }}>
								<div style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '6px', fontWeight: 500 }}>
									Hoạt động hôm nay
								</div>
								<div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1 }}>
									{activitySummary.total}
								</div>
								<div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 600, marginTop: '4px' }}>
									Tổng hoạt động
								</div>
							</div>
						</div>
					</div>

					{/* Card 2 - Uptime hệ thống */}
					<div style={{ 
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
							background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
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
								background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
								color: 'white',
								flexShrink: 0
							}}>
								<CheckCircle size={20} />
							</div>
							<div style={{ flex: 1 }}>
								<div style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '6px', fontWeight: 500 }}>
									Uptime hệ thống
								</div>
								<div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1 }}>
									{systemHealth.uptime}%
								</div>
								<div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
									Thời gian hoạt động
								</div>
							</div>
						</div>
					</div>

					{/* Card 3 - Thời gian phản hồi */}
					<div style={{ 
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
							background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
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
								background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
								color: 'white',
								flexShrink: 0
							}}>
								<Clock size={20} />
							</div>
							<div style={{ flex: 1 }}>
								<div style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '6px', fontWeight: 500 }}>
									Thời gian phản hồi
								</div>
								<div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1 }}>
									{systemHealth.responseTime}s
								</div>
								<div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600, marginTop: '4px' }}>
									Trung bình phản hồi
								</div>
							</div>
						</div>
					</div>

					{/* Card 4 - Tỷ lệ lỗi */}
					<div style={{ 
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
							background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
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
								background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
								color: 'white',
								flexShrink: 0
							}}>
								<AlertTriangle size={20} />
							</div>
							<div style={{ flex: 1 }}>
								<div style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '6px', fontWeight: 500 }}>
									Tỷ lệ lỗi
								</div>
								<div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1 }}>
									{systemHealth.errorRate}%
								</div>
								<div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600, marginTop: '4px' }}>
									Tỷ lệ lỗi hệ thống
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Stats Grid */}
			<StatCardsGrid stats={stats} loading={loading} />

			{/* Charts Section */}
			<div style={{ 
				display: 'grid', 
				gridTemplateColumns: '1fr 1fr', 
				gap: '24px',
				marginBottom: '32px'
			}}>
				<UserGrowthChart 
					data={userGrowth} 
					chartData={chartData.userGrowth} 
					loading={loading} 
				/>
				<CourseCategoryChart 
					data={courseCategories} 
					chartData={chartData.courseCategories} 
					loading={loading} 
				/>
			</div>

			{/* Bottom Section */}
			<div style={{ 
				display: 'grid', 
				gridTemplateColumns: '2fr 1fr', 
				gap: '24px'
			}}>
				<RecentActivityFeed 
					activities={recentActivities} 
					loading={loading}
					onActivityClick={handleActivityClick}
				/>

				{/* Top Performers */}
				<div style={{ 
					background: 'var(--card)', 
					border: '1px solid var(--border)', 
					borderRadius: 'var(--radius-lg)',
					padding: '24px',
					boxShadow: 'var(--shadow-sm)'
				}}>
					<div style={{ marginBottom: '20px' }}>
						<div style={{ 
							display: 'flex', 
							alignItems: 'center', 
							gap: '8px',
							fontSize: '18px',
							fontWeight: 600,
							color: 'var(--foreground)',
							marginBottom: '4px'
						}}>
							<TrendingUp size={20} />
							Top Performers
						</div>
						<div style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
							Các khóa học và giảng viên xuất sắc nhất
						</div>
					</div>

					<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
						{topPerformers.slice(0, 5).map((performer, index) => (
							<div key={performer.id} style={{ 
								display: 'flex', 
								alignItems: 'center', 
								gap: '12px',
								padding: '12px',
								background: 'var(--muted)',
								borderRadius: 'var(--radius-md)',
								border: '1px solid var(--border)'
							}}>
								<div style={{ 
									fontSize: '14px', 
									fontWeight: 600, 
									color: 'var(--primary)',
									background: 'var(--primary-light)',
									width: '24px',
									height: '24px',
									borderRadius: '50%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									#{index + 1}
								</div>
								{performer.avatar && (
									<img 
										src={performer.avatar} 
										alt={performer.name}
										style={{ 
											width: '32px', 
											height: '32px', 
											borderRadius: '50%',
											objectFit: 'cover'
										}}
									/>
								)}
								<div style={{ flex: 1 }}>
									<div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>
										{performer.name}
									</div>
									<div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
										{performer.value.toLocaleString()} {performer.unit}
									</div>
								</div>
								<div style={{ textAlign: 'right' }}>
									<div style={{ 
										fontSize: '12px', 
										fontWeight: 600, 
										color: performer.growth > 0 ? 'var(--success)' : 'var(--danger)'
									}}>
										{performer.growth > 0 ? '+' : ''}{performer.growth}%
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Settings Modal */}
			<DashboardSettingsModal
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
				settings={settings}
				onUpdateSettings={updateSettings as (key: string, value: any) => void}
			/>

			{/* Filters Modal */}
			<DashboardFiltersModal
				isOpen={showFilters}
				onClose={() => setShowFilters(false)}
				filters={filters}
				onUpdateFilter={updateFilter as (key: string, value: any) => void}
				onClearFilters={clearFilters}
			/>

			{/* Export Options Modal */}
			<DashboardExportModal
				isOpen={showExportOptions}
				onClose={() => setShowExportOptions(false)}
				onExportComplete={handleExportComplete}
				onExportStats={handleExportStats}
				onExportUserGrowth={handleExportUserGrowth}
				onExportCategories={handleExportCategories}
				onExportActivities={handleExportActivities}
				onExportPerformers={handleExportPerformers}
				onExportSystemHealth={handleExportSystemHealth}
			/>

			{/* Activity Detail Modal */}
			<ActivityDetailModal
				isOpen={!!selectedActivity}
				onClose={() => setSelectedActivity(null)}
				activity={selectedActivity}
			/>
		</div>
	)
}