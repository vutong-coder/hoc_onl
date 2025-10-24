import { useState, useMemo, useCallback, useEffect } from 'react'
import { 
	Course, 
	CourseFilters, 
	CourseDashboard,
	CourseForm,
	CourseCategory,
	Instructor,
	CourseStatus,
	CourseLevel
} from '../types/course'
import { 
	mockCourseDashboard,
	mockCourses,
	mockCourseCategories,
	mockInstructors
} from '../mock/courses'

export default function useCourses() {
	const [dashboard, setDashboard] = useState<CourseDashboard>(mockCourseDashboard)
	const [filters, setFilters] = useState<CourseFilters>({
		search: '',
		category: 'all',
		level: 'all',
		status: 'all',
		instructor: 'all',
		priceRange: 'all',
		isPublished: 'all',
		isFeatured: 'all',
		sortBy: 'title',
		sortOrder: 'asc'
	})
	const [isCourseEditorOpen, setIsCourseEditorOpen] = useState(false)
	const [editingCourse, setEditingCourse] = useState<Course | null>(null)
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
	const [loading, setLoading] = useState(false)

	// Filter courses
	const filteredCourses = useMemo(() => {
		let result = [...mockCourses]

		// Search filter
		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			result = result.filter(course =>
				course.title.toLowerCase().includes(searchLower) ||
				course.description.toLowerCase().includes(searchLower) ||
				course.instructor.name.toLowerCase().includes(searchLower) ||
				course.tags.some(tag => tag.toLowerCase().includes(searchLower))
			)
		}

		// Category filter
		if (filters.category !== 'all') {
			result = result.filter(course => course.category.id === filters.category)
		}

		// Level filter
		if (filters.level !== 'all') {
			result = result.filter(course => course.level === filters.level)
		}

		// Status filter
		if (filters.status !== 'all') {
			result = result.filter(course => course.status === filters.status)
		}

		// Instructor filter
		if (filters.instructor !== 'all') {
			result = result.filter(course => course.instructor.id === filters.instructor)
		}

		// Price range filter
		if (filters.priceRange === 'free') {
			result = result.filter(course => course.price === 0)
		} else if (filters.priceRange === 'paid') {
			result = result.filter(course => course.price > 0)
		}

		// Published filter
		if (filters.isPublished !== 'all') {
			result = result.filter(course => course.isPublished === filters.isPublished)
		}

		// Featured filter
		if (filters.isFeatured !== 'all') {
			result = result.filter(course => course.isFeatured === filters.isFeatured)
		}

		// Sort
		result.sort((a, b) => {
			let aValue: any, bValue: any

			switch (filters.sortBy) {
				case 'title':
					aValue = a.title.toLowerCase()
					bValue = b.title.toLowerCase()
					break
				case 'createdAt':
					aValue = new Date(a.createdAt).getTime()
					bValue = new Date(b.createdAt).getTime()
					break
				case 'updatedAt':
					aValue = new Date(a.updatedAt).getTime()
					bValue = new Date(b.updatedAt).getTime()
					break
				case 'enrollmentCount':
					aValue = a.enrollmentCount
					bValue = b.enrollmentCount
					break
				case 'rating':
					aValue = a.rating
					bValue = b.rating
					break
				case 'price':
					aValue = a.price
					bValue = b.price
					break
				default:
					aValue = a.title.toLowerCase()
					bValue = b.title.toLowerCase()
			}

			if (filters.sortOrder === 'asc') {
				return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
			} else {
				return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
			}
		})

		return result
	}, [filters])

	// Update filter
	const updateFilter = useCallback((key: keyof CourseFilters, value: any) => {
		setFilters(prev => ({ ...prev, [key]: value }))
	}, [])

	// Clear all filters
	const clearFilters = useCallback(() => {
		setFilters({
			search: '',
			category: 'all',
			level: 'all',
			status: 'all',
			instructor: 'all',
			priceRange: 'all',
			isPublished: 'all',
			isFeatured: 'all',
			sortBy: 'title',
			sortOrder: 'asc'
		})
	}, [])

	// Course management
	const addCourse = useCallback((courseForm: CourseForm) => {
		const category = mockCourseCategories.find(cat => cat.id === courseForm.categoryId)
		const instructor = mockInstructors.find(inst => inst.id === courseForm.instructorId)
		
		if (!category || !instructor) return

		const newCourse: Course = {
			id: `course-${Date.now()}`,
			title: courseForm.title,
			description: courseForm.description,
			shortDescription: courseForm.shortDescription,
			category,
			instructor,
			level: courseForm.level,
			duration: courseForm.duration,
			price: courseForm.price,
			tokenSymbol: courseForm.tokenSymbol,
			thumbnail: courseForm.thumbnail,
			videoUrl: courseForm.videoUrl,
			tags: courseForm.tags,
			status: courseForm.status,
			isPublished: courseForm.isPublished,
			isFeatured: courseForm.isFeatured,
			enrollmentCount: 0,
			maxEnrollments: courseForm.maxEnrollments,
			rating: 0,
			reviewCount: 0,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			publishedAt: courseForm.isPublished ? new Date().toISOString() : undefined,
			lessons: [],
			prerequisites: courseForm.prerequisites,
			learningOutcomes: courseForm.learningOutcomes,
			certificateAvailable: courseForm.certificateAvailable,
			certificateTemplate: courseForm.certificateTemplate
		}

		setDashboard(prev => ({
			...prev,
			recentCourses: [newCourse, ...prev.recentCourses].slice(0, 5),
			stats: {
				...prev.stats,
				totalCourses: prev.stats.totalCourses + 1,
				publishedCourses: prev.stats.publishedCourses + (courseForm.isPublished ? 1 : 0),
				draftCourses: prev.stats.draftCourses + (courseForm.isPublished ? 0 : 1),
				featuredCourses: prev.stats.featuredCourses + (courseForm.isFeatured ? 1 : 0)
			}
		}))
	}, [])

	const updateCourse = useCallback((courseId: string, courseForm: CourseForm) => {
		const category = mockCourseCategories.find(cat => cat.id === courseForm.categoryId)
		const instructor = mockInstructors.find(inst => inst.id === courseForm.instructorId)
		
		if (!category || !instructor) return

		setDashboard(prev => ({
			...prev,
			recentCourses: prev.recentCourses.map(course =>
				course.id === courseId
					? {
						...course,
						title: courseForm.title,
						description: courseForm.description,
						shortDescription: courseForm.shortDescription,
						category,
						instructor,
						level: courseForm.level,
						duration: courseForm.duration,
						price: courseForm.price,
						tokenSymbol: courseForm.tokenSymbol,
						thumbnail: courseForm.thumbnail,
						videoUrl: courseForm.videoUrl,
						tags: courseForm.tags,
						status: courseForm.status,
						isPublished: courseForm.isPublished,
						isFeatured: courseForm.isFeatured,
						maxEnrollments: courseForm.maxEnrollments,
						prerequisites: courseForm.prerequisites,
						learningOutcomes: courseForm.learningOutcomes,
						certificateAvailable: courseForm.certificateAvailable,
						certificateTemplate: courseForm.certificateTemplate,
						updatedAt: new Date().toISOString(),
						publishedAt: courseForm.isPublished && !course.isPublished ? new Date().toISOString() : course.publishedAt
					}
					: course
			),
			stats: {
				...prev.stats,
				publishedCourses: prev.stats.publishedCourses + (courseForm.isPublished ? 1 : 0),
				draftCourses: prev.stats.draftCourses + (courseForm.isPublished ? 0 : 1),
				featuredCourses: prev.stats.featuredCourses + (courseForm.isFeatured ? 1 : 0)
			}
		}))
	}, [])

	const deleteCourse = useCallback((courseId: string) => {
		setDashboard(prev => {
			const course = prev.recentCourses.find(c => c.id === courseId)
			return {
				...prev,
				recentCourses: prev.recentCourses.filter(c => c.id !== courseId),
				stats: {
					...prev.stats,
					totalCourses: prev.stats.totalCourses - 1,
					publishedCourses: prev.stats.publishedCourses - (course?.isPublished ? 1 : 0),
					draftCourses: prev.stats.draftCourses - (course?.isPublished ? 0 : 1),
					featuredCourses: prev.stats.featuredCourses - (course?.isFeatured ? 1 : 0)
				}
			}
		})
	}, [])

	const toggleCourseStatus = useCallback((courseId: string) => {
		setDashboard(prev => ({
			...prev,
			recentCourses: prev.recentCourses.map(course =>
				course.id === courseId
					? { 
						...course, 
						isPublished: !course.isPublished,
						status: !course.isPublished ? 'published' as CourseStatus : 'draft' as CourseStatus,
						publishedAt: !course.isPublished ? new Date().toISOString() : undefined,
						updatedAt: new Date().toISOString()
					}
					: course
			),
			stats: {
				...prev.stats,
				publishedCourses: prev.recentCourses.reduce((count, course) => {
					if (course.id === courseId) {
						return count + (course.isPublished ? 0 : 1) // If currently published, decrease by 1, else increase by 1
					}
					return count + (course.isPublished ? 1 : 0)
				}, 0),
				draftCourses: prev.recentCourses.reduce((count, course) => {
					if (course.id === courseId) {
						return count + (course.isPublished ? 1 : 0) // If currently published, increase by 1, else decrease by 1
					}
					return count + (course.isPublished ? 0 : 1)
				}, 0)
			}
		}))
	}, [])

	// Modal management
	const openCourseEditor = useCallback((course?: Course) => {
		setEditingCourse(course || null)
		setIsCourseEditorOpen(true)
	}, [])

	const closeCourseEditor = useCallback(() => {
		setIsCourseEditorOpen(false)
		setEditingCourse(null)
	}, [])

	const saveCourse = useCallback((courseForm: CourseForm) => {
		if (editingCourse) {
			updateCourse(editingCourse.id, courseForm)
		} else {
			addCourse(courseForm)
		}
		closeCourseEditor()
	}, [editingCourse, addCourse, updateCourse, closeCourseEditor])

	// Simulate real-time updates
	useEffect(() => {
		const interval = setInterval(() => {
			setDashboard(prev => {
				// Simulate new enrollments occasionally
				if (Math.random() < 0.1) { // 10% chance
					const publishedCourses = prev.recentCourses.filter(course => course.isPublished)
					if (publishedCourses.length > 0) {
						const randomCourse = publishedCourses[Math.floor(Math.random() * publishedCourses.length)]
						
						const newEnrollment = {
							id: `enroll-${Date.now()}`,
							studentId: `student-${Math.floor(Math.random() * 1000)}`,
							studentName: `Học viên ${Math.floor(Math.random() * 100)}`,
							courseId: randomCourse.id,
							courseTitle: randomCourse.title,
							enrolledAt: new Date().toISOString(),
							progress: Math.floor(Math.random() * 100),
							status: 'active' as const
						}

						return {
							...prev,
							recentEnrollments: [newEnrollment, ...prev.recentEnrollments].slice(0, 10),
							stats: {
								...prev.stats,
								totalEnrollments: prev.stats.totalEnrollments + 1
							},
							recentCourses: prev.recentCourses.map(course =>
								course.id === randomCourse.id
									? { ...course, enrollmentCount: course.enrollmentCount + 1 }
									: course
							)
						}
					}
				}
				return prev
			})
		}, 15000) // Update every 15 seconds

		return () => clearInterval(interval)
	}, [])

	// Helper functions
	const getCourseById = useCallback((id: string) => {
		return mockCourses.find(course => course.id === id)
	}, [])

	const getCoursesByCategory = useCallback((categoryId: string) => {
		return mockCourses.filter(course => course.category.id === categoryId)
	}, [])

	const getCoursesByInstructor = useCallback((instructorId: string) => {
		return mockCourses.filter(course => course.instructor.id === instructorId)
	}, [])

	const getPublishedCourses = useCallback(() => {
		return mockCourses.filter(course => course.isPublished)
	}, [])

	const getFeaturedCourses = useCallback(() => {
		return mockCourses.filter(course => course.isFeatured)
	}, [])

	const getCoursesByLevel = useCallback((level: CourseLevel) => {
		return mockCourses.filter(course => course.level === level)
	}, [])

	const getTopRatedCourses = useCallback((limit = 5) => {
		return mockCourses
			.filter(course => course.isPublished && course.rating > 0)
			.sort((a, b) => b.rating - a.rating)
			.slice(0, limit)
	}, [])

	const getMostEnrolledCourses = useCallback((limit = 5) => {
		return mockCourses
			.filter(course => course.isPublished)
			.sort((a, b) => b.enrollmentCount - a.enrollmentCount)
			.slice(0, limit)
	}, [])

	return {
		// Data
		dashboard,
		courses: filteredCourses,
		categories: mockCourseCategories,
		instructors: mockInstructors,
		filters,
		
		// Actions
		updateFilter,
		clearFilters,
		addCourse,
		updateCourse,
		deleteCourse,
		toggleCourseStatus,
		
		// Modal management
		isCourseEditorOpen,
		editingCourse,
		openCourseEditor,
		closeCourseEditor,
		saveCourse,
		
		// Selection
		selectedCourse,
		setSelectedCourse,
		
		// Loading
		loading,
		setLoading,
		
		// Helper functions
		getCourseById,
		getCoursesByCategory,
		getCoursesByInstructor,
		getPublishedCourses,
		getFeaturedCourses,
		getCoursesByLevel,
		getTopRatedCourses,
		getMostEnrolledCourses
	}
}
