import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Course, CourseForm, CourseLevel, CourseStatus } from '../types/course'

// Export courses to Excel
export const exportCoursesToExcel = (courses: Course[], filename = 'courses.xlsx') => {
	// Prepare data for export
	const exportData = courses.map(course => ({
		'ID': course.id,
		'Tên khóa học': course.title,
		'Mô tả ngắn': course.shortDescription,
		'Danh mục': course.category.name,
		'Giảng viên': course.instructor.name,
		'Cấp độ': course.level,
		'Thời lượng (giờ)': course.duration,
		'Giá (Token)': course.price,
		'Loại Token': course.tokenSymbol,
		'Trạng thái': course.status,
		'Đã xuất bản': course.isPublished ? 'Có' : 'Không',
		'Nổi bật': course.isFeatured ? 'Có' : 'Không',
		'Số học viên': course.enrollmentCount,
		'Số học viên tối đa': course.maxEnrollments || 'Không giới hạn',
		'Đánh giá': course.rating,
		'Số đánh giá': course.reviewCount,
		'Tags': course.tags.join(', '),
		'Điều kiện tiên quyết': course.prerequisites.join(', '),
		'Kết quả học tập': course.learningOutcomes.join(', '),
		'Có chứng chỉ': course.certificateAvailable ? 'Có' : 'Không',
		'Template chứng chỉ': course.certificateTemplate || '',
		'Ngày tạo': new Date(course.createdAt).toLocaleDateString('vi-VN'),
		'Ngày cập nhật': new Date(course.updatedAt).toLocaleDateString('vi-VN'),
		'Ngày xuất bản': course.publishedAt ? new Date(course.publishedAt).toLocaleDateString('vi-VN') : ''
	}))

	// Create workbook and worksheet
	const workbook = XLSX.utils.book_new()
	const worksheet = XLSX.utils.json_to_sheet(exportData)

	// Set column widths
	const columnWidths = [
		{ wch: 15 }, // ID
		{ wch: 30 }, // Tên khóa học
		{ wch: 40 }, // Mô tả ngắn
		{ wch: 20 }, // Danh mục
		{ wch: 25 }, // Giảng viên
		{ wch: 15 }, // Cấp độ
		{ wch: 15 }, // Thời lượng
		{ wch: 15 }, // Giá
		{ wch: 15 }, // Loại Token
		{ wch: 15 }, // Trạng thái
		{ wch: 15 }, // Đã xuất bản
		{ wch: 15 }, // Nổi bật
		{ wch: 15 }, // Số học viên
		{ wch: 20 }, // Số học viên tối đa
		{ wch: 10 }, // Đánh giá
		{ wch: 15 }, // Số đánh giá
		{ wch: 30 }, // Tags
		{ wch: 40 }, // Điều kiện tiên quyết
		{ wch: 40 }, // Kết quả học tập
		{ wch: 15 }, // Có chứng chỉ
		{ wch: 25 }, // Template chứng chỉ
		{ wch: 15 }, // Ngày tạo
		{ wch: 15 }, // Ngày cập nhật
		{ wch: 15 }  // Ngày xuất bản
	]
	worksheet['!cols'] = columnWidths

	// Add worksheet to workbook
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Khóa học')

	// Generate Excel file
	const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
	const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
	
	saveAs(data, filename)
}

// Import courses from Excel
export const importCoursesFromExcel = (file: File): Promise<CourseForm[]> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		
		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target?.result as ArrayBuffer)
				const workbook = XLSX.read(data, { type: 'array' })
				
				// Get first worksheet
				const sheetName = workbook.SheetNames[0]
				const worksheet = workbook.Sheets[sheetName]
				
				// Convert to JSON
				const jsonData = XLSX.utils.sheet_to_json(worksheet)
				
				// Transform to CourseForm
				const courses = jsonData.map((row: any, index: number): CourseForm => {
					// Validate required fields
					if (!row['Tên khóa học'] || !row['Mô tả ngắn'] || !row['Danh mục']) {
						throw new Error(`Dòng ${index + 2}: Thiếu thông tin bắt buộc (Tên khóa học, Mô tả ngắn, Danh mục)`)
					}

					return {
						title: String(row['Tên khóa học'] || ''),
						description: String(row['Mô tả chi tiết'] || row['Mô tả ngắn'] || ''),
						shortDescription: String(row['Mô tả ngắn'] || ''),
						categoryId: String(row['ID Danh mục'] || ''), // Will need to map by name
						instructorId: String(row['ID Giảng viên'] || ''), // Will need to map by name
						level: (mapLevel(row['Cấp độ']) || 'beginner') as CourseLevel,
						duration: parseInt(String(row['Thời lượng (giờ)'])) || 0,
						price: parseInt(String(row['Giá (Token)'])) || 0,
						tokenSymbol: String(row['Loại Token'] || 'LEARN'),
						thumbnail: String(row['Hình ảnh'] || ''),
						videoUrl: String(row['Video giới thiệu'] || ''),
						tags: row['Tags'] ? String(row['Tags']).split(',').map((tag: string) => tag.trim()) : [],
						status: (mapStatus(row['Trạng thái']) || 'draft') as CourseStatus,
						isPublished: row['Đã xuất bản'] === 'Có' || row['Đã xuất bản'] === true,
						isFeatured: row['Nổi bật'] === 'Có' || row['Nổi bật'] === true,
						maxEnrollments: row['Số học viên tối đa'] && row['Số học viên tối đa'] !== 'Không giới hạn' 
							? parseInt(String(row['Số học viên tối đa'])) 
							: undefined,
						prerequisites: row['Điều kiện tiên quyết'] 
							? String(row['Điều kiện tiên quyết']).split(',').map((prereq: string) => prereq.trim())
							: [],
						learningOutcomes: row['Kết quả học tập']
							? String(row['Kết quả học tập']).split(',').map((outcome: string) => outcome.trim())
							: [],
						certificateAvailable: row['Có chứng chỉ'] === 'Có' || row['Có chứng chỉ'] === true,
						certificateTemplate: String(row['Template chứng chỉ'] || '')
					}
				})

				resolve(courses)
			} catch (error) {
				reject(error)
			}
		}
		
		reader.onerror = () => {
			reject(new Error('Lỗi đọc file Excel'))
		}
		
		reader.readAsArrayBuffer(file)
	})
}

// Helper functions for mapping
const mapLevel = (level: string): string => {
	const levelMap: Record<string, string> = {
		'Cơ bản': 'beginner',
		'Trung bình': 'intermediate',
		'Nâng cao': 'advanced',
		'Chuyên gia': 'expert',
		'beginner': 'beginner',
		'intermediate': 'intermediate',
		'advanced': 'advanced',
		'expert': 'expert'
	}
	return levelMap[level] || 'beginner'
}

const mapStatus = (status: string): string => {
	const statusMap: Record<string, string> = {
		'Bản nháp': 'draft',
		'Đã xuất bản': 'published',
		'Đã lưu trữ': 'archived',
		'Tạm dừng': 'suspended',
		'draft': 'draft',
		'published': 'published',
		'archived': 'archived',
		'suspended': 'suspended'
	}
	return statusMap[status] || 'draft'
}

// Generate Excel template
export const generateExcelTemplate = () => {
	const templateData = [{
		'Tên khóa học': 'React.js từ Cơ bản đến Nâng cao',
		'Mô tả ngắn': 'Học React.js từ cơ bản đến nâng cao với các dự án thực tế',
		'Mô tả chi tiết': 'Khóa học toàn diện về React.js, từ những khái niệm cơ bản đến các kỹ thuật nâng cao...',
		'Danh mục': 'Web Development',
		'Giảng viên': 'Nguyễn Văn Minh',
		'Cấp độ': 'Trung bình',
		'Thời lượng (giờ)': 40,
		'Giá (Token)': 2990000,
		'Loại Token': 'LEARN',
		'Trạng thái': 'Đã xuất bản',
		'Đã xuất bản': 'Có',
		'Nổi bật': 'Có',
		'Số học viên tối đa': 2000,
		'Tags': 'React, JavaScript, Frontend, Web Development',
		'Điều kiện tiên quyết': 'HTML/CSS cơ bản, JavaScript ES6',
		'Kết quả học tập': 'Nắm vững các khái niệm cơ bản của React, Xây dựng được ứng dụng React hoàn chỉnh',
		'Có chứng chỉ': 'Có',
		'Template chứng chỉ': 'react-certificate-template',
		'Hình ảnh': 'https://via.placeholder.com/400x225/3b82f6/ffffff?text=React+Course',
		'Video giới thiệu': 'https://example.com/video/react-intro'
	}]

	const workbook = XLSX.utils.book_new()
	const worksheet = XLSX.utils.json_to_sheet(templateData)
	
	// Set column widths
	const columnWidths = [
		{ wch: 30 }, { wch: 40 }, { wch: 50 }, { wch: 20 }, { wch: 25 },
		{ wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
		{ wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 40 },
		{ wch: 50 }, { wch: 15 }, { wch: 25 }, { wch: 40 }, { wch: 40 }
	]
	worksheet['!cols'] = columnWidths

	XLSX.utils.book_append_sheet(workbook, worksheet, 'Template')
	
	const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
	const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
	
	saveAs(data, 'course-template.xlsx')
}
