import React from 'react'
import Modal from '../../components/common/Modal'
import { BookOpen, Clock, DollarSign, Users, Star, Calendar, Tag, CheckCircle, Award, Target } from 'lucide-react'

interface CourseDetailModalProps {
	isOpen: boolean
	onClose: () => void
	course: any
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
	isOpen,
	onClose,
	course
}) => {
	if (!course) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Chi tiết khóa học"
			maxWidth="800px"
		>
			<div className="modal-content-wrapper">
				{/* Course Header Info */}
				<div className="modal-info-card">
					<div className="card-icon">
						<img 
							src={course.thumbnail} 
							alt={course.title}
							style={{ 
								width: '40px', 
								height: '40px', 
								objectFit: 'cover', 
								borderRadius: '12px' 
							}}
						/>
					</div>
					<div className="card-title">{course.title}</div>
					<div className="card-description">{course.shortDescription}</div>
					<div className="card-value">
						<span style={{ 
							padding: '4px 8px', 
							background: 'var(--muted)', 
							borderRadius: 'var(--radius-sm)',
							fontSize: '12px',
							marginRight: '8px'
						}}>
							{course.category.icon} {course.category.name}
						</span>
						<span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
							bởi {course.instructor.name}
						</span>
					</div>
				</div>

				{/* Course Information */}
				<div className="modal-detail-section">
					<div className="section-title">
						<BookOpen />
						<h4>Thông tin khóa học</h4>
					</div>
					<div className="modal-info-pairs">
						<div className="modal-info-pair">
							<div className="info-label">Cấp độ</div>
							<div className="info-value">{course.level}</div>
						</div>
						<div className="modal-info-pair">
							<div className="info-label">Thời lượng</div>
							<div className="info-value">{course.duration} giờ</div>
						</div>
						<div className="modal-info-pair">
							<div className="info-label">Giá</div>
							<div className="info-value" style={{ fontWeight: 600, color: 'var(--primary)' }}>
								{course.price === 0 ? 'Miễn phí' : 
									`${course.price.toLocaleString()} ${course.tokenSymbol}`}
							</div>
						</div>
						<div className="modal-info-pair">
							<div className="info-label">Học viên</div>
							<div className="info-value">{course.enrollmentCount.toLocaleString()}</div>
						</div>
						<div className="modal-info-pair">
							<div className="info-label">Đánh giá</div>
							<div className="info-value">{course.rating} ⭐ ({course.reviewCount})</div>
						</div>
					</div>
				</div>

				{/* Status Information */}
				<div className="modal-detail-section">
					<div className="section-title">
						<CheckCircle />
						<h4>Trạng thái</h4>
					</div>
					<div className="modal-info-pairs">
						<div className="modal-info-pair">
							<div className="info-label">Trạng thái</div>
							<div className="info-value">
								<span className={`modal-status-badge ${course.isPublished ? 'success' : 'warning'}`}>
									{course.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
								</span>
							</div>
						</div>
						<div className="modal-info-pair">
							<div className="info-label">Nổi bật</div>
							<div className="info-value">{course.isFeatured ? 'Có' : 'Không'}</div>
						</div>
						<div className="modal-info-pair">
							<div className="info-label">Chứng chỉ</div>
							<div className="info-value">{course.certificateAvailable ? 'Có' : 'Không'}</div>
						</div>
						<div className="modal-info-pair">
							<div className="info-label">Tạo lúc</div>
							<div className="info-value">{new Date(course.createdAt).toLocaleDateString('vi-VN')}</div>
						</div>
						<div className="modal-info-pair">
							<div className="info-label">Cập nhật</div>
							<div className="info-value">{new Date(course.updatedAt).toLocaleDateString('vi-VN')}</div>
						</div>
					</div>
				</div>

				{/* Description */}
				<div className="modal-detail-section">
					<div className="section-title">
						<BookOpen />
						<h4>Mô tả chi tiết</h4>
					</div>
					<p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
						{course.description}
					</p>
				</div>

				{/* Tags */}
				{course.tags.length > 0 && (
					<div className="modal-detail-section">
						<div className="section-title">
							<Tag />
							<h4>Tags</h4>
						</div>
						<div className="modal-tags">
							{course.tags.map(tag => (
								<span key={tag} className="modal-tag">{tag}</span>
							))}
						</div>
					</div>
				)}

				{/* Prerequisites */}
				{course.prerequisites.length > 0 && (
					<div className="modal-detail-section">
						<div className="section-title">
							<CheckCircle />
							<h4>Điều kiện tiên quyết</h4>
						</div>
						<ul className="modal-list">
							{course.prerequisites.map((prereq, index) => (
								<li key={index} className="list-item">
									<div className="item-icon">
										<CheckCircle />
									</div>
									<div className="item-content">
										<div className="item-title">{prereq}</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Learning Outcomes */}
				{course.learningOutcomes.length > 0 && (
					<div className="modal-detail-section">
						<div className="section-title">
							<Target />
							<h4>Kết quả học tập</h4>
						</div>
						<ul className="modal-list">
							{course.learningOutcomes.map((outcome, index) => (
								<li key={index} className="list-item">
									<div className="item-icon">
										<Award />
									</div>
									<div className="item-content">
										<div className="item-title">{outcome}</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</Modal>
	)
}

export default CourseDetailModal
