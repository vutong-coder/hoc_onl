import React from 'react'
import { Organization, OrganizationForm, OrganizationType, OrganizationStatus, OrganizationSize, SubscriptionPlan } from '../../types/organization'
import { Building2, Users, Globe, Mail, Phone, MapPin, Calendar, DollarSign, Tag, FileText, X } from 'lucide-react'
import '../../styles/form.css'
import '../../styles/organizations.css'

interface OrganizationEditorModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (organization: OrganizationForm) => void
	editingOrganization?: Organization | null
}

const OrganizationEditorModal: React.FC<OrganizationEditorModalProps> = ({
	isOpen,
	onClose,
	onSave,
	editingOrganization
}) => {
	const [formData, setFormData] = React.useState<OrganizationForm>({
		name: '',
		description: '',
		shortDescription: '',
		logo: '',
		website: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		country: '',
		postalCode: '',
		type: 'other',
		status: 'pending',
		size: 'small',
		industry: '',
		foundedYear: new Date().getFullYear(),
		revenue: 0,
		currency: 'VND',
		employees: 0,
		subscriptionPlan: 'free',
		contactPerson: {
			name: '',
			title: '',
			email: '',
			phone: '',
			department: '',
			isPrimary: true
		},
		socialMedia: {
			website: '',
			facebook: '',
			twitter: '',
			linkedin: '',
			youtube: '',
			instagram: ''
		},
		tags: [],
		notes: ''
	})

	const [newTag, setNewTag] = React.useState('')

	React.useEffect(() => {
		if (editingOrganization) {
			setFormData({
				name: editingOrganization.name,
				description: editingOrganization.description,
				shortDescription: editingOrganization.shortDescription,
				logo: editingOrganization.logo,
				website: editingOrganization.website,
				email: editingOrganization.email,
				phone: editingOrganization.phone,
				address: editingOrganization.address,
				city: editingOrganization.city,
				country: editingOrganization.country,
				postalCode: editingOrganization.postalCode,
				type: editingOrganization.type,
				status: editingOrganization.status,
				size: editingOrganization.size,
				industry: editingOrganization.industry,
				foundedYear: editingOrganization.foundedYear,
				revenue: editingOrganization.revenue,
				currency: editingOrganization.currency,
				employees: editingOrganization.employees,
				subscriptionPlan: editingOrganization.subscriptionPlan,
				contactPerson: editingOrganization.contactPerson,
				socialMedia: editingOrganization.socialMedia,
				tags: editingOrganization.tags,
				notes: editingOrganization.notes
			})
		} else {
			// Reset form for new organization
			setFormData({
				name: '',
				description: '',
				shortDescription: '',
				logo: '',
				website: '',
				email: '',
				phone: '',
				address: '',
				city: '',
				country: '',
				postalCode: '',
				type: 'other',
				status: 'pending',
				size: 'small',
				industry: '',
				foundedYear: new Date().getFullYear(),
				revenue: 0,
				currency: 'VND',
				employees: 0,
				subscriptionPlan: 'free',
				contactPerson: {
					name: '',
					title: '',
					email: '',
					phone: '',
					department: '',
					isPrimary: true
				},
				socialMedia: {
					website: '',
					facebook: '',
					twitter: '',
					linkedin: '',
					youtube: '',
					instagram: ''
				},
				tags: [],
				notes: ''
			})
		}
	}, [editingOrganization, isOpen])

	const handleInputChange = (field: keyof OrganizationForm, value: any) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handleContactPersonChange = (field: keyof OrganizationForm['contactPerson'], value: any) => {
		setFormData(prev => ({
			...prev,
			contactPerson: { ...prev.contactPerson, [field]: value }
		}))
	}

	const handleSocialMediaChange = (field: keyof OrganizationForm['socialMedia'], value: any) => {
		setFormData(prev => ({
			...prev,
			socialMedia: { ...prev.socialMedia, [field]: value }
		}))
	}

	const handleAddTag = () => {
		if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
			setFormData(prev => ({
				...prev,
				tags: [...prev.tags, newTag.trim()]
			}))
			setNewTag('')
		}
	}

	const handleRemoveTag = (tagToRemove: string) => {
		setFormData(prev => ({
			...prev,
			tags: prev.tags.filter(tag => tag !== tagToRemove)
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSave(formData)
	}

	const organizationTypes: { value: OrganizationType; label: string }[] = [
		{ value: 'university', label: 'Đại học' },
		{ value: 'college', label: 'Cao đẳng' },
		{ value: 'school', label: 'Trường học' },
		{ value: 'training_center', label: 'Trung tâm đào tạo' },
		{ value: 'corporate', label: 'Doanh nghiệp' },
		{ value: 'ngo', label: 'Tổ chức phi lợi nhuận' },
		{ value: 'government', label: 'Cơ quan nhà nước' },
		{ value: 'startup', label: 'Startup' },
		{ value: 'enterprise', label: 'Tập đoàn' },
		{ value: 'other', label: 'Khác' }
	]

	const organizationStatuses: { value: OrganizationStatus; label: string }[] = [
		{ value: 'active', label: 'Hoạt động' },
		{ value: 'inactive', label: 'Không hoạt động' },
		{ value: 'suspended', label: 'Tạm dừng' },
		{ value: 'pending', label: 'Chờ duyệt' },
		{ value: 'archived', label: 'Lưu trữ' }
	]

	const organizationSizes: { value: OrganizationSize; label: string }[] = [
		{ value: 'startup', label: '1-10 nhân viên' },
		{ value: 'small', label: '11-50 nhân viên' },
		{ value: 'medium', label: '51-200 nhân viên' },
		{ value: 'large', label: '201-1000 nhân viên' },
		{ value: 'enterprise', label: '1000+ nhân viên' }
	]

	const subscriptionPlans: { value: SubscriptionPlan; label: string }[] = [
		{ value: 'free', label: 'Miễn phí' },
		{ value: 'basic', label: 'Cơ bản' },
		{ value: 'professional', label: 'Chuyên nghiệp' },
		{ value: 'enterprise', label: 'Doanh nghiệp' },
		{ value: 'custom', label: 'Tùy chỉnh' }
	]

	if (!isOpen) return null

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content organization-editor-modal" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h2 className="modal-title">
						<Building2 size={24} />
						{editingOrganization ? 'Chỉnh sửa tổ chức' : 'Thêm tổ chức mới'}
					</h2>
					<button className="modal-close" onClick={onClose}>
						<X size={24} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="modal-body">
					<div className="form-sections">
						{/* Basic Information */}
						<div className="form-section">
							<h3 className="section-title">
								<Building2 size={18} />
								Thông tin cơ bản
							</h3>
							<div className="form-grid">
								<div className="form-group">
									<label>Tên tổ chức *</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) => handleInputChange('name', e.target.value)}
										className="form-input"
										required
									/>
								</div>

								<div className="form-group">
									<label>Mô tả ngắn *</label>
									<input
										type="text"
										value={formData.shortDescription}
										onChange={(e) => handleInputChange('shortDescription', e.target.value)}
										className="form-input"
										required
									/>
								</div>

								<div className="form-group full-width">
									<label>Mô tả chi tiết</label>
									<textarea
										value={formData.description}
										onChange={(e) => handleInputChange('description', e.target.value)}
										className="form-textarea"
										rows={3}
									/>
								</div>

								<div className="form-group">
									<label>Logo URL</label>
									<input
										type="url"
										value={formData.logo}
										onChange={(e) => handleInputChange('logo', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Website</label>
									<input
										type="url"
										value={formData.website}
										onChange={(e) => handleInputChange('website', e.target.value)}
										className="form-input"
									/>
								</div>
							</div>
						</div>

						{/* Contact Information */}
						<div className="form-section">
							<h3 className="section-title">
								<Mail size={18} />
								Thông tin liên hệ
							</h3>
							<div className="form-grid">
								<div className="form-group">
									<label>Email *</label>
									<input
										type="email"
										value={formData.email}
										onChange={(e) => handleInputChange('email', e.target.value)}
										className="form-input"
										required
									/>
								</div>

								<div className="form-group">
									<label>Số điện thoại</label>
									<input
										type="tel"
										value={formData.phone}
										onChange={(e) => handleInputChange('phone', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group full-width">
									<label>Địa chỉ</label>
									<input
										type="text"
										value={formData.address}
										onChange={(e) => handleInputChange('address', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Thành phố</label>
									<input
										type="text"
										value={formData.city}
										onChange={(e) => handleInputChange('city', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Quốc gia</label>
									<input
										type="text"
										value={formData.country}
										onChange={(e) => handleInputChange('country', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Mã bưu điện</label>
									<input
										type="text"
										value={formData.postalCode}
										onChange={(e) => handleInputChange('postalCode', e.target.value)}
										className="form-input"
									/>
								</div>
							</div>
						</div>

						{/* Organization Details */}
						<div className="form-section">
							<h3 className="section-title">
								<Globe size={18} />
								Chi tiết tổ chức
							</h3>
							<div className="form-grid">
								<div className="form-group">
									<label>Loại tổ chức</label>
									<select
										value={formData.type}
										onChange={(e) => handleInputChange('type', e.target.value as OrganizationType)}
										className="form-select"
									>
										{organizationTypes.map(type => (
											<option key={type.value} value={type.value}>{type.label}</option>
										))}
									</select>
								</div>

								<div className="form-group">
									<label>Trạng thái</label>
									<select
										value={formData.status}
										onChange={(e) => handleInputChange('status', e.target.value as OrganizationStatus)}
										className="form-select"
									>
										{organizationStatuses.map(status => (
											<option key={status.value} value={status.value}>{status.label}</option>
										))}
									</select>
								</div>

								<div className="form-group">
									<label>Quy mô</label>
									<select
										value={formData.size}
										onChange={(e) => handleInputChange('size', e.target.value as OrganizationSize)}
										className="form-select"
									>
										{organizationSizes.map(size => (
											<option key={size.value} value={size.value}>{size.label}</option>
										))}
									</select>
								</div>

								<div className="form-group">
									<label>Ngành</label>
									<input
										type="text"
										value={formData.industry}
										onChange={(e) => handleInputChange('industry', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Năm thành lập</label>
									<input
										type="number"
										value={formData.foundedYear}
										onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value))}
										className="form-input"
										min="1800"
										max={new Date().getFullYear()}
									/>
								</div>

								<div className="form-group">
									<label>Số nhân viên</label>
									<input
										type="number"
										value={formData.employees}
										onChange={(e) => handleInputChange('employees', parseInt(e.target.value) || 0)}
										className="form-input"
										min="0"
									/>
								</div>

								<div className="form-group">
									<label>Doanh thu</label>
									<input
										type="number"
										value={formData.revenue}
										onChange={(e) => handleInputChange('revenue', parseInt(e.target.value) || 0)}
										className="form-input"
										min="0"
									/>
								</div>

								<div className="form-group">
									<label>Đơn vị tiền tệ</label>
									<select
										value={formData.currency}
										onChange={(e) => handleInputChange('currency', e.target.value)}
										className="form-select"
									>
										<option value="VND">VND</option>
										<option value="USD">USD</option>
										<option value="EUR">EUR</option>
									</select>
								</div>

								<div className="form-group">
									<label>Gói đăng ký</label>
									<select
										value={formData.subscriptionPlan}
										onChange={(e) => handleInputChange('subscriptionPlan', e.target.value as SubscriptionPlan)}
										className="form-select"
									>
										{subscriptionPlans.map(plan => (
											<option key={plan.value} value={plan.value}>{plan.label}</option>
										))}
									</select>
								</div>
							</div>
						</div>

						{/* Contact Person */}
						<div className="form-section">
							<h3 className="section-title">
								<Users size={18} />
								Người liên hệ
							</h3>
							<div className="form-grid">
								<div className="form-group">
									<label>Tên người liên hệ</label>
									<input
										type="text"
										value={formData.contactPerson.name}
										onChange={(e) => handleContactPersonChange('name', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Chức vụ</label>
									<input
										type="text"
										value={formData.contactPerson.title}
										onChange={(e) => handleContactPersonChange('title', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Email liên hệ</label>
									<input
										type="email"
										value={formData.contactPerson.email}
										onChange={(e) => handleContactPersonChange('email', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Số điện thoại liên hệ</label>
									<input
										type="tel"
										value={formData.contactPerson.phone}
										onChange={(e) => handleContactPersonChange('phone', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Phòng ban</label>
									<input
										type="text"
										value={formData.contactPerson.department}
										onChange={(e) => handleContactPersonChange('department', e.target.value)}
										className="form-input"
									/>
								</div>
							</div>
						</div>

						{/* Social Media */}
						<div className="form-section">
							<h3 className="section-title">
								<Globe size={18} />
								Mạng xã hội
							</h3>
							<div className="form-grid">
								<div className="form-group">
									<label>Facebook</label>
									<input
										type="url"
										value={formData.socialMedia.facebook || ''}
										onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Twitter</label>
									<input
										type="url"
										value={formData.socialMedia.twitter || ''}
										onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>LinkedIn</label>
									<input
										type="url"
										value={formData.socialMedia.linkedin || ''}
										onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>YouTube</label>
									<input
										type="url"
										value={formData.socialMedia.youtube || ''}
										onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
										className="form-input"
									/>
								</div>

								<div className="form-group">
									<label>Instagram</label>
									<input
										type="url"
										value={formData.socialMedia.instagram || ''}
										onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
										className="form-input"
									/>
								</div>
							</div>
						</div>

						{/* Tags */}
						<div className="form-section">
							<h3 className="section-title">
								<Tag size={18} />
								Tags
							</h3>
							<div className="form-group">
								<div className="tag-input-group">
									<input
										type="text"
										value={newTag}
										onChange={(e) => setNewTag(e.target.value)}
										onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
										className="form-input"
										placeholder="Nhập tag và nhấn Enter"
									/>
									<button type="button" onClick={handleAddTag} className="btn btn-primary">
										Thêm
									</button>
								</div>
								<div className="tags-container">
									{formData.tags.map(tag => (
										<span key={tag} className="tag">
											{tag}
											<button type="button" onClick={() => handleRemoveTag(tag)} className="tag-remove">
												<X size={12} />
											</button>
										</span>
									))}
								</div>
							</div>
						</div>

						{/* Notes */}
						<div className="form-section">
							<h3 className="section-title">
								<FileText size={18} />
								Ghi chú
							</h3>
							<div className="form-group">
								<textarea
									value={formData.notes}
									onChange={(e) => handleInputChange('notes', e.target.value)}
									className="form-textarea"
									rows={4}
									placeholder="Ghi chú về tổ chức..."
								/>
							</div>
						</div>
					</div>

					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" onClick={onClose}>
							Hủy
						</button>
						<button type="submit" className="btn btn-primary">
							{editingOrganization ? 'Cập nhật' : 'Tạo mới'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default OrganizationEditorModal
