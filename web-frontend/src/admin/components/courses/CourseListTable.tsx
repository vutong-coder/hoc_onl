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
	BookOpen
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import '../../styles/table.css'

interface CourseListTableProps {
	courses: Course[]
	onCourseClick?: (course: Course) => void
	onEditCourse?: (course: Course) => void
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
					{courses.map(course => (
						<tr key={course.id}>
							<td>
								<div className="course-info">
									<img 
										src={course.thumbnail} 
										alt={course.title}
										className="course-thumbnail-small"
									/>
									<div className="course-details">
										<div className="course-title">{course.title}</div>
										<div className="course-description">{course.shortDescription}</div>
										<div className="course-meta">
											{course.isFeatured && (
												<Badge variant="warning" style={{ fontSize: '10px', padding: '2px 6px' }}>
													<Award size={10} />
													Nổi bật
												</Badge>
											)}
											{course.certificateAvailable && (
												<Badge variant="info" style={{ fontSize: '10px', padding: '2px 6px' }}>
													<BookOpen size={10} />
													Chứng chỉ
												</Badge>
											)}
											<div className="course-duration">
												<Clock size={12} />
												{course.duration}h
											</div>
										</div>
									</div>
								</div>
							</td>
							<td>
								<div className="category-info">
									<span className="category-icon">{course.category.icon}</span>
									<span className="category-name">{course.category.name}</span>
								</div>
							</td>
							<td>
								<div className="instructor-info">
									<img 
										src={course.instructor.avatar || 'https://via.placeholder.com/32'} 
										alt={course.instructor.name}
										className="instructor-avatar-small"
									/>
									<div className="instructor-details">
										<div className="instructor-name">{course.instructor.name}</div>
										{course.instructor.isVerified && (
											<Badge variant="success" style={{ fontSize: '10px', padding: '2px 6px' }}>
												Verified
											</Badge>
										)}
									</div>
								</div>
							</td>
							<td>
								<Badge variant={getLevelBadgeVariant(course.level)}>
									{getLevelLabel(course.level)}
								</Badge>
							</td>
							<td>
								<div className="price-info">
									<div className="price-amount">
										{formatPrice(course.price, course.tokenSymbol)}
									</div>
									<div className="price-symbol">{course.tokenSymbol}</div>
								</div>
							</td>
							<td>
								<Badge variant={getStatusBadgeVariant(course.status)}>
									{getStatusLabel(course.status)}
								</Badge>
							</td>
							<td>
								<div className="enrollment-info">
									<div className="enrollment-count">
										<Users size={14} />
										{course.enrollmentCount.toLocaleString()}
									</div>
									{course.maxEnrollments && (
										<div className="max-enrollment">
											/ {course.maxEnrollments.toLocaleString()}
										</div>
									)}
								</div>
							</td>
							<td>
								{course.rating > 0 ? (
									<div className="rating-info">
										<div className="rating-stars">
											<Star size={14} className="text-warning" />
											<span>{course.rating}</span>
										</div>
										<div className="rating-count">({course.reviewCount})</div>
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
										className={`btn btn-icon btn-sm ${course.isPublished ? 'btn-warning' : 'btn-success'}`}
										title={course.isPublished ? 'Tạm dừng' : 'Xuất bản'}
										onClick={() => onToggleStatus?.(course.id)}
									>
										{course.isPublished ? <Pause size={16} /> : <Play size={16} />}
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
					))}
				</tbody>
			</table>
		</div>
	)
}
