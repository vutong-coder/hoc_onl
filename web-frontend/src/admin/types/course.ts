// Types cho Hệ thống quản lý khóa học

export interface Course {
	id: string
	title: string
	description: string
	shortDescription: string
	category: CourseCategory
	instructor: Instructor
	level: CourseLevel
	duration: number // hours
	price: number
	tokenSymbol: string // Thay đổi từ currency sang tokenSymbol
	thumbnail: string
	videoUrl?: string
	tags: string[]
	status: CourseStatus
	isPublished: boolean
	isFeatured: boolean
	enrollmentCount: number
	maxEnrollments?: number
	rating: number
	reviewCount: number
	createdAt: string
	updatedAt: string
	publishedAt?: string
	lessons: Lesson[]
	prerequisites: string[]
	learningOutcomes: string[]
	certificateAvailable: boolean
	certificateTemplate?: string
}

export interface CourseCategory {
	id: string
	name: string
	description: string
	icon: string
	color: string
	parentId?: string
	isActive: boolean
	courseCount: number
}

export interface Instructor {
	id: string
	name: string
	email: string
	avatar?: string
	bio: string
	specialties: string[]
	experience: number // years
	rating: number
	studentCount: number
	courseCount: number
	isVerified: boolean
	socialLinks: SocialLink[]
}

export interface SocialLink {
	platform: 'linkedin' | 'twitter' | 'github' | 'website'
	url: string
}

export interface Lesson {
	id: string
	title: string
	description: string
	duration: number // minutes
	type: LessonType
	content: string
	videoUrl?: string
	attachments: Attachment[]
	isFree: boolean
	order: number
	isPublished: boolean
}

export type LessonType = 'video' | 'text' | 'quiz' | 'assignment' | 'live'

export interface Attachment {
	id: string
	name: string
	type: string
	size: number
	url: string
	uploadedAt: string
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type CourseStatus = 'draft' | 'published' | 'archived' | 'suspended'

export interface CourseFilters {
	search: string
	category: string | 'all'
	level: CourseLevel | 'all'
	status: CourseStatus | 'all'
	instructor: string | 'all'
	priceRange: 'free' | 'paid' | 'all'
	isPublished: boolean | 'all'
	isFeatured: boolean | 'all'
	sortBy: 'title' | 'createdAt' | 'updatedAt' | 'enrollmentCount' | 'rating' | 'price'
	sortOrder: 'asc' | 'desc'
}

export interface CourseStats {
	totalCourses: number
	publishedCourses: number
	draftCourses: number
	archivedCourses: number
	totalEnrollments: number
	averageRating: number
	totalRevenue: number
	activeInstructors: number
	featuredCourses: number
}

export interface CourseForm {
	title: string
	description: string
	shortDescription: string
	categoryId: string
	instructorId: string
	level: CourseLevel
	duration: number
	price: number
	tokenSymbol: string // Thay đổi từ currency sang tokenSymbol
	thumbnail: string
	videoUrl?: string
	tags: string[]
	status: CourseStatus
	isPublished: boolean
	isFeatured: boolean
	maxEnrollments?: number
	prerequisites: string[]
	learningOutcomes: string[]
	certificateAvailable: boolean
	certificateTemplate?: string
}

export interface CourseAnalytics {
	courseId: string
	enrollmentTrend: EnrollmentTrend[]
	completionRate: number
	averageCompletionTime: number // days
	studentFeedback: StudentFeedback[]
	revenue: number
	popularLessons: string[]
}

export interface EnrollmentTrend {
	date: string
	enrollments: number
	completions: number
}

export interface StudentFeedback {
	id: string
	studentId: string
	studentName: string
	rating: number
	comment: string
	createdAt: string
	isVerified: boolean
}

export interface CourseDashboard {
	stats: CourseStats
	recentCourses: Course[]
	topCourses: Course[]
	topInstructors: Instructor[]
	categories: CourseCategory[]
	recentEnrollments: RecentEnrollment[]
}

export interface RecentEnrollment {
	id: string
	studentId: string
	studentName: string
	courseId: string
	courseTitle: string
	enrolledAt: string
	progress: number
	status: 'active' | 'completed' | 'dropped'
}

export interface BulkCourseAction {
	action: 'publish' | 'unpublish' | 'archive' | 'delete' | 'feature' | 'unfeature'
	courseIds: string[]
	reason?: string
}
