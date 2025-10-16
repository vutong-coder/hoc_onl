import React, { useState, useRef } from 'react'
import { 
	BookOpen, 
	Plus, 
	Grid3X3, 
	List,
	RefreshCw,
	Download,
	Upload,
	Settings,
	BarChart3,
	Users,
	Star,
	TrendingUp,
	FileText
} from 'lucide-react'
import useCourses from '../hooks/useCourses'
import CourseGrid from '../components/courses/CourseGrid'
import CourseListTable from '../components/courses/CourseListTable'
import CourseFilterBar from '../components/courses/CourseFilterBar'
import CourseEditorModal from '../components/courses/CourseEditorModal'
import StatCard from '../components/common/StatCard'
import Modal from '../components/common/Modal'
import { exportCoursesToExcel, importCoursesFromExcel, generateExcelTemplate } from '../utils/courseExcelHelpers'
import '../styles/common.css'
import '../styles/courses.css'

export default function CoursesPage(): JSX.Element {
	const {
		dashboard,
		courses,
		categories,
		instructors,
		filters,
		updateFilter,
		clearFilters,
		addCourse,
		updateCourse,
		deleteCourse,
		toggleCourseStatus,
		isCourseEditorOpen,
		editingCourse,
		openCourseEditor,
		closeCourseEditor,
		saveCourse,
		selectedCourse,
		setSelectedCourse,
		loading,
		setLoading
	} = useCourses()

	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
	const [showStats, setShowStats] = useState(true)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleAddCourse = () => {
		openCourseEditor()
	}

	const handleEditCourse = (course: any) => {
		openCourseEditor(course)
	}

	const handleDeleteCourse = (courseId: string) => {
		if (confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
			deleteCourse(courseId)
		}
	}

	const handleToggleCourseStatus = (courseId: string) => {
		toggleCourseStatus(courseId)
	}

	const handleCourseClick = (course: any) => {
		setSelectedCourse(course)
	}

	const handleExportCourses = () => {
		try {
			const filename = `courses-${new Date().toISOString().split('T')[0]}.xlsx`
			exportCoursesToExcel(courses, filename)
		} catch (error) {
			console.error('Export error:', error)
			alert('Có lỗi xảy ra khi xuất file Excel')
		}
	}

	const handleImportCourses = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		try {
			setLoading(true)
			const importedCourses = await importCoursesFromExcel(file)
			
			// Process imported courses
			for (const courseForm of importedCourses) {
				// Map category and instructor names to IDs
				const category = categories.find(cat => cat.name === courseForm.categoryId)
				const instructor = instructors.find(inst => inst.name === courseForm.instructorId)
				
				if (category && instructor) {
					const mappedCourseForm = {
						...courseForm,
						categoryId: category.id,
						instructorId: instructor.id
					}
					addCourse(mappedCourseForm)
				}
			}
			
			alert(`Đã nhập thành công ${importedCourses.length} khóa học`)
		} catch (error) {
			console.error('Import error:', error)
			alert(`Lỗi nhập file: ${error instanceof Error ? error.message : 'Unknown error'}`)
		} finally {
			setLoading(false)
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		}
	}

	const handleDownloadTemplate = () => {
		generateExcelTemplate()
	}

	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
		return num.toString()
	}

	const formatCurrency = (amount: number) => {
		return `${amount.toLocaleString()} LEARN`
	}

	return (
		<div style={{ padding: '24px' }}>
			{/* Header */}
			<div style={{ marginBottom: '24px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
					<div>
						<h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0' }}>
							Quản lý khóa học
						</h1>
						<p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
							Quản lý và tổ chức các khóa học trực tuyến với đầy đủ tính năng
						</p>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<button
							className="btn btn-secondary"
							onClick={handleDownloadTemplate}
							title="Tải template Excel"
						>
							<FileText size={18} />
							Template
						</button>
						<button
							className="btn btn-secondary"
							onClick={handleImportCourses}
						>
							<Upload size={18} />
							Nhập Excel
						</button>
						<button
							className="btn btn-secondary"
							onClick={handleExportCourses}
						>
							<Download size={18} />
							Xuất Excel
						</button>
						<button
							className="btn btn-primary"
							onClick={handleAddCourse}
						>
							<Plus size={18} />
							Thêm khóa học
						</button>
					</div>
				</div>
			</div>

			{/* Stats Overview */}
			{showStats && (
				<div style={{ marginBottom: '24px' }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
						<h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
							Tổng quan
						</h2>
						<button
							className="btn btn-icon btn-sm btn-secondary"
							onClick={() => setShowStats(!showStats)}
							title="Ẩn/hiện thống kê"
						>
							<BarChart3 size={16} />
						</button>
					</div>
					
					<div style={{ 
						display: 'grid', 
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
						gap: '16px' 
					}}>
						<StatCard
							title="Tổng khóa học"
							value={dashboard.stats.totalCourses}
							subtitle={`${dashboard.stats.publishedCourses} đã xuất bản`}
							icon={<BookOpen size={24} />}
							gradient="primary"
						/>
						
						<StatCard
							title="Tổng học viên"
							value={formatNumber(dashboard.stats.totalEnrollments)}
							subtitle={`${dashboard.stats.activeInstructors} giảng viên`}
							icon={<Users size={24} />}
							gradient="accent"
						/>
						
						<StatCard
							title="Đánh giá TB"
							value={`${dashboard.stats.averageRating.toFixed(1)}`}
							subtitle={`${dashboard.stats.featuredCourses} khóa nổi bật`}
							icon={<Star size={24} />}
							gradient="primary"
						/>
						
						<StatCard
							title="Doanh thu"
							value={formatCurrency(dashboard.stats.totalRevenue)}
							subtitle="Tổng doanh thu"
							icon={<TrendingUp size={24} />}
							gradient="accent"
						/>
					</div>
				</div>
			)}

			{/* Controls */}
			<div style={{ 
				display: 'flex', 
				justifyContent: 'space-between', 
				alignItems: 'center',
				marginBottom: '24px',
				gap: '16px',
				flexWrap: 'wrap'
			}}>
				<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
					<div style={{ 
						display: 'flex', 
						gap: '4px',
						background: 'var(--muted)',
						padding: '4px',
						borderRadius: 'var(--radius-md)'
					}}>
						<button
							className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
							onClick={() => setViewMode('grid')}
							title="Xem dạng lưới"
						>
							<Grid3X3 size={16} />
						</button>
						<button
							className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
							onClick={() => setViewMode('list')}
							title="Xem dạng danh sách"
						>
							<List size={16} />
						</button>
					</div>

					<div style={{ 
						padding: '8px 12px',
						background: 'var(--muted)',
						borderRadius: 'var(--radius-md)',
						fontSize: '14px',
						fontWeight: 500
					}}>
						{courses.length} khóa học
					</div>
				</div>

				<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => window.location.reload()}
					>
						<RefreshCw size={16} />
						Làm mới
					</button>
					
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => setShowStats(!showStats)}
					>
						<BarChart3 size={16} />
						{showStats ? 'Ẩn' : 'Hiện'} thống kê
					</button>
				</div>
			</div>

			{/* Filters */}
			<CourseFilterBar
				filters={filters}
				onFilterChange={updateFilter}
				categories={categories}
				instructors={instructors}
				onClearFilters={clearFilters}
			/>

			{/* Content */}
			<div style={{ 
				background: 'var(--card)',
				borderRadius: 'var(--radius-lg)',
				padding: '24px',
				boxShadow: 'var(--shadow-sm)',
				minHeight: '500px'
			}}>
				{viewMode === 'grid' ? (
					<CourseGrid
						courses={courses}
						onCourseClick={handleCourseClick}
						onEditCourse={handleEditCourse}
						onDeleteCourse={handleDeleteCourse}
						onToggleStatus={handleToggleCourseStatus}
						loading={loading}
						emptyMessage="Không có khóa học nào phù hợp với bộ lọc"
					/>
				) : (
					<CourseListTable
						courses={courses}
						onCourseClick={handleCourseClick}
						onEditCourse={handleEditCourse}
						onDeleteCourse={handleDeleteCourse}
						onToggleStatus={handleToggleCourseStatus}
						loading={loading}
						emptyMessage="Không có khóa học nào phù hợp với bộ lọc"
					/>
				)}
			</div>

			{/* Course Editor Modal */}
			<CourseEditorModal
				isOpen={isCourseEditorOpen}
				onClose={closeCourseEditor}
				onSave={saveCourse}
				editingCourse={editingCourse}
				categories={categories}
				instructors={instructors}
				title={editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
			/>

			{/* Course Details Modal */}
			<Modal
				isOpen={!!selectedCourse}
				onClose={() => setSelectedCourse(null)}
				title="Chi tiết khóa học"
				maxWidth="800px"
			>
				{selectedCourse && (
					<div style={{ padding: '20px' }}>
						{/* Course Header */}
						<div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
							<img 
								src={selectedCourse.thumbnail} 
								alt={selectedCourse.title}
								style={{ 
									width: '200px', 
									height: '120px', 
									objectFit: 'cover', 
									borderRadius: 'var(--radius-md)' 
								}}
							/>
							<div style={{ flex: 1 }}>
								<h3 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0' }}>
									{selectedCourse.title}
								</h3>
								<p style={{ color: 'var(--muted-foreground)', margin: '0 0 12px 0' }}>
									{selectedCourse.shortDescription}
								</p>
								<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
									<span style={{ 
										padding: '4px 8px', 
										background: 'var(--muted)', 
										borderRadius: 'var(--radius-sm)',
										fontSize: '12px'
									}}>
										{selectedCourse.category.icon} {selectedCourse.category.name}
									</span>
									<span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
										bởi {selectedCourse.instructor.name}
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
										<span>{selectedCourse.level}</span>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<span style={{ color: 'var(--muted-foreground)' }}>Thời lượng:</span>
										<span>{selectedCourse.duration} giờ</span>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<span style={{ color: 'var(--muted-foreground)' }}>Giá:</span>
										<span style={{ fontWeight: 600, color: 'var(--primary)' }}>
											{selectedCourse.price === 0 ? 'Miễn phí' : 
												`${selectedCourse.price.toLocaleString()} ${selectedCourse.tokenSymbol}`}
										</span>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<span style={{ color: 'var(--muted-foreground)' }}>Học viên:</span>
										<span>{selectedCourse.enrollmentCount.toLocaleString()}</span>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<span style={{ color: 'var(--muted-foreground)' }}>Đánh giá:</span>
										<span>{selectedCourse.rating} ⭐ ({selectedCourse.reviewCount})</span>
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
											background: selectedCourse.isPublished ? '#10b981' : '#f59e0b',
											color: 'white'
										}}>
											{selectedCourse.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
										</span>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<span style={{ color: 'var(--muted-foreground)' }}>Nổi bật:</span>
										<span>{selectedCourse.isFeatured ? 'Có' : 'Không'}</span>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<span style={{ color: 'var(--muted-foreground)' }}>Chứng chỉ:</span>
										<span>{selectedCourse.certificateAvailable ? 'Có' : 'Không'}</span>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<span style={{ color: 'var(--muted-foreground)' }}>Tạo lúc:</span>
										<span>{new Date(selectedCourse.createdAt).toLocaleDateString('vi-VN')}</span>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<span style={{ color: 'var(--muted-foreground)' }}>Cập nhật:</span>
										<span>{new Date(selectedCourse.updatedAt).toLocaleDateString('vi-VN')}</span>
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
								{selectedCourse.description}
							</p>
						</div>

						{/* Tags */}
						{selectedCourse.tags.length > 0 && (
							<div style={{ marginBottom: '24px' }}>
								<h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
									Tags
								</h4>
								<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
									{selectedCourse.tags.map(tag => (
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
						{selectedCourse.prerequisites.length > 0 && (
							<div style={{ marginBottom: '24px' }}>
								<h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
									Điều kiện tiên quyết
								</h4>
								<ul style={{ paddingLeft: '20px', margin: 0 }}>
									{selectedCourse.prerequisites.map((prereq, index) => (
										<li key={index} style={{ marginBottom: '4px' }}>
											{prereq}
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Learning Outcomes */}
						{selectedCourse.learningOutcomes.length > 0 && (
							<div>
								<h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
									Kết quả học tập
								</h4>
								<ul style={{ paddingLeft: '20px', margin: 0 }}>
									{selectedCourse.learningOutcomes.map((outcome, index) => (
										<li key={index} style={{ marginBottom: '4px' }}>
											{outcome}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				)}
			</Modal>

			{/* Hidden file input for import */}
			<input
				ref={fileInputRef}
				type="file"
				accept=".xlsx,.xls"
				onChange={handleFileChange}
				style={{ display: 'none' }}
			/>
		</div>
	)
}