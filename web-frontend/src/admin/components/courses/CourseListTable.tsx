import React from 'react'
import { type Course as ApiCourse } from '../../../services/api/courseApi'
import Badge from '../common/Badge'
import { extractCourseStatus, getCourseThumbnail, getCourseField } from '../../../utils/courseAdapter'
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
	BookOpen
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import '../../styles/table.css'

interface CourseListTableProps {
	courses: ApiCourse[]
	onCourseClick?: (course: ApiCourse) => void
	onEditCourse?: (course: ApiCourse) => void
	onDeleteCourse?: (courseId: string) => void
	onToggleStatus?: (courseId: string) => void
	loading?: boolean
	emptyMessage?: string
}

export default function CourseListTable({ 
	courses, 
	onCourseClick,
	onEditCourse,
	onDeleteCourse,
	onToggleStatus,
	loading = false,
	emptyMessage = "Không có khóa học nào"
}: CourseListTableProps): JSX.Element {
	
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

	if (loading) {
		return (
			<div className="course-list-loading">
				<div className="admin-table">
					<thead>
						<tr>
							<th>Khóa học</th>
							<th>Danh mục</th>
							<th>Giảng viên</th>
							<th>Cấp độ</th>
							<th>Giá</th>
							<th>Trạng thái</th>
							<th>Học viên</th>
							<th>Đánh giá</th>
							<th>Cập nhật</th>
							<th>Hành động</th>
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: 5 }).map((_, index) => (
							<tr key={index}>
								<td>
									<div className="course-info-skeleton">
										<div className="skeleton-thumbnail"></div>
										<div className="skeleton-content">
											<div className="skeleton-title"></div>
											<div className="skeleton-description"></div>
										</div>
									</div>
								</td>
								<td><div className="skeleton-text"></div></td>
								<td><div className="skeleton-text"></div></td>
								<td><div className="skeleton-text"></div></td>
								<td><div className="skeleton-text"></div></td>
								<td><div className="skeleton-text"></div></td>
								<td><div className="skeleton-text"></div></td>
								<td><div className="skeleton-text"></div></td>
								<td><div className="skeleton-text"></div></td>
								<td><div className="skeleton-text"></div></td>
							</tr>
						))}
					</tbody>
				</div>
			</div>
		)
	}

	if (courses.length === 0) {
		return (
			<div className="admin-table-empty">
				<div className="admin-table-empty-icon">📚</div>
				<div className="admin-table-empty-text">{emptyMessage}</div>
			</div>
		)
	}

	return (
		<div className="course-list-table">
			<table className="admin-table">
				<thead>
					<tr>
						<th>Khóa học</th>
						<th>Danh mục</th>
						<th>Giảng viên</th>
						<th>Cấp độ</th>
						<th>Giá</th>
						<th>Trạng thái</th>
						<th>Học viên</th>
						<th>Đánh giá</th>
						<th>Cập nhật</th>
						<th>Hành động</th>
					</tr>
				</thead>
				<tbody>
					{courses.map(course => {
						// Extract fields using adapter
						const { status, isPublished } = extractCourseStatus(course)
						const thumbnail = getCourseThumbnail(course)
						const level = getCourseField(course, 'level', 'beginner')
						const duration = getCourseField(course, 'duration', 0)
						const price = getCourseField(course, 'price', 0)
						const tokenSymbol = getCourseField(course, 'tokenSymbol', 'LEARN')
						const shortDescription = getCourseField(course, 'shortDescription', course.description || '')
						const enrollmentCount = getCourseField(course, 'enrollmentCount', 0)
						const maxEnrollments = getCourseField(course, 'maxEnrollments', 0)
						const rating = getCourseField(course, 'rating', 0)
						const reviewCount = getCourseField(course, 'reviewCount', 0)
						const isFeatured = getCourseField(course, 'isFeatured', false)
						const certificateAvailable = getCourseField(course, 'certificateAvailable', false)
						
						return (
						<tr key={course.id}>
							<td>
								<div className="course-info">
									<img 
										src={thumbnail || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10" fill="%239ca3af">No Image</text></svg>'} 
										alt={course.title}
										className="course-thumbnail-small"
									/>
									<div className="course-details">
										<div className="course-title">{course.title}</div>
										<div className="course-description">{shortDescription}</div>
										<div className="course-meta">
											{isFeatured && (
												<Badge variant="warning" style={{ fontSize: '10px', padding: '2px 6px' }}>
													<Award size={10} />
													Nổi bật
												</Badge>
											)}
											{certificateAvailable && (
												<Badge variant="info" style={{ fontSize: '10px', padding: '2px 6px' }}>
													<BookOpen size={10} />
													Chứng chỉ
												</Badge>
											)}
											<div className="course-duration">
												<Clock size={12} />
												{duration}h
											</div>
										</div>
									</div>
								</div>
							</td>
							<td>
								<div className="category-info">
                                    <span className="category-icon"><BookOpen size={12} /></span>
                                    <span className="category-name">{(course as any)?.category?.name || 'Khác'}</span>
								</div>
							</td>
							<td>
								<div className="instructor-info">
                                    <img 
                                        src={(course as any)?.instructor?.avatar || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="100%" height="100%" fill="%23e5e7eb"/></svg>'} 
                                        alt={(course as any)?.instructor?.name || 'Instructor'}
										className="instructor-avatar-small"
									/>
									<div className="instructor-details">
                                        <div className="instructor-name">{(course as any)?.instructor?.name || '—'}</div>
                                        {(course as any)?.instructor?.isVerified && (
											<Badge variant="success" style={{ fontSize: '10px', padding: '2px 6px' }}>
												Verified
											</Badge>
										)}
									</div>
								</div>
							</td>
							<td>
								<Badge variant={getLevelBadgeVariant(level)}>
									{getLevelLabel(level)}
								</Badge>
							</td>
							<td>
								<div className="price-info">
                                    <div className="price-amount">
                                        {formatPrice(price, tokenSymbol)}
                                    </div>
                                    <div className="price-symbol">{tokenSymbol}</div>
								</div>
							</td>
							<td>
							<Badge variant={getStatusBadgeVariant(status)}>
								{getStatusLabel(status)}
								</Badge>
							</td>
							<td>
								<div className="enrollment-info">
                                        <div className="enrollment-count">
                                            <Users size={14} />
                                            {enrollmentCount.toLocaleString()}
                                        </div>
                                        {maxEnrollments > 0 && (
										<div className="max-enrollment">
                                                / {maxEnrollments.toLocaleString()}
										</div>
									)}
								</div>
							</td>
							<td>
                                {rating > 0 ? (
									<div className="rating-info">
										<div className="rating-stars">
											<Star size={14} className="text-warning" />
                                            <span>{rating}</span>
										</div>
                                        <div className="rating-count">({reviewCount})</div>
									</div>
								) : (
									<span className="no-rating">Chưa có đánh giá</span>
								)}
							</td>
							<td>
								<div className="update-info">
									<div className="updated-at">
										{formatTime(course.updatedAt)}
									</div>
									<div className="created-at">
										Tạo: {new Date(course.createdAt).toLocaleDateString('vi-VN')}
									</div>
								</div>
							</td>
							<td>
								<div className="action-buttons">
									<button
										className="btn btn-icon btn-sm btn-secondary"
										title="Xem chi tiết"
										onClick={() => onCourseClick?.(course)}
									>
										<Eye size={16} />
									</button>
									
									<button
										className="btn btn-icon btn-sm btn-primary"
										title="Chỉnh sửa"
										onClick={() => onEditCourse?.(course)}
									>
										<Edit size={16} />
									</button>
									
									<button
										className={`btn btn-icon btn-sm ${isPublished ? 'btn-warning' : 'btn-success'}`}
										title={isPublished ? 'Tạm dừng' : 'Xuất bản'}
										onClick={() => onToggleStatus?.(course.id)}
									>
										{isPublished ? <Pause size={16} /> : <Play size={16} />}
									</button>
									
									<button
										className="btn btn-icon btn-sm btn-danger"
										title="Xóa"
										onClick={() => onDeleteCourse?.(course.id)}
									>
										<Trash2 size={16} />
									</button>
								</div>
							</td>
						</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
