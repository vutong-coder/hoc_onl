import React from 'react'
import { Building2, Globe, Calendar, Users, Mail, Phone } from 'lucide-react'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'

interface OrganizationDetailModalProps {
	isOpen: boolean
	onClose: () => void
	organization: any
}

const OrganizationDetailModal: React.FC<OrganizationDetailModalProps> = ({
	isOpen,
	onClose,
	organization
}) => {
	if (!organization) return null

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

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={organization.name || 'Chi tiết tổ chức'}
			maxWidth="800px"
		>
			<div className="organization-detail-modal-content">
				<div className="organization-detail-header">
					<img src={organization.logo} alt={organization.name} className="organization-detail-logo" />
					<div className="organization-detail-info">
						<h2 className="organization-detail-title">{organization.name}</h2>
						<p className="organization-detail-description">{organization.description}</p>
						<div className="organization-detail-meta">
							<div className="meta-item">
								<Building2 size={16} />
								<span>{organization.type}</span>
							</div>
							<div className="meta-item">
								<Globe size={16} />
								<span>{organization.city}, {organization.country}</span>
							</div>
							<div className="meta-item">
								<Calendar size={16} />
								<span>Thành lập: {organization.foundedYear}</span>
							</div>
							<div className="meta-item">
								<Users size={16} />
								<span>{organization.employees} nhân viên</span>
							</div>
						</div>
					</div>
				</div>

				<div className="organization-detail-stats">
					<div className="stat-item">
						<div className="stat-label">Học viên</div>
						<div className="stat-value">{formatNumber(organization.students)}</div>
					</div>
					<div className="stat-item">
						<div className="stat-label">Khóa học</div>
						<div className="stat-value">{organization.courses}</div>
					</div>
					<div className="stat-item">
						<div className="stat-label">Giảng viên</div>
						<div className="stat-value">{organization.instructors}</div>
					</div>
					<div className="stat-item">
						<div className="stat-label">Doanh thu</div>
						<div className="stat-value">{formatCurrency(organization.revenue, organization.currency)}</div>
					</div>
				</div>

				<div className="organization-detail-sections">
					<div className="detail-section">
						<h3>Thông tin liên hệ</h3>
						<div className="contact-info">
							<div className="contact-item">
								<Mail size={16} />
								<span>{organization.email}</span>
							</div>
							<div className="contact-item">
								<Phone size={16} />
								<span>{organization.phone}</span>
							</div>
							<div className="contact-item">
								<Globe size={16} />
								<span>{organization.website}</span>
							</div>
						</div>
					</div>

					<div className="detail-section">
						<h3>Người liên hệ</h3>
						<div className="contact-person">
							<div className="person-name">{organization.contactPerson.name}</div>
							<div className="person-title">{organization.contactPerson.title}</div>
							<div className="person-department">{organization.contactPerson.department}</div>
							<div className="person-contact">
								<span>{organization.contactPerson.email}</span>
								<span>{organization.contactPerson.phone}</span>
							</div>
						</div>
					</div>

					<div className="detail-section">
						<h3>Gói đăng ký</h3>
						<div className="subscription-info">
							<div className="subscription-plan">{organization.subscriptionPlan}</div>
							<div className="subscription-status">
								<Badge variant={organization.subscriptionStatus === 'active' ? 'success' : 'danger'}>
									{organization.subscriptionStatus}
								</Badge>
							</div>
							<div className="subscription-expiry">
								Hết hạn: {new Date(organization.subscriptionExpiry).toLocaleDateString('vi-VN')}
							</div>
						</div>
					</div>

					{organization.tags.length > 0 && (
						<div className="detail-section">
							<h3>Tags</h3>
							<div className="tags-container">
								{organization.tags.map((tag: string) => (
									<Badge key={tag} variant="secondary">{tag}</Badge>
								))}
							</div>
						</div>
					)}

					{organization.notes && (
						<div className="detail-section">
							<h3>Ghi chú</h3>
							<p className="notes-content">{organization.notes}</p>
						</div>
					)}
				</div>
			</div>
		</Modal>
	)
}

export default OrganizationDetailModal
