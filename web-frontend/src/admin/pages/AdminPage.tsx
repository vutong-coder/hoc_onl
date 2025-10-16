import React, { useState, useRef } from 'react'
import {
	Settings,
	Plus,
	RefreshCw,
	Download,
	Upload,
	FileSpreadsheet,
	FileText,
	Eye,
	Edit,
	Trash2,
	Key,
	Shield,
	Users,
	Activity,
	Server,
	Database,
	AlertTriangle,
	CheckCircle,
	TrendingUp,
	BarChart3,
	Clock,
	Cpu,
	HardDrive,
	Network,
	Lock,
	Unlock,
	UserPlus,
	UserMinus
} from 'lucide-react'
import useSystemAdmin from '../hooks/useSystemAdmin'
import SystemHealthWidget from '../components/admin/SystemHealthWidget'
import AdminUsersTable from '../components/admin/AdminUsersTable'
import GlobalSettings from '../components/admin/GlobalSettings'
import AuditLog from '../components/admin/AuditLog'
import Modal from '../components/common/Modal'
import Badge from '../components/common/Badge'
import StatCard from '../components/common/StatCard'
import { 
	exportAdminsToExcel,
	importAdminsFromExcel,
	generateAdminExcelTemplate
} from '../utils/adminExcelHelpers'
import '../styles/common.css'
import '../styles/admin.css'

export default function AdminPage(): JSX.Element {
	const {
		admins,
		allAdmins,
		systemHealth,
		settings,
		auditLogs,
		dashboard,
		alerts,
		activities,
		securityEvents,
		performanceMetrics,
		maintenance,
		filters,
		addAdmin,
		updateAdmin,
		deleteAdmin,
		toggleAdminStatus,
		resetAdminPassword,
		toggleTwoFactor,
		updateSetting,
		addSetting,
		deleteSetting,
		resetSetting,
		refreshSystemHealth,
		updateFilter,
		clearFilters,
		loading,
		totalAdmins,
		filteredAdminsCount
	} = useSystemAdmin()

	const [activeTab, setActiveTab] = useState<'overview' | 'admins' | 'settings' | 'audit'>('overview')
	const [showAddModal, setShowAddModal] = useState(false)
	const [editingAdmin, setEditingAdmin] = useState<any>(null)
	const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
	const [showStats, setShowStats] = useState(true)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleAddAdmin = () => {
		setEditingAdmin(null)
		setShowAddModal(true)
	}

	const handleEditAdmin = (admin: any) => {
		setEditingAdmin(admin)
		setShowAddModal(true)
	}

	const handleDeleteAdmin = (adminId: string) => {
		if (window.confirm('Bạn có chắc chắn muốn xóa admin này?')) {
			deleteAdmin(adminId)
		}
	}

	const handleViewAdmin = (admin: any) => {
		setSelectedAdmin(admin)
	}

	const handleSaveAdmin = (adminForm: any) => {
		if (editingAdmin) {
			updateAdmin(adminForm, editingAdmin.id)
		} else {
			addAdmin(adminForm)
		}
		setShowAddModal(false)
		setEditingAdmin(null)
	}

	const handleToggleAdminStatus = (adminId: string, newStatus: any) => {
		toggleAdminStatus(adminId, newStatus)
	}

	const handleResetPassword = (adminId: string) => {
		if (window.confirm('Bạn có chắc chắn muốn đặt lại mật khẩu cho admin này?')) {
			resetAdminPassword(adminId)
			alert('Mật khẩu đã được đặt lại thành công!')
		}
	}

	const handleToggleTwoFactor = (adminId: string) => {
		toggleTwoFactor(adminId)
	}

	// Excel Export Functions
	const handleExportAdmins = () => {
		try {
			const filename = `admin-users-${new Date().toISOString().split('T')[0]}.xlsx`
			exportAdminsToExcel(admins, filename)
			alert('Đã xuất file Excel thành công!')
		} catch (error) {
			console.error('Export error:', error)
			alert('Có lỗi xảy ra khi xuất file Excel')
		}
	}

	// Excel Import Functions
	const handleImportAdmins = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		try {
			const importedAdmins = await importAdminsFromExcel(file)

			// Process imported admins
			for (const adminForm of importedAdmins) {
				addAdmin(adminForm)
			}

			alert(`Đã nhập thành công ${importedAdmins.length} admin`)
		} catch (error) {
			console.error('Import error:', error)
			alert(`Lỗi nhập file: ${error instanceof Error ? error.message : 'Unknown error'}`)
		} finally {
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		}
	}

	// Generate Excel Template Function
	const handleDownloadTemplate = () => {
		generateAdminExcelTemplate()
		alert('Đã tải template Excel thành công!')
	}

	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
		return num.toString()
	}

	const formatBytes = (bytes: number) => {
		if (bytes >= 1000000000000) return `${(bytes / 1000000000000).toFixed(1)}TB`
		if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)}GB`
		if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)}MB`
		if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)}KB`
		return `${bytes}B`
	}

	const formatPercentage = (value: number) => {
		return `${value.toFixed(1)}%`
	}

	const getRoleLabel = (role: string) => {
		const labels: Record<string, string> = {
			super_admin: 'Super Admin',
			system_admin: 'System Admin',
			content_admin: 'Content Admin',
			user_admin: 'User Admin',
			security_admin: 'Security Admin',
			audit_admin: 'Audit Admin',
			support_admin: 'Support Admin'
		}
		return labels[role] || role
	}

	const getStatusLabel = (status: string) => {
		const labels: Record<string, string> = {
			active: 'Hoạt động',
			inactive: 'Không hoạt động',
			suspended: 'Tạm dừng',
			pending: 'Chờ duyệt',
			locked: 'Khóa'
		}
		return labels[status] || status
	}

	return (
		<div className="admin-page">
			{/* Header */}
			<div className="admin-header">
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
					<div>
						<div className="admin-title">
							<Settings size={32} />
							<h1>Quản trị Hệ thống</h1>
						</div>
						<p className="admin-subtitle">
							Quản lý admin users, cài đặt hệ thống và theo dõi audit logs
						</p>
					</div>

					<div className="admin-actions">
						<button
							className="btn btn-secondary"
							onClick={() => setShowStats(!showStats)}
							title="Ẩn/hiện thống kê"
						>
							<BarChart3 size={18} />
						</button>
						<button
							className="btn btn-secondary"
							onClick={handleDownloadTemplate}
							title="Tải template Excel"
						>
							<FileText size={18} />
							Template
						</button>
						<button
							className="btn btn-secondary"
							onClick={handleImportAdmins}
							title="Nhập Excel"
						>
							<Upload size={18} />
							Nhập Excel
						</button>
						<button
							className="btn btn-secondary"
							onClick={handleExportAdmins}
							title="Xuất Excel"
						>
							<FileSpreadsheet size={18} />
							Xuất Excel
						</button>
						<button
							className="btn btn-primary"
							onClick={handleAddAdmin}
						>
							<Plus size={18} />
							Thêm admin
						</button>
					</div>
				</div>

				{/* Stats Overview */}
				{showStats && (
					<div className="admin-stats-grid">
						<StatCard
							title="Tổng Admin"
							value={dashboard.stats.totalAdmins}
							subtitle={`${dashboard.stats.activeAdmins} đang hoạt động`}
							icon={<Users size={24} />}
							gradient="primary"
							trend={{ value: dashboard.stats.totalAdmins > 0 ? 5.2 : 0, isPositive: true }}
						/>
						
						<StatCard
							title="Đăng nhập gần đây"
							value={dashboard.stats.recentLogins}
							subtitle={`${dashboard.stats.failedLogins} thất bại`}
							icon={<Activity size={24} />}
							gradient="accent"
							trend={{ value: dashboard.stats.recentLogins > 0 ? 12.8 : 0, isPositive: true }}
						/>
						
						<StatCard
							title="2FA Enabled"
							value={dashboard.stats.twoFactorEnabled}
							subtitle={`${dashboard.stats.totalAdmins - dashboard.stats.twoFactorEnabled} chưa bật`}
							icon={<Shield size={24} />}
							gradient="primary"
							trend={{ value: dashboard.stats.twoFactorEnabled > 0 ? 8.4 : 0, isPositive: true }}
						/>
						
						<StatCard
							title="Suspended"
							value={dashboard.stats.suspendedAdmins}
							subtitle={`${dashboard.stats.pendingAdmins} chờ duyệt`}
							icon={<AlertTriangle size={24} />}
							gradient="accent"
							trend={{ value: dashboard.stats.suspendedAdmins > 0 ? -2.1 : 0, isPositive: false }}
						/>
						
						<StatCard
							title="System Health"
							value={systemHealth.overall === 'healthy' ? 'Khỏe mạnh' : 'Cảnh báo'}
							subtitle={`Uptime: ${formatPercentage(systemHealth.uptime.current)}`}
							icon={<Server size={24} />}
							gradient="primary"
							trend={{ value: systemHealth.uptime.current, isPositive: true }}
						/>
						
						<StatCard
							title="Storage Usage"
							value={formatPercentage((systemHealth.storage.used / systemHealth.storage.total) * 100)}
							subtitle={`${formatBytes(systemHealth.storage.used)} / ${formatBytes(systemHealth.storage.total)}`}
							icon={<HardDrive size={24} />}
							gradient="accent"
							trend={{ value: (systemHealth.storage.used / systemHealth.storage.total) * 100, isPositive: false }}
						/>
					</div>
				)}
			</div>

			{/* Tab Navigation */}
			<div className="admin-tabs">
				<button
					className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
					onClick={() => setActiveTab('overview')}
				>
					<BarChart3 size={16} />
					Tổng quan
				</button>
				<button
					className={`admin-tab ${activeTab === 'admins' ? 'active' : ''}`}
					onClick={() => setActiveTab('admins')}
				>
					<Users size={16} />
					Admin Users ({totalAdmins})
				</button>
				<button
					className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
					onClick={() => setActiveTab('settings')}
				>
					<Settings size={16} />
					Cài đặt ({settings.length})
				</button>
				<button
					className={`admin-tab ${activeTab === 'audit' ? 'active' : ''}`}
					onClick={() => setActiveTab('audit')}
				>
					<Activity size={16} />
					Audit Log ({auditLogs.length})
				</button>
			</div>

			{/* Tab Content */}
			<div className="admin-tab-content">
				{activeTab === 'overview' && (
					<div className="overview-content">
						<SystemHealthWidget
							systemHealth={systemHealth}
							onRefresh={refreshSystemHealth}
							loading={loading}
						/>
						
						{/* Recent Activities */}
						<div className="recent-activities">
							<h3>Hoạt động gần đây</h3>
							<div className="activities-list">
								{activities.slice(0, 5).map((activity) => (
									<div key={activity.id} className="activity-item">
										<div className="activity-icon">
											<Activity size={16} />
										</div>
										<div className="activity-content">
											<div className="activity-title">{activity.description}</div>
											<div className="activity-meta">
												<span>{activity.adminName}</span>
												<span>•</span>
												<span>{new Date(activity.timestamp).toLocaleString('vi-VN')}</span>
											</div>
										</div>
										<div className="activity-status">
											<Badge variant={activity.status === 'completed' ? 'success' : 'warning'}>
												{activity.status}
											</Badge>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Critical Alerts */}
						<div className="critical-alerts">
							<h3>Cảnh báo quan trọng</h3>
							<div className="alerts-list">
								{alerts.filter(alert => alert.severity === 'critical' && !alert.resolved).slice(0, 3).map((alert) => (
									<div key={alert.id} className="alert-item critical">
										<div className="alert-icon">
											<AlertTriangle size={16} />
										</div>
										<div className="alert-content">
											<div className="alert-title">{alert.title}</div>
											<div className="alert-message">{alert.message}</div>
											<div className="alert-meta">
												<span>{alert.source}</span>
												<span>•</span>
												<span>{new Date(alert.timestamp).toLocaleString('vi-VN')}</span>
											</div>
										</div>
										<div className="alert-actions">
											<button className="btn btn-sm btn-outline">
												<CheckCircle size={14} />
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{activeTab === 'admins' && (
					<AdminUsersTable
						admins={admins}
						onEditAdmin={handleEditAdmin}
						onDeleteAdmin={handleDeleteAdmin}
						onViewAdmin={handleViewAdmin}
						onToggleStatus={handleToggleAdminStatus}
						onResetPassword={handleResetPassword}
						onToggleTwoFactor={handleToggleTwoFactor}
						loading={loading}
						emptyMessage="Không có admin nào phù hợp với bộ lọc"
					/>
				)}

				{activeTab === 'settings' && (
					<GlobalSettings
						settings={settings}
						onUpdateSetting={updateSetting}
						onResetSetting={resetSetting}
						onAddSetting={addSetting}
						onDeleteSetting={deleteSetting}
						loading={loading}
					/>
				)}

				{activeTab === 'audit' && (
					<AuditLog
						logs={auditLogs}
						onRefresh={() => {/* Refresh logic */}}
						onExport={() => {/* Export logic */}}
						loading={loading}
						emptyMessage="Không có audit log nào"
					/>
				)}
			</div>

			{/* Admin Details Modal */}
			<Modal
				isOpen={!!selectedAdmin}
				onClose={() => setSelectedAdmin(null)}
				title={selectedAdmin?.fullName || 'Chi tiết Admin'}
				maxWidth="800px"
			>
				{selectedAdmin && (
					<div className="admin-detail-modal-content">
						<div className="admin-detail-header">
							<div className="admin-detail-avatar">
								{selectedAdmin.avatar ? (
									<img src={selectedAdmin.avatar} alt={selectedAdmin.fullName} />
								) : (
									<Users size={40} />
								)}
							</div>
							<div className="admin-detail-info">
								<h2 className="admin-detail-title">{selectedAdmin.fullName}</h2>
								<p className="admin-detail-username">@{selectedAdmin.username}</p>
								<div className="admin-detail-meta">
									<div className="meta-item">
										<Badge variant="secondary">
											{getRoleLabel(selectedAdmin.role)}
										</Badge>
									</div>
									<div className="meta-item">
										<Badge variant="secondary">
											{getStatusLabel(selectedAdmin.status)}
										</Badge>
									</div>
									<div className="meta-item">
										<Shield size={16} />
										<span>{selectedAdmin.isTwoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}</span>
									</div>
								</div>
							</div>
						</div>

						<div className="admin-detail-sections">
							<div className="detail-section">
								<h3>Thông tin liên hệ</h3>
								<div className="contact-info">
									<div className="contact-item">
										<span className="contact-label">Email:</span>
										<span className="contact-value">{selectedAdmin.email}</span>
									</div>
									{selectedAdmin.metadata.phone && (
										<div className="contact-item">
											<span className="contact-label">Phone:</span>
											<span className="contact-value">{selectedAdmin.metadata.phone}</span>
										</div>
									)}
									{selectedAdmin.metadata.address && (
										<div className="contact-item">
											<span className="contact-label">Address:</span>
											<span className="contact-value">{selectedAdmin.metadata.address}</span>
										</div>
									)}
								</div>
							</div>

							<div className="detail-section">
								<h3>Quyền hạn</h3>
								<div className="permissions-list">
									{selectedAdmin.permissions.map((permission: string) => (
										<Badge key={permission} variant="info">
											{permission.replace(/_/g, ' ')}
										</Badge>
									))}
								</div>
							</div>

							<div className="detail-section">
								<h3>Thông tin hoạt động</h3>
								<div className="activity-info">
									<div className="activity-item">
										<span className="activity-label">Đăng nhập cuối:</span>
										<span className="activity-value">
											{new Date(selectedAdmin.lastLoginAt).toLocaleString('vi-VN')}
										</span>
									</div>
									<div className="activity-item">
										<span className="activity-label">Tạo bởi:</span>
										<span className="activity-value">{selectedAdmin.createdBy}</span>
									</div>
									<div className="activity-item">
										<span className="activity-label">Ngày tạo:</span>
										<span className="activity-value">
											{new Date(selectedAdmin.createdAt).toLocaleString('vi-VN')}
										</span>
									</div>
									<div className="activity-item">
										<span className="activity-label">Cập nhật cuối:</span>
										<span className="activity-value">
											{new Date(selectedAdmin.updatedAt).toLocaleString('vi-VN')}
										</span>
									</div>
								</div>
							</div>

							{selectedAdmin.metadata.bio && (
								<div className="detail-section">
									<h3>Giới thiệu</h3>
									<p className="bio-content">{selectedAdmin.metadata.bio}</p>
								</div>
							)}

							{selectedAdmin.metadata.skills && selectedAdmin.metadata.skills.length > 0 && (
								<div className="detail-section">
									<h3>Kỹ năng</h3>
									<div className="skills-list">
										{selectedAdmin.metadata.skills.map((skill: string) => (
											<Badge key={skill} variant="success">{skill}</Badge>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</Modal>

			{/* Hidden file input for import */}
			<input
				ref={fileInputRef}
				type="file"
				accept=".xlsx,.xls"
				onChange={handleFileChange}
				style={{ display: 'none' }}
			/>
		</div>
	)
}