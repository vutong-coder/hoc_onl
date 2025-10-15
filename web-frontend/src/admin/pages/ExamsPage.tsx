import React, { useState, useRef } from 'react'
import { Plus, Download, Upload, Shuffle, FileDown } from 'lucide-react'
import SearchBar from '../components/common/SearchBar'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ExamTable from '../components/exams/ExamTable'
import RandomExamModal from '../components/exams/RandomExamModal'
import useExams from '../hooks/useExams'
import { Exam, RandomExamConfig } from '../types/exam'
import { exportExamsToExcel, importExamsFromExcel, downloadExamTemplate } from '../utils/examExcelHelpers'
import '../styles/common.css'
import '../styles/form.css'

export default function ExamsPage(): JSX.Element {
	const {
		exams,
		allExams,
		filters,
		updateFilter,
		currentPage,
		setCurrentPage,
		totalPages,
		totalItems,
		itemsPerPage,
		sortKey,
		sortOrder,
		handleSort,
		deleteExam,
		updateExam,
		duplicateExam,
		generateRandomExam,
		addExam,
		subjects
	} = useExams()

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [examToDelete, setExamToDelete] = useState<Exam | null>(null)
	const [isViewModalOpen, setIsViewModalOpen] = useState(false)
	const [examToView, setExamToView] = useState<Exam | null>(null)
	const [isRandomModalOpen, setIsRandomModalOpen] = useState(false)
	const [isAddModalOpen, setIsAddModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [examToEdit, setExamToEdit] = useState<Exam | null>(null)
	const [isImportModalOpen, setIsImportModalOpen] = useState(false)
	const [importFile, setImportFile] = useState<File | null>(null)
	const [importPreview, setImportPreview] = useState<Partial<Exam>[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Xử lý xem chi tiết
	const handleView = (exam: Exam) => {
		setExamToView(exam)
		setIsViewModalOpen(true)
	}

	// Xử lý xóa exam
	const handleDelete = (exam: Exam) => {
		setExamToDelete(exam)
		setIsDeleteModalOpen(true)
	}

	// Xác nhận xóa
	const confirmDelete = () => {
		if (examToDelete) {
			deleteExam(examToDelete.id)
			setIsDeleteModalOpen(false)
			setExamToDelete(null)
		}
	}

	// Xử lý sao chép
	const handleDuplicate = (exam: Exam) => {
		duplicateExam(exam.id)
	}

	// Xử lý chỉnh sửa
	const handleEdit = (exam: Exam) => {
		setExamToEdit(exam)
		setIsEditModalOpen(true)
	}

	// Xử lý cập nhật đề thi
	const handleUpdateExam = (examData: Partial<Exam>) => {
		if (examToEdit) {
			const updatedExam: Exam = {
				...examToEdit,
				...examData
			}
			updateExam(updatedExam)
			setIsEditModalOpen(false)
			setExamToEdit(null)
		}
	}

	// Xử lý sinh đề ngẫu nhiên
	const handleGenerateRandom = (config: RandomExamConfig) => {
		const newExam = generateRandomExam(config)
		setIsRandomModalOpen(false)
		alert(`Đã sinh thành công đề thi: "${newExam.title}"`)
	}

	// Xử lý thêm đề thi mới
	const handleAddExam = (examData: Partial<Exam>) => {
		addExam(examData as Omit<Exam, 'id' | 'createdAt'>)
		setIsAddModalOpen(false)
	}

	// Xử lý export Excel
	const handleExportExcel = () => {
		exportExamsToExcel(allExams)
	}

	// Xử lý import Excel
	const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setImportFile(file)

		try {
			const exams = await importExamsFromExcel(file)
			setImportPreview(exams)
			setIsImportModalOpen(true)
		} catch (error) {
			alert('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại file.')
			console.error(error)
		}
	}

	// Xác nhận import
	const confirmImport = () => {
		importPreview.forEach(examData => {
			addExam(examData as Omit<Exam, 'id' | 'createdAt'>)
		})
		setIsImportModalOpen(false)
		setImportFile(null)
		setImportPreview([])
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	// Download template
	const handleDownloadTemplate = () => {
		downloadExamTemplate()
	}

	// Helper functions cho labels
	const getStatusLabel = (status: string) => {
		const labels: Record<string, string> = {
			draft: 'Nháp',
			published: 'Đã xuất bản',
			ongoing: 'Đang diễn ra',
			ended: 'Đã kết thúc',
			archived: 'Lưu trữ'
		}
		return labels[status] || status
	}

	const getTypeLabel = (type: string) => {
		const labels: Record<string, string> = {
			practice: 'Luyện tập',
			quiz: 'Kiểm tra',
			midterm: 'Giữa kỳ',
			final: 'Cuối kỳ',
			assignment: 'Bài tập'
		}
		return labels[type] || type
	}

	const getDifficultyLabel = (difficulty: string) => {
		const labels: Record<string, string> = {
			easy: 'Dễ',
			medium: 'Trung bình',
			hard: 'Khó'
		}
		return labels[difficulty] || difficulty
	}

	return (
		<div style={{ padding: '24px' }}>
			{/* Header */}
			<div style={{ marginBottom: '24px' }}>
				<h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0' }}>
					Quản lý Bài thi
				</h1>
				<p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
					Quản lý đề thi, câu hỏi và kết quả thi
				</p>
			</div>

			{/* Actions Bar */}
			<div style={{ 
				display: 'flex', 
				justifyContent: 'space-between', 
				alignItems: 'center',
				marginBottom: '24px',
				gap: '16px',
				flexWrap: 'wrap'
			}}>
				<SearchBar
					value={filters.search}
					onChange={(value) => updateFilter('search', value)}
					placeholder="Tìm kiếm theo tiêu đề, môn học..."
				/>

				<div style={{ display: 'flex', gap: '12px' }}>
					<input
						ref={fileInputRef}
						type="file"
						accept=".xlsx,.xls"
						style={{ display: 'none' }}
						onChange={handleImportFile}
					/>
					<button 
						className="btn btn-secondary"
						onClick={() => setIsRandomModalOpen(true)}
					>
						<Shuffle size={18} />
						Sinh đề ngẫu nhiên
					</button>
					<button 
						className="btn btn-secondary"
						onClick={() => fileInputRef.current?.click()}
					>
						<Upload size={18} />
						Nhập đề thi
					</button>
					<button 
						className="btn btn-secondary"
						onClick={handleExportExcel}
					>
						<Download size={18} />
						Xuất Excel
					</button>
					<button 
						className="btn btn-primary"
						onClick={() => setIsAddModalOpen(true)}
					>
						<Plus size={18} />
						Thêm đề thi
					</button>
				</div>
			</div>

			{/* Filters */}
			<div className="filters-container">
				<div className="filter-group">
					<label className="filter-label">Môn học</label>
					<select
						className="filter-select"
						value={filters.subject}
						onChange={(e) => updateFilter('subject', e.target.value)}
					>
						<option value="all">Tất cả môn học</option>
						{subjects.map(subject => (
							<option key={subject} value={subject}>{subject}</option>
						))}
					</select>
				</div>

				<div className="filter-group">
					<label className="filter-label">Loại bài thi</label>
					<select
						className="filter-select"
						value={filters.type}
						onChange={(e) => updateFilter('type', e.target.value)}
					>
						<option value="all">Tất cả loại</option>
						<option value="practice">Luyện tập</option>
						<option value="quiz">Kiểm tra</option>
						<option value="midterm">Giữa kỳ</option>
						<option value="final">Cuối kỳ</option>
						<option value="assignment">Bài tập</option>
					</select>
				</div>

				<div className="filter-group">
					<label className="filter-label">Độ khó</label>
					<select
						className="filter-select"
						value={filters.difficulty}
						onChange={(e) => updateFilter('difficulty', e.target.value)}
					>
						<option value="all">Tất cả độ khó</option>
						<option value="easy">Dễ</option>
						<option value="medium">Trung bình</option>
						<option value="hard">Khó</option>
					</select>
				</div>

				<div className="filter-group">
					<label className="filter-label">Trạng thái</label>
					<select
						className="filter-select"
						value={filters.status}
						onChange={(e) => updateFilter('status', e.target.value)}
					>
						<option value="all">Tất cả trạng thái</option>
						<option value="draft">Nháp</option>
						<option value="published">Đã xuất bản</option>
						<option value="ongoing">Đang diễn ra</option>
						<option value="ended">Đã kết thúc</option>
						<option value="archived">Lưu trữ</option>
					</select>
				</div>

				<div className="filter-group">
					<label className="filter-label">Kết quả</label>
					<div style={{ 
						padding: '8px 12px',
						background: 'var(--muted)',
						borderRadius: 'var(--radius-md)',
						fontSize: '14px',
						fontWeight: 500
					}}>
						Tìm thấy {totalItems} đề thi
					</div>
				</div>
			</div>

			{/* Table */}
			<div style={{ 
				background: 'var(--card)',
				borderRadius: 'var(--radius-lg)',
				boxShadow: 'var(--shadow-sm)',
				overflow: 'hidden'
			}}>
				<ExamTable
					exams={exams}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onView={handleView}
					onDuplicate={handleDuplicate}
					onSort={handleSort}
					sortKey={sortKey}
					sortOrder={sortOrder}
				/>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
					totalItems={totalItems}
					itemsPerPage={itemsPerPage}
				/>
			)}

			{/* Random Exam Modal */}
			<RandomExamModal
				isOpen={isRandomModalOpen}
				onClose={() => setIsRandomModalOpen(false)}
				onGenerate={handleGenerateRandom}
			/>

			{/* Add Exam Modal */}
			<Modal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				title="Thêm đề thi mới"
				maxWidth="700px"
				footer={
					<>
						<button
							className="btn btn-secondary"
							onClick={() => setIsAddModalOpen(false)}
						>
							Hủy
						</button>
						<button
							className="btn btn-primary"
							onClick={(e) => {
								const form = (e.target as HTMLButtonElement).closest('.modal-content')?.querySelector('form')
								if (form) {
									const formData = new FormData(form)
									const examData = {
										title: formData.get('title') as string,
										description: formData.get('description') as string,
										subject: formData.get('subject') as string,
										type: formData.get('type') as any,
										totalQuestions: parseInt(formData.get('totalQuestions') as string) || 0,
										duration: parseInt(formData.get('duration') as string) || 0,
										totalPoints: parseInt(formData.get('totalPoints') as string) || 0,
										passingScore: parseInt(formData.get('passingScore') as string) || 0,
										difficulty: formData.get('difficulty') as any,
										maxAttempts: parseInt(formData.get('maxAttempts') as string) || 1,
										allowReview: formData.get('allowReview') === 'on',
										shuffleQuestions: formData.get('shuffleQuestions') === 'on',
										showResults: formData.get('showResults') === 'on',
										status: 'draft' as const,
										createdBy: 'Admin'
									}
									
									if (examData.title && examData.subject && examData.totalQuestions && examData.duration) {
										// Auto-calculate if not provided
										if (!examData.totalPoints) {
											examData.totalPoints = examData.totalQuestions * 2
										}
										if (!examData.passingScore) {
											examData.passingScore = Math.floor(examData.totalPoints * 0.5)
										}
										handleAddExam(examData)
									} else {
										alert('Vui lòng điền đầy đủ các trường bắt buộc (*)')
									}
								}
							}}
						>
							Thêm đề thi
						</button>
					</>
				}
			>
				<form>
					<div className="form-group">
						<label className="form-label">Tiêu đề đề thi *</label>
						<input 
							type="text" 
							name="title" 
							className="form-input" 
							placeholder="VD: Kiểm tra giữa kỳ - Lập trình Web" 
							required 
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Mô tả</label>
						<textarea 
							name="description" 
							className="form-textarea" 
							placeholder="Mô tả ngắn về đề thi..."
							rows={3}
						/>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Môn học *</label>
							<select name="subject" className="form-select" required>
								{subjects.map(s => (
									<option key={s} value={s}>{s}</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label className="form-label">Loại bài thi</label>
							<select name="type" className="form-select" defaultValue="practice">
								<option value="practice">Luyện tập</option>
								<option value="quiz">Kiểm tra</option>
								<option value="midterm">Giữa kỳ</option>
								<option value="final">Cuối kỳ</option>
								<option value="assignment">Bài tập</option>
							</select>
						</div>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Số câu hỏi *</label>
							<input 
								type="number" 
								name="totalQuestions" 
								className="form-input" 
								placeholder="30" 
								min="1"
								required 
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Thời gian (phút) *</label>
							<input 
								type="number" 
								name="duration" 
								className="form-input" 
								placeholder="60" 
								min="1"
								required 
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Độ khó</label>
							<select name="difficulty" className="form-select" defaultValue="medium">
								<option value="easy">Dễ</option>
								<option value="medium">Trung bình</option>
								<option value="hard">Khó</option>
							</select>
						</div>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Tổng điểm</label>
							<input 
								type="number" 
								name="totalPoints" 
								className="form-input" 
								placeholder="Auto = Số câu × 2" 
								min="0"
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Điểm đạt</label>
							<input 
								type="number" 
								name="passingScore" 
								className="form-input" 
								placeholder="Auto = 50% tổng điểm" 
								min="0"
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Số lần thi tối đa</label>
							<input 
								type="number" 
								name="maxAttempts" 
								className="form-input" 
								defaultValue="3" 
								min="1"
							/>
						</div>
					</div>

					<div style={{ 
						display: 'flex', 
						gap: '24px', 
						padding: '16px',
						background: 'var(--muted)',
						borderRadius: 'var(--radius-md)',
						marginTop: '16px'
					}}>
						<label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
							<input 
								type="checkbox" 
								name="allowReview" 
								defaultChecked 
								style={{ width: '18px', height: '18px', cursor: 'pointer' }}
							/>
							<span style={{ fontSize: '14px' }}>Cho phép xem lại câu hỏi</span>
						</label>

						<label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
							<input 
								type="checkbox" 
								name="shuffleQuestions" 
								defaultChecked 
								style={{ width: '18px', height: '18px', cursor: 'pointer' }}
							/>
							<span style={{ fontSize: '14px' }}>Trộn câu hỏi</span>
						</label>

						<label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
							<input 
								type="checkbox" 
								name="showResults" 
								defaultChecked 
								style={{ width: '18px', height: '18px', cursor: 'pointer' }}
							/>
							<span style={{ fontSize: '14px' }}>Hiển thị kết quả</span>
						</label>
					</div>

					<div style={{ 
						marginTop: '16px',
						padding: '12px',
						background: 'var(--accent)',
						color: 'var(--accent-foreground)',
						borderRadius: 'var(--radius-md)',
						fontSize: '13px'
					}}>
						<strong>💡 Lưu ý:</strong> Trường có dấu (*) là bắt buộc. Tổng điểm và Điểm đạt sẽ tự động tính nếu không nhập.
					</div>
				</form>
			</Modal>

			{/* Edit Exam Modal */}
			{examToEdit && (
				<Modal
					isOpen={isEditModalOpen}
					onClose={() => {
						setIsEditModalOpen(false)
						setExamToEdit(null)
					}}
					title="Chỉnh sửa đề thi"
					maxWidth="700px"
					footer={
						<>
							<button
								className="btn btn-secondary"
								onClick={() => {
									setIsEditModalOpen(false)
									setExamToEdit(null)
								}}
							>
								Hủy
							</button>
							<button
								className="btn btn-primary"
								onClick={(e) => {
									const form = (e.target as HTMLButtonElement).closest('.modal-content')?.querySelector('form')
									if (form) {
										const formData = new FormData(form)
										const examData = {
											title: formData.get('title') as string,
											description: formData.get('description') as string,
											subject: formData.get('subject') as string,
											type: formData.get('type') as any,
											totalQuestions: parseInt(formData.get('totalQuestions') as string) || 0,
											duration: parseInt(formData.get('duration') as string) || 0,
											totalPoints: parseInt(formData.get('totalPoints') as string) || 0,
											passingScore: parseInt(formData.get('passingScore') as string) || 0,
											difficulty: formData.get('difficulty') as any,
											maxAttempts: parseInt(formData.get('maxAttempts') as string) || 1,
											allowReview: formData.get('allowReview') === 'on',
											shuffleQuestions: formData.get('shuffleQuestions') === 'on',
											showResults: formData.get('showResults') === 'on'
										}
										
										if (examData.title && examData.subject && examData.totalQuestions && examData.duration) {
											// Auto-calculate if not provided
											if (!examData.totalPoints) {
												examData.totalPoints = examData.totalQuestions * 2
											}
											if (!examData.passingScore) {
												examData.passingScore = Math.floor(examData.totalPoints * 0.5)
											}
											handleUpdateExam(examData)
										} else {
											alert('Vui lòng điền đầy đủ các trường bắt buộc (*)')
										}
									}
								}}
							>
								Cập nhật
							</button>
						</>
					}
				>
					<form>
						<div className="form-group">
							<label className="form-label">Tiêu đề đề thi *</label>
							<input 
								type="text" 
								name="title" 
								className="form-input" 
								defaultValue={examToEdit.title}
								placeholder="VD: Kiểm tra giữa kỳ - Lập trình Web" 
								required 
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Mô tả</label>
							<textarea 
								name="description" 
								className="form-textarea" 
								defaultValue={examToEdit.description || ''}
								placeholder="Mô tả ngắn về đề thi..."
								rows={3}
							/>
						</div>

						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Môn học *</label>
								<select 
									name="subject" 
									className="form-select" 
									defaultValue={examToEdit.subject}
									required
								>
									{subjects.map(s => (
										<option key={s} value={s}>{s}</option>
									))}
								</select>
							</div>

							<div className="form-group">
								<label className="form-label">Loại bài thi</label>
								<select 
									name="type" 
									className="form-select" 
									defaultValue={examToEdit.type}
								>
									<option value="practice">Luyện tập</option>
									<option value="quiz">Kiểm tra</option>
									<option value="midterm">Giữa kỳ</option>
									<option value="final">Cuối kỳ</option>
									<option value="assignment">Bài tập</option>
								</select>
							</div>
						</div>

						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Số câu hỏi *</label>
								<input 
									type="number" 
									name="totalQuestions" 
									className="form-input" 
									defaultValue={examToEdit.totalQuestions}
									placeholder="30" 
									min="1"
									required 
								/>
							</div>

							<div className="form-group">
								<label className="form-label">Thời gian (phút) *</label>
								<input 
									type="number" 
									name="duration" 
									className="form-input" 
									defaultValue={examToEdit.duration}
									placeholder="60" 
									min="1"
									required 
								/>
							</div>

							<div className="form-group">
								<label className="form-label">Độ khó</label>
								<select 
									name="difficulty" 
									className="form-select" 
									defaultValue={examToEdit.difficulty}
								>
									<option value="easy">Dễ</option>
									<option value="medium">Trung bình</option>
									<option value="hard">Khó</option>
								</select>
							</div>
						</div>

						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Tổng điểm</label>
								<input 
									type="number" 
									name="totalPoints" 
									className="form-input" 
									defaultValue={examToEdit.totalPoints}
									placeholder="Auto = Số câu × 2" 
									min="0"
								/>
							</div>

							<div className="form-group">
								<label className="form-label">Điểm đạt</label>
								<input 
									type="number" 
									name="passingScore" 
									className="form-input" 
									defaultValue={examToEdit.passingScore}
									placeholder="Auto = 50% tổng điểm" 
									min="0"
								/>
							</div>

							<div className="form-group">
								<label className="form-label">Số lần thi tối đa</label>
								<input 
									type="number" 
									name="maxAttempts" 
									className="form-input" 
									defaultValue={examToEdit.maxAttempts}
									min="1"
								/>
							</div>
						</div>

						<div style={{ 
							display: 'flex', 
							gap: '24px', 
							padding: '16px',
							background: 'var(--muted)',
							borderRadius: 'var(--radius-md)',
							marginTop: '16px'
						}}>
							<label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
								<input 
									type="checkbox" 
									name="allowReview" 
									defaultChecked={examToEdit.allowReview}
									style={{ width: '18px', height: '18px', cursor: 'pointer' }}
								/>
								<span style={{ fontSize: '14px' }}>Cho phép xem lại câu hỏi</span>
							</label>

							<label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
								<input 
									type="checkbox" 
									name="shuffleQuestions" 
									defaultChecked={examToEdit.shuffleQuestions}
									style={{ width: '18px', height: '18px', cursor: 'pointer' }}
								/>
								<span style={{ fontSize: '14px' }}>Trộn câu hỏi</span>
							</label>

							<label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
								<input 
									type="checkbox" 
									name="showResults" 
									defaultChecked={examToEdit.showResults}
									style={{ width: '18px', height: '18px', cursor: 'pointer' }}
								/>
								<span style={{ fontSize: '14px' }}>Hiển thị kết quả</span>
							</label>
						</div>

						<div style={{ 
							marginTop: '16px',
							padding: '12px',
							background: 'var(--accent)',
							color: 'var(--accent-foreground)',
							borderRadius: 'var(--radius-md)',
							fontSize: '13px'
						}}>
							<strong>💡 Lưu ý:</strong> Các thay đổi sẽ được lưu ngay lập tức. {examToEdit.status === 'ongoing' && '⚠️ Không thể sửa đề đang thi!'}
						</div>
					</form>
				</Modal>
			)}

			{/* Import Preview Modal */}
			<Modal
				isOpen={isImportModalOpen}
				onClose={() => {
					setIsImportModalOpen(false)
					setImportPreview([])
					setImportFile(null)
				}}
				title="Xem trước dữ liệu nhập"
				maxWidth="900px"
				footer={
					<>
						<button
							className="btn btn-secondary"
							onClick={handleDownloadTemplate}
						>
							<FileDown size={18} />
							Tải mẫu Excel
						</button>
						<button
							className="btn btn-secondary"
							onClick={() => {
								setIsImportModalOpen(false)
								setImportPreview([])
								setImportFile(null)
							}}
						>
							Hủy
						</button>
						<button
							className="btn btn-primary"
							onClick={confirmImport}
							disabled={importPreview.length === 0}
						>
							Nhập {importPreview.length} đề thi
						</button>
					</>
				}
			>
				<div>
					<p style={{ marginBottom: '16px', color: 'var(--muted-foreground)' }}>
						Đã tìm thấy <strong>{importPreview.length}</strong> đề thi hợp lệ từ file <strong>{importFile?.name}</strong>
					</p>

					{importPreview.length > 0 ? (
						<div style={{ maxHeight: '500px', overflowY: 'auto' }}>
							<table className="admin-table">
								<thead>
									<tr>
										<th>Tiêu đề</th>
										<th>Môn học</th>
										<th>Loại</th>
										<th>Số câu</th>
										<th>Thời gian</th>
										<th>Độ khó</th>
									</tr>
								</thead>
								<tbody>
									{importPreview.map((exam, index) => (
										<tr key={index}>
											<td>{exam.title}</td>
											<td>{exam.subject}</td>
											<td>
												<span className="badge badge-info">
													{exam.type === 'practice' ? 'Luyện tập' :
													 exam.type === 'quiz' ? 'Kiểm tra' :
													 exam.type === 'midterm' ? 'Giữa kỳ' :
													 exam.type === 'final' ? 'Cuối kỳ' : 'Bài tập'}
												</span>
											</td>
											<td>{exam.totalQuestions} câu</td>
											<td>{exam.duration} phút</td>
											<td>
												<span className={`badge badge-${
													exam.difficulty === 'easy' ? 'success' :
													exam.difficulty === 'medium' ? 'warning' : 'danger'
												}`}>
													{exam.difficulty === 'easy' ? 'Dễ' :
													 exam.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="admin-table-empty">
							<div className="admin-table-empty-icon">⚠️</div>
							<div className="admin-table-empty-text">
								Không tìm thấy dữ liệu hợp lệ trong file
							</div>
							<div style={{ marginTop: '12px' }}>
								<button
									className="btn btn-secondary"
									onClick={handleDownloadTemplate}
								>
									<FileDown size={18} />
									Tải mẫu Excel
								</button>
							</div>
						</div>
					)}
				</div>
			</Modal>

			{/* Delete Modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="Xác nhận xóa đề thi"
				footer={
					<>
						<button 
							className="btn btn-secondary"
							onClick={() => setIsDeleteModalOpen(false)}
						>
							Hủy
						</button>
						<button 
							className="btn btn-danger"
							onClick={confirmDelete}
						>
							Xóa
						</button>
					</>
				}
			>
				<p style={{ margin: 0 }}>
					Bạn có chắc chắn muốn xóa đề thi <strong>{examToDelete?.title}</strong>?
					<br />
					Hành động này không thể hoàn tác.
				</p>
			</Modal>

			{/* View Details Modal */}
			<Modal
				isOpen={isViewModalOpen}
				onClose={() => setIsViewModalOpen(false)}
				title="Chi tiết đề thi"
				maxWidth="700px"
			>
				{examToView && (
					<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
						<div>
							<h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
								{examToView.title}
							</h3>
							<p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
								{examToView.description}
							</p>
						</div>

						<div className="form-grid">
							<div>
								<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
									Môn học
								</label>
								<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{examToView.subject}</p>
							</div>

							<div>
								<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
									Loại bài thi
								</label>
								<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{getTypeLabel(examToView.type)}</p>
							</div>

							<div>
								<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
									Số câu hỏi
								</label>
								<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{examToView.totalQuestions} câu</p>
							</div>

							<div>
								<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
									Thời gian
								</label>
								<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{examToView.duration} phút</p>
							</div>

							<div>
								<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
									Tổng điểm
								</label>
								<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{examToView.totalPoints} điểm</p>
							</div>

							<div>
								<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
									Điểm đạt
								</label>
								<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{examToView.passingScore} điểm</p>
							</div>

							<div>
								<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
									Độ khó
								</label>
								<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{getDifficultyLabel(examToView.difficulty)}</p>
							</div>

							<div>
								<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
									Trạng thái
								</label>
								<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{getStatusLabel(examToView.status)}</p>
							</div>

							<div>
								<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
									Số lần thi tối đa
								</label>
								<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{examToView.maxAttempts}</p>
							</div>

							<div>
								<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
									Người tạo
								</label>
								<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{examToView.createdBy}</p>
							</div>
						</div>

						<div style={{ 
							padding: '16px',
							background: 'var(--muted)',
							borderRadius: 'var(--radius-md)',
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							gap: '12px',
							fontSize: '14px'
						}}>
							<div>
								<label style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
									Xem lại câu hỏi
								</label>
								<p style={{ margin: '4px 0 0', fontWeight: 500 }}>
									{examToView.allowReview ? '✓ Cho phép' : '✗ Không'}
								</p>
							</div>
							<div>
								<label style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
									Trộn câu hỏi
								</label>
								<p style={{ margin: '4px 0 0', fontWeight: 500 }}>
									{examToView.shuffleQuestions ? '✓ Có' : '✗ Không'}
								</p>
							</div>
							<div>
								<label style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
									Hiển thị kết quả
								</label>
								<p style={{ margin: '4px 0 0', fontWeight: 500 }}>
									{examToView.showResults ? '✓ Có' : '✗ Không'}
								</p>
							</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	)
}
