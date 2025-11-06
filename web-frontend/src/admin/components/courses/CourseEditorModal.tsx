import React, { useState, useEffect } from 'react'
import { CourseForm, CourseCategory, Instructor, CourseLevel, CourseStatus } from '../../types/course'
import { type Course as ApiCourse } from '../../../services/api/courseApi'
import { extractCourseStatus, getCourseThumbnail, getCourseField } from '../../../utils/courseAdapter'
import Modal from '../common/Modal'
import Dropdown from '../common/Dropdown'
import { X, Save, Plus, Trash2, BookOpen, Settings, DollarSign, Tag, CheckCircle, Award, Target, Users } from 'lucide-react'

interface CourseEditorModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (course: CourseForm) => void
    editingCourse?: ApiCourse | null
	categories: CourseCategory[]
	instructors: Instructor[]
	title?: string
}

export default function CourseEditorModal({ 
	isOpen, 
	onClose, 
	onSave, 
	editingCourse,
	categories,
	instructors,
	title = "Thêm khóa học mới"
}: CourseEditorModalProps): JSX.Element {
	
	const [form, setForm] = useState<CourseForm>({
		title: '',
		description: '',
		shortDescription: '',
		categoryId: '',
		instructorId: '',
		level: 'beginner',
		duration: 0,
		price: 0,
		tokenSymbol: 'LEARN',
		thumbnail: '',
		videoUrl: '',
		tags: [],
		status: 'draft',
		isPublished: false,
		isFeatured: false,
		maxEnrollments: undefined,
		prerequisites: [],
		learningOutcomes: [],
		certificateAvailable: false,
		certificateTemplate: ''
	})

	const [errors, setErrors] = useState<Record<string, string>>({})
	const [newTag, setNewTag] = useState('')
	const [newPrerequisite, setNewPrerequisite] = useState('')
	const [newOutcome, setNewOutcome] = useState('')

    useEffect(() => {
		if (editingCourse) {
			// Use adapter helpers to safely extract fields
			const { status, isPublished } = extractCourseStatus(editingCourse)
			const thumbnail = getCourseThumbnail(editingCourse)
			
			setForm({
                title: editingCourse.title || '',
                description: editingCourse.description || '',
                shortDescription: getCourseField(editingCourse, 'shortDescription', editingCourse.description?.substring(0, 150) || ''),
                categoryId: (editingCourse as any)?.category?.id || '',
                instructorId: (editingCourse as any)?.instructor?.id || (editingCourse as any)?.instructorId?.toString() || '',
                level: (getCourseField(editingCourse, 'level', 'beginner') as CourseLevel),
                duration: getCourseField(editingCourse, 'duration', 0),
                price: getCourseField(editingCourse, 'price', 0),
                tokenSymbol: getCourseField(editingCourse, 'tokenSymbol', 'LEARN'),
                thumbnail: thumbnail,
                videoUrl: getCourseField(editingCourse, 'videoUrl', ''),
                tags: getCourseField(editingCourse, 'tags', []),
                status: status as CourseStatus,
                isPublished: isPublished,
                isFeatured: getCourseField(editingCourse, 'isFeatured', false),
                maxEnrollments: getCourseField(editingCourse, 'maxEnrollments', undefined),
                prerequisites: getCourseField(editingCourse, 'prerequisites', []),
                learningOutcomes: getCourseField(editingCourse, 'learningOutcomes', []),
                certificateAvailable: getCourseField(editingCourse, 'certificateAvailable', false),
                certificateTemplate: getCourseField(editingCourse, 'certificateTemplate', '')
			})
		} else {
			setForm({
				title: '',
				description: '',
				shortDescription: '',
				categoryId: '',
				instructorId: '',
				level: 'beginner',
				duration: 0,
				price: 0,
				tokenSymbol: 'LEARN',
				thumbnail: '',
				videoUrl: '',
				tags: [],
				status: 'draft',
				isPublished: false,
				isFeatured: false,
				maxEnrollments: undefined,
				prerequisites: [],
				learningOutcomes: [],
				certificateAvailable: false,
				certificateTemplate: ''
			})
		}
		setErrors({})
	}, [editingCourse, isOpen])

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!form.title.trim()) {
			newErrors.title = 'Tên khóa học không được để trống'
		}

		if (!form.description.trim()) {
			newErrors.description = 'Mô tả không được để trống'
		}

		if (!form.shortDescription.trim()) {
			newErrors.shortDescription = 'Mô tả ngắn không được để trống'
		}

		if (!form.categoryId) {
			newErrors.categoryId = 'Vui lòng chọn danh mục'
		}

		if (!form.instructorId) {
			newErrors.instructorId = 'Vui lòng chọn giảng viên'
		}

		if (form.duration <= 0) {
			newErrors.duration = 'Thời lượng phải lớn hơn 0'
		}

		if (form.price < 0) {
			newErrors.price = 'Giá không được âm'
		}

		if (!form.thumbnail.trim()) {
			newErrors.thumbnail = 'URL hình ảnh không được để trống'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		
		if (validateForm()) {
			onSave(form)
			onClose()
		}
	}

	const addTag = () => {
		if (newTag.trim() && !form.tags.includes(newTag.trim())) {
			setForm(prev => ({
				...prev,
				tags: [...prev.tags, newTag.trim()]
			}))
			setNewTag('')
		}
	}

	const removeTag = (index: number) => {
		setForm(prev => ({
			...prev,
			tags: prev.tags.filter((_, i) => i !== index)
		}))
	}

	const addPrerequisite = () => {
		if (newPrerequisite.trim() && !form.prerequisites.includes(newPrerequisite.trim())) {
			setForm(prev => ({
				...prev,
				prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
			}))
			setNewPrerequisite('')
		}
	}

	const removePrerequisite = (index: number) => {
		setForm(prev => ({
			...prev,
			prerequisites: prev.prerequisites.filter((_, i) => i !== index)
		}))
	}

	const addOutcome = () => {
		if (newOutcome.trim() && !form.learningOutcomes.includes(newOutcome.trim())) {
			setForm(prev => ({
				...prev,
				learningOutcomes: [...prev.learningOutcomes, newOutcome.trim()]
			}))
			setNewOutcome('')
		}
	}

	const removeOutcome = (index: number) => {
		setForm(prev => ({
			...prev,
			learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index)
		}))
	}

	const categoryOptions = categories.map(cat => ({
		value: cat.id,
		label: `${cat.icon} ${cat.name}`
	}))

	const instructorOptions = instructors.map(inst => ({
		value: inst.id,
		label: inst.name
	}))

	const levelOptions = [
		{ value: 'beginner', label: 'Cơ bản' },
		{ value: 'intermediate', label: 'Trung bình' },
		{ value: 'advanced', label: 'Nâng cao' },
		{ value: 'expert', label: 'Chuyên gia' }
	]

	const statusOptions = [
		{ value: 'draft', label: 'Bản nháp' },
		{ value: 'published', label: 'Đã xuất bản' },
		{ value: 'archived', label: 'Đã lưu trữ' },
		{ value: 'suspended', label: 'Tạm dừng' }
	]

	const currencyOptions = [
		{ value: 'LEARN', label: 'LEARN Token' },
		{ value: 'CERT', label: 'CERT Token' },
		{ value: 'SKILL', label: 'SKILL Token' }
	]

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			footer={
				<>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={onClose}
					>
						<X size={16} />
						Hủy
					</button>
					<button
						type="submit"
						form="course-editor-form"
						className="btn btn-primary"
					>
						<Save size={16} />
						{editingCourse ? 'Cập nhật' : 'Tạo mới'}
					</button>
				</>
			}
		>
			<div className="modal-content-wrapper">
				<form id="course-editor-form" onSubmit={handleSubmit}>
					{/* Basic Information */}
					<div className="modal-form-section">
						<div className="section-title">
							<BookOpen />
							<h4>Thông tin cơ bản</h4>
						</div>
						
						<div className="modal-form-group">
							<label className="form-label">
								<BookOpen />
								Tên khóa học <span className="required">*</span>
							</label>
							<input
								type="text"
								className={`form-input ${errors.title ? 'error' : ''}`}
								value={form.title}
								onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
								placeholder="Nhập tên khóa học"
							/>
							{errors.title && <span className="error-message">{errors.title}</span>}
						</div>

						<div className="modal-form-group">
							<label className="form-label">
								<BookOpen />
								Mô tả ngắn <span className="required">*</span>
							</label>
							<textarea
								className={`form-textarea ${errors.shortDescription ? 'error' : ''}`}
								value={form.shortDescription}
								onChange={(e) => setForm(prev => ({ ...prev, shortDescription: e.target.value }))}
								placeholder="Mô tả ngắn gọn về khóa học"
								rows={2}
							/>
							{errors.shortDescription && <span className="error-message">{errors.shortDescription}</span>}
						</div>

						<div className="modal-form-group">
							<label className="form-label">
								<BookOpen />
								Mô tả chi tiết <span className="required">*</span>
							</label>
							<textarea
								className={`form-textarea ${errors.description ? 'error' : ''}`}
								value={form.description}
								onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
								placeholder="Mô tả chi tiết về khóa học"
								rows={4}
							/>
							{errors.description && <span className="error-message">{errors.description}</span>}
						</div>
					</div>

					{/* Course Details */}
					<div className="modal-form-section">
						<div className="section-title">
							<Settings />
							<h4>Chi tiết khóa học</h4>
						</div>
						
						<div className="modal-form-row">
							<div className="modal-form-group">
								<label className="form-label">
									<Tag />
									Danh mục <span className="required">*</span>
								</label>
								<Dropdown
									options={categoryOptions}
									value={form.categoryId}
									onChange={(value) => setForm(prev => ({ ...prev, categoryId: String(value) }))}
									placeholder="Chọn danh mục"
								/>
								{errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
							</div>

							<div className="modal-form-group">
								<label className="form-label">
									<BookOpen />
									Giảng viên <span className="required">*</span>
								</label>
								<Dropdown
									options={instructorOptions}
									value={form.instructorId}
									onChange={(value) => setForm(prev => ({ ...prev, instructorId: String(value) }))}
									placeholder="Chọn giảng viên"
								/>
								{errors.instructorId && <span className="error-message">{errors.instructorId}</span>}
							</div>
						</div>

						<div className="modal-form-row">
							<div className="modal-form-group">
								<label className="form-label">
									<Target />
									Cấp độ
								</label>
								<Dropdown
									options={levelOptions}
									value={form.level}
									onChange={(value) => setForm(prev => ({ ...prev, level: value as CourseLevel }))}
								/>
							</div>

							<div className="modal-form-group">
								<label className="form-label">
									<Settings />
									Thời lượng (giờ) <span className="required">*</span>
								</label>
								<input
									type="number"
									className={`form-input ${errors.duration ? 'error' : ''}`}
									value={form.duration}
									onChange={(e) => setForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
									min="1"
									placeholder="0"
								/>
								{errors.duration && <span className="error-message">{errors.duration}</span>}
							</div>
						</div>
					</div>

					{/* Pricing */}
					<div className="modal-form-section">
						<div className="section-title">
							<DollarSign />
							<h4>Giá cả</h4>
						</div>
						
						<div className="modal-form-row">
							<div className="modal-form-group">
								<label className="form-label">
									<DollarSign />
									Giá
								</label>
								<input
									type="number"
									className={`form-input ${errors.price ? 'error' : ''}`}
									value={form.price}
									onChange={(e) => setForm(prev => ({ ...prev, price: Number(e.target.value) }))}
									min="0"
									placeholder="0"
								/>
								{errors.price && <span className="error-message">{errors.price}</span>}
							</div>

							<div className="modal-form-group">
								<label className="form-label">
									<DollarSign />
									Token
								</label>
								<Dropdown
									options={[
										{ value: 'LEARN', label: 'LEARN Token' },
										{ value: 'CERT', label: 'CERT Token' },
										{ value: 'SKILL', label: 'SKILL Token' }
									]}
									value={form.tokenSymbol}
									onChange={(value) => setForm(prev => ({ ...prev, tokenSymbol: String(value) }))}
								/>
							</div>
						</div>

						<div className="modal-form-row">
							<div className="modal-form-group">
								<label className="form-label">
									<BookOpen />
									Hình ảnh <span className="required">*</span>
								</label>
								<input
									type="url"
									className={`form-input ${errors.thumbnail ? 'error' : ''}`}
									value={form.thumbnail}
									onChange={(e) => setForm(prev => ({ ...prev, thumbnail: e.target.value }))}
									placeholder="https://example.com/image.jpg"
								/>
								{errors.thumbnail && <span className="error-message">{errors.thumbnail}</span>}
							</div>

							<div className="modal-form-group">
								<label className="form-label">
									<BookOpen />
									Video giới thiệu
								</label>
								<input
									type="url"
									className="form-input"
									value={form.videoUrl}
									onChange={(e) => setForm(prev => ({ ...prev, videoUrl: e.target.value }))}
									placeholder="https://example.com/video.mp4"
								/>
							</div>
						</div>
					</div>

					{/* Tags */}
					<div className="modal-form-section">
						<div className="section-title">
							<Tag />
							<h4>Tags</h4>
						</div>
						
						<div className="modal-form-group">
							<label className="form-label">
								<Tag />
								Thêm tag
							</label>
							<div style={{ display: 'flex', gap: '8px' }}>
								<input
									type="text"
									className="form-input"
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
									placeholder="Nhập tag mới"
									onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
								/>
								<button
									type="button"
									className="modal-action-button"
									onClick={addTag}
								>
									<Plus />
									Thêm
								</button>
							</div>
							
							{form.tags.length > 0 && (
								<div className="modal-tags" style={{ marginTop: '12px' }}>
									{form.tags.map((tag, index) => (
										<span key={index} className="modal-tag">
											{tag}
											<button
												type="button"
												onClick={() => removeTag(index)}
												style={{ 
													marginLeft: '8px', 
													background: 'none', 
													border: 'none', 
													color: 'inherit',
													cursor: 'pointer'
												}}
											>
												<X size={12} />
											</button>
										</span>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Prerequisites */}
					<div className="modal-form-section">
						<div className="section-title">
							<CheckCircle />
							<h4>Điều kiện tiên quyết</h4>
						</div>
						
						<div className="modal-form-group">
							<label className="form-label">
								<CheckCircle />
								Thêm điều kiện tiên quyết
							</label>
							<div style={{ display: 'flex', gap: '8px' }}>
								<input
									type="text"
									className="form-input"
									value={newPrerequisite}
									onChange={(e) => setNewPrerequisite(e.target.value)}
									placeholder="Nhập điều kiện tiên quyết"
									onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
								/>
								<button
									type="button"
									className="modal-action-button"
									onClick={addPrerequisite}
								>
									<Plus />
									Thêm
								</button>
							</div>
							
							{form.prerequisites.length > 0 && (
								<ul className="modal-list" style={{ marginTop: '12px' }}>
									{form.prerequisites.map((prereq, index) => (
										<li key={index} className="list-item">
											<div className="item-icon">
												<CheckCircle />
											</div>
											<div className="item-content">
												<div className="item-title">{prereq}</div>
											</div>
											<div className="item-meta">
												<button
													type="button"
													className="modal-action-button"
													onClick={() => removePrerequisite(index)}
												>
													<Trash2 />
													Xóa
												</button>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>

					{/* Learning Outcomes */}
					<div className="modal-form-section">
						<div className="section-title">
							<Target />
							<h4>Kết quả học tập</h4>
						</div>
						
						<div className="modal-form-group">
							<label className="form-label">
								<Target />
								Thêm kết quả học tập
							</label>
							<div style={{ display: 'flex', gap: '8px' }}>
								<input
									type="text"
									className="form-input"
									value={newOutcome}
									onChange={(e) => setNewOutcome(e.target.value)}
									placeholder="Nhập kết quả học tập"
									onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOutcome())}
								/>
								<button
									type="button"
									className="modal-action-button"
									onClick={addOutcome}
								>
									<Plus />
									Thêm
								</button>
							</div>
							
							{form.learningOutcomes.length > 0 && (
								<ul className="modal-list" style={{ marginTop: '12px' }}>
									{form.learningOutcomes.map((outcome, index) => (
										<li key={index} className="list-item">
											<div className="item-icon">
												<Award />
											</div>
											<div className="item-content">
												<div className="item-title">{outcome}</div>
											</div>
											<div className="item-meta">
												<button
													type="button"
													className="modal-action-button"
													onClick={() => removeOutcome(index)}
												>
													<Trash2 />
													Xóa
												</button>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>

					{/* Settings */}
					<div className="modal-form-section">
						<div className="section-title">
							<Settings />
							<h4>Cài đặt</h4>
						</div>
						
						<div className="modal-form-row">
							<div className="modal-form-group">
								<label className="form-label">
									<CheckCircle />
									Trạng thái
								</label>
								<Dropdown
									options={statusOptions}
									value={form.status}
									onChange={(value) => setForm(prev => ({ ...prev, status: value as CourseStatus }))}
								/>
							</div>

							<div className="modal-form-group">
								<label className="form-label">
									<Users />
									Số học viên tối đa
								</label>
								<input
									type="number"
									className="form-input"
									value={form.maxEnrollments || ''}
									onChange={(e) => setForm(prev => ({ ...prev, maxEnrollments: e.target.value ? Number(e.target.value) : undefined }))}
									min="1"
									placeholder="Không giới hạn"
								/>
							</div>
						</div>

						<div className="modal-checkbox-group">
							<div className="checkbox-item">
								<input
									type="checkbox"
									checked={form.isPublished}
									onChange={(e) => setForm(prev => ({ ...prev, isPublished: e.target.checked }))}
								/>
								<label>Xuất bản khóa học</label>
							</div>

							<div className="checkbox-item">
								<input
									type="checkbox"
									checked={form.isFeatured}
									onChange={(e) => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
								/>
								<label>Đánh dấu nổi bật</label>
							</div>

							<div className="checkbox-item">
								<input
									type="checkbox"
									checked={form.certificateAvailable}
									onChange={(e) => setForm(prev => ({ ...prev, certificateAvailable: e.target.checked }))}
								/>
								<label>Có chứng chỉ</label>
							</div>
						</div>

						{form.certificateAvailable && (
							<div className="modal-form-group">
								<label className="form-label">
									<Award />
									Template chứng chỉ
								</label>
								<input
									type="text"
									className="form-input"
									value={form.certificateTemplate}
									onChange={(e) => setForm(prev => ({ ...prev, certificateTemplate: e.target.value }))}
									placeholder="certificate-template-name"
								/>
							</div>
						)}
					</div>
				</form>
			</div>
		</Modal>
	)
}
