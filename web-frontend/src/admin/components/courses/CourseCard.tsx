import React from 'react'
import { type Course as ApiCourse } from '../../../services/api/courseApi'
import Badge from '../common/Badge'
import { extractCourseStatus, getCourseThumbnail, getCourseField } from '../../../utils/courseAdapter'
import '../../styles/courses.css'
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
	course: ApiCourse
	onClick?: (course: ApiCourse) => void
	onEdit?: (course: ApiCourse) => void
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
	// Extract status from backend visibility field
	const { status, isPublished } = extractCourseStatus(course)
	const thumbnail = getCourseThumbnail(course)
	const level = getCourseField(course, 'level', 'beginner')
	const duration = getCourseField(course, 'duration', 0)
	const price = getCourseField(course, 'price', 0)
	const tokenSymbol = getCourseField(course, 'tokenSymbol', 'LEARN')
	const shortDescription = getCourseField(course, 'shortDescription', course.description || '')
	const enrollmentCount = getCourseField(course, 'enrollmentCount', 0)
	const rating = getCourseField(course, 'rating', 0)
	const reviewCount = getCourseField(course, 'reviewCount', 0)
	const tags = getCourseField(course, 'tags', [])
	const isFeatured = getCourseField(course, 'isFeatured', false)
	const certificateAvailable = getCourseField(course, 'certificateAvailable', false)
	
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

	const formatPrice = (price?: number | null, tokenSymbol?: string) => {
		const safePrice = typeof price === 'number' && isFinite(price) ? price : 0
		if (safePrice === 0) return 'Miễn phí'
		const symbol = tokenSymbol && tokenSymbol.trim() ? tokenSymbol : 'LEARN'
		return `${safePrice.toLocaleString()} ${symbol}`
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
		onDelete?.(course.id)
	}

	const handleToggleStatusClick = (e: React.MouseEvent) => {
		e.stopPropagation()
		onToggleStatus?.(course.id)
	}

	return (
		<div 
			className={`course-card ${isFeatured ? 'featured' : ''}`}
			onClick={handleCardClick}
		>
			{/* Featured Badge */}
			{isFeatured && (
				<div className="course-featured-badge">
					<Award size={16} />
					<span>Nổi bật</span>
				</div>
			)}

			{/* Thumbnail */}
			<div className="course-thumbnail">
				<img 
					src={thumbnail || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="%239ca3af">No Image</text></svg>'} 
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
							className={`btn btn-icon btn-sm ${isPublished ? 'btn-warning' : 'btn-success'}`}
							title={isPublished ? 'Tạm dừng' : 'Xuất bản'}
							onClick={handleToggleStatusClick}
						>
							{isPublished ? <Pause size={16} /> : <Play size={16} />}
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
                        <span className="category-icon">
                            { (course as any)?.category?.icon ? (course as any).category.icon : <BookOpen size={14} /> }
                        </span>
                        <span className="category-name">{(course as any)?.category?.name || 'Khác'}</span>
                    </div>
					<div className="course-status">
					<Badge variant={getStatusBadgeVariant(status)}>
						{getStatusLabel(status)}
						</Badge>
					</div>
				</div>

				{/* Title */}
				<h3 className="course-title">{course.title}</h3>

				{/* Description */}
				<p className="course-description">{shortDescription}</p>

				{/* Instructor */}
                <div className="course-instructor">
                    <img 
                        src={(course as any)?.instructor?.avatar || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="100%" height="100%" fill="%23e5e7eb"/></svg>'} 
                        alt={(course as any)?.instructor?.name || 'Instructor'}
                        className="instructor-avatar"
                    />
                    <div className="instructor-info">
                        <span className="instructor-name">{(course as any)?.instructor?.name || '—'}</span>
                        {(course as any)?.instructor?.isVerified && (
                            <Badge variant="success" style={{ fontSize: '10px', padding: '2px 6px' }}>
                                Verified
                            </Badge>
                        )}
                    </div>
                </div>

				{/* Meta Info */}
				<div className="course-meta">
					<div className="meta-item">
						<Badge variant={getLevelBadgeVariant(level)}>
							{getLevelLabel(level)}
						</Badge>
					</div>
					<div className="meta-item">
						<Clock size={14} />
						<span>{duration}h</span>
					</div>
                    <div className="meta-item">
                        <Users size={14} />
                        <span>{enrollmentCount.toLocaleString()}</span>
                    </div>
					{rating > 0 && (
						<div className="meta-item">
							<Star size={14} className="text-warning" />
							<span>{rating}</span>
							<span className="review-count">({reviewCount})</span>
						</div>
					)}
				</div>

				{/* Tags */}
                {tags.length > 0 && (
					<div className="course-tags">
                        {tags.slice(0, 3).map(tag => (
							<span key={tag} className="course-tag">
								<Tag size={12} />
								{tag}
							</span>
						))}
                        {tags.length > 3 && (
							<span className="course-tag-more">
                                +{tags.length - 3} khác
							</span>
						)}
					</div>
				)}

				{/* Footer */}
				<div className="course-footer">
					<div className="course-price">
						<span className="price-amount">
							{formatPrice(price, tokenSymbol)}
						</span>
						{certificateAvailable && (
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
