import React, { useEffect, useState } from 'react'
import Modal from '../../components/common/Modal'
import { BookOpen, Clock, DollarSign, Users, Star, Calendar, Tag, CheckCircle, Award, Target } from 'lucide-react'
import courseApi, { type Material, type CreateMaterialRequest } from '../../../services/api/courseApi'
import CourseQuizModal from './CourseQuizModal'

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

    const safeImg = (url?: string) => {
        if (typeof url === 'string' && url.trim().length > 0) return url
        // local, non-network fallback to avoid DNS issues
        return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="%239ca3af">No Image</text></svg>'
    }

    const formatPrice = (price?: number | null, token?: string) => {
        const value = typeof price === 'number' && isFinite(price) ? price : 0
        if (value === 0) return 'Miễn phí'
        return `${value.toLocaleString()} ${token && token.trim() ? token : 'LEARN'}`
    }

    // Materials state
    const [materials, setMaterials] = useState<Material[]>([])
    const [materialsLoading, setMaterialsLoading] = useState(false)
    const [newMaterial, setNewMaterial] = useState<CreateMaterialRequest>({
        title: '',
        description: '',
        type: 'video',
        contentUrl: '',
        videoUrl: '',
        order: 1,
        duration: 0,
    })

    const loadMaterials = async () => {
        if (!course?.id) return
        setMaterialsLoading(true)
        try {
            const res = await courseApi.getCourseMaterials(course.id)
            setMaterials(res.data)
        } catch (e) {
            console.error('Load materials failed', e)
        } finally {
            setMaterialsLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen && course?.id) {
            loadMaterials()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, course?.id])

    const handleAddMaterial = async () => {
        if (!course?.id) return
        if (!newMaterial.title?.trim()) return
        try {
            await courseApi.addMaterialToCourse(course.id, newMaterial)
            setNewMaterial({ title: '', description: '', type: 'video', contentUrl: '', videoUrl: '', order: (newMaterial.order || 1) + 1, duration: 0 })
            await loadMaterials()
        } catch (e) {
            alert('Thêm học liệu thất bại')
        }
    }

    const handleDeleteMaterial = async (materialId: string) => {
        try {
            await courseApi.deleteMaterial(materialId)
            await loadMaterials()
        } catch (e) {
            alert('Xóa học liệu thất bại')
        }
    }

    // Quiz modal
    const [quizModalOpen, setQuizModalOpen] = useState(false)

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
                            src={safeImg(course.thumbnail)} 
                            alt={course.title || 'Course'}
							style={{ 
								width: '40px', 
								height: '40px', 
								objectFit: 'cover', 
								borderRadius: '12px' 
							}}
						/>
					</div>
                    <div className="card-title">{course.title || '—'}</div>
                    <div className="card-description">{course.shortDescription || ''}</div>
					<div className="card-value">
						<span style={{ 
							padding: '4px 8px', 
							background: 'var(--muted)', 
							borderRadius: 'var(--radius-sm)',
							fontSize: '12px',
							marginRight: '8px'
						}}>
                            <BookOpen size={12} /> {(course as any)?.category?.name || 'Khác'}
						</span>
						<span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                            bởi {(course as any)?.instructor?.name || '—'}
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
                            <div className="info-value">{course.level || '—'}</div>
						</div>
						<div className="modal-info-pair">
							<div className="info-label">Thời lượng</div>
                            <div className="info-value">{course.duration || 0} giờ</div>
						</div>
						<div className="modal-info-pair">
							<div className="info-label">Giá</div>
							<div className="info-value" style={{ fontWeight: 600, color: 'var(--primary)' }}>
                                {formatPrice(course.price, (course as any)?.tokenSymbol)}
							</div>
						</div>
						<div className="modal-info-pair">
							<div className="info-label">Học viên</div>
                            <div className="info-value">{(course.enrollmentCount || 0).toLocaleString()}</div>
						</div>
						<div className="modal-info-pair">
							<div className="info-label">Đánh giá</div>
                            <div className="info-value">{course.rating || 0} ⭐ ({course.reviewCount || 0})</div>
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
                            <div className="info-value">{course.createdAt ? new Date(course.createdAt).toLocaleDateString('vi-VN') : '—'}</div>
						</div>
						<div className="modal-info-pair">
							<div className="info-label">Cập nhật</div>
                            <div className="info-value">{course.updatedAt ? new Date(course.updatedAt).toLocaleDateString('vi-VN') : '—'}</div>
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
                        {course.description || ''}
					</p>
				</div>

                {/* Materials */}
                <div className="modal-detail-section">
                    <div className="section-title">
                        <BookOpen />
                        <h4>Học liệu</h4>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontWeight: 600 }}>Quản lý học liệu</div>
                        <button className="btn btn-secondary" type="button" onClick={() => setQuizModalOpen(true)}>Quản trị Quiz</button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Tiêu đề học liệu"
                            value={newMaterial.title}
                            onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                            style={{ minWidth: 220 }}
                        />
                        <select
                            className="form-input"
                            value={newMaterial.type}
                            onChange={(e) => setNewMaterial(prev => ({ ...prev, type: e.target.value as any }))}
                        >
                            <option value="video">Video</option>
                            <option value="document">Tài liệu</option>
                            <option value="quiz">Quiz</option>
                            <option value="text">Text</option>
                        </select>
                        <input
                            type="url"
                            className="form-input"
                            placeholder={newMaterial.type === 'video' ? 'Video URL' : 'Content URL'}
                            value={newMaterial.type === 'video' ? (newMaterial.videoUrl || '') : (newMaterial.contentUrl || '')}
                            onChange={(e) => setNewMaterial(prev => (
                                prev.type === 'video' ? { ...prev, videoUrl: e.target.value } : { ...prev, contentUrl: e.target.value }
                            ))}
                            style={{ minWidth: 240 }}
                        />
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Thứ tự"
                            value={newMaterial.order}
                            onChange={(e) => setNewMaterial(prev => ({ ...prev, order: Number(e.target.value) || 1 }))}
                            style={{ width: 100 }}
                        />
                        <button className="btn btn-primary" type="button" onClick={handleAddMaterial}>Thêm học liệu</button>
                    </div>
                    {materialsLoading ? (
                        <div>Đang tải học liệu...</div>
                    ) : materials.length === 0 ? (
                        <div style={{ color: 'var(--muted-foreground)' }}>Chưa có học liệu</div>
                    ) : (
                        <ul className="modal-list">
                            {materials.map(m => (
                                <li key={m.id} className="list-item">
                                    <div className="item-icon"><BookOpen /></div>
                                    <div className="item-content">
                                        <div className="item-title">{m.title}</div>
                                        <div className="item-subtitle" style={{ color: 'var(--muted-foreground)', fontSize: 12 }}>
                                            {m.type} • Thứ tự {m.order ?? m['displayOrder'] ?? '-'}
                                        </div>
                                    </div>
                                    <div className="item-meta">
                                        <button className="modal-action-button" type="button" onClick={() => handleDeleteMaterial(m.id)}>Xóa</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <CourseQuizModal isOpen={quizModalOpen} onClose={() => setQuizModalOpen(false)} />

				{/* Tags */}
                {(course.tags || []).length > 0 && (
					<div className="modal-detail-section">
						<div className="section-title">
							<Tag />
							<h4>Tags</h4>
						</div>
						<div className="modal-tags">
                            {(course.tags || []).map(tag => (
								<span key={tag} className="modal-tag">{tag}</span>
							))}
						</div>
					</div>
				)}

				{/* Prerequisites */}
                {(course.prerequisites || []).length > 0 && (
					<div className="modal-detail-section">
						<div className="section-title">
							<CheckCircle />
							<h4>Điều kiện tiên quyết</h4>
						</div>
						<ul className="modal-list">
                            {(course.prerequisites || []).map((prereq, index) => (
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
                {(course.learningOutcomes || []).length > 0 && (
					<div className="modal-detail-section">
						<div className="section-title">
							<Target />
							<h4>Kết quả học tập</h4>
						</div>
						<ul className="modal-list">
                            {(course.learningOutcomes || []).map((outcome, index) => (
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
