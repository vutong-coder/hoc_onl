import React, { useState, useRef } from 'react'
import {
	Building2,
	Plus,
	RefreshCw,
	Download,
	Upload,
	FileSpreadsheet,
	Users,
	TrendingUp,
	Shield,
	CheckCircle,
	AlertTriangle,
	Globe,
	Calendar,
	DollarSign,
	BookOpen,
	GraduationCap,
	FileText,
	Mail,
	Phone
} from 'lucide-react'
import useOrganizations from '../hooks/useOrganizations'
import OrganizationTable from '../components/organizations/OrganizationTable'
import OrganizationFilterBar from '../components/organizations/OrganizationFilterBar'
import OrganizationEditorModal from '../components/organizations/OrganizationEditorModal'
import Modal from '../components/common/Modal'
import Badge from '../components/common/Badge'
import StatCard from '../components/common/StatCard'
import { 
	exportOrganizationsToExcel,
	importOrganizationsFromExcel,
	generateOrganizationExcelTemplate
} from '../utils/organizationExcelHelpers'
import '../styles/common.css'
import '../styles/organizations.css'

export default function OrganizationsPage(): JSX.Element {
	const {
		organizations,
		allOrganizations,
		dashboard,
		filters,
		updateFilter,
		clearFilters,
		addOrganization,
		updateOrganization,
		deleteOrganization,
		toggleOrganizationStatus,
		loading,
		totalCount,
		filteredCount
	} = useOrganizations()

	const [showAddModal, setShowAddModal] = useState(false)
	const [editingOrganization, setEditingOrganization] = useState<any>(null)
	const [selectedOrganization, setSelectedOrganization] = useState<any>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleAddOrganization = () => {
		setEditingOrganization(null)
		setShowAddModal(true)
	}

	const handleEditOrganization = (organization: any) => {
		setEditingOrganization(organization)
		setShowAddModal(true)
	}

	const handleDeleteOrganization = (organizationId: string) => {
		if (window.confirm('Bạn có chắc chắn muốn xóa tổ chức này?')) {
			deleteOrganization(organizationId)
		}
	}

	const handleToggleOrganizationStatus = (organizationId: string, newStatus: any) => {
		toggleOrganizationStatus(organizationId, newStatus)
	}

	const handleOrganizationClick = (organization: any) => {
		setSelectedOrganization(organization)
	}

	const handleSaveOrganization = (organizationForm: any) => {
		if (editingOrganization) {
			updateOrganization(organizationForm, editingOrganization.id)
		} else {
			addOrganization(organizationForm)
		}
		setShowAddModal(false)
		setEditingOrganization(null)
	}

	// Excel Export Function
	const handleExportOrganizations = () => {
		try {
			const filename = `organizations-${new Date().toISOString().split('T')[0]}.xlsx`
			exportOrganizationsToExcel(organizations, filename)
			alert('Đã xuất file Excel thành công!')
		} catch (error) {
			console.error('Export error:', error)
			alert('Có lỗi xảy ra khi xuất file Excel')
		}
	}

	// Excel Import Function
	const handleImportOrganizations = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		try {
			const importedOrganizations = await importOrganizationsFromExcel(file)

			// Process imported organizations
			for (const organizationForm of importedOrganizations) {
				addOrganization(organizationForm)
			}

			alert(`Đã nhập thành công ${importedOrganizations.length} tổ chức`)
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
		generateOrganizationExcelTemplate()
		alert('Đã tải template Excel thành công!')
	}

	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
		return num.toString()
	}

	const formatCurrency = (amount: number, currency: string) => {
		if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B ${currency}`
		if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M ${currency}`
		if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K ${currency}`
		return `${amount} ${currency}`
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'var(--success)'
			case 'inactive': return 'var(--muted-foreground)'
			case 'suspended': return 'var(--danger)'
			case 'pending': return 'var(--warning)'
			case 'archived': return 'var(--secondary)'
			default: return 'var(--muted-foreground)'
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'active': return <CheckCircle size={16} />
			case 'inactive': return <Shield size={16} />
			case 'suspended': return <AlertTriangle size={16} />
			case 'pending': return <Calendar size={16} />
			case 'archived': return <Shield size={16} />
			default: return <Shield size={16} />
		}
	}

	return (
		<div style={{ padding: '24px' }}>
			{/* Header */}
			<div style={{ marginBottom: '32px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
					<div>
						<h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>
							<Building2 size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
							Quản lý Tổ chức
						</h1>
						<p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
							Quản lý và theo dõi các tổ chức sử dụng hệ thống học trực tuyến
						</p>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
							onClick={handleImportOrganizations}
							title="Nhập Excel"
						>
							<Upload size={18} />
							Nhập Excel
						</button>
						<button
							className="btn btn-secondary"
							onClick={handleExportOrganizations}
							title="Xuất Excel"
						>
							<FileSpreadsheet size={18} />
							Xuất Excel
						</button>
						<button
							className="btn btn-primary"
							onClick={handleAddOrganization}
						>
							<Plus size={18} />
							Thêm tổ chức
						</button>
					</div>
				</div>

				{/* Stats Overview */}
				<div style={{ 
					display: 'grid', 
					gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
					gap: '16px',
					marginBottom: '24px'
				}}>
					<StatCard
						title="Tổng tổ chức"
						value={dashboard.stats.totalOrganizations}
						subtitle={`${dashboard.stats.activeOrganizations} đang hoạt động`}
						icon={<Building2 size={24} />}
						gradient="primary"
						trend={{ value: dashboard.stats.monthlyGrowth[dashboard.stats.monthlyGrowth.length - 1]?.count || 0, isPositive: true }}
					/>
					
					<StatCard
						title="Tổng nhân viên"
						value={formatNumber(dashboard.stats.totalEmployees)}
						subtitle={`TB: ${formatNumber(dashboard.stats.averageEmployees)}/tổ chức`}
						icon={<Users size={24} />}
						gradient="accent"
						trend={{ value: 5.2, isPositive: true }}
					/>
					
					<StatCard
						title="Tổng học viên"
						value={formatNumber(dashboard.stats.totalStudents)}
						subtitle={`TB: ${formatNumber(dashboard.stats.averageStudents)}/tổ chức`}
						icon={<GraduationCap size={24} />}
						gradient="primary"
						trend={{ value: 12.8, isPositive: true }}
					/>
					
					<StatCard
						title="Tổng khóa học"
						value={dashboard.stats.totalCourses}
						subtitle={`TB: ${dashboard.stats.averageCourses}/tổ chức`}
						icon={<BookOpen size={24} />}
						gradient="accent"
						trend={{ value: 8.4, isPositive: true }}
					/>
					
					<StatCard
						title="Tổng doanh thu"
						value={formatCurrency(dashboard.stats.totalRevenue, 'VND')}
						subtitle={`${dashboard.stats.premiumOrganizations} tổ chức premium`}
						icon={<DollarSign size={24} />}
						gradient="primary"
						trend={{ value: 15.6, isPositive: true }}
					/>
					
					<StatCard
						title="Đã xác minh"
						value={dashboard.stats.verifiedOrganizations}
						subtitle={`${dashboard.stats.pendingOrganizations} chờ xác minh`}
						icon={<CheckCircle size={24} />}
						gradient="accent"
						trend={{ value: parseFloat(((dashboard.stats.verifiedOrganizations / dashboard.stats.totalOrganizations) * 100).toFixed(1)), isPositive: true }}
					/>
				</div>
			</div>

			{/* Filter Bar */}
			<OrganizationFilterBar
				filters={filters}
				updateFilter={updateFilter}
				organizations={allOrganizations}
				onClearFilters={clearFilters}
			/>

			{/* Results Summary */}
			<div style={{ 
				display: 'flex', 
				justifyContent: 'space-between', 
				alignItems: 'center', 
				marginBottom: '16px',
				padding: '12px 16px',
				background: 'var(--muted)',
				borderRadius: 'var(--radius-md)',
				border: '1px solid var(--border)'
			}}>
				<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
					<span style={{ fontSize: '14px', color: 'var(--foreground)' }}>
						Hiển thị <strong>{filteredCount}</strong> trong tổng số <strong>{totalCount}</strong> tổ chức
					</span>
					{filters.search && (
						<Badge variant="info">
							Tìm kiếm: "{filters.search}"
						</Badge>
					)}
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					<button
						className="btn btn-sm btn-outline"
						onClick={() => {/* TODO: Refresh data */}}
						disabled={loading}
					>
						<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
						Làm mới
					</button>
				</div>
			</div>

			{/* Content */}
			<div style={{
				background: 'var(--card)',
				borderRadius: 'var(--radius-lg)',
				padding: '24px',
				boxShadow: 'var(--shadow-sm)',
				minHeight: '500px'
			}}>
				<OrganizationTable
					organizations={organizations}
					onOrganizationClick={handleOrganizationClick}
					onEditOrganization={handleEditOrganization}
					onDeleteOrganization={handleDeleteOrganization}
					onToggleStatus={handleToggleOrganizationStatus}
					loading={loading}
					emptyMessage="Không có tổ chức nào phù hợp với bộ lọc"
				/>
			</div>

			{/* Organization Editor Modal */}
			<OrganizationEditorModal
				isOpen={showAddModal}
				onClose={() => {
					setShowAddModal(false)
					setEditingOrganization(null)
				}}
				onSave={handleSaveOrganization}
				editingOrganization={editingOrganization}
			/>

			{/* Organization Details Modal */}
			<Modal
				isOpen={!!selectedOrganization}
				onClose={() => setSelectedOrganization(null)}
				title={selectedOrganization?.name || 'Chi tiết tổ chức'}
				maxWidth="800px"
			>
				{selectedOrganization && (
					<div className="organization-detail-modal-content">
						<div className="organization-detail-header">
							<img src={selectedOrganization.logo} alt={selectedOrganization.name} className="organization-detail-logo" />
							<div className="organization-detail-info">
								<h2 className="organization-detail-title">{selectedOrganization.name}</h2>
								<p className="organization-detail-description">{selectedOrganization.description}</p>
								<div className="organization-detail-meta">
									<div className="meta-item">
										<Building2 size={16} />
										<span>{selectedOrganization.type}</span>
									</div>
									<div className="meta-item">
										<Globe size={16} />
										<span>{selectedOrganization.city}, {selectedOrganization.country}</span>
									</div>
									<div className="meta-item">
										<Calendar size={16} />
										<span>Thành lập: {selectedOrganization.foundedYear}</span>
									</div>
									<div className="meta-item">
										<Users size={16} />
										<span>{selectedOrganization.employees} nhân viên</span>
									</div>
								</div>
							</div>
						</div>

						<div className="organization-detail-stats">
							<div className="stat-item">
								<div className="stat-label">Học viên</div>
								<div className="stat-value">{formatNumber(selectedOrganization.students)}</div>
							</div>
							<div className="stat-item">
								<div className="stat-label">Khóa học</div>
								<div className="stat-value">{selectedOrganization.courses}</div>
							</div>
							<div className="stat-item">
								<div className="stat-label">Giảng viên</div>
								<div className="stat-value">{selectedOrganization.instructors}</div>
							</div>
							<div className="stat-item">
								<div className="stat-label">Doanh thu</div>
								<div className="stat-value">{formatCurrency(selectedOrganization.revenue, selectedOrganization.currency)}</div>
							</div>
						</div>

						<div className="organization-detail-sections">
							<div className="detail-section">
								<h3>Thông tin liên hệ</h3>
								<div className="contact-info">
									<div className="contact-item">
										<Mail size={16} />
										<span>{selectedOrganization.email}</span>
									</div>
									<div className="contact-item">
										<Phone size={16} />
										<span>{selectedOrganization.phone}</span>
									</div>
									<div className="contact-item">
										<Globe size={16} />
										<span>{selectedOrganization.website}</span>
									</div>
								</div>
							</div>

							<div className="detail-section">
								<h3>Người liên hệ</h3>
								<div className="contact-person">
									<div className="person-name">{selectedOrganization.contactPerson.name}</div>
									<div className="person-title">{selectedOrganization.contactPerson.title}</div>
									<div className="person-department">{selectedOrganization.contactPerson.department}</div>
									<div className="person-contact">
										<span>{selectedOrganization.contactPerson.email}</span>
										<span>{selectedOrganization.contactPerson.phone}</span>
									</div>
								</div>
							</div>

							<div className="detail-section">
								<h3>Gói đăng ký</h3>
								<div className="subscription-info">
									<div className="subscription-plan">{selectedOrganization.subscriptionPlan}</div>
									<div className="subscription-status">
										<Badge variant={selectedOrganization.subscriptionStatus === 'active' ? 'success' : 'danger'}>
											{selectedOrganization.subscriptionStatus}
										</Badge>
									</div>
									<div className="subscription-expiry">
										Hết hạn: {new Date(selectedOrganization.subscriptionExpiry).toLocaleDateString('vi-VN')}
									</div>
								</div>
							</div>

							{selectedOrganization.tags.length > 0 && (
								<div className="detail-section">
									<h3>Tags</h3>
									<div className="tags-container">
										{selectedOrganization.tags.map((tag: string) => (
											<Badge key={tag} variant="secondary">{tag}</Badge>
										))}
									</div>
								</div>
							)}

							{selectedOrganization.notes && (
								<div className="detail-section">
									<h3>Ghi chú</h3>
									<p className="notes-content">{selectedOrganization.notes}</p>
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