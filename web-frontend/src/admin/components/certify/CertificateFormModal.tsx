import React, { useState, useEffect } from 'react'
import { 
	CertificateTemplate, 
	CertificateForm, 
	CertificateCategory, 
	CertificateLevel,
	RequirementType,
	CertificateRequirement 
} from '../../types/certification'
import { 
	X, 
	Plus, 
	Trash2, 
	Save, 
	Upload,
	Eye,
	Palette,
	Settings,
	FileText,
	Award,
	Clock,
	CheckCircle,
	AlertTriangle
} from 'lucide-react'
import Modal from '../common/Modal'
import Badge from '../common/Badge'

interface CertificateFormModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (form: CertificateForm) => void
	editingTemplate?: CertificateTemplate | null
}

export default function CertificateFormModal({
	isOpen,
	onClose,
	onSave,
	editingTemplate
}: CertificateFormModalProps): JSX.Element {
	const [form, setForm] = useState<CertificateForm>({
		name: '',
		description: '',
		category: 'course_completion',
		level: 'beginner',
		validityPeriod: 12,
		issuer: 'EduPlatform',
		issuerLogo: '',
		requirements: [],
		templateDesign: {
			layout: 'modern',
			colors: {
				primary: '#3b82f6',
				secondary: '#1e40af',
				accent: '#f59e0b',
				text: '#1f2937',
				background: '#ffffff'
			},
			fonts: {
				title: 'Inter',
				subtitle: 'Inter',
				body: 'Inter',
				details: 'Inter'
			},
			elements: {
				logo: true,
				signature: true,
				seal: true,
				border: true,
				watermark: true,
				qrCode: true
			},
			dimensions: {
				width: 800,
				height: 600,
				unit: 'px'
			}
		},
		metadata: {
			tags: [],
			keywords: [],
			industry: [],
			prerequisites: [],
			benefits: [],
			recognition: [],
			compliance: []
		},
		isActive: true
	})

	const [activeTab, setActiveTab] = useState<'basic' | 'requirements' | 'design' | 'metadata'>('basic')
	const [newRequirement, setNewRequirement] = useState<Partial<CertificateRequirement>>({
		type: 'course_completion',
		description: '',
		value: 0,
		unit: '%',
		isMandatory: true
	})

	const [newTag, setNewTag] = useState('')
	const [newKeyword, setNewKeyword] = useState('')
	const [newIndustry, setNewIndustry] = useState('')
	const [newPrerequisite, setNewPrerequisite] = useState('')
	const [newBenefit, setNewBenefit] = useState('')
	const [newRecognition, setNewRecognition] = useState('')
	const [newCompliance, setNewCompliance] = useState('')

	useEffect(() => {
		if (editingTemplate) {
			setForm({
				name: editingTemplate.name,
				description: editingTemplate.description,
				category: editingTemplate.category,
				level: editingTemplate.level,
				validityPeriod: editingTemplate.validityPeriod,
				issuer: editingTemplate.issuer,
				issuerLogo: editingTemplate.issuerLogo,
				requirements: editingTemplate.requirements,
				templateDesign: editingTemplate.templateDesign,
				metadata: editingTemplate.metadata,
				isActive: editingTemplate.isActive
			})
		} else {
			setForm({
				name: '',
				description: '',
				category: 'course_completion',
				level: 'beginner',
				validityPeriod: 12,
				issuer: 'EduPlatform',
				issuerLogo: '',
				requirements: [],
				templateDesign: {
					layout: 'modern',
					colors: {
						primary: '#3b82f6',
						secondary: '#1e40af',
						accent: '#f59e0b',
						text: '#1f2937',
						background: '#ffffff'
					},
					fonts: {
						title: 'Inter',
						subtitle: 'Inter',
						body: 'Inter',
						details: 'Inter'
					},
					elements: {
						logo: true,
						signature: true,
						seal: true,
						border: true,
						watermark: true,
						qrCode: true
					},
					dimensions: {
						width: 800,
						height: 600,
						unit: 'px'
					}
				},
				metadata: {
					tags: [],
					keywords: [],
					industry: [],
					prerequisites: [],
					benefits: [],
					recognition: [],
					compliance: []
				},
				isActive: true
			})
		}
	}, [editingTemplate, isOpen])

	const handleSave = () => {
		if (!form.name.trim()) {
			alert('Vui lòng nhập tên chứng chỉ')
			return
		}
		if (!form.description.trim()) {
			alert('Vui lòng nhập mô tả chứng chỉ')
			return
		}
		if (form.requirements.length === 0) {
			alert('Vui lòng thêm ít nhất một yêu cầu')
			return
		}

		onSave(form)
		onClose()
	}

	const addRequirement = () => {
		if (!newRequirement.description?.trim()) {
			alert('Vui lòng nhập mô tả yêu cầu')
			return
		}

		const requirement: CertificateRequirement = {
			id: `req-${Date.now()}`,
			type: newRequirement.type as RequirementType,
			description: newRequirement.description,
			value: newRequirement.value || 0,
			unit: newRequirement.unit || '%',
			isMandatory: newRequirement.isMandatory || true
		}

		setForm(prev => ({
			...prev,
			requirements: [...prev.requirements, requirement]
		}))

		setNewRequirement({
			type: 'course_completion',
			description: '',
			value: 0,
			unit: '%',
			isMandatory: true
		})
	}

	const removeRequirement = (requirementId: string) => {
		setForm(prev => ({
			...prev,
			requirements: prev.requirements.filter(req => req.id !== requirementId)
		}))
	}

	const addToArray = (field: keyof typeof form.metadata, value: string) => {
		if (!value.trim()) return

		setForm(prev => ({
			...prev,
			metadata: {
				...prev.metadata,
				[field]: [...prev.metadata[field], value.trim()]
			}
		}))

		// Clear input
		switch (field) {
			case 'tags':
				setNewTag('')
				break
			case 'keywords':
				setNewKeyword('')
				break
			case 'industry':
				setNewIndustry('')
				break
			case 'prerequisites':
				setNewPrerequisite('')
				break
			case 'benefits':
				setNewBenefit('')
				break
			case 'recognition':
				setNewRecognition('')
				break
			case 'compliance':
				setNewCompliance('')
				break
		}
	}

	const removeFromArray = (field: keyof typeof form.metadata, index: number) => {
		setForm(prev => ({
			...prev,
			metadata: {
				...prev.metadata,
				[field]: prev.metadata[field].filter((_, i) => i !== index)
			}
		}))
	}

	const getCategoryLabel = (category: CertificateCategory) => {
		const labels: Record<CertificateCategory, string> = {
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

	const getLevelLabel = (level: CertificateLevel) => {
		const labels: Record<CertificateLevel, string> = {
			beginner: 'Cơ bản',
			intermediate: 'Trung cấp',
			advanced: 'Nâng cao',
			expert: 'Chuyên gia',
			master: 'Thạc sĩ'
		}
		return labels[level] || level
	}

	const getRequirementTypeLabel = (type: RequirementType) => {
		const labels: Record<RequirementType, string> = {
			course_completion: 'Hoàn thành khóa học',
			exam_score: 'Điểm thi',
			attendance_rate: 'Tỷ lệ tham gia',
			assignment_submission: 'Nộp bài tập',
			project_completion: 'Hoàn thành dự án',
			time_spent: 'Thời gian học',
			quiz_score: 'Điểm quiz',
			peer_review: 'Đánh giá đồng nghiệp',
			instructor_approval: 'Phê duyệt giảng viên',
			custom: 'Tùy chỉnh'
		}
		return labels[type] || type
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={editingTemplate ? 'Chỉnh sửa mẫu chứng chỉ' : 'Thêm mẫu chứng chỉ mới'}
			maxWidth="1000px"
		>
			<div className="certificate-form-modal">
				{/* Tab Navigation */}
				<div className="form-tabs">
					<button
						className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
						onClick={() => setActiveTab('basic')}
					>
						<FileText size={16} />
						Thông tin cơ bản
					</button>
					<button
						className={`tab-button ${activeTab === 'requirements' ? 'active' : ''}`}
						onClick={() => setActiveTab('requirements')}
					>
						<CheckCircle size={16} />
						Yêu cầu ({form.requirements.length})
					</button>
					<button
						className={`tab-button ${activeTab === 'design' ? 'active' : ''}`}
						onClick={() => setActiveTab('design')}
					>
						<Palette size={16} />
						Thiết kế
					</button>
					<button
						className={`tab-button ${activeTab === 'metadata' ? 'active' : ''}`}
						onClick={() => setActiveTab('metadata')}
					>
						<Settings size={16} />
						Metadata
					</button>
				</div>

				{/* Tab Content */}
				<div className="tab-content">
					{/* Basic Information Tab */}
					{activeTab === 'basic' && (
						<div className="form-section">
							<div className="form-group">
								<label>Tên chứng chỉ *</label>
								<input
									type="text"
									value={form.name}
									onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
									placeholder="Nhập tên chứng chỉ"
									className="form-input"
								/>
							</div>

							<div className="form-group">
								<label>Mô tả *</label>
								<textarea
									value={form.description}
									onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
									placeholder="Mô tả chi tiết về chứng chỉ"
									className="form-textarea"
									rows={4}
								/>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label>Danh mục *</label>
									<select
										value={form.category}
										onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as CertificateCategory }))}
										className="form-select"
									>
										{Object.values(['course_completion', 'skill_assessment', 'professional_development', 'academic_achievement', 'industry_certification', 'soft_skills', 'technical_skills', 'leadership', 'project_management', 'other'] as CertificateCategory[]).map(category => (
											<option key={category} value={category}>
												{getCategoryLabel(category)}
											</option>
										))}
									</select>
								</div>

								<div className="form-group">
									<label>Cấp độ *</label>
									<select
										value={form.level}
										onChange={(e) => setForm(prev => ({ ...prev, level: e.target.value as CertificateLevel }))}
										className="form-select"
									>
										{Object.values(['beginner', 'intermediate', 'advanced', 'expert', 'master'] as CertificateLevel[]).map(level => (
											<option key={level} value={level}>
												{getLevelLabel(level)}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label>Thời hạn (tháng) *</label>
									<input
										type="number"
										value={form.validityPeriod}
										onChange={(e) => setForm(prev => ({ ...prev, validityPeriod: parseInt(e.target.value) || 12 }))}
										min="1"
										max="120"
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Người cấp *</label>
									<input
										type="text"
										value={form.issuer}
										onChange={(e) => setForm(prev => ({ ...prev, issuer: e.target.value }))}
										placeholder="Tên tổ chức cấp chứng chỉ"
										className="form-input"
									/>
								</div>
							</div>

							<div className="form-group">
								<label>Logo người cấp</label>
								<input
									type="url"
									value={form.issuerLogo}
									onChange={(e) => setForm(prev => ({ ...prev, issuerLogo: e.target.value }))}
									placeholder="URL logo"
									className="form-input"
								/>
							</div>

							<div className="form-group">
								<label className="checkbox-label">
									<input
										type="checkbox"
										checked={form.isActive}
										onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
									/>
									<span>Kích hoạt chứng chỉ</span>
								</label>
							</div>
						</div>
					)}

					{/* Requirements Tab */}
					{activeTab === 'requirements' && (
						<div className="form-section">
							<div className="requirements-list">
								<h3>Danh sách yêu cầu</h3>
								{form.requirements.map((requirement) => (
									<div key={requirement.id} className="requirement-item">
										<div className="requirement-info">
											<div className="requirement-type">
												{getRequirementTypeLabel(requirement.type)}
											</div>
											<div className="requirement-description">
												{requirement.description}
											</div>
											<div className="requirement-details">
												<span className="requirement-value">
													{requirement.value} {requirement.unit}
												</span>
												{requirement.isMandatory && (
													<Badge variant="warning">Bắt buộc</Badge>
												)}
											</div>
										</div>
										<button
											className="btn btn-sm btn-outline btn-danger"
											onClick={() => removeRequirement(requirement.id)}
										>
											<Trash2 size={16} />
										</button>
									</div>
								))}
							</div>

							<div className="add-requirement">
								<h3>Thêm yêu cầu mới</h3>
								<div className="form-row">
									<div className="form-group">
										<label>Loại yêu cầu</label>
										<select
											value={newRequirement.type}
											onChange={(e) => setNewRequirement(prev => ({ ...prev, type: e.target.value as RequirementType }))}
											className="form-select"
										>
											{Object.values(['course_completion', 'exam_score', 'attendance_rate', 'assignment_submission', 'project_completion', 'time_spent', 'quiz_score', 'peer_review', 'instructor_approval', 'custom'] as RequirementType[]).map(type => (
												<option key={type} value={type}>
													{getRequirementTypeLabel(type)}
												</option>
											))}
										</select>
									</div>

									<div className="form-group">
										<label>Mô tả</label>
										<input
											type="text"
											value={newRequirement.description || ''}
											onChange={(e) => setNewRequirement(prev => ({ ...prev, description: e.target.value }))}
											placeholder="Mô tả yêu cầu"
											className="form-input"
										/>
									</div>
								</div>

								<div className="form-row">
									<div className="form-group">
										<label>Giá trị</label>
										<input
											type="number"
											value={newRequirement.value || 0}
											onChange={(e) => setNewRequirement(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
											className="form-input"
										/>
									</div>

									<div className="form-group">
										<label>Đơn vị</label>
										<input
											type="text"
											value={newRequirement.unit || ''}
											onChange={(e) => setNewRequirement(prev => ({ ...prev, unit: e.target.value }))}
											placeholder="%, điểm, giờ, bài..."
											className="form-input"
										/>
									</div>

									<div className="form-group">
										<label className="checkbox-label">
											<input
												type="checkbox"
												checked={newRequirement.isMandatory || false}
												onChange={(e) => setNewRequirement(prev => ({ ...prev, isMandatory: e.target.checked }))}
											/>
											<span>Bắt buộc</span>
										</label>
									</div>
								</div>

								<button
									className="btn btn-primary"
									onClick={addRequirement}
								>
									<Plus size={16} />
									Thêm yêu cầu
								</button>
							</div>
						</div>
					)}

					{/* Design Tab */}
					{activeTab === 'design' && (
						<div className="form-section">
							<div className="form-group">
								<label>Layout</label>
								<select
									value={form.templateDesign.layout}
									onChange={(e) => setForm(prev => ({
										...prev,
										templateDesign: {
											...prev.templateDesign,
											layout: e.target.value as 'classic' | 'modern' | 'minimal' | 'creative'
										}
									}))}
									className="form-select"
								>
									<option value="classic">Cổ điển</option>
									<option value="modern">Hiện đại</option>
									<option value="minimal">Tối giản</option>
									<option value="creative">Sáng tạo</option>
								</select>
							</div>

							<div className="form-group">
								<label>Màu sắc</label>
								<div className="color-inputs">
									<div className="color-input">
										<label>Màu chính</label>
										<input
											type="color"
											value={form.templateDesign.colors.primary}
											onChange={(e) => setForm(prev => ({
												...prev,
												templateDesign: {
													...prev.templateDesign,
													colors: {
														...prev.templateDesign.colors,
														primary: e.target.value
													}
												}
											}))}
										/>
									</div>
									<div className="color-input">
										<label>Màu phụ</label>
										<input
											type="color"
											value={form.templateDesign.colors.secondary}
											onChange={(e) => setForm(prev => ({
												...prev,
												templateDesign: {
													...prev.templateDesign,
													colors: {
														...prev.templateDesign.colors,
														secondary: e.target.value
													}
												}
											}))}
										/>
									</div>
									<div className="color-input">
										<label>Màu nhấn</label>
										<input
											type="color"
											value={form.templateDesign.colors.accent}
											onChange={(e) => setForm(prev => ({
												...prev,
												templateDesign: {
													...prev.templateDesign,
													colors: {
														...prev.templateDesign.colors,
														accent: e.target.value
													}
												}
											}))}
										/>
									</div>
								</div>
							</div>

							<div className="form-group">
								<label>Phần tử</label>
								<div className="element-checkboxes">
									{Object.entries(form.templateDesign.elements).map(([key, value]) => (
										<label key={key} className="checkbox-label">
											<input
												type="checkbox"
												checked={value}
												onChange={(e) => setForm(prev => ({
													...prev,
													templateDesign: {
														...prev.templateDesign,
														elements: {
															...prev.templateDesign.elements,
															[key]: e.target.checked
														}
													}
												}))}
											/>
											<span>{key === 'logo' ? 'Logo' : key === 'signature' ? 'Chữ ký' : key === 'seal' ? 'Con dấu' : key === 'border' ? 'Viền' : key === 'watermark' ? 'Watermark' : key === 'qrCode' ? 'QR Code' : key}</span>
										</label>
									))}
								</div>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label>Chiều rộng</label>
									<input
										type="number"
										value={form.templateDesign.dimensions.width}
										onChange={(e) => setForm(prev => ({
											...prev,
											templateDesign: {
												...prev.templateDesign,
												dimensions: {
													...prev.templateDesign.dimensions,
													width: parseInt(e.target.value) || 800
												}
											}
										}))}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Chiều cao</label>
									<input
										type="number"
										value={form.templateDesign.dimensions.height}
										onChange={(e) => setForm(prev => ({
											...prev,
											templateDesign: {
												...prev.templateDesign,
												dimensions: {
													...prev.templateDesign.dimensions,
													height: parseInt(e.target.value) || 600
												}
											}
										}))}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Đơn vị</label>
									<select
										value={form.templateDesign.dimensions.unit}
										onChange={(e) => setForm(prev => ({
											...prev,
											templateDesign: {
												...prev.templateDesign,
												dimensions: {
													...prev.templateDesign.dimensions,
													unit: e.target.value as 'px' | 'mm' | 'in'
												}
											}
										}))}
										className="form-select"
									>
										<option value="px">Pixel</option>
										<option value="mm">Millimeter</option>
										<option value="in">Inch</option>
									</select>
								</div>
							</div>
						</div>
					)}

					{/* Metadata Tab */}
					{activeTab === 'metadata' && (
						<div className="form-section">
							{/* Tags */}
							<div className="form-group">
								<label>Tags</label>
								<div className="array-input">
									<input
										type="text"
										value={newTag}
										onChange={(e) => setNewTag(e.target.value)}
										placeholder="Nhập tag và nhấn Enter"
										className="form-input"
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault()
												addToArray('tags', newTag)
											}
										}}
									/>
									<button
										className="btn btn-sm btn-primary"
										onClick={() => addToArray('tags', newTag)}
									>
										<Plus size={16} />
									</button>
								</div>
								<div className="array-list">
									{form.metadata.tags.map((tag, index) => (
										<Badge key={index} variant="secondary">
											{tag}
											<button
												className="remove-item"
												onClick={() => removeFromArray('tags', index)}
											>
												<X size={12} />
											</button>
										</Badge>
									))}
								</div>
							</div>

							{/* Keywords */}
							<div className="form-group">
								<label>Từ khóa</label>
								<div className="array-input">
									<input
										type="text"
										value={newKeyword}
										onChange={(e) => setNewKeyword(e.target.value)}
										placeholder="Nhập từ khóa và nhấn Enter"
										className="form-input"
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault()
												addToArray('keywords', newKeyword)
											}
										}}
									/>
									<button
										className="btn btn-sm btn-primary"
										onClick={() => addToArray('keywords', newKeyword)}
									>
										<Plus size={16} />
									</button>
								</div>
								<div className="array-list">
									{form.metadata.keywords.map((keyword, index) => (
										<Badge key={index} variant="info">
											{keyword}
											<button
												className="remove-item"
												onClick={() => removeFromArray('keywords', index)}
											>
												<X size={12} />
											</button>
										</Badge>
									))}
								</div>
							</div>

							{/* Industry */}
							<div className="form-group">
								<label>Ngành nghề</label>
								<div className="array-input">
									<input
										type="text"
										value={newIndustry}
										onChange={(e) => setNewIndustry(e.target.value)}
										placeholder="Nhập ngành nghề và nhấn Enter"
										className="form-input"
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault()
												addToArray('industry', newIndustry)
											}
										}}
									/>
									<button
										className="btn btn-sm btn-primary"
										onClick={() => addToArray('industry', newIndustry)}
									>
										<Plus size={16} />
									</button>
								</div>
								<div className="array-list">
									{form.metadata.industry.map((industry, index) => (
										<Badge key={index} variant="warning">
											{industry}
											<button
												className="remove-item"
												onClick={() => removeFromArray('industry', index)}
											>
												<X size={12} />
											</button>
										</Badge>
									))}
								</div>
							</div>

							{/* Prerequisites */}
							<div className="form-group">
								<label>Điều kiện tiên quyết</label>
								<div className="array-input">
									<input
										type="text"
										value={newPrerequisite}
										onChange={(e) => setNewPrerequisite(e.target.value)}
										placeholder="Nhập điều kiện và nhấn Enter"
										className="form-input"
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault()
												addToArray('prerequisites', newPrerequisite)
											}
										}}
									/>
									<button
										className="btn btn-sm btn-primary"
										onClick={() => addToArray('prerequisites', newPrerequisite)}
									>
										<Plus size={16} />
									</button>
								</div>
								<div className="array-list">
									{form.metadata.prerequisites.map((prerequisite, index) => (
										<Badge key={index} variant="secondary">
											{prerequisite}
											<button
												className="remove-item"
												onClick={() => removeFromArray('prerequisites', index)}
											>
												<X size={12} />
											</button>
										</Badge>
									))}
								</div>
							</div>

							{/* Benefits */}
							<div className="form-group">
								<label>Lợi ích</label>
								<div className="array-input">
									<input
										type="text"
										value={newBenefit}
										onChange={(e) => setNewBenefit(e.target.value)}
										placeholder="Nhập lợi ích và nhấn Enter"
										className="form-input"
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault()
												addToArray('benefits', newBenefit)
											}
										}}
									/>
									<button
										className="btn btn-sm btn-primary"
										onClick={() => addToArray('benefits', newBenefit)}
									>
										<Plus size={16} />
									</button>
								</div>
								<div className="array-list">
									{form.metadata.benefits.map((benefit, index) => (
										<Badge key={index} variant="success">
											{benefit}
											<button
												className="remove-item"
												onClick={() => removeFromArray('benefits', index)}
											>
												<X size={12} />
											</button>
										</Badge>
									))}
								</div>
							</div>

							{/* Recognition */}
							<div className="form-group">
								<label>Sự công nhận</label>
								<div className="array-input">
									<input
										type="text"
										value={newRecognition}
										onChange={(e) => setNewRecognition(e.target.value)}
										placeholder="Nhập sự công nhận và nhấn Enter"
										className="form-input"
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault()
												addToArray('recognition', newRecognition)
											}
										}}
									/>
									<button
										className="btn btn-sm btn-primary"
										onClick={() => addToArray('recognition', newRecognition)}
									>
										<Plus size={16} />
									</button>
								</div>
								<div className="array-list">
									{form.metadata.recognition.map((recognition, index) => (
										<Badge key={index} variant="info">
											{recognition}
											<button
												className="remove-item"
												onClick={() => removeFromArray('recognition', index)}
											>
												<X size={12} />
											</button>
										</Badge>
									))}
								</div>
							</div>

							{/* Compliance */}
							<div className="form-group">
								<label>Tuân thủ</label>
								<div className="array-input">
									<input
										type="text"
										value={newCompliance}
										onChange={(e) => setNewCompliance(e.target.value)}
										placeholder="Nhập tiêu chuẩn tuân thủ và nhấn Enter"
										className="form-input"
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault()
												addToArray('compliance', newCompliance)
											}
										}}
									/>
									<button
										className="btn btn-sm btn-primary"
										onClick={() => addToArray('compliance', newCompliance)}
									>
										<Plus size={16} />
									</button>
								</div>
								<div className="array-list">
									{form.metadata.compliance.map((compliance, index) => (
										<Badge key={index} variant="danger">
											{compliance}
											<button
												className="remove-item"
												onClick={() => removeFromArray('compliance', index)}
											>
												<X size={12} />
											</button>
										</Badge>
									))}
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="modal-actions">
					<button
						className="btn btn-secondary"
						onClick={onClose}
					>
						Hủy
					</button>
					<button
						className="btn btn-primary"
						onClick={handleSave}
					>
						<Save size={16} />
						{editingTemplate ? 'Cập nhật' : 'Tạo mới'}
					</button>
				</div>
			</div>
		</Modal>
	)
}
