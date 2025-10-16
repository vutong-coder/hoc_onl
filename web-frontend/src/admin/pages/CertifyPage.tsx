import React, { useState, useRef } from 'react'
import {
	Award,
	Plus,
	RefreshCw,
	Download,
	Upload,
	FileSpreadsheet,
	FileText,
	Eye,
	Edit,
	Trash2,
	Copy,
	Users,
	Building2,
	BookOpen,
	Calendar,
	Clock,
	CheckCircle,
	AlertTriangle,
	TrendingUp,
	BarChart3,
	List,
	Grid3X3
} from 'lucide-react'
import useCertifications from '../hooks/useCertifications'
import CatalogTable from '../components/certify/CatalogTable'
import IssuedTable from '../components/certify/IssuedTable'
import CertificateFormModal from '../components/certify/CertificateFormModal'
import Modal from '../components/common/Modal'
import Badge from '../components/common/Badge'
import StatCard from '../components/common/StatCard'
import { CertificateForm, IssuedCertificate } from '../types/certification'
import { 
	exportCertificatesToExcel,
	importCertificatesFromExcel,
	generateCertificateExcelTemplate
} from '../utils/certificateExcelHelpers'
import '../styles/common.css'
import '../styles/certify.css'

export default function CertifyPage(): JSX.Element {
	const {
		templates,
		allTemplates,
		issuedCertificates,
		allIssuedCertificates,
		dashboard,
		filters,
		updateFilter,
		clearFilters,
		addTemplate,
		updateTemplate,
		deleteTemplate,
		duplicateTemplate,
		toggleTemplateStatus,
		addIssuedCertificate,
		updateIssuedCertificate,
		deleteIssuedCertificate,
		toggleCertificateStatus,
		loading,
		totalTemplates,
		totalIssuedCertificates,
		filteredTemplatesCount,
		filteredIssuedCertificatesCount
	} = useCertifications()

	const [activeTab, setActiveTab] = useState<'catalog' | 'issued'>('catalog')
	const [showAddModal, setShowAddModal] = useState(false)
	const [editingTemplate, setEditingTemplate] = useState<any>(null)
	const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
	const [selectedCertificate, setSelectedCertificate] = useState<any>(null)
	const [showStats, setShowStats] = useState(true)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleAddTemplate = () => {
		setEditingTemplate(null)
		setShowAddModal(true)
	}

	const handleEditTemplate = (template: any) => {
		setEditingTemplate(template)
		setShowAddModal(true)
	}

	const handleDeleteTemplate = (templateId: string) => {
		if (window.confirm('Bạn có chắc chắn muốn xóa mẫu chứng chỉ này?')) {
			deleteTemplate(templateId)
		}
	}

	const handleDuplicateTemplate = (template: any) => {
		duplicateTemplate(template)
		alert('Đã nhân bản mẫu chứng chỉ thành công!')
	}

	const handleViewTemplate = (template: any) => {
		setSelectedTemplate(template)
	}

	const handleSaveTemplate = (templateForm: any) => {
		if (editingTemplate) {
			updateTemplate(templateForm, editingTemplate.id)
		} else {
			addTemplate(templateForm)
		}
		setShowAddModal(false)
		setEditingTemplate(null)
	}

	// Certificate operations
	const handleEditCertificate = (certificate: any) => {
		setSelectedCertificate(certificate)
	}

	const handleDeleteCertificate = (certificateId: string) => {
		if (window.confirm('Bạn có chắc chắn muốn xóa chứng chỉ này?')) {
			deleteIssuedCertificate(certificateId)
		}
	}

	const handleViewCertificate = (certificate: any) => {
		setSelectedCertificate(certificate)
	}

	const handleDownloadCertificate = (certificate: any) => {
		if (certificate.downloadUrl) {
			window.open(certificate.downloadUrl, '_blank')
		} else {
			alert('Chứng chỉ chưa có file để tải xuống')
		}
	}

	const handleToggleCertificateStatus = (certificateId: string, newStatus: any) => {
		toggleCertificateStatus(certificateId, newStatus)
	}

	// Excel Export Functions
	const handleExportTemplates = () => {
		try {
			const filename = `certificate-templates-${new Date().toISOString().split('T')[0]}.xlsx`
			exportCertificatesToExcel(templates, filename, 'templates')
			alert('Đã xuất file Excel thành công!')
		} catch (error) {
			console.error('Export error:', error)
			alert('Có lỗi xảy ra khi xuất file Excel')
		}
	}

	const handleExportCertificates = () => {
		try {
			const filename = `issued-certificates-${new Date().toISOString().split('T')[0]}.xlsx`
			exportCertificatesToExcel(issuedCertificates, filename, 'certificates')
			alert('Đã xuất file Excel thành công!')
		} catch (error) {
			console.error('Export error:', error)
			alert('Có lỗi xảy ra khi xuất file Excel')
		}
	}

	// Excel Import Functions
	const handleImportTemplates = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		try {
			const importedData = await importCertificatesFromExcel(file, activeTab === 'catalog' ? 'templates' : 'certificates')

			if (activeTab === 'catalog') {
				// Process imported templates
				for (const templateForm of importedData as CertificateForm[]) {
					addTemplate(templateForm)
				}
				alert(`Đã nhập thành công ${importedData.length} mẫu chứng chỉ`)
			} else {
				// Process imported certificates
				for (const certificateData of importedData as Partial<IssuedCertificate>[]) {
					addIssuedCertificate(certificateData)
				}
				alert(`Đã nhập thành công ${importedData.length} chứng chỉ`)
			}
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
		generateCertificateExcelTemplate(activeTab === 'catalog' ? 'templates' : 'certificates')
		alert('Đã tải template Excel thành công!')
	}

	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
		return num.toString()
	}

	const getCategoryLabel = (category: string) => {
		const labels: Record<string, string> = {
			course_completion: 'Hoàn thành khóa học',
			skill_assessment: 'Đánh giá kỹ năng',
			professional_development: 'Phát triển chuyên môn',
			academic_achievement: 'Thành tích học thuật',
			industry_certification: 'Chứng chỉ ngành',
			soft_skills: 'Kỹ năng mềm',
			technical_skills: 'Kỹ năng kỹ thuật',
			leadership: 'Lãnh đạo',
			project_management: 'Quản lý dự án',
			other: 'Khác'
		}
		return labels[category] || category
	}

	const getLevelLabel = (level: string) => {
		const labels: Record<string, string> = {
			beginner: 'Cơ bản',
			intermediate: 'Trung cấp',
			advanced: 'Nâng cao',
			expert: 'Chuyên gia',
			master: 'Thạc sĩ'
		}
		return labels[level] || level
	}

	return (
		<div className="certify-page">
			{/* Header */}
			<div className="certify-header">
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
					<div>
						<div className="certify-title">
							<Award size={32} />
							<h1>Quản lý Chứng chỉ</h1>
						</div>
						<p className="certify-subtitle">
							Quản lý mẫu chứng chỉ và theo dõi các chứng chỉ đã cấp
						</p>
					</div>

					<div className="certify-actions">
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
							onClick={handleImportTemplates}
							title="Nhập Excel"
						>
							<Upload size={18} />
							Nhập Excel
						</button>
						<button
							className="btn btn-secondary"
							onClick={activeTab === 'catalog' ? handleExportTemplates : handleExportCertificates}
							title="Xuất Excel"
						>
							<FileSpreadsheet size={18} />
							Xuất Excel
						</button>
						<button
							className="btn btn-primary"
							onClick={handleAddTemplate}
						>
							<Plus size={18} />
							Thêm mẫu chứng chỉ
						</button>
					</div>
				</div>

				{/* Stats Overview */}
				{showStats && (
					<div className="certify-stats-grid">
						<StatCard
							title="Tổng mẫu chứng chỉ"
							value={dashboard.stats.totalTemplates}
							subtitle={`${dashboard.stats.activeTemplates} đang hoạt động`}
							icon={<Award size={24} />}
							gradient="primary"
							trend={{ value: dashboard.stats.totalTemplates > 0 ? 5.2 : 0, isPositive: true }}
						/>
						
						<StatCard
							title="Chứng chỉ đã cấp"
							value={dashboard.stats.totalIssued}
							subtitle={`${dashboard.stats.activeCertificates} đang hoạt động`}
							icon={<CheckCircle size={24} />}
							gradient="accent"
							trend={{ value: dashboard.stats.totalIssued > 0 ? 12.8 : 0, isPositive: true }}
						/>
						
						<StatCard
							title="Người nhận"
							value={formatNumber(dashboard.stats.totalRecipients)}
							subtitle={`${dashboard.stats.totalOrganizations} tổ chức`}
							icon={<Users size={24} />}
							gradient="primary"
							trend={{ value: dashboard.stats.totalRecipients > 0 ? 8.4 : 0, isPositive: true }}
						/>
						
						<StatCard
							title="Chứng chỉ hết hạn"
							value={dashboard.stats.expiredCertificates}
							subtitle={`${dashboard.stats.pendingCertificates} chờ duyệt`}
							icon={<AlertTriangle size={24} />}
							gradient="accent"
							trend={{ value: dashboard.stats.expiredCertificates > 0 ? -2.1 : 0, isPositive: false }}
						/>
						
						<StatCard
							title="Danh mục phổ biến"
							value={getCategoryLabel(dashboard.stats.mostPopularCategory)}
							subtitle={`Cấp độ: ${getLevelLabel(dashboard.stats.mostPopularLevel)}`}
							icon={<TrendingUp size={24} />}
							gradient="primary"
							trend={{ value: 15.6, isPositive: true }}
						/>
						
						<StatCard
							title="Thời hạn TB"
							value={`${dashboard.stats.averageValidityPeriod.toFixed(0)} tháng`}
							subtitle="Thời hạn trung bình"
							icon={<Clock size={24} />}
							gradient="accent"
							trend={{ value: 3.2, isPositive: true }}
						/>
					</div>
				)}
			</div>

			{/* Tab Navigation */}
			<div className="certify-tabs">
				<button
					className={`certify-tab ${activeTab === 'catalog' ? 'active' : ''}`}
					onClick={() => setActiveTab('catalog')}
				>
					<Award size={16} />
					Danh mục mẫu ({totalTemplates})
				</button>
				<button
					className={`certify-tab ${activeTab === 'issued' ? 'active' : ''}`}
					onClick={() => setActiveTab('issued')}
				>
					<CheckCircle size={16} />
					Chứng chỉ đã cấp ({totalIssuedCertificates})
				</button>
			</div>

			{/* Tab Content */}
			<div className="certify-tab-content">
				{activeTab === 'catalog' && (
					<CatalogTable
						templates={templates}
						onEditTemplate={handleEditTemplate}
						onDeleteTemplate={handleDeleteTemplate}
						onViewTemplate={handleViewTemplate}
						onDuplicateTemplate={handleDuplicateTemplate}
						loading={loading}
						emptyMessage="Không có mẫu chứng chỉ nào phù hợp với bộ lọc"
					/>
				)}

				{activeTab === 'issued' && (
					<IssuedTable
						certificates={issuedCertificates}
						onEditCertificate={handleEditCertificate}
						onDeleteCertificate={handleDeleteCertificate}
						onViewCertificate={handleViewCertificate}
						onDownloadCertificate={handleDownloadCertificate}
						onToggleStatus={handleToggleCertificateStatus}
						loading={loading}
						emptyMessage="Không có chứng chỉ nào phù hợp với bộ lọc"
					/>
				)}
			</div>

			{/* Template Form Modal */}
			<CertificateFormModal
				isOpen={showAddModal}
				onClose={() => {
					setShowAddModal(false)
					setEditingTemplate(null)
				}}
				onSave={handleSaveTemplate}
				editingTemplate={editingTemplate}
			/>

			{/* Template Details Modal */}
			<Modal
				isOpen={!!selectedTemplate}
				onClose={() => setSelectedTemplate(null)}
				title={selectedTemplate?.name || 'Chi tiết mẫu chứng chỉ'}
				maxWidth="800px"
			>
				{selectedTemplate && (
					<div className="template-detail-modal-content">
						<div className="template-detail-header">
							<div className="template-detail-info">
								<h2 className="template-detail-title">{selectedTemplate.name}</h2>
								<p className="template-detail-description">{selectedTemplate.description}</p>
								<div className="template-detail-meta">
									<div className="meta-item">
										<Award size={16} />
										<span>{selectedTemplate.issuer}</span>
									</div>
									<div className="meta-item">
										<Badge variant="secondary">
											{getCategoryLabel(selectedTemplate.category)}
										</Badge>
									</div>
									<div className="meta-item">
										<Badge variant="secondary">
											{getLevelLabel(selectedTemplate.level)}
										</Badge>
									</div>
									<div className="meta-item">
										<Clock size={16} />
										<span>{selectedTemplate.validityPeriod} tháng</span>
									</div>
								</div>
							</div>
						</div>

						<div className="template-detail-sections">
							<div className="detail-section">
								<h3>Yêu cầu</h3>
								<div className="requirements-list">
									{selectedTemplate.requirements.map((req: any) => (
										<div key={req.id} className="requirement-item">
											<div className="requirement-info">
												<div className="requirement-type">{req.type}</div>
												<div className="requirement-description">{req.description}</div>
												<div className="requirement-details">
													<span className="requirement-value">
														{req.value} {req.unit}
													</span>
													{req.isMandatory && (
														<Badge variant="warning">Bắt buộc</Badge>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="detail-section">
								<h3>Thiết kế</h3>
								<div className="design-info">
									<div className="design-item">
										<strong>Layout:</strong> {selectedTemplate.templateDesign.layout}
									</div>
									<div className="design-item">
										<strong>Kích thước:</strong> {selectedTemplate.templateDesign.dimensions.width}x{selectedTemplate.templateDesign.dimensions.height} {selectedTemplate.templateDesign.dimensions.unit}
									</div>
									<div className="design-item">
										<strong>Màu chính:</strong> 
										<span 
											className="color-preview" 
											style={{ backgroundColor: selectedTemplate.templateDesign.colors.primary }}
										></span>
										{selectedTemplate.templateDesign.colors.primary}
									</div>
								</div>
							</div>

							{selectedTemplate.metadata.tags.length > 0 && (
								<div className="detail-section">
									<h3>Tags</h3>
									<div className="tags-container">
										{selectedTemplate.metadata.tags.map((tag: string) => (
											<Badge key={tag} variant="secondary">{tag}</Badge>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</Modal>

			{/* Certificate Details Modal */}
			<Modal
				isOpen={!!selectedCertificate}
				onClose={() => setSelectedCertificate(null)}
				title={selectedCertificate?.certificateName || 'Chi tiết chứng chỉ'}
				maxWidth="800px"
			>
				{selectedCertificate && (
					<div className="certificate-detail-modal-content">
						<div className="certificate-detail-header">
							<div className="certificate-detail-info">
								<h2 className="certificate-detail-title">{selectedCertificate.certificateName}</h2>
								<div className="certificate-detail-meta">
									<div className="meta-item">
										<Users size={16} />
										<span>{selectedCertificate.recipientName}</span>
									</div>
									<div className="meta-item">
										<Building2 size={16} />
										<span>{selectedCertificate.organizationName}</span>
									</div>
									<div className="meta-item">
										<Calendar size={16} />
										<span>Cấp ngày: {new Date(selectedCertificate.issuedAt).toLocaleDateString('vi-VN')}</span>
									</div>
									<div className="meta-item">
										<Clock size={16} />
										<span>Hết hạn: {new Date(selectedCertificate.expiresAt).toLocaleDateString('vi-VN')}</span>
									</div>
								</div>
							</div>
						</div>

						<div className="certificate-detail-sections">
							<div className="detail-section">
								<h3>Thông tin xác minh</h3>
								<div className="verification-info">
									<div className="verification-item">
										<strong>Mã xác minh:</strong> {selectedCertificate.verificationCode}
									</div>
									<div className="verification-item">
										<strong>URL xác minh:</strong> 
										<a href={selectedCertificate.metadata.verificationUrl} target="_blank" rel="noopener noreferrer">
											{selectedCertificate.metadata.verificationUrl}
										</a>
									</div>
									{selectedCertificate.blockchainHash && (
										<div className="verification-item">
											<strong>Blockchain Hash:</strong> 
											<span className="blockchain-hash">{selectedCertificate.blockchainHash}</span>
										</div>
									)}
								</div>
							</div>

							<div className="detail-section">
								<h3>Kết quả học tập</h3>
								<div className="score-info">
									<div className="score-item">
										<strong>Điểm số:</strong> {selectedCertificate.metadata.score}/100
									</div>
									<div className="score-item">
										<strong>Xếp loại:</strong> {selectedCertificate.metadata.grade}
									</div>
									<div className="score-item">
										<strong>Người cấp:</strong> {selectedCertificate.metadata.issuedBy}
									</div>
									<div className="score-item">
										<strong>Chức vụ:</strong> {selectedCertificate.metadata.issuedByTitle}
									</div>
								</div>
							</div>

							{selectedCertificate.courseName && (
								<div className="detail-section">
									<h3>Khóa học</h3>
									<div className="course-info">
										<div className="course-item">
											<BookOpen size={16} />
											<span>{selectedCertificate.courseName}</span>
										</div>
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