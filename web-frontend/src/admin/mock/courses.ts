// ⚠️ DEPRECATED: Mock data for Course Management
// Use real API from course-service (port 9001) via src/admin/services/courseApi.ts
// This file is kept for backward compatibility with categories and instructors only

import { 
	Course, 
	CourseCategory, 
	Instructor, 
	CourseStats, 
	CourseDashboard,
	RecentEnrollment,
	StudentFeedback,
	EnrollmentTrend
} from '../types/course'

// Mock Course Categories
export const mockCourseCategories: CourseCategory[] = [
	{
		id: 'cat-1',
		name: 'Web Development',
		description: 'Khóa học phát triển web frontend và backend',
		icon: '🌐',
		color: '#3b82f6',
		isActive: true,
		courseCount: 15
	},
	{
		id: 'cat-2',
		name: 'Mobile Development',
		description: 'Phát triển ứng dụng di động iOS và Android',
		icon: '📱',
		color: '#10b981',
		isActive: true,
		courseCount: 8
	},
	{
		id: 'cat-3',
		name: 'Data Science',
		description: 'Khoa học dữ liệu và machine learning',
		icon: '📊',
		color: '#f59e0b',
		isActive: true,
		courseCount: 12
	},
	{
		id: 'cat-4',
		name: 'DevOps',
		description: 'DevOps và cloud computing',
		icon: '⚙️',
		color: '#8b5cf6',
		isActive: true,
		courseCount: 6
	},
	{
		id: 'cat-5',
		name: 'UI/UX Design',
		description: 'Thiết kế giao diện và trải nghiệm người dùng',
		icon: '🎨',
		color: '#ef4444',
		isActive: true,
		courseCount: 10
	},
	{
		id: 'cat-6',
		name: 'Cybersecurity',
		description: 'An ninh mạng và bảo mật thông tin',
		icon: '🔒',
		color: '#6b7280',
		isActive: true,
		courseCount: 7
	}
]

// Mock Instructors
export const mockInstructors: Instructor[] = [
	{
		id: 'inst-1',
		name: 'Nguyễn Văn Minh',
		email: 'minh.nguyen@example.com',
		avatar: 'https://via.placeholder.com/150/3b82f6/ffffff?text=MN',
		bio: 'Senior Full-stack Developer với 8 năm kinh nghiệm trong React, Node.js và cloud technologies.',
		specialties: ['React', 'Node.js', 'AWS', 'Docker'],
		experience: 8,
		rating: 4.8,
		studentCount: 1250,
		courseCount: 5,
		isVerified: true,
		socialLinks: [
			{ platform: 'linkedin', url: 'https://linkedin.com/in/minh-nguyen' },
			{ platform: 'github', url: 'https://github.com/minh-nguyen' }
		]
	},
	{
		id: 'inst-2',
		name: 'Trần Thị Lan',
		email: 'lan.tran@example.com',
		avatar: 'https://via.placeholder.com/150/10b981/ffffff?text=TL',
		bio: 'Mobile App Developer chuyên về React Native và Flutter với 6 năm kinh nghiệm.',
		specialties: ['React Native', 'Flutter', 'iOS', 'Android'],
		experience: 6,
		rating: 4.7,
		studentCount: 890,
		courseCount: 3,
		isVerified: true,
		socialLinks: [
			{ platform: 'twitter', url: 'https://twitter.com/lan-tran' },
			{ platform: 'github', url: 'https://github.com/lan-tran' }
		]
	},
	{
		id: 'inst-3',
		name: 'Lê Hoàng Nam',
		email: 'nam.le@example.com',
		avatar: 'https://via.placeholder.com/150/f59e0b/ffffff?text=LN',
		bio: 'Data Scientist và ML Engineer với background về Python, TensorFlow và PyTorch.',
		specialties: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch'],
		experience: 7,
		rating: 4.9,
		studentCount: 2100,
		courseCount: 8,
		isVerified: true,
		socialLinks: [
			{ platform: 'linkedin', url: 'https://linkedin.com/in/nam-le' },
			{ platform: 'github', url: 'https://github.com/nam-le' }
		]
	},
	{
		id: 'inst-4',
		name: 'Phạm Thị Hoa',
		email: 'hoa.pham@example.com',
		avatar: 'https://via.placeholder.com/150/8b5cf6/ffffff?text=HP',
		bio: 'DevOps Engineer chuyên về AWS, Kubernetes và CI/CD pipelines.',
		specialties: ['AWS', 'Kubernetes', 'Docker', 'Jenkins'],
		experience: 5,
		rating: 4.6,
		studentCount: 650,
		courseCount: 4,
		isVerified: true,
		socialLinks: [
			{ platform: 'linkedin', url: 'https://linkedin.com/in/hoa-pham' },
			{ platform: 'github', url: 'https://github.com/hoa-pham' }
		]
	},
	{
		id: 'inst-5',
		name: 'Hoàng Văn Đức',
		email: 'duc.hoang@example.com',
		avatar: 'https://via.placeholder.com/150/ef4444/ffffff?text=DH',
		bio: 'UI/UX Designer với 10 năm kinh nghiệm trong Figma, Adobe Creative Suite và user research.',
		specialties: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
		experience: 10,
		rating: 4.8,
		studentCount: 1800,
		courseCount: 6,
		isVerified: true,
		socialLinks: [
			{ platform: 'linkedin', url: 'https://linkedin.com/in/duc-hoang' },
			{ platform: 'website', url: 'https://duc-hoang.design' }
		]
	}
]

// Mock Courses
// ⚠️ DEPRECATED: Use adminCourseApi.getAllCourses() instead
export const mockCourses: Course[] = [
	{
		id: 'course-1',
		title: 'React.js từ Cơ bản đến Nâng cao',
		description: 'Khóa học toàn diện về React.js, từ những khái niệm cơ bản đến các kỹ thuật nâng cao như hooks, context, và performance optimization. Học viên sẽ xây dựng được các ứng dụng web hiện đại và responsive.',
		shortDescription: 'Học React.js từ cơ bản đến nâng cao với các dự án thực tế',
		category: mockCourseCategories[0],
		instructor: mockInstructors[0],
		level: 'intermediate',
		duration: 40,
		price: 2990000,
		tokenSymbol: 'LEARN',
		thumbnail: 'https://via.placeholder.com/400x225/3b82f6/ffffff?text=React+Course',
		videoUrl: 'https://example.com/video/react-intro',
		tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
		status: 'published',
		isPublished: true,
		isFeatured: true,
		enrollmentCount: 1250,
		maxEnrollments: 2000,
		rating: 4.8,
		reviewCount: 156,
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-20T14:30:00Z',
		publishedAt: '2024-01-16T09:00:00Z',
		lessons: [
			{
				id: 'lesson-1',
				title: 'Giới thiệu React và JSX',
				description: 'Tìm hiểu về React và cách sử dụng JSX',
				duration: 45,
				type: 'video',
				content: 'React là một thư viện JavaScript để xây dựng giao diện người dùng...',
				videoUrl: 'https://example.com/video/react-intro',
				attachments: [],
				isFree: true,
				order: 1,
				isPublished: true
			},
			{
				id: 'lesson-2',
				title: 'Components và Props',
				description: 'Học cách tạo và sử dụng components',
				duration: 60,
				type: 'video',
				content: 'Components là các phần tử có thể tái sử dụng...',
				videoUrl: 'https://example.com/video/react-components',
				attachments: [],
				isFree: false,
				order: 2,
				isPublished: true
			}
		],
		prerequisites: ['HTML/CSS cơ bản', 'JavaScript ES6'],
		learningOutcomes: [
			'Nắm vững các khái niệm cơ bản của React',
			'Xây dựng được ứng dụng React hoàn chỉnh',
			'Hiểu và sử dụng được React Hooks',
			'Tối ưu hóa performance của ứng dụng'
		],
		certificateAvailable: true,
		certificateTemplate: 'react-certificate-template'
	},
	{
		id: 'course-2',
		title: 'Flutter Development cho Beginners',
		description: 'Khóa học Flutter từ đầu dành cho người mới bắt đầu. Học cách xây dựng ứng dụng di động đa nền tảng với Flutter và Dart.',
		shortDescription: 'Học Flutter để xây dựng ứng dụng di động đa nền tảng',
		category: mockCourseCategories[1],
		instructor: mockInstructors[1],
		level: 'beginner',
		duration: 35,
		price: 2490000,
		tokenSymbol: 'LEARN',
		thumbnail: 'https://via.placeholder.com/400x225/10b981/ffffff?text=Flutter+Course',
		videoUrl: 'https://example.com/video/flutter-intro',
		tags: ['Flutter', 'Dart', 'Mobile', 'Cross-platform'],
		status: 'published',
		isPublished: true,
		isFeatured: false,
		enrollmentCount: 890,
		maxEnrollments: 1500,
		rating: 4.7,
		reviewCount: 98,
		createdAt: '2024-01-10T08:00:00Z',
		updatedAt: '2024-01-18T16:20:00Z',
		publishedAt: '2024-01-12T10:00:00Z',
		lessons: [
			{
				id: 'lesson-3',
				title: 'Giới thiệu Flutter và Dart',
				description: 'Tìm hiểu về Flutter framework và ngôn ngữ Dart',
				duration: 50,
				type: 'video',
				content: 'Flutter là framework của Google để phát triển ứng dụng di động...',
				videoUrl: 'https://example.com/video/flutter-intro',
				attachments: [],
				isFree: true,
				order: 1,
				isPublished: true
			}
		],
		prerequisites: ['Kiến thức lập trình cơ bản'],
		learningOutcomes: [
			'Hiểu được Flutter framework và Dart language',
			'Tạo được ứng dụng Flutter cơ bản',
			'Làm việc với widgets và state management',
			'Deploy ứng dụng lên App Store và Google Play'
		],
		certificateAvailable: true,
		certificateTemplate: 'flutter-certificate-template'
	},
	{
		id: 'course-3',
		title: 'Machine Learning với Python',
		description: 'Khóa học Machine Learning từ cơ bản đến nâng cao sử dụng Python, scikit-learn, và TensorFlow. Bao gồm các thuật toán ML phổ biến và deep learning.',
		shortDescription: 'Học Machine Learning với Python và các thư viện phổ biến',
		category: mockCourseCategories[2],
		instructor: mockInstructors[2],
		level: 'advanced',
		duration: 60,
		price: 3990000,
		tokenSymbol: 'LEARN',
		thumbnail: 'https://via.placeholder.com/400x225/f59e0b/ffffff?text=ML+Course',
		videoUrl: 'https://example.com/video/ml-intro',
		tags: ['Machine Learning', 'Python', 'TensorFlow', 'Data Science'],
		status: 'published',
		isPublished: true,
		isFeatured: true,
		enrollmentCount: 2100,
		maxEnrollments: 3000,
		rating: 4.9,
		reviewCount: 234,
		createdAt: '2024-01-05T09:00:00Z',
		updatedAt: '2024-01-22T11:15:00Z',
		publishedAt: '2024-01-08T14:00:00Z',
		lessons: [
			{
				id: 'lesson-4',
				title: 'Giới thiệu Machine Learning',
				description: 'Tìm hiểu về Machine Learning và các ứng dụng',
				duration: 55,
				type: 'video',
				content: 'Machine Learning là một nhánh của AI...',
				videoUrl: 'https://example.com/video/ml-intro',
				attachments: [],
				isFree: true,
				order: 1,
				isPublished: true
			}
		],
		prerequisites: ['Python cơ bản', 'Toán học cơ bản', 'Thống kê'],
		learningOutcomes: [
			'Hiểu được các khái niệm cơ bản của ML',
			'Implement các thuật toán ML phổ biến',
			'Làm việc với TensorFlow và Keras',
			'Xây dựng được model ML hoàn chỉnh'
		],
		certificateAvailable: true,
		certificateTemplate: 'ml-certificate-template'
	},
	{
		id: 'course-4',
		title: 'AWS Cloud Practitioner',
		description: 'Khóa học AWS Cloud Practitioner giúp bạn hiểu về các dịch vụ cloud của Amazon và cách sử dụng chúng trong thực tế.',
		shortDescription: 'Học AWS Cloud từ cơ bản với các dịch vụ phổ biến',
		category: mockCourseCategories[3],
		instructor: mockInstructors[3],
		level: 'beginner',
		duration: 25,
		price: 1990000,
		tokenSymbol: 'LEARN',
		thumbnail: 'https://via.placeholder.com/400x225/8b5cf6/ffffff?text=AWS+Course',
		videoUrl: 'https://example.com/video/aws-intro',
		tags: ['AWS', 'Cloud', 'DevOps', 'Infrastructure'],
		status: 'published',
		isPublished: true,
		isFeatured: false,
		enrollmentCount: 650,
		maxEnrollments: 1000,
		rating: 4.6,
		reviewCount: 87,
		createdAt: '2024-01-12T11:00:00Z',
		updatedAt: '2024-01-19T13:45:00Z',
		publishedAt: '2024-01-14T15:00:00Z',
		lessons: [
			{
				id: 'lesson-5',
				title: 'Giới thiệu AWS và Cloud Computing',
				description: 'Tìm hiểu về AWS và cloud computing',
				duration: 40,
				type: 'video',
				content: 'Amazon Web Services là nền tảng cloud hàng đầu...',
				videoUrl: 'https://example.com/video/aws-intro',
				attachments: [],
				isFree: true,
				order: 1,
				isPublished: true
			}
		],
		prerequisites: ['Kiến thức IT cơ bản'],
		learningOutcomes: [
			'Hiểu được các dịch vụ AWS cơ bản',
			'Triển khai ứng dụng trên AWS',
			'Quản lý tài nguyên cloud hiệu quả',
			'Chuẩn bị cho AWS certification'
		],
		certificateAvailable: true,
		certificateTemplate: 'aws-certificate-template'
	},
	{
		id: 'course-5',
		title: 'UI/UX Design Fundamentals',
		description: 'Khóa học thiết kế UI/UX từ cơ bản, bao gồm user research, wireframing, prototyping và visual design sử dụng Figma.',
		shortDescription: 'Học thiết kế UI/UX với Figma và các công cụ hiện đại',
		category: mockCourseCategories[4],
		instructor: mockInstructors[4],
		level: 'beginner',
		duration: 30,
		price: 2290000,
		tokenSymbol: 'LEARN',
		thumbnail: 'https://via.placeholder.com/400x225/ef4444/ffffff?text=UI+UX+Course',
		videoUrl: 'https://example.com/video/uiux-intro',
		tags: ['UI/UX', 'Figma', 'Design', 'User Research'],
		status: 'published',
		isPublished: true,
		isFeatured: false,
		enrollmentCount: 1800,
		maxEnrollments: 2500,
		rating: 4.8,
		reviewCount: 145,
		createdAt: '2024-01-08T14:00:00Z',
		updatedAt: '2024-01-21T10:30:00Z',
		publishedAt: '2024-01-10T16:00:00Z',
		lessons: [
			{
				id: 'lesson-6',
				title: 'Giới thiệu UI/UX Design',
				description: 'Tìm hiểu về UI/UX design và quy trình thiết kế',
				duration: 45,
				type: 'video',
				content: 'UI/UX Design là quá trình tạo ra trải nghiệm người dùng...',
				videoUrl: 'https://example.com/video/uiux-intro',
				attachments: [],
				isFree: true,
				order: 1,
				isPublished: true
			}
		],
		prerequisites: ['Không yêu cầu kinh nghiệm'],
		learningOutcomes: [
			'Hiểu được nguyên tắc UI/UX design',
			'Sử dụng thành thạo Figma',
			'Thực hiện user research và testing',
			'Tạo được prototype hoàn chỉnh'
		],
		certificateAvailable: true,
		certificateTemplate: 'uiux-certificate-template'
	},
	{
		id: 'course-6',
		title: 'Cybersecurity Essentials',
		description: 'Khóa học bảo mật thông tin cơ bản, bao gồm các mối đe dọa, biện pháp phòng chống và best practices trong cybersecurity.',
		shortDescription: 'Học bảo mật thông tin và cybersecurity từ cơ bản',
		category: mockCourseCategories[5],
		instructor: mockInstructors[0], // Using existing instructor
		level: 'intermediate',
		duration: 28,
		price: 2790000,
		tokenSymbol: 'LEARN',
		thumbnail: 'https://via.placeholder.com/400x225/6b7280/ffffff?text=Cybersecurity+Course',
		videoUrl: 'https://example.com/video/cyber-intro',
		tags: ['Cybersecurity', 'Security', 'Network', 'Ethical Hacking'],
		status: 'draft',
		isPublished: false,
		isFeatured: false,
		enrollmentCount: 0,
		maxEnrollments: 800,
		rating: 0,
		reviewCount: 0,
		createdAt: '2024-01-25T09:00:00Z',
		updatedAt: '2024-01-25T09:00:00Z',
		lessons: [
			{
				id: 'lesson-7',
				title: 'Giới thiệu Cybersecurity',
				description: 'Tìm hiểu về cybersecurity và các mối đe dọa',
				duration: 50,
				type: 'video',
				content: 'Cybersecurity là việc bảo vệ hệ thống thông tin...',
				videoUrl: 'https://example.com/video/cyber-intro',
				attachments: [],
				isFree: true,
				order: 1,
				isPublished: false
			}
		],
		prerequisites: ['Kiến thức IT cơ bản', 'Network fundamentals'],
		learningOutcomes: [
			'Hiểu được các mối đe dọa bảo mật',
			'Implement các biện pháp phòng chống',
			'Thực hiện security assessment',
			'Tuân thủ các chuẩn bảo mật'
		],
		certificateAvailable: true,
		certificateTemplate: 'cyber-certificate-template'
	}
]

// Mock Recent Enrollments
export const mockRecentEnrollments: RecentEnrollment[] = [
	{
		id: 'enroll-1',
		studentId: 'student-1',
		studentName: 'Nguyễn Văn A',
		courseId: 'course-1',
		courseTitle: 'React.js từ Cơ bản đến Nâng cao',
		enrolledAt: '2024-01-20T10:30:00Z',
		progress: 75,
		status: 'active'
	},
	{
		id: 'enroll-2',
		studentId: 'student-2',
		studentName: 'Trần Thị B',
		courseId: 'course-2',
		courseTitle: 'Flutter Development cho Beginners',
		enrolledAt: '2024-01-19T14:20:00Z',
		progress: 100,
		status: 'completed'
	},
	{
		id: 'enroll-3',
		studentId: 'student-3',
		studentName: 'Lê Văn C',
		courseId: 'course-3',
		courseTitle: 'Machine Learning với Python',
		enrolledAt: '2024-01-18T16:45:00Z',
		progress: 45,
		status: 'active'
	}
]

// Mock Course Stats
export const mockCourseStats: CourseStats = {
	totalCourses: 6,
	publishedCourses: 5,
	draftCourses: 1,
	archivedCourses: 0,
	totalEnrollments: 6690,
	averageRating: 4.76,
	totalRevenue: 15650000000, // 15.65 billion LEARN tokens
	activeInstructors: 5,
	featuredCourses: 2
}

// Complete Course Dashboard
// ⚠️ DEPRECATED: Dashboard now loaded from real API in useCourses hook
export const mockCourseDashboard: CourseDashboard = {
	stats: mockCourseStats,
	recentCourses: mockCourses.slice(0, 3),
	topCourses: mockCourses.filter(c => c.isFeatured),
	topInstructors: mockInstructors.slice(0, 3),
	categories: mockCourseCategories,
	recentEnrollments: mockRecentEnrollments
}

// Helper functions
export function getCourseById(id: string): Course | undefined {
	return mockCourses.find(course => course.id === id)
}

export function getCoursesByCategory(categoryId: string): Course[] {
	return mockCourses.filter(course => course.category.id === categoryId)
}

export function getCoursesByInstructor(instructorId: string): Course[] {
	return mockCourses.filter(course => course.instructor.id === instructorId)
}

export function getPublishedCourses(): Course[] {
	return mockCourses.filter(course => course.isPublished)
}

export function getFeaturedCourses(): Course[] {
	return mockCourses.filter(course => course.isFeatured)
}

export function getCoursesByLevel(level: string): Course[] {
	return mockCourses.filter(course => course.level === level)
}

export function getTopRatedCourses(limit = 5): Course[] {
	return mockCourses
		.filter(course => course.isPublished)
		.sort((a, b) => b.rating - a.rating)
		.slice(0, limit)
}

export function getMostEnrolledCourses(limit = 5): Course[] {
	return mockCourses
		.filter(course => course.isPublished)
		.sort((a, b) => b.enrollmentCount - a.enrollmentCount)
		.slice(0, limit)
}
