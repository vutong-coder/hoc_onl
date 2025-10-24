import { useState, useMemo, useCallback } from 'react'
import { Exam, ExamFilters, RandomExamConfig } from '../types/exam'
import { mockExams, mockQuestions } from '../mock/exams'

export default function useExams() {
	const [exams, setExams] = useState<Exam[]>(mockExams)
	const [filters, setFilters] = useState<ExamFilters>({
		search: '',
		subject: 'all',
		difficulty: 'all',
		status: 'all',
		type: 'all'
	})
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(10)
	const [sortKey, setSortKey] = useState<string>('createdAt')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

	// Lọc exams theo filters
	const filteredExams = useMemo(() => {
		let result = [...exams]

		// Lọc theo search
		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			result = result.filter(exam => 
				exam.title.toLowerCase().includes(searchLower) ||
				exam.subject.toLowerCase().includes(searchLower) ||
				exam.description?.toLowerCase().includes(searchLower) ||
				exam.createdBy.toLowerCase().includes(searchLower)
			)
		}

		// Lọc theo subject
		if (filters.subject !== 'all') {
			result = result.filter(exam => exam.subject === filters.subject)
		}

		// Lọc theo difficulty
		if (filters.difficulty !== 'all') {
			result = result.filter(exam => exam.difficulty === filters.difficulty)
		}

		// Lọc theo status
		if (filters.status !== 'all') {
			result = result.filter(exam => exam.status === filters.status)
		}

		// Lọc theo type
		if (filters.type !== 'all') {
			result = result.filter(exam => exam.type === filters.type)
		}

		return result
	}, [exams, filters])

	// Sắp xếp exams
	const sortedExams = useMemo(() => {
		const result = [...filteredExams]

		result.sort((a, b) => {
			let aValue = a[sortKey as keyof Exam]
			let bValue = b[sortKey as keyof Exam]

			// Convert to string for comparison
			if (aValue === undefined) aValue = ''
			if (bValue === undefined) bValue = ''

			const aString = String(aValue).toLowerCase()
			const bString = String(bValue).toLowerCase()

			if (aString < bString) return sortOrder === 'asc' ? -1 : 1
			if (aString > bString) return sortOrder === 'asc' ? 1 : -1
			return 0
		})

		return result
	}, [filteredExams, sortKey, sortOrder])

	// Phân trang
	const paginatedExams = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage
		const endIndex = startIndex + itemsPerPage
		return sortedExams.slice(startIndex, endIndex)
	}, [sortedExams, currentPage, itemsPerPage])

	const totalPages = Math.ceil(sortedExams.length / itemsPerPage)

	// Cập nhật filter
	const updateFilter = useCallback((key: keyof ExamFilters, value: any) => {
		setFilters(prev => ({ ...prev, [key]: value }))
		setCurrentPage(1) // Reset về trang 1 khi filter thay đổi
	}, [])

	// Sắp xếp
	const handleSort = useCallback((key: string) => {
		if (sortKey === key) {
			// Toggle sort order nếu cùng key
			setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
		} else {
			setSortKey(key)
			setSortOrder('asc')
		}
	}, [sortKey])

	// Xóa exam
	const deleteExam = useCallback((examId: string) => {
		setExams(prev => prev.filter(exam => exam.id !== examId))
	}, [])

	// Cập nhật exam
	const updateExam = useCallback((updatedExam: Exam) => {
		setExams(prev => prev.map(exam => 
			exam.id === updatedExam.id ? updatedExam : exam
		))
	}, [])

	// Thêm exam mới
	const addExam = useCallback((newExam: Omit<Exam, 'id' | 'createdAt'>) => {
		const exam: Exam = {
			...newExam,
			id: String(Date.now()),
			createdAt: new Date().toISOString()
		}
		setExams(prev => [exam, ...prev])
	}, [])

	// Sao chép exam
	const duplicateExam = useCallback((examId: string) => {
		const examToDuplicate = exams.find(e => e.id === examId)
		if (examToDuplicate) {
			const duplicated: Exam = {
				...examToDuplicate,
				id: String(Date.now()),
				title: `${examToDuplicate.title} (Bản sao)`,
				status: 'draft',
				createdAt: new Date().toISOString()
			}
			setExams(prev => [duplicated, ...prev])
		}
	}, [exams])

	// Sinh đề thi ngẫu nhiên
	const generateRandomExam = useCallback((config: RandomExamConfig) => {
		const { subject, difficulty, totalQuestions, duration, easyCount, mediumCount, hardCount } = config

		// Lấy questions theo config
		let selectedQuestions = []

		if (difficulty === 'mixed' && easyCount !== undefined && mediumCount !== undefined && hardCount !== undefined) {
			// Custom distribution
			const easyQuestions = mockQuestions
				.filter(q => q.subject === subject && q.difficulty === 'easy')
				.sort(() => Math.random() - 0.5)
				.slice(0, easyCount)
			
			const mediumQuestions = mockQuestions
				.filter(q => q.subject === subject && q.difficulty === 'medium')
				.sort(() => Math.random() - 0.5)
				.slice(0, mediumCount)
			
			const hardQuestions = mockQuestions
				.filter(q => q.subject === subject && q.difficulty === 'hard')
				.sort(() => Math.random() - 0.5)
				.slice(0, hardCount)
			
			selectedQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions]
		} else if (difficulty === 'mixed') {
			// Auto distribution: 40% easy, 40% medium, 20% hard
			const easyCount = Math.floor(totalQuestions * 0.4)
			const mediumCount = Math.floor(totalQuestions * 0.4)
			const hardCount = totalQuestions - easyCount - mediumCount

			const easyQuestions = mockQuestions
				.filter(q => q.subject === subject && q.difficulty === 'easy')
				.sort(() => Math.random() - 0.5)
				.slice(0, easyCount)
			
			const mediumQuestions = mockQuestions
				.filter(q => q.subject === subject && q.difficulty === 'medium')
				.sort(() => Math.random() - 0.5)
				.slice(0, mediumCount)
			
			const hardQuestions = mockQuestions
				.filter(q => q.subject === subject && q.difficulty === 'hard')
				.sort(() => Math.random() - 0.5)
				.slice(0, hardCount)
			
			selectedQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions]
		} else {
			// Single difficulty
			selectedQuestions = mockQuestions
				.filter(q => q.subject === subject && q.difficulty === difficulty)
				.sort(() => Math.random() - 0.5)
				.slice(0, totalQuestions)
		}

		// Tính tổng điểm
		const totalPoints = selectedQuestions.reduce((sum, q) => sum + q.points, 0)

		// Xác định độ khó của đề thi
		const examDifficulty = difficulty === 'mixed' 
			? (hardCount && hardCount > totalQuestions * 0.3 ? 'hard' : 'medium')
			: difficulty as 'easy' | 'medium' | 'hard'

		// Tạo exam mới
		const newExam: Exam = {
			id: String(Date.now()),
			title: `Đề thi ${subject} - ${new Date().toLocaleDateString('vi-VN')}`,
			description: `Đề thi được sinh tự động với ${totalQuestions} câu hỏi`,
			subject,
			duration,
			totalQuestions: selectedQuestions.length,
			totalPoints,
			difficulty: examDifficulty,
			status: 'draft',
			type: 'practice',
			createdBy: 'Hệ thống',
			createdAt: new Date().toISOString(),
			passingScore: Math.floor(totalPoints * 0.5),
			allowReview: true,
			shuffleQuestions: true,
			showResults: true,
			maxAttempts: 3
		}

		setExams(prev => [newExam, ...prev])
		return newExam
	}, [])

	// Lấy danh sách subjects unique
	const subjects = useMemo(() => {
		const uniqueSubjects = Array.from(new Set(exams.map(e => e.subject)))
		return uniqueSubjects.sort()
	}, [exams])

	return {
		exams: paginatedExams,
		allExams: sortedExams,
		filters,
		updateFilter,
		currentPage,
		setCurrentPage,
		totalPages,
		totalItems: sortedExams.length,
		itemsPerPage,
		sortKey,
		sortOrder,
		handleSort,
		deleteExam,
		updateExam,
		addExam,
		duplicateExam,
		generateRandomExam,
		subjects
	}
}

