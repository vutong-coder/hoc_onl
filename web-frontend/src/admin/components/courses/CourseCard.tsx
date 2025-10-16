import React from 'react'
import { Course } from '../../types/course'
import Badge from '../common/Badge'
import { 
	Edit, 
	Trash2, 
	Eye, 
	Play, 
	Pause,
	Star,
	Users,
	Clock,
	Tag,
	Award,
	Globe,
	BookOpen
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface CourseCardProps {
	course: Course
	onClick?: (course: Course) => void
	onEdit?: (course: Course) => void
	onDelete?: (courseId: string) => void
	onToggleStatus?: (courseId: string) => void
}

export default function CourseCard({ 
	course, 
	onClick, 
	onEdit, 
	onDelete, 
	onToggleStatus 
}: CourseCardProps): JSX.Element {
	
	const getLevelBadgeVariant = (level: string) => {
		switch (level) {
			case 'beginner': return 'success'
			case 'intermediate': return 'warning'
			case 'advanced': return 'danger'
			case 'expert': return 'secondary'
			default: return 'secondary'
		}
	}

	const getLevelLabel = (level: string) => {
		switch (level) {
			case 'beginner': return 'Cơ bản'
			case 'intermediate': return 'Trung bình'
			case 'advanced': return 'Nâng cao'
			case 'expert': return 'Chuyên gia'
			default: return level
		}
	}

	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case 'published': return 'success'
			case 'draft': return 'warning'
			case 'archived': return 'secondary'
			case 'suspended': return 'danger'
			default: return 'secondary'
		}
	}

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'published': return 'Đã xuất bản'
			case 'draft': return 'Bản nháp'
			case 'archived': return 'Đã lưu trữ'
			case 'suspended': return 'Tạm dừng'
			default: return status
		}
	}

	const formatPrice = (price: number, tokenSymbol: string) => {
		if (price === 0) return 'Miễn phí'
		return `${price.toLocaleString()} ${tokenSymbol}`
	}

	const formatTime = (timestamp: string) => {
		try {
			return formatDistanceToNow(new Date(timestamp), {
				addSuffix: true,
				locale: vi
			})
		} catch {
			return timestamp
		}
	}

	const handleCardClick = () => {
		onClick?.(course)
	}

	const handleEditClick = (e: React.MouseEvent) => {
		e.stopPropagation()
		onEdit?.(course)
	}

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (confirm(`Bạn có chắc chắn muốn xóa khóa học "${course.title}"?`)) {
			onDelete?.(course.id)
		}
	}

	const handleToggleStatusClick = (e: React.MouseEvent) => {
		e.stopPropagation()
		onToggleStatus?.(course.id)
	}

	return (
		<div 
			className={`course-card ${course.isFeatured ? 'featured' : ''}`}
			onClick={handleCardClick}
		>
			{/* Featured Badge */}
			{course.isFeatured && (
				<div className="course-featured-badge">
					<Award size={16} />
					<span>Nổi bật</span>
				</div>
			)}

			{/* Thumbnail */}
			<div className="course-thumbnail">
				<img 
					src={course.thumbnail} 
					alt={course.title}
					loading="lazy"
				/>
				<div className="course-overlay">
					<div className="course-actions">
						<button
							className="btn btn-icon btn-sm btn-secondary"
							title="Xem chi tiết"
							onClick={handleCardClick}
						>
							<Eye size={16} />
						</button>
						<button
							className="btn btn-icon btn-sm btn-primary"
							title="Chỉnh sửa"
							onClick={handleEditClick}
						>
							<Edit size={16} />
						</button>
						<button
							className={`btn btn-icon btn-sm ${course.isPublished ? 'btn-warning' : 'btn-success'}`}
							title={course.isPublished ? 'Tạm dừng' : 'Xuất bản'}
							onClick={handleToggleStatusClick}
						>
							{course.isPublished ? <Pause size={16} /> : <Play size={16} />}
						</button>
						<button
							className="btn btn-icon btn-sm btn-danger"
							title="Xóa"
							onClick={handleDeleteClick}
						>
							<Trash2 size={16} />
						</button>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="course-content">
				{/* Header */}
				<div className="course-header">
					<div className="course-category">
						<span className="category-icon">{course.category.icon}</span>
						<span className="category-name">{course.category.name}</span>
					</div>
					<div className="course-status">
						<Badge variant={getStatusBadgeVariant(course.status)}>
							{getStatusLabel(course.status)}
						</Badge>
					</div>
				</div>

				{/* Title */}
				<h3 className="course-title">{course.title}</h3>

				{/* Description */}
				<p className="course-description">{course.shortDescription}</p>

				{/* Instructor */}
				<div className="course-instructor">
					<img 
						src={course.instructor.avatar || 'https://via.placeholder.com/32'} 
						alt={course.instructor.name}
						className="instructor-avatar"
					/>
					<div className="instructor-info">
						<span className="instructor-name">{course.instructor.name}</span>
						{course.instructor.isVerified && (
							<Badge variant="success" style={{ fontSize: '10px', padding: '2px 6px' }}>
								Verified
							</Badge>
						)}
					</div>
				</div>

				{/* Meta Info */}
				<div className="course-meta">
					<div className="meta-item">
						<Badge variant={getLevelBadgeVariant(course.level)}>
							{getLevelLabel(course.level)}
						</Badge>
					</div>
					<div className="meta-item">
						<Clock size={14} />
						<span>{course.duration}h</span>
					</div>
					<div className="meta-item">
						<Users size={14} />
						<span>{course.enrollmentCount.toLocaleString()}</span>
					</div>
					{course.rating > 0 && (
						<div className="meta-item">
							<Star size={14} className="text-warning" />
							<span>{course.rating}</span>
							<span className="review-count">({course.reviewCount})</span>
						</div>
					)}
				</div>

				{/* Tags */}
				{course.tags.length > 0 && (
					<div className="course-tags">
						{course.tags.slice(0, 3).map(tag => (
							<span key={tag} className="course-tag">
								<Tag size={12} />
								{tag}
							</span>
						))}
						{course.tags.length > 3 && (
							<span className="course-tag-more">
								+{course.tags.length - 3} khác
							</span>
						)}
					</div>
				)}

				{/* Footer */}
				<div className="course-footer">
					<div className="course-price">
						<span className="price-amount">
							{formatPrice(course.price, course.tokenSymbol)}
						</span>
						{course.certificateAvailable && (
							<div className="certificate-badge">
								<Award size={14} />
								<span>Chứng chỉ</span>
							</div>
						)}
					</div>
					<div className="course-updated">
						Cập nhật {formatTime(course.updatedAt)}
					</div>
				</div>
			</div>
		</div>
	)
}
