import React from 'react'
import { Award, Clock } from 'lucide-react'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'

interface TemplateDetailModalProps {
	isOpen: boolean
	onClose: () => void
	template: any
}

const TemplateDetailModal: React.FC<TemplateDetailModalProps> = ({
	isOpen,
	onClose,
	template
}) => {
	if (!template) return null

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
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={template.name || 'Chi tiết mẫu chứng chỉ'}
			maxWidth="800px"
		>
			<div className="template-detail-modal-content">
				<div className="template-detail-header">
					<div className="template-detail-info">
						<h2 className="template-detail-title">{template.name}</h2>
						<p className="template-detail-description">{template.description}</p>
						<div className="template-detail-meta">
							<div className="meta-item">
								<Award size={16} />
								<span>{template.issuer}</span>
							</div>
							<div className="meta-item">
								<Badge variant="secondary">
									{getCategoryLabel(template.category)}
								</Badge>
							</div>
							<div className="meta-item">
								<Badge variant="secondary">
									{getLevelLabel(template.level)}
								</Badge>
							</div>
							<div className="meta-item">
								<Clock size={16} />
								<span>{template.validityPeriod} tháng</span>
							</div>
						</div>
					</div>
				</div>

				<div className="template-detail-sections">
					<div className="detail-section">
						<h3>Yêu cầu</h3>
						<div className="requirements-list">
							{template.requirements.map((req: any) => (
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
								<strong>Layout:</strong> {template.templateDesign.layout}
							</div>
							<div className="design-item">
								<strong>Kích thước:</strong> {template.templateDesign.dimensions.width}x{template.templateDesign.dimensions.height} {template.templateDesign.dimensions.unit}
							</div>
							<div className="design-item">
								<strong>Màu chính:</strong> 
								<span 
									className="color-preview" 
									style={{ backgroundColor: template.templateDesign.colors.primary }}
								></span>
								{template.templateDesign.colors.primary}
							</div>
						</div>
					</div>

					{template.metadata.tags.length > 0 && (
						<div className="detail-section">
							<h3>Tags</h3>
							<div className="tags-container">
								{template.metadata.tags.map((tag: string) => (
									<Badge key={tag} variant="secondary">{tag}</Badge>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</Modal>
	)
}

export default TemplateDetailModal
