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
import CourseDetailModal from '../modal/Courses/CourseDetailModal'
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
						gridTemplateColumns: 'repeat(4, 1fr)', 
						gap: '16px' 
					}}>
						{/* Card 1 - Tổng khóa học */}
						<div style={{ 
							background: 'var(--card)',
							borderRadius: 'var(--radius-lg)',
							padding: '20px',
							boxShadow: 'var(--shadow-sm)',
							border: '1px solid var(--border)',
							position: 'relative',
							overflow: 'hidden'
						}}>
							<div style={{ 
								position: 'absolute',
								top: '0',
								right: '0',
								width: '80px',
								height: '80px',
								background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)',
								borderRadius: '50%',
								transform: 'translate(20px, -20px)'
							}} />
							<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
								<div style={{ 
									width: '40px', 
									height: '40px', 
									borderRadius: 'var(--radius-md)', 
									display: 'flex', 
									alignItems: 'center', 
									justifyContent: 'center',
									background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
									color: 'white',
									flexShrink: 0
								}}>
									<BookOpen size={20} />
								</div>
								<div style={{ flex: 1 }}>
									<div style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '6px', fontWeight: 500 }}>
										Tổng khóa học
									</div>
									<div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1 }}>
										{dashboard.stats.totalCourses}
									</div>
									<div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 600, marginTop: '4px' }}>
										{dashboard.stats.publishedCourses} đã xuất bản
									</div>
								</div>
							</div>
						</div>

						{/* Card 2 - Tổng học viên */}
						<div style={{ 
							background: 'var(--card)',
							borderRadius: 'var(--radius-lg)',
							padding: '20px',
							boxShadow: 'var(--shadow-sm)',
							border: '1px solid var(--border)',
							position: 'relative',
							overflow: 'hidden'
						}}>
							<div style={{ 
								position: 'absolute',
								top: '0',
								right: '0',
								width: '80px',
								height: '80px',
								background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
								borderRadius: '50%',
								transform: 'translate(20px, -20px)'
							}} />
							<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
								<div style={{ 
									width: '40px', 
									height: '40px', 
									borderRadius: 'var(--radius-md)', 
									display: 'flex', 
									alignItems: 'center', 
									justifyContent: 'center',
									background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
									color: 'white',
									flexShrink: 0
								}}>
									<Users size={20} />
								</div>
								<div style={{ flex: 1 }}>
									<div style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '6px', fontWeight: 500 }}>
										Tổng học viên
									</div>
									<div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1 }}>
										{formatNumber(dashboard.stats.totalEnrollments)}
									</div>
									<div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
										{dashboard.stats.activeInstructors} giảng viên
									</div>
								</div>
							</div>
						</div>

						{/* Card 3 - Đánh giá TB */}
						<div style={{ 
							background: 'var(--card)',
							borderRadius: 'var(--radius-lg)',
							padding: '20px',
							boxShadow: 'var(--shadow-sm)',
							border: '1px solid var(--border)',
							position: 'relative',
							overflow: 'hidden'
						}}>
							<div style={{ 
								position: 'absolute',
								top: '0',
								right: '0',
								width: '80px',
								height: '80px',
								background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
								borderRadius: '50%',
								transform: 'translate(20px, -20px)'
							}} />
							<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
								<div style={{ 
									width: '40px', 
									height: '40px', 
									borderRadius: 'var(--radius-md)', 
									display: 'flex', 
									alignItems: 'center', 
									justifyContent: 'center',
									background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
									color: 'white',
									flexShrink: 0
								}}>
									<Star size={20} />
								</div>
								<div style={{ flex: 1 }}>
									<div style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '6px', fontWeight: 500 }}>
										Đánh giá TB
									</div>
									<div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1 }}>
										{dashboard.stats.averageRating.toFixed(1)}
									</div>
									<div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600, marginTop: '4px' }}>
										{dashboard.stats.featuredCourses} khóa nổi bật
									</div>
								</div>
							</div>
						</div>

						{/* Card 4 - Doanh thu */}
						<div style={{ 
							background: 'var(--card)',
							borderRadius: 'var(--radius-lg)',
							padding: '20px',
							boxShadow: 'var(--shadow-sm)',
							border: '1px solid var(--border)',
							position: 'relative',
							overflow: 'hidden'
						}}>
							<div style={{ 
								position: 'absolute',
								top: '0',
								right: '0',
								width: '80px',
								height: '80px',
								background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
								borderRadius: '50%',
								transform: 'translate(20px, -20px)'
							}} />
							<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
								<div style={{ 
									width: '40px', 
									height: '40px', 
									borderRadius: 'var(--radius-md)', 
									display: 'flex', 
									alignItems: 'center', 
									justifyContent: 'center',
									background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
									color: 'white',
									flexShrink: 0
								}}>
									<TrendingUp size={20} />
								</div>
								<div style={{ flex: 1 }}>
									<div style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '6px', fontWeight: 500 }}>
										Doanh thu
									</div>
									<div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1 }}>
										{formatCurrency(dashboard.stats.totalRevenue)}
									</div>
									<div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600, marginTop: '4px' }}>
										Tổng doanh thu
									</div>
								</div>
							</div>
						</div>
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
							className={`btn btn-icon btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
							onClick={() => setViewMode('grid')}
							title="Xem dạng lưới"
						>
							<Grid3X3 size={16} />
						</button>
						<button
							className={`btn btn-icon btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
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
			<CourseDetailModal
				isOpen={!!selectedCourse}
				onClose={() => setSelectedCourse(null)}
				course={selectedCourse}
			/>

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