import React, { useState } from 'react'
import { 
	Shield, 
	ShieldAlert, 
	Activity, 
	AlertTriangle, 
	TrendingUp, 
	Users,
	Search,
	Filter,
	RefreshCw
} from 'lucide-react'
import useSecurityDashboard from '../hooks/useSecurityDashboard'
import ModuleStatusGrid from '../components/security/ModuleStatusGrid'
import ActivityLog from '../components/security/ActivityLog'
import SearchBar from '../components/common/SearchBar'
import Badge from '../components/common/Badge'
import '../styles/common.css'
import '../styles/security.css'

export default function SecurityPage(): JSX.Element {
	const {
		dashboard,
		modules,
		activities,
		alerts,
		filters,
		updateFilter,
		autoRefresh,
		setAutoRefresh,
		resolveAlert,
		getUnresolvedAlerts,
		getActiveModules
	} = useSecurityDashboard()

	const [selectedModule, setSelectedModule] = useState<any>(null)
	const [activeTab, setActiveTab] = useState<'modules' | 'activities' | 'alerts'>('modules')

	const unresolvedAlerts = getUnresolvedAlerts()
	const activeModules = getActiveModules()

	const handleModuleClick = (module: any) => {
		setSelectedModule(module)
		// Could open a detail modal here
	}

	const handleResolveAlert = (alertId: string) => {
		resolveAlert(alertId)
	}

	return (
		<div style={{ padding: '24px' }}>
			{/* Header */}
			<div style={{ marginBottom: '24px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
					<div>
						<h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0' }}>
							Bảo Mật & Blockchain
						</h1>
						<p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
							Giám sát hệ thống blockchain và bảo mật thời gian thực
						</p>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<div className="realtime-indicator">
							<div className="realtime-pulse" />
							<span>Live monitoring</span>
						</div>
						
						<label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
							<input
								type="checkbox"
								checked={autoRefresh}
								onChange={(e) => setAutoRefresh(e.target.checked)}
								style={{ width: '18px', height: '18px', cursor: 'pointer' }}
							/>
							<span style={{ fontSize: '14px' }}>Tự động làm mới</span>
						</label>
					</div>
				</div>
			</div>

			{/* Stats Overview */}
			<div className="stats-grid">
				<div className="stat-card">
					<div className="stat-card-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>
						<Shield size={24} />
					</div>
					<div className="stat-card-content">
						<div className="stat-card-label">Module đang hoạt động</div>
						<div className="stat-card-value">{dashboard.overview.activeModules}/{dashboard.overview.totalModules}</div>
						<div className="stat-card-change neutral">
							{Math.round((dashboard.overview.activeModules / dashboard.overview.totalModules) * 100)}% uptime
						</div>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-card-icon" style={{ background: '#fee2e2', color: '#ef4444' }}>
						<AlertTriangle size={24} />
					</div>
					<div className="stat-card-content">
						<div className="stat-card-label">Cảnh báo chưa xử lý</div>
						<div className="stat-card-value">{unresolvedAlerts.length}</div>
						{unresolvedAlerts.length > 0 && (
							<div className="stat-card-change negative">
								Cần chú ý!
							</div>
						)}
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-card-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
						<Activity size={24} />
					</div>
					<div className="stat-card-content">
						<div className="stat-card-label">Tổng giao dịch</div>
						<div className="stat-card-value">{dashboard.overview.totalTransactions.toLocaleString()}</div>
						<div className="stat-card-change positive">
							+{modules.reduce((sum, m) => sum + m.todayTransactions, 0)} hôm nay
						</div>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-card-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
						<TrendingUp size={24} />
					</div>
					<div className="stat-card-content">
						<div className="stat-card-label">Điểm bảo mật TB</div>
						<div className="stat-card-value">{dashboard.overview.averageSecurityScore}</div>
						<div className="stat-card-change neutral">
							/ 100
						</div>
					</div>
				</div>
			</div>

			{/* Filters & Search */}
			<div style={{ 
				display: 'flex', 
				justifyContent: 'space-between', 
				alignItems: 'center',
				marginBottom: '24px',
				gap: '16px',
				flexWrap: 'wrap'
			}}>
				<SearchBar
					value={filters.search}
					onChange={(value) => updateFilter('search', value)}
					placeholder="Tìm kiếm module, mô tả..."
				/>

				<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
					<button
						className={`btn ${autoRefresh ? 'btn-primary' : 'btn-secondary'}`}
						onClick={() => setAutoRefresh(!autoRefresh)}
					>
						<RefreshCw size={18} className={autoRefresh ? 'animate-spin' : ''} />
						{autoRefresh ? 'Đang làm mới' : 'Làm mới'}
					</button>
				</div>
			</div>

			{/* Filters */}
			<div className="filters-container">
				<div className="filter-group">
					<label className="filter-label">Module</label>
					<select
						className="filter-select"
						value={filters.module}
						onChange={(e) => updateFilter('module', e.target.value)}
					>
						<option value="all">Tất cả modules</option>
						<option value="anti_cheat">Camera AI + Smart Contract</option>
						<option value="copyright_protection">Document Hash + Ethereum</option>
						<option value="token_rewards">ERC-20 + Learning Ecosystem</option>
						<option value="multisig_wallet">Multi-signature + Node.js</option>
					</select>
				</div>

				<div className="filter-group">
					<label className="filter-label">Trạng thái</label>
					<select
						className="filter-select"
						value={filters.status}
						onChange={(e) => updateFilter('status', e.target.value)}
					>
						<option value="all">Tất cả</option>
						<option value="active">Hoạt động</option>
						<option value="warning">Cảnh báo</option>
						<option value="error">Lỗi</option>
						<option value="maintenance">Bảo trì</option>
						<option value="offline">Offline</option>
					</select>
				</div>

				<div className="filter-group">
					<label className="filter-label">Mức độ</label>
					<select
						className="filter-select"
						value={filters.severity}
						onChange={(e) => updateFilter('severity', e.target.value)}
					>
						<option value="all">Tất cả mức độ</option>
						<option value="info">Thông tin</option>
						<option value="warning">Cảnh báo</option>
						<option value="error">Lỗi</option>
						<option value="critical">Nghiêm trọng</option>
					</select>
				</div>

				<div className="filter-group">
					<label className="filter-label">Thời gian</label>
					<select
						className="filter-select"
						value={filters.timeRange}
						onChange={(e) => updateFilter('timeRange', e.target.value)}
					>
						<option value="today">Hôm nay</option>
						<option value="week">Tuần này</option>
						<option value="month">Tháng này</option>
						<option value="all">Tất cả</option>
					</select>
				</div>

				<div className="filter-group">
					<label className="filter-label">Kết quả</label>
					<div style={{ 
						padding: '8px 12px',
						background: 'var(--muted)',
						borderRadius: 'var(--radius-md)',
						fontSize: '14px',
						fontWeight: 500
					}}>
						{activeTab === 'modules' && `${modules.length} modules`}
						{activeTab === 'activities' && `${activities.length} hoạt động`}
						{activeTab === 'alerts' && `${alerts.length} cảnh báo`}
					</div>
				</div>
			</div>

			{/* Tab Navigation */}
			<div style={{ 
				display: 'flex', 
				gap: '4px',
				marginBottom: '24px',
				background: 'var(--muted)',
				padding: '4px',
				borderRadius: 'var(--radius-md)',
				width: 'fit-content'
			}}>
				{[
					{ id: 'modules', label: 'Modules', icon: Shield },
					{ id: 'activities', label: 'Hoạt động', icon: Activity },
					{ id: 'alerts', label: 'Cảnh báo', icon: AlertTriangle }
				].map(tab => (
					<button
						key={tab.id}
						className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
						onClick={() => setActiveTab(tab.id as any)}
						style={{ 
							display: 'flex', 
							alignItems: 'center', 
							gap: '8px',
							padding: '8px 16px'
						}}
					>
						<tab.icon size={16} />
						{tab.label}
						{tab.id === 'alerts' && unresolvedAlerts.length > 0 && (
							<Badge variant="danger" style={{ fontSize: '10px', padding: '2px 6px' }}>
								{unresolvedAlerts.length}
							</Badge>
						)}
					</button>
				))}
			</div>

			{/* Content */}
			<div style={{ 
				background: 'var(--card)',
				borderRadius: 'var(--radius-lg)',
				padding: '24px',
				boxShadow: 'var(--shadow-sm)',
				minHeight: '500px'
			}}>
				{activeTab === 'modules' && (
					<div>
						<h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>
							Trạng thái Modules Blockchain
						</h2>
						<ModuleStatusGrid
							modules={modules}
							onModuleClick={handleModuleClick}
						/>
					</div>
				)}

				{activeTab === 'activities' && (
					<div>
						<h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>
							Nhật ký hoạt động
						</h2>
						<ActivityLog activities={activities} />
					</div>
				)}

				{activeTab === 'alerts' && (
					<div>
						<h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>
							Cảnh báo bảo mật ({alerts.length})
						</h2>
						{alerts.length === 0 ? (
							<div className="admin-table-empty">
								<div className="admin-table-empty-icon">✅</div>
								<div className="admin-table-empty-text">Không có cảnh báo nào</div>
							</div>
						) : (
							<div style={{ maxHeight: '600px', overflowY: 'auto' }}>
								<table className="admin-table">
									<thead>
										<tr>
											<th>Thời gian</th>
											<th>Module</th>
											<th>Loại</th>
											<th>Mô tả</th>
											<th>Mức độ</th>
											<th>Trạng thái</th>
											<th>Hành động</th>
										</tr>
									</thead>
									<tbody>
										{alerts.map(alert => (
											<tr key={alert.id} className={`alert-${alert.severity}`}>
												<td style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
													{new Date(alert.timestamp).toLocaleString('vi-VN')}
												</td>
												<td>
													<Badge variant="info" style={{ fontSize: '11px' }}>
														{alert.module}
													</Badge>
												</td>
												<td style={{ fontSize: '13px' }}>
													{alert.type.replace(/_/g, ' ')}
												</td>
												<td>
													<div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
														{alert.title}
													</div>
													<div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
														{alert.description}
													</div>
												</td>
												<td>
													<Badge variant={
														alert.severity === 'critical' ? 'danger' :
														alert.severity === 'high' ? 'danger' :
														alert.severity === 'medium' ? 'warning' : 'secondary'
													} style={{ fontSize: '11px' }}>
														{alert.severity.toUpperCase()}
													</Badge>
												</td>
												<td>
													{alert.resolved ? (
														<Badge variant="success" style={{ fontSize: '11px' }}>
															Đã xử lý
														</Badge>
													) : (
														<Badge variant="danger" style={{ fontSize: '11px' }}>
															Chưa xử lý
														</Badge>
													)}
												</td>
												<td>
													{!alert.resolved && (
														<button
															className="btn btn-sm btn-secondary"
															onClick={() => handleResolveAlert(alert.id)}
														>
															Xử lý
														</button>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}