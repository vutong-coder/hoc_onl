import React from 'react'
import Modal from '../../components/common/Modal'

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
			<div style={{ padding: '20px' }}>
				{/* Course Header */}
				<div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
					<img 
						src={course.thumbnail} 
						alt={course.title}
						style={{ 
							width: '200px', 
							height: '120px', 
							objectFit: 'cover', 
							borderRadius: 'var(--radius-md)' 
						}}
					/>
					<div style={{ flex: 1 }}>
						<h3 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0' }}>
							{course.title}
						</h3>
						<p style={{ color: 'var(--muted-foreground)', margin: '0 0 12px 0' }}>
							{course.shortDescription}
						</p>
						<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
							<span style={{ 
								padding: '4px 8px', 
								background: 'var(--muted)', 
								borderRadius: 'var(--radius-sm)',
								fontSize: '12px'
							}}>
								{course.category.icon} {course.category.name}
							</span>
							<span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
								bởi {course.instructor.name}
							</span>
						</div>
					</div>
				</div>

				{/* Course Details */}
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
					<div>
						<h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
							Thông tin khóa học
						</h4>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ color: 'var(--muted-foreground)' }}>Cấp độ:</span>
								<span>{course.level}</span>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ color: 'var(--muted-foreground)' }}>Thời lượng:</span>
								<span>{course.duration} giờ</span>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ color: 'var(--muted-foreground)' }}>Giá:</span>
								<span style={{ fontWeight: 600, color: 'var(--primary)' }}>
									{course.price === 0 ? 'Miễn phí' : 
										`${course.price.toLocaleString()} ${course.tokenSymbol}`}
								</span>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ color: 'var(--muted-foreground)' }}>Học viên:</span>
								<span>{course.enrollmentCount.toLocaleString()}</span>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ color: 'var(--muted-foreground)' }}>Đánh giá:</span>
								<span>{course.rating} ⭐ ({course.reviewCount})</span>
							</div>
						</div>
					</div>

					<div>
						<h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
							Trạng thái
						</h4>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ color: 'var(--muted-foreground)' }}>Trạng thái:</span>
								<span style={{ 
									padding: '2px 8px', 
									borderRadius: 'var(--radius-sm)',
									fontSize: '12px',
									background: course.isPublished ? '#10b981' : '#f59e0b',
									color: 'white'
								}}>
									{course.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
								</span>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ color: 'var(--muted-foreground)' }}>Nổi bật:</span>
								<span>{course.isFeatured ? 'Có' : 'Không'}</span>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ color: 'var(--muted-foreground)' }}>Chứng chỉ:</span>
								<span>{course.certificateAvailable ? 'Có' : 'Không'}</span>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ color: 'var(--muted-foreground)' }}>Tạo lúc:</span>
								<span>{new Date(course.createdAt).toLocaleDateString('vi-VN')}</span>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ color: 'var(--muted-foreground)' }}>Cập nhật:</span>
								<span>{new Date(course.updatedAt).toLocaleDateString('vi-VN')}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Description */}
				<div style={{ marginBottom: '24px' }}>
					<h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
						Mô tả chi tiết
					</h4>
					<p style={{ lineHeight: 1.6, color: 'var(--foreground)' }}>
						{course.description}
					</p>
				</div>

				{/* Tags */}
				{course.tags.length > 0 && (
					<div style={{ marginBottom: '24px' }}>
						<h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
							Tags
						</h4>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
							{course.tags.map(tag => (
								<span key={tag} style={{ 
									padding: '4px 8px', 
									background: 'var(--muted)', 
									borderRadius: 'var(--radius-sm)',
									fontSize: '12px'
								}}>
									{tag}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Prerequisites */}
				{course.prerequisites.length > 0 && (
					<div style={{ marginBottom: '24px' }}>
						<h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
							Điều kiện tiên quyết
						</h4>
						<ul style={{ paddingLeft: '20px', margin: 0 }}>
							{course.prerequisites.map((prereq, index) => (
								<li key={index} style={{ marginBottom: '4px' }}>
									{prereq}
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Learning Outcomes */}
				{course.learningOutcomes.length > 0 && (
					<div>
						<h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
							Kết quả học tập
						</h4>
						<ul style={{ paddingLeft: '20px', margin: 0 }}>
							{course.learningOutcomes.map((outcome, index) => (
								<li key={index} style={{ marginBottom: '4px' }}>
									{outcome}
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
