import { Exam, Question } from '../types/exam'

// Mock data cho Exams
export const mockExams: Exam[] = [
	{
		id: '1',
		title: 'Kiểm tra giữa kỳ - Lập trình Web',
		description: 'Kiểm tra kiến thức HTML, CSS, JavaScript cơ bản',
		subject: 'Lập trình Web',
		duration: 90,
		totalQuestions: 50,
		totalPoints: 100,
		difficulty: 'medium',
		status: 'published',
		type: 'midterm',
		createdBy: 'Nguyễn Văn An',
		createdAt: '2024-01-15T08:00:00Z',
		startDate: '2024-03-20T09:00:00Z',
		endDate: '2024-03-20T11:00:00Z',
		passingScore: 50,
		allowReview: true,
		shuffleQuestions: true,
		showResults: true,
		maxAttempts: 1
	},
	{
		id: '2',
		title: 'Bài tập thực hành - Cơ sở dữ liệu',
		description: 'Thực hành SQL queries và database design',
		subject: 'Cơ sở dữ liệu',
		duration: 120,
		totalQuestions: 30,
		totalPoints: 100,
		difficulty: 'hard',
		status: 'ongoing',
		type: 'assignment',
		createdBy: 'Trần Thị Bình',
		createdAt: '2024-02-01T10:00:00Z',
		startDate: '2024-03-15T08:00:00Z',
		endDate: '2024-03-25T23:59:00Z',
		passingScore: 60,
		allowReview: true,
		shuffleQuestions: false,
		showResults: false,
		maxAttempts: 3
	},
	{
		id: '3',
		title: 'Quiz nhanh - Thuật toán và cấu trúc dữ liệu',
		description: 'Kiểm tra nhanh về độ phức tạp thuật toán',
		subject: 'Thuật toán',
		duration: 30,
		totalQuestions: 20,
		totalPoints: 50,
		difficulty: 'easy',
		status: 'ended',
		type: 'quiz',
		createdBy: 'Lê Minh Cường',
		createdAt: '2024-01-20T14:00:00Z',
		startDate: '2024-03-01T14:00:00Z',
		endDate: '2024-03-01T14:30:00Z',
		passingScore: 30,
		allowReview: true,
		shuffleQuestions: true,
		showResults: true,
		maxAttempts: 1
	},
	{
		id: '4',
		title: 'Thi cuối kỳ - Hệ điều hành',
		description: 'Đề thi cuối kỳ môn Hệ điều hành',
		subject: 'Hệ điều hành',
		duration: 120,
		totalQuestions: 60,
		totalPoints: 100,
		difficulty: 'hard',
		status: 'published',
		type: 'final',
		createdBy: 'Phạm Thị Dung',
		createdAt: '2024-02-10T09:00:00Z',
		startDate: '2024-04-01T08:00:00Z',
		endDate: '2024-04-01T10:30:00Z',
		passingScore: 50,
		allowReview: false,
		shuffleQuestions: true,
		showResults: false,
		maxAttempts: 1
	},
	{
		id: '5',
		title: 'Luyện tập - Mạng máy tính',
		description: 'Bài tập thực hành về mô hình OSI và TCP/IP',
		subject: 'Mạng máy tính',
		duration: 60,
		totalQuestions: 40,
		totalPoints: 80,
		difficulty: 'medium',
		status: 'published',
		type: 'practice',
		createdBy: 'Hoàng Văn Em',
		createdAt: '2024-02-15T11:00:00Z',
		startDate: '2024-03-10T00:00:00Z',
		endDate: '2024-04-30T23:59:00Z',
		passingScore: 40,
		allowReview: true,
		shuffleQuestions: true,
		showResults: true,
		maxAttempts: 5
	},
	{
		id: '6',
		title: 'Kiểm tra nhanh - Lập trình hướng đối tượng',
		description: 'Kiểm tra về các khái niệm OOP',
		subject: 'Lập trình hướng đối tượng',
		duration: 45,
		totalQuestions: 25,
		totalPoints: 50,
		difficulty: 'easy',
		status: 'draft',
		type: 'quiz',
		createdBy: 'Đỗ Thị Phương',
		createdAt: '2024-03-01T15:00:00Z',
		passingScore: 25,
		allowReview: true,
		shuffleQuestions: false,
		showResults: true,
		maxAttempts: 2
	},
	{
		id: '7',
		title: 'Thi giữa kỳ - Trí tuệ nhân tạo',
		description: 'Đề thi giữa kỳ môn AI',
		subject: 'Trí tuệ nhân tạo',
		duration: 90,
		totalQuestions: 45,
		totalPoints: 100,
		difficulty: 'hard',
		status: 'published',
		type: 'midterm',
		createdBy: 'Vũ Minh Giang',
		createdAt: '2024-02-20T10:00:00Z',
		startDate: '2024-03-28T09:00:00Z',
		endDate: '2024-03-28T10:30:00Z',
		passingScore: 50,
		allowReview: true,
		shuffleQuestions: true,
		showResults: false,
		maxAttempts: 1
	},
	{
		id: '8',
		title: 'Bài tập về nhà - Phát triển phần mềm',
		description: 'Assignment về agile methodology',
		subject: 'Phát triển phần mềm',
		duration: 180,
		totalQuestions: 15,
		totalPoints: 100,
		difficulty: 'medium',
		status: 'ongoing',
		type: 'assignment',
		createdBy: 'Ngô Thị Hà',
		createdAt: '2024-03-05T13:00:00Z',
		startDate: '2024-03-18T00:00:00Z',
		endDate: '2024-03-30T23:59:00Z',
		passingScore: 60,
		allowReview: false,
		shuffleQuestions: false,
		showResults: false,
		maxAttempts: 1
	},
	{
		id: '9',
		title: 'Ôn tập - An toàn thông tin',
		description: 'Câu hỏi ôn tập về cryptography',
		subject: 'An toàn thông tin',
		duration: 60,
		totalQuestions: 35,
		totalPoints: 70,
		difficulty: 'medium',
		status: 'archived',
		type: 'practice',
		createdBy: 'Bùi Văn Ích',
		createdAt: '2024-01-10T16:00:00Z',
		startDate: '2024-02-01T00:00:00Z',
		endDate: '2024-02-28T23:59:00Z',
		passingScore: 35,
		allowReview: true,
		shuffleQuestions: true,
		showResults: true,
		maxAttempts: 10
	},
	{
		id: '10',
		title: 'Quiz - Học máy cơ bản',
		description: 'Kiểm tra kiến thức về machine learning algorithms',
		subject: 'Học máy',
		duration: 40,
		totalQuestions: 30,
		totalPoints: 60,
		difficulty: 'hard',
		status: 'published',
		type: 'quiz',
		createdBy: 'Lý Thị Kim',
		createdAt: '2024-02-25T12:00:00Z',
		startDate: '2024-03-22T14:00:00Z',
		endDate: '2024-03-22T15:00:00Z',
		passingScore: 36,
		allowReview: true,
		shuffleQuestions: true,
		showResults: true,
		maxAttempts: 2
	}
]

// Mock questions để sinh đề ngẫu nhiên
export const mockQuestions: Question[] = [
	// Lập trình Web - Easy
	{ id: 'q1', content: 'HTML là viết tắt của gì?', type: 'multiple-choice', options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'], correctAnswer: 'HyperText Markup Language', points: 2, difficulty: 'easy', subject: 'Lập trình Web', tags: ['html', 'basics'] },
	{ id: 'q2', content: 'CSS dùng để làm gì?', type: 'multiple-choice', options: ['Tạo cấu trúc trang', 'Định dạng giao diện', 'Xử lý logic'], correctAnswer: 'Định dạng giao diện', points: 2, difficulty: 'easy', subject: 'Lập trình Web', tags: ['css', 'basics'] },
	
	// Lập trình Web - Medium
	{ id: 'q3', content: 'Flexbox được dùng để làm gì trong CSS?', type: 'multiple-choice', options: ['Tạo layout linh hoạt', 'Tạo animation', 'Tạo gradient'], correctAnswer: 'Tạo layout linh hoạt', points: 3, difficulty: 'medium', subject: 'Lập trình Web', tags: ['css', 'flexbox'] },
	{ id: 'q4', content: 'Promise trong JavaScript là gì?', type: 'multiple-choice', options: ['Object xử lý bất đồng bộ', 'Function callback', 'Event listener'], correctAnswer: 'Object xử lý bất đồng bộ', points: 3, difficulty: 'medium', subject: 'Lập trình Web', tags: ['javascript', 'async'] },
	
	// Lập trình Web - Hard
	{ id: 'q5', content: 'Event Loop trong JavaScript hoạt động như thế nào?', type: 'essay', correctAnswer: '', points: 5, difficulty: 'hard', subject: 'Lập trình Web', tags: ['javascript', 'advanced'] },
	
	// Cơ sở dữ liệu - Easy
	{ id: 'q6', content: 'SQL là viết tắt của gì?', type: 'multiple-choice', options: ['Structured Query Language', 'Simple Query Language', 'Standard Question Language'], correctAnswer: 'Structured Query Language', points: 2, difficulty: 'easy', subject: 'Cơ sở dữ liệu', tags: ['sql', 'basics'] },
	
	// Cơ sở dữ liệu - Medium
	{ id: 'q7', content: 'Primary key là gì?', type: 'multiple-choice', options: ['Khóa chính xác định duy nhất record', 'Khóa ngoại liên kết bảng', 'Index tăng tốc truy vấn'], correctAnswer: 'Khóa chính xác định duy nhất record', points: 3, difficulty: 'medium', subject: 'Cơ sở dữ liệu', tags: ['database', 'keys'] },
	
	// Cơ sở dữ liệu - Hard  
	{ id: 'q8', content: 'Giải thích về ACID trong database transactions', type: 'essay', correctAnswer: '', points: 5, difficulty: 'hard', subject: 'Cơ sở dữ liệu', tags: ['transactions', 'acid'] },
	
	// Thuật toán - Easy
	{ id: 'q9', content: 'Độ phức tạp của Binary Search là gì?', type: 'multiple-choice', options: ['O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 'O(log n)', points: 2, difficulty: 'easy', subject: 'Thuật toán', tags: ['complexity', 'search'] },
	
	// Thuật toán - Medium
	{ id: 'q10', content: 'Thuật toán Quick Sort hoạt động như thế nào?', type: 'essay', correctAnswer: '', points: 3, difficulty: 'medium', subject: 'Thuật toán', tags: ['sorting', 'quicksort'] }
]

// Helper functions
export function getAllExams(): Exam[] {
	return mockExams
}

export function getExamById(id: string): Exam | undefined {
	return mockExams.find(exam => exam.id === id)
}

export function getQuestionsBySubject(subject: string, difficulty?: string, count?: number): Question[] {
	let filtered = mockQuestions.filter(q => q.subject === subject)
	
	if (difficulty && difficulty !== 'mixed') {
		filtered = filtered.filter(q => q.difficulty === difficulty)
	}
	
	if (count) {
		// Shuffle và lấy count câu
		filtered = filtered.sort(() => Math.random() - 0.5).slice(0, count)
	}
	
	return filtered
}

