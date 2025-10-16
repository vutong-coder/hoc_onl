import React, { useState, useEffect } from 'react'
import { Course, CourseForm, CourseCategory, Instructor, CourseLevel, CourseStatus } from '../../types/course'
import Modal from '../common/Modal'
import Dropdown from '../common/Dropdown'
import { X, Save, Plus, Trash2 } from 'lucide-react'

interface CourseEditorModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (course: CourseForm) => void
	editingCourse?: Course | null
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
			setForm({
				title: editingCourse.title,
				description: editingCourse.description,
				shortDescription: editingCourse.shortDescription,
				categoryId: editingCourse.category.id,
				instructorId: editingCourse.instructor.id,
				level: editingCourse.level,
				duration: editingCourse.duration,
				price: editingCourse.price,
				tokenSymbol: editingCourse.tokenSymbol,
				thumbnail: editingCourse.thumbnail,
				videoUrl: editingCourse.videoUrl || '',
				tags: editingCourse.tags,
				status: editingCourse.status,
				isPublished: editingCourse.isPublished,
				isFeatured: editingCourse.isFeatured,
				maxEnrollments: editingCourse.maxEnrollments,
				prerequisites: editingCourse.prerequisites,
				learningOutcomes: editingCourse.learningOutcomes,
				certificateAvailable: editingCourse.certificateAvailable,
				certificateTemplate: editingCourse.certificateTemplate || ''
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
		>
			<form onSubmit={handleSubmit} className="course-editor-form">
				{/* Basic Information */}
				<div className="form-section">
					<h3 className="section-title">Thông tin cơ bản</h3>
					
					<div className="form-group">
						<label className="form-label">Tên khóa học *</label>
						<input
							type="text"
							className={`form-input ${errors.title ? 'error' : ''}`}
							value={form.title}
							onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
							placeholder="Nhập tên khóa học"
						/>
						{errors.title && <span className="error-message">{errors.title}</span>}
					</div>

					<div className="form-group">
						<label className="form-label">Mô tả ngắn *</label>
						<textarea
							className={`form-textarea ${errors.shortDescription ? 'error' : ''}`}
							value={form.shortDescription}
							onChange={(e) => setForm(prev => ({ ...prev, shortDescription: e.target.value }))}
							placeholder="Mô tả ngắn gọn về khóa học"
							rows={2}
						/>
						{errors.shortDescription && <span className="error-message">{errors.shortDescription}</span>}
					</div>

					<div className="form-group">
						<label className="form-label">Mô tả chi tiết *</label>
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
				<div className="form-section">
					<h3 className="section-title">Chi tiết khóa học</h3>
					
					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Danh mục *</label>
							<Dropdown
								options={categoryOptions}
								value={form.categoryId}
								onChange={(value) => setForm(prev => ({ ...prev, categoryId: String(value) }))}
								placeholder="Chọn danh mục"
							/>
							{errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
						</div>

						<div className="form-group">
							<label className="form-label">Giảng viên *</label>
							<Dropdown
								options={instructorOptions}
								value={form.instructorId}
								onChange={(value) => setForm(prev => ({ ...prev, instructorId: String(value) }))}
								placeholder="Chọn giảng viên"
							/>
							{errors.instructorId && <span className="error-message">{errors.instructorId}</span>}
						</div>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Cấp độ</label>
							<Dropdown
								options={levelOptions}
								value={form.level}
								onChange={(value) => setForm(prev => ({ ...prev, level: value as CourseLevel }))}
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Thời lượng (giờ) *</label>
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

					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Giá</label>
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

						<div className="form-group">
							<label className="form-label">Token</label>
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

					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Hình ảnh *</label>
							<input
								type="url"
								className={`form-input ${errors.thumbnail ? 'error' : ''}`}
								value={form.thumbnail}
								onChange={(e) => setForm(prev => ({ ...prev, thumbnail: e.target.value }))}
								placeholder="https://example.com/image.jpg"
							/>
							{errors.thumbnail && <span className="error-message">{errors.thumbnail}</span>}
						</div>

						<div className="form-group">
							<label className="form-label">Video giới thiệu</label>
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
				<div className="form-section">
					<h3 className="section-title">Tags</h3>
					
					<div className="form-group">
						<div className="tag-input-group">
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
								className="btn btn-secondary"
								onClick={addTag}
							>
								<Plus size={16} />
							</button>
						</div>
						
						{form.tags.length > 0 && (
							<div className="tags-list">
								{form.tags.map((tag, index) => (
									<span key={index} className="tag-item">
										{tag}
										<button
											type="button"
											className="tag-remove"
											onClick={() => removeTag(index)}
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
				<div className="form-section">
					<h3 className="section-title">Điều kiện tiên quyết</h3>
					
					<div className="form-group">
						<div className="list-input-group">
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
								className="btn btn-secondary"
								onClick={addPrerequisite}
							>
								<Plus size={16} />
							</button>
						</div>
						
						{form.prerequisites.length > 0 && (
							<div className="list-items">
								{form.prerequisites.map((prereq, index) => (
									<div key={index} className="list-item">
										<span>{prereq}</span>
										<button
											type="button"
											className="btn btn-icon btn-sm btn-danger"
											onClick={() => removePrerequisite(index)}
										>
											<Trash2 size={12} />
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Learning Outcomes */}
				<div className="form-section">
					<h3 className="section-title">Kết quả học tập</h3>
					
					<div className="form-group">
						<div className="list-input-group">
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
								className="btn btn-secondary"
								onClick={addOutcome}
							>
								<Plus size={16} />
							</button>
						</div>
						
						{form.learningOutcomes.length > 0 && (
							<div className="list-items">
								{form.learningOutcomes.map((outcome, index) => (
									<div key={index} className="list-item">
										<span>{outcome}</span>
										<button
											type="button"
											className="btn btn-icon btn-sm btn-danger"
											onClick={() => removeOutcome(index)}
										>
											<Trash2 size={12} />
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Settings */}
				<div className="form-section">
					<h3 className="section-title">Cài đặt</h3>
					
					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Trạng thái</label>
							<Dropdown
								options={statusOptions}
								value={form.status}
								onChange={(value) => setForm(prev => ({ ...prev, status: value as CourseStatus }))}
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Số học viên tối đa</label>
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

					<div className="form-group">
						<label className="checkbox-label">
							<input
								type="checkbox"
								checked={form.isPublished}
								onChange={(e) => setForm(prev => ({ ...prev, isPublished: e.target.checked }))}
							/>
							<span>Xuất bản khóa học</span>
						</label>
					</div>

					<div className="form-group">
						<label className="checkbox-label">
							<input
								type="checkbox"
								checked={form.isFeatured}
								onChange={(e) => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
							/>
							<span>Đánh dấu nổi bật</span>
						</label>
					</div>

					<div className="form-group">
						<label className="checkbox-label">
							<input
								type="checkbox"
								checked={form.certificateAvailable}
								onChange={(e) => setForm(prev => ({ ...prev, certificateAvailable: e.target.checked }))}
							/>
							<span>Có chứng chỉ</span>
						</label>
					</div>

					{form.certificateAvailable && (
						<div className="form-group">
							<label className="form-label">Template chứng chỉ</label>
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

				{/* Actions */}
				<div className="form-actions">
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
						className="btn btn-primary"
					>
						<Save size={16} />
						{editingCourse ? 'Cập nhật' : 'Tạo mới'}
					</button>
				</div>
			</form>
		</Modal>
	)
}
