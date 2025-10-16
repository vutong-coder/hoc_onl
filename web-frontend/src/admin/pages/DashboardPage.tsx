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
import Modal from '../components/common/Modal'
import Badge from '../components/common/Badge'
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
					gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
					gap: '16px',
					marginBottom: '24px'
				}}>
					<div style={{ 
						padding: '16px', 
						background: 'var(--card)', 
						borderRadius: 'var(--radius-lg)',
						border: '1px solid var(--border)',
						textAlign: 'center'
					}}>
						<div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
							{activitySummary.total}
						</div>
						<div style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
							Hoạt động hôm nay
						</div>
					</div>
					<div style={{ 
						padding: '16px', 
						background: 'var(--card)', 
						borderRadius: 'var(--radius-lg)',
						border: '1px solid var(--border)',
						textAlign: 'center'
					}}>
						<div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)', marginBottom: '4px' }}>
							{systemHealth.uptime}%
						</div>
						<div style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
							Uptime hệ thống
						</div>
					</div>
					<div style={{ 
						padding: '16px', 
						background: 'var(--card)', 
						borderRadius: 'var(--radius-lg)',
						border: '1px solid var(--border)',
						textAlign: 'center'
					}}>
						<div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--warning)', marginBottom: '4px' }}>
							{systemHealth.responseTime}s
						</div>
						<div style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
							Thời gian phản hồi
						</div>
					</div>
					<div style={{ 
						padding: '16px', 
						background: 'var(--card)', 
						borderRadius: 'var(--radius-lg)',
						border: '1px solid var(--border)',
						textAlign: 'center'
					}}>
						<div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--danger)', marginBottom: '4px' }}>
							{systemHealth.errorRate}%
						</div>
						<div style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
							Tỷ lệ lỗi
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
			<Modal
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
				title="Cài đặt Dashboard"
				maxWidth="500px"
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
					<div>
						<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
							Khoảng thời gian làm mới (giây)
						</label>
						<input
							type="number"
							value={settings.refreshInterval}
							onChange={(e) => updateSettings('refreshInterval', parseInt(e.target.value))}
							min="10"
							max="300"
							className="form-input"
						/>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<input
							type="checkbox"
							id="autoRefresh"
							checked={settings.autoRefresh}
							onChange={(e) => updateSettings('autoRefresh', e.target.checked)}
						/>
						<label htmlFor="autoRefresh">Tự động làm mới</label>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<input
							type="checkbox"
							id="showCharts"
							checked={settings.showCharts}
							onChange={(e) => updateSettings('showCharts', e.target.checked)}
						/>
						<label htmlFor="showCharts">Hiển thị biểu đồ</label>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<input
							type="checkbox"
							id="showActivities"
							checked={settings.showActivities}
							onChange={(e) => updateSettings('showActivities', e.target.checked)}
						/>
						<label htmlFor="showActivities">Hiển thị hoạt động</label>
					</div>

					<div>
						<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
							Loại biểu đồ
						</label>
						<select
							value={settings.chartType}
							onChange={(e) => updateSettings('chartType', e.target.value)}
							className="form-select"
						>
							<option value="line">Đường</option>
							<option value="bar">Cột</option>
							<option value="pie">Tròn</option>
							<option value="doughnut">Vòng tròn</option>
						</select>
					</div>
				</div>
			</Modal>

			{/* Filters Modal */}
			<Modal
				isOpen={showFilters}
				onClose={() => setShowFilters(false)}
				title="Bộ lọc Dashboard"
				maxWidth="400px"
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
					<div>
						<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
							Khoảng thời gian
						</label>
						<select
							value={filters.timeRange}
							onChange={(e) => updateFilter('timeRange', e.target.value)}
							className="form-select"
						>
							<option value="7d">7 ngày qua</option>
							<option value="30d">30 ngày qua</option>
							<option value="90d">90 ngày qua</option>
							<option value="1y">1 năm qua</option>
							<option value="all">Tất cả</option>
						</select>
					</div>

					<div>
						<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
							Loại hoạt động
						</label>
						<select
							value={filters.activityType}
							onChange={(e) => updateFilter('activityType', e.target.value)}
							className="form-select"
						>
							<option value="all">Tất cả</option>
							<option value="user_registration">Đăng ký người dùng</option>
							<option value="course_enrollment">Đăng ký khóa học</option>
							<option value="course_completion">Hoàn thành khóa học</option>
							<option value="payment_received">Thanh toán</option>
							<option value="system_alert">Cảnh báo hệ thống</option>
						</select>
					</div>

					<div>
						<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
							Trạng thái
						</label>
						<select
							value={filters.status}
							onChange={(e) => updateFilter('status', e.target.value)}
							className="form-select"
						>
							<option value="all">Tất cả</option>
							<option value="success">Thành công</option>
							<option value="warning">Cảnh báo</option>
							<option value="error">Lỗi</option>
							<option value="info">Thông tin</option>
						</select>
					</div>

					<div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
						<button className="btn btn-secondary" onClick={clearFilters}>
							Xóa bộ lọc
						</button>
						<button className="btn btn-primary" onClick={() => setShowFilters(false)}>
							Áp dụng
						</button>
					</div>
				</div>
			</Modal>

			{/* Export Options Modal */}
			<Modal
				isOpen={showExportOptions}
				onClose={() => setShowExportOptions(false)}
				title="Xuất dữ liệu Excel"
				maxWidth="600px"
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
					<div style={{ marginBottom: '16px' }}>
						<p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
							Chọn loại dữ liệu bạn muốn xuất ra file Excel:
						</p>
					</div>

					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
						<button
							className="btn btn-primary"
							onClick={handleExportComplete}
							style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
						>
							<FileSpreadsheet size={18} />
							<div style={{ textAlign: 'left' }}>
								<div style={{ fontWeight: 600 }}>Dashboard hoàn chỉnh</div>
								<div style={{ fontSize: '12px', opacity: 0.8 }}>Tất cả dữ liệu trong 1 file</div>
							</div>
						</button>

						<button
							className="btn btn-outline"
							onClick={handleExportStats}
							style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
						>
							<BarChart3 size={18} />
							<div style={{ textAlign: 'left' }}>
								<div style={{ fontWeight: 600 }}>Thống kê tổng quan</div>
								<div style={{ fontSize: '12px', opacity: 0.8 }}>8 chỉ số chính</div>
							</div>
						</button>

						<button
							className="btn btn-outline"
							onClick={handleExportUserGrowth}
							style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
						>
							<TrendingUp size={18} />
							<div style={{ textAlign: 'left' }}>
								<div style={{ fontWeight: 600 }}>Tăng trưởng người dùng</div>
								<div style={{ fontSize: '12px', opacity: 0.8 }}>30 ngày gần nhất</div>
							</div>
						</button>

						<button
							className="btn btn-outline"
							onClick={handleExportCategories}
							style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
						>
							<BookOpen size={18} />
							<div style={{ textAlign: 'left' }}>
								<div style={{ fontWeight: 600 }}>Danh mục khóa học</div>
								<div style={{ fontSize: '12px', opacity: 0.8 }}>8 danh mục</div>
							</div>
						</button>

						<button
							className="btn btn-outline"
							onClick={handleExportActivities}
							style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
						>
							<Activity size={18} />
							<div style={{ textAlign: 'left' }}>
								<div style={{ fontWeight: 600 }}>Hoạt động gần đây</div>
								<div style={{ fontSize: '12px', opacity: 0.8 }}>10 hoạt động mới nhất</div>
							</div>
						</button>

						<button
							className="btn btn-outline"
							onClick={handleExportPerformers}
							style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
						>
							<Users size={18} />
							<div style={{ textAlign: 'left' }}>
								<div style={{ fontWeight: 600 }}>Top Performers</div>
								<div style={{ fontSize: '12px', opacity: 0.8 }}>5 người xuất sắc nhất</div>
							</div>
						</button>

						<button
							className="btn btn-outline"
							onClick={handleExportSystemHealth}
							style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
						>
							<CheckCircle size={18} />
							<div style={{ textAlign: 'left' }}>
								<div style={{ fontWeight: 600 }}>Tình trạng hệ thống</div>
								<div style={{ fontSize: '12px', opacity: 0.8 }}>Health & Alerts</div>
							</div>
						</button>
					</div>

					<div style={{ 
						marginTop: '20px', 
						padding: '16px', 
						background: 'var(--muted)', 
						borderRadius: 'var(--radius-md)',
						border: '1px solid var(--border)'
					}}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
							<Table size={16} />
							<span style={{ fontWeight: 600, fontSize: '14px' }}>Thông tin xuất file</span>
						</div>
						<ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
							<li>File Excel (.xlsx) với nhiều sheet</li>
							<li>Tên file tự động với ngày xuất</li>
							<li>Dữ liệu được format theo tiếng Việt</li>
							<li>Hỗ trợ mở bằng Excel, Google Sheets</li>
						</ul>
					</div>
				</div>
			</Modal>

			{/* Activity Detail Modal */}
			<Modal
				isOpen={!!selectedActivity}
				onClose={() => setSelectedActivity(null)}
				title="Chi tiết hoạt động"
				maxWidth="600px"
			>
				{selectedActivity && (
					<div>
						<div style={{ marginBottom: '20px' }}>
							<h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
								{selectedActivity.title}
							</h3>
							<p style={{ color: 'var(--muted-foreground)', marginBottom: '16px' }}>
								{selectedActivity.description}
							</p>
						</div>

						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
							<div>
								<label style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px', display: 'block' }}>
									Thời gian
								</label>
								<div style={{ fontSize: '14px', fontWeight: 500 }}>
									{new Date(selectedActivity.timestamp).toLocaleString('vi-VN')}
								</div>
							</div>
							<div>
								<label style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px', display: 'block' }}>
									Trạng thái
								</label>
								<Badge variant={selectedActivity.status === 'success' ? 'success' : 
													selectedActivity.status === 'warning' ? 'warning' : 
													selectedActivity.status === 'error' ? 'danger' : 'info'}>
									{selectedActivity.status}
								</Badge>
							</div>
						</div>

						{selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
							<div>
								<h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
									Thông tin bổ sung
								</h4>
								<div style={{ 
									background: 'var(--muted)', 
									padding: '16px', 
									borderRadius: 'var(--radius-md)',
									fontSize: '14px'
								}}>
									<pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
										{JSON.stringify(selectedActivity.metadata, null, 2)}
									</pre>
								</div>
							</div>
						)}
					</div>
				)}
			</Modal>
		</div>
	)
}