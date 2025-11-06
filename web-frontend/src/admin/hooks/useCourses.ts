import { useState, useMemo, useCallback, useEffect } from 'react'
import {
    CourseFilters,
    CourseForm,
    CourseCategory,
    Instructor,
    CourseStatus,
    CourseLevel,
} from '../types/course'
// Use API Course type and real service path
import courseApi, { type Course as ApiCourse, PageResponse } from '../../services/api/courseApi'
// Import adapter để convert giữa backend và frontend
import { backendToAdminCourse, courseFormToBackendCreateRequest, courseFormToBackendUpdateRequest } from '../../utils/courseAdapter'

// Local dashboard state using API Course type to avoid type conflicts
type DashboardState = {
    stats: {
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
    recentCourses: ApiCourse[]
    topCourses: ApiCourse[]
    topInstructors: Instructor[]
    categories: CourseCategory[]
    recentEnrollments: any[]
}

// Initial empty dashboard - will be loaded from API
const initialDashboard: DashboardState = {
    stats: {
        totalCourses: 0,
        publishedCourses: 0,
        draftCourses: 0,
        archivedCourses: 0,
        totalEnrollments: 0,
        averageRating: 0,
        totalRevenue: 0,
        activeInstructors: 0,
        featuredCourses: 0
    },
    recentCourses: [],
    topCourses: [],
    topInstructors: [],
    categories: [],
    recentEnrollments: []
}

export default function useCourses() {
	const [dashboard, setDashboard] = useState<DashboardState>(initialDashboard)
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
	const [editingCourse, setEditingCourse] = useState<ApiCourse | null>(null)
	const [selectedCourse, setSelectedCourse] = useState<ApiCourse | null>(null)
	const [loading, setLoading] = useState(false)
	    const [allCourses, setAllCourses] = useState<ApiCourse[]>([])
    const [categories, setCategories] = useState<CourseCategory[]>([])
    const [instructors, setInstructors] = useState<Instructor[]>([])

	// ✅ FIX: Remove useCallback to prevent useEffect re-trigger
	const loadCourses = async () => {
		setLoading(true)
		try {
			// Load courses
			const coursesResponse = await courseApi.getAllCourses(0, 100)
			const courses = (coursesResponse.data as PageResponse<ApiCourse>).content
			// Store API courses (original backend format)
			setAllCourses(courses as ApiCourse[])

	            // Build categories/instructors from backend data if present
            const uniqueCategories: Record<string, CourseCategory> = {}
            const uniqueInstructors: Record<string, Instructor> = {}
            for (const c of courses as ApiCourse[]) {
                if (c.category?.id && c.category?.name) {
                    uniqueCategories[c.category.id] = {
                        id: c.category.id,
                        name: c.category.name,
                        description: c.category.description || '',
                        icon: '',
                        color: '#999999',
                        isActive: true,
                        courseCount: 0
                    }
                }
                if (c.instructor?.id && c.instructor?.name) {
                    uniqueInstructors[c.instructor.id] = {
                        id: c.instructor.id,
                        name: c.instructor.name,
                        email: c.instructor.email || '',
                        bio: c.instructor.bio || '',
                        specialties: [],
                        experience: 0,
                        rating: c.rating || 0,
                        studentCount: c.enrollmentCount || 0,
                        courseCount: 0,
                        isVerified: true,
                        socialLinks: []
                    }
                }
            }
            setCategories(Object.values(uniqueCategories))
            setInstructors(Object.values(uniqueInstructors))
            // Compute dashboard stats locally
            const totalEnrollments = (courses as ApiCourse[]).reduce((sum, c) => sum + (c.enrollmentCount || 0), 0)
            const averageRatingRaw = (courses as ApiCourse[]).reduce((sum, c) => sum + (c.rating || 0), 0)
            const averageRating = courses.length ? averageRatingRaw / courses.length : 0
            const totalRevenue = (courses as ApiCourse[]).reduce((sum, c) => sum + (c.price || 0) * (c.enrollmentCount || 0), 0)
            const publishedCourses = (courses as ApiCourse[]).filter(c => c.isPublished).length
            const draftCourses = (courses as ApiCourse[]).length - publishedCourses

            const topCourses = [...(courses as ApiCourse[])]
                .filter(c => c.isPublished)
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 5)

            setDashboard(prev => ({
                ...prev,
                stats: {
                    totalCourses: courses.length,
                    publishedCourses,
                    draftCourses,
                    archivedCourses: 0,
                    totalEnrollments,
                    averageRating,
                    totalRevenue,
                    activeInstructors: Object.keys(uniqueInstructors).length,
                    featuredCourses: (courses as ApiCourse[]).filter(c => c.isFeatured).length,
                },
                recentCourses: (courses as ApiCourse[]).slice(0, 5),
                topCourses,
                topInstructors: Object.values(uniqueInstructors),
                categories: Object.values(uniqueCategories),
                recentEnrollments: [],
            }))
		} catch (error) {
			console.error('❌ Error loading courses:', error)
		} finally {
			setLoading(false)
		}
	}

	// ✅ FIX: Load courses on mount only once
	useEffect(() => {
		loadCourses()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Filter courses
	const filteredCourses = useMemo(() => {
        let result = [...allCourses]

		// Search filter
		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			result = result.filter(course =>
                course.title?.toLowerCase().includes(searchLower) ||
                (course.description || '').toLowerCase().includes(searchLower) ||
                (course.instructor?.name || '').toLowerCase().includes(searchLower) ||
                (course.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
			)
		}

		// Category filter
		if (filters.category !== 'all') {
            result = result.filter(course => course.category?.id === filters.category)
		}

		// Level filter
		if (filters.level !== 'all') {
            result = result.filter(course => course.level === filters.level)
		}

		// Status filter
		if (filters.status !== 'all') {
            result = result.filter(course => (course.status as any) === filters.status)
		}

		// Instructor filter
		if (filters.instructor !== 'all') {
            result = result.filter(course => course.instructor?.id === filters.instructor)
		}

		// Price range filter
		if (filters.priceRange === 'free') {
            result = result.filter(course => (course.price || 0) === 0)
		} else if (filters.priceRange === 'paid') {
            result = result.filter(course => (course.price || 0) > 0)
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
                    aValue = (a.title || '').toLowerCase()
                    bValue = (b.title || '').toLowerCase()
					break
				case 'createdAt':
                    aValue = new Date(a.createdAt || 0).getTime()
                    bValue = new Date(b.createdAt || 0).getTime()
					break
				case 'updatedAt':
                    aValue = new Date(a.updatedAt || 0).getTime()
                    bValue = new Date(b.updatedAt || 0).getTime()
					break
				case 'enrollmentCount':
                    aValue = a.enrollmentCount || 0
                    bValue = b.enrollmentCount || 0
					break
				case 'rating':
                    aValue = a.rating || 0
                    bValue = b.rating || 0
					break
				case 'price':
                    aValue = a.price || 0
                    bValue = b.price || 0
					break
				default:
                    aValue = (a.title || '').toLowerCase()
                    bValue = (b.title || '').toLowerCase()
			}

			if (filters.sortOrder === 'asc') {
				return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
			} else {
				return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
			}
		})

        return result
    }, [filters, allCourses])

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
	// ✅ FIX: Remove useCallback dependency on loadCourses
    const addCourse = useCallback(async (courseForm: CourseForm) => {
		setLoading(true)
		try {
			// Convert CourseForm → Backend CreateCourseRequest (chỉ gửi field backend hỗ trợ)
			const backendRequest = courseFormToBackendCreateRequest({
				title: courseForm.title,
				description: courseForm.description,
				shortDescription: courseForm.shortDescription,
				instructorId: courseForm.instructorId,
				thumbnail: courseForm.thumbnail,
				isPublished: courseForm.isPublished,
				status: courseForm.status
			})
			
			await courseApi.createCourse(backendRequest)
			await loadCourses() // Reload to get fresh data
		} catch (error) {
			console.error('Error adding course:', error)
			throw error
		} finally {
			setLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

    // removed legacy mock-based addCourseOld

	const updateCourse = useCallback(async (courseId: string, courseForm: CourseForm) => {
		setLoading(true)
		try {
			// Convert CourseForm → Backend UpdateCourseRequest (chỉ gửi field backend hỗ trợ)
			const backendRequest = courseFormToBackendUpdateRequest({
				title: courseForm.title,
				description: courseForm.description,
				shortDescription: courseForm.shortDescription,
				thumbnail: courseForm.thumbnail,
				isPublished: courseForm.isPublished,
				status: courseForm.status
			})
			
			await courseApi.updateCourse(courseId, backendRequest)
			await loadCourses() // Reload to get fresh data
		} catch (error) {
			console.error('Error updating course:', error)
			throw error
		} finally {
			setLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

    // removed legacy mock-based updateCourseOld

	const deleteCourse = useCallback(async (courseId: string) => {
		setLoading(true)
		try {
			await courseApi.deleteCourse(courseId)
			await loadCourses() // Reload to get fresh data
		} catch (error: any) {
			const message = error?.message || 'Xóa khóa học thất bại. Vui lòng kiểm tra backend.'
			alert(message)
		} finally {
			setLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

    // removed legacy mock-based deleteCourseOld

	const toggleCourseStatus = useCallback(async (courseId: string) => {
		setLoading(true)
		try {
            const course = allCourses.find(c => c.id === courseId)
			if (!course) return
			
			await courseApi.updateCourse(courseId, {
				isPublished: !course.isPublished
			})
			await loadCourses() // Reload to get fresh data
		} catch (error) {
			console.error('Error toggling course status:', error)
			throw error
		} finally {
			setLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allCourses])

    // removed legacy mock-based toggleCourseStatusOld

	// Modal management
	const openCourseEditor = useCallback((course?: ApiCourse) => {
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

	// ✅ FIX: Auto-refresh with proper cleanup and no dependency on loadCourses
	useEffect(() => {
		const interval = setInterval(() => {
			loadCourses()
		}, 30000) // Refresh every 30 seconds

		return () => clearInterval(interval)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
        categories,
        instructors,
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
