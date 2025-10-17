import React, { useState, useRef } from 'react'
import { Plus, Download, Upload, Shuffle, FileDown } from 'lucide-react'
import SearchBar from '../components/common/SearchBar'
import Pagination from '../components/common/Pagination'
import ExamTable from '../components/exams/ExamTable'
import RandomExamModal from '../components/exams/RandomExamModal'
import AddExamModal from '../modal/Exams/AddExamModal'
import EditExamModal from '../modal/Exams/EditExamModal'
import ImportExamModal from '../modal/Exams/ImportExamModal'
import DeleteExamModal from '../modal/Exams/DeleteExamModal'
import ViewExamModal from '../modal/Exams/ViewExamModal'
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

	// Helper functions moved to modal components

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
			<AddExamModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onAddExam={handleAddExam}
				subjects={subjects}
			/>

			{/* Edit Exam Modal */}
			<EditExamModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false)
					setExamToEdit(null)
				}}
				onUpdateExam={handleUpdateExam}
				exam={examToEdit}
				subjects={subjects}
			/>

			{/* Import Preview Modal */}
			<ImportExamModal
				isOpen={isImportModalOpen}
				onClose={() => {
					setIsImportModalOpen(false)
					setImportPreview([])
					setImportFile(null)
				}}
				onConfirmImport={confirmImport}
				onDownloadTemplate={handleDownloadTemplate}
				importFile={importFile}
				importPreview={importPreview}
			/>

			{/* Delete Modal */}
			<DeleteExamModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={confirmDelete}
				exam={examToDelete}
			/>

			{/* View Details Modal */}
			<ViewExamModal
				isOpen={isViewModalOpen}
				onClose={() => setIsViewModalOpen(false)}
				exam={examToView}
			/>
		</div>
	)
}
