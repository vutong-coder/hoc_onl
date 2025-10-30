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
	mockCourseCategories,
	mockInstructors
} from '../mock/courses'
import adminCourseApi, { getCourseStatistics, getTopCourses } from '../services/courseApi'

// Initial empty dashboard - will be loaded from API
const initialDashboard: CourseDashboard = {
	stats: {
		totalCourses: 0,
		publishedCourses: 0,
		draftCourses: 0,
		totalStudents: 0,
		totalRevenue: 0,
		averageRating: 0,
		completionRate: 0,
		totalInstructors: 0
	},
	courses: [],
	topCourses: [],
	recentCourses: [],
	categories: mockCourseCategories,
	instructors: mockInstructors
}

export default function useCourses() {
	const [dashboard, setDashboard] = useState<CourseDashboard>(initialDashboard)
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
	const [allCourses, setAllCourses] = useState<Course[]>([])

	// Load courses from API
	const loadCourses = useCallback(async () => {
		setLoading(true)
		try {
			// Load courses
			const coursesResponse = await adminCourseApi.getAllCourses(0, 100)
			const courses = coursesResponse.data.content
			
			// Load statistics
			const stats = await getCourseStatistics()
			
			// Load top courses
			const topCourses = await getTopCourses(5)
			
			setAllCourses(courses)
			setDashboard(prev => ({
				...prev,
				stats: {
					totalCourses: stats.totalCourses,
					publishedCourses: stats.publishedCourses,
					draftCourses: stats.draftCourses,
					totalStudents: stats.totalEnrollments,
					totalRevenue: 0, // TODO: Calculate from backend
					averageRating: stats.averageRating,
					completionRate: 0, // TODO: Get from backend
					totalInstructors: mockInstructors.length
				},
				courses,
				topCourses,
				recentCourses: courses.slice(0, 5)
			}))
		} catch (error) {
			console.error('❌ Error loading courses:', error)
		} finally {
			setLoading(false)
		}
	}, [])

	// Load courses on mount
	useEffect(() => {
		loadCourses()
	}, [loadCourses])

	// Filter courses
	const filteredCourses = useMemo(() => {
		let result = [...allCourses]

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
	const addCourse = useCallback(async (courseForm: CourseForm) => {
		setLoading(true)
		try {
			const newCourseData = {
				title: courseForm.title,
				description: courseForm.description,
				shortDescription: courseForm.shortDescription,
				level: courseForm.level,
				duration: courseForm.duration,
				price: courseForm.price,
				thumbnail: courseForm.thumbnail,
				tags: courseForm.tags,
				prerequisites: courseForm.prerequisites,
				learningOutcomes: courseForm.learningOutcomes,
				certificateAvailable: courseForm.certificateAvailable
			}
			
			await adminCourseApi.createCourse(newCourseData)
			await loadCourses() // Reload to get fresh data
		} catch (error) {
			console.error('Error adding course:', error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [loadCourses])

	const addCourseOld = useCallback((courseForm: CourseForm) => {
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

	const updateCourse = useCallback(async (courseId: string, courseForm: CourseForm) => {
		setLoading(true)
		try {
			const updateData = {
				title: courseForm.title,
				description: courseForm.description,
				shortDescription: courseForm.shortDescription,
				level: courseForm.level,
				duration: courseForm.duration,
				price: courseForm.price,
				thumbnail: courseForm.thumbnail,
				tags: courseForm.tags,
				isPublished: courseForm.isPublished,
				isFeatured: courseForm.isFeatured
			}
			
			await adminCourseApi.updateCourse(courseId, updateData)
			await loadCourses() // Reload to get fresh data
		} catch (error) {
			console.error('Error updating course:', error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [loadCourses])

	const updateCourseOld = useCallback((courseId: string, courseForm: CourseForm) => {
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

	const deleteCourse = useCallback(async (courseId: string) => {
		setLoading(true)
		try {
			await adminCourseApi.deleteCourse(courseId)
			await loadCourses() // Reload to get fresh data
		} catch (error) {
			console.error('Error deleting course:', error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [loadCourses])

	const deleteCourseOld = useCallback((courseId: string) => {
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

	const toggleCourseStatus = useCallback(async (courseId: string) => {
		setLoading(true)
		try {
			const course = allCourses.find(c => c.id === courseId)
			if (!course) return
			
			await adminCourseApi.updateCourse(courseId, {
				isPublished: !course.isPublished
			})
			await loadCourses() // Reload to get fresh data
		} catch (error) {
			console.error('Error toggling course status:', error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [allCourses, loadCourses])

	const toggleCourseStatusOld = useCallback((courseId: string) => {
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

	// Auto-refresh courses every 30 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			loadCourses()
		}, 30000) // Refresh every 30 seconds

		return () => clearInterval(interval)
	}, [loadCourses])

	// Helper functions
	const getCourseById = useCallback((id: string) => {
		return allCourses.find(course => course.id === id)
	}, [allCourses])

	const getCoursesByCategory = useCallback((categoryId: string) => {
		return allCourses.filter(course => course.category?.id === categoryId)
	}, [allCourses])

	const getCoursesByInstructor = useCallback((instructorId: string) => {
		return allCourses.filter(course => course.instructor?.id === instructorId)
	}, [allCourses])

	const getPublishedCourses = useCallback(() => {
		return allCourses.filter(course => course.isPublished)
	}, [allCourses])

	const getFeaturedCourses = useCallback(() => {
		return allCourses.filter(course => course.isFeatured)
	}, [allCourses])

	const getCoursesByLevel = useCallback((level: CourseLevel) => {
		return allCourses.filter(course => course.level === level)
	}, [allCourses])

	const getTopRatedCourses = useCallback((limit = 5) => {
		return allCourses
			.filter(course => course.isPublished && (course.rating || 0) > 0)
			.sort((a, b) => (b.rating || 0) - (a.rating || 0))
			.slice(0, limit)
	}, [allCourses])

	const getMostEnrolledCourses = useCallback((limit = 5) => {
		return allCourses
			.filter(course => course.isPublished)
			.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
			.slice(0, limit)
	}, [allCourses])

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
		loadCourses,
		
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
