import { 
	RewardRule, 
	RewardTransaction, 
	TokenInfo, 
	RewardStats, 
	UserRewardSummary, 
	RewardDashboard,
	RulePerformance,
	RewardRuleForm
} from '../types/reward'

// Mock Reward Rules
export const mockRewardRules: RewardRule[] = [
	{
		id: 'rule-1',
		name: 'Hoàn thành khóa học React',
		description: 'Tự động thưởng token khi học sinh hoàn thành khóa học React cơ bản',
		type: 'course_completion',
		trigger: 'automatic',
		conditions: [
			{
				id: 'cond-1',
				type: 'course_id',
				operator: 'equals',
				value: 'react-basic-course',
				description: 'Khóa học React cơ bản'
			}
		],
		tokenAmount: 50,
		tokenSymbol: 'LEARN',
		isActive: true,
		priority: 1,
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z',
		createdBy: 'admin-user',
		usageCount: 234,
		lastUsed: '2024-01-16T14:30:00Z'
	},
	{
		id: 'rule-2',
		name: 'Điểm thi xuất sắc (90+)',
		description: 'Thưởng token cho học sinh đạt điểm thi từ 90 điểm trở lên',
		type: 'exam_score',
		trigger: 'automatic',
		conditions: [
			{
				id: 'cond-2',
				type: 'exam_score',
				operator: 'greater_equal',
				value: 90,
				description: 'Điểm thi từ 90 trở lên'
			}
		],
		tokenAmount: 25,
		tokenSymbol: 'LEARN',
		isActive: true,
		priority: 2,
		createdAt: '2024-01-10T09:00:00Z',
		updatedAt: '2024-01-10T09:00:00Z',
		createdBy: 'admin-user',
		usageCount: 156,
		lastUsed: '2024-01-16T16:45:00Z'
	},
	{
		id: 'rule-3',
		name: 'Đăng nhập hàng ngày',
		description: 'Thưởng token cho học sinh đăng nhập liên tục 7 ngày',
		type: 'daily_login',
		trigger: 'automatic',
		conditions: [
			{
				id: 'cond-3',
				type: 'login_days',
				operator: 'greater_equal',
				value: 7,
				description: 'Đăng nhập liên tục 7 ngày'
			}
		],
		tokenAmount: 15,
		tokenSymbol: 'LEARN',
		isActive: true,
		priority: 3,
		createdAt: '2024-01-05T08:00:00Z',
		updatedAt: '2024-01-05T08:00:00Z',
		createdBy: 'admin-user',
		usageCount: 89,
		lastUsed: '2024-01-16T08:00:00Z'
	},
	{
		id: 'rule-4',
		name: 'Nộp bài tập đúng hạn',
		description: 'Thưởng token cho học sinh nộp bài tập trước deadline',
		type: 'assignment_submission',
		trigger: 'automatic',
		conditions: [
			{
				id: 'cond-4',
				type: 'assignment_count',
				operator: 'greater_equal',
				value: 1,
				description: 'Nộp ít nhất 1 bài tập'
			}
		],
		tokenAmount: 10,
		tokenSymbol: 'LEARN',
		isActive: true,
		priority: 4,
		createdAt: '2024-01-12T11:00:00Z',
		updatedAt: '2024-01-12T11:00:00Z',
		createdBy: 'admin-user',
		usageCount: 445,
		lastUsed: '2024-01-16T17:20:00Z'
	},
	{
		id: 'rule-5',
		name: 'Quiz hoàn hảo',
		description: 'Thưởng token cho học sinh làm quiz đạt điểm tuyệt đối',
		type: 'quiz_perfect',
		trigger: 'automatic',
		conditions: [
			{
				id: 'cond-5',
				type: 'quiz_score',
				operator: 'equals',
				value: 100,
				description: 'Điểm quiz 100/100'
			}
		],
		tokenAmount: 20,
		tokenSymbol: 'LEARN',
		isActive: true,
		priority: 5,
		createdAt: '2024-01-08T14:00:00Z',
		updatedAt: '2024-01-08T14:00:00Z',
		createdBy: 'admin-user',
		usageCount: 67,
		lastUsed: '2024-01-16T15:10:00Z'
	},
	{
		id: 'rule-6',
		name: 'Giới thiệu bạn bè',
		description: 'Thưởng token cho học sinh giới thiệu bạn bè tham gia khóa học',
		type: 'referral',
		trigger: 'manual',
		conditions: [
			{
				id: 'cond-6',
				type: 'custom_field',
				operator: 'equals',
				value: 'referral_confirmed',
				description: 'Giới thiệu được xác nhận'
			}
		],
		tokenAmount: 100,
		tokenSymbol: 'LEARN',
		isActive: true,
		priority: 6,
		createdAt: '2024-01-20T10:00:00Z',
		updatedAt: '2024-01-20T10:00:00Z',
		createdBy: 'admin-user',
		usageCount: 23,
		lastUsed: '2024-01-15T12:00:00Z'
	}
]

// Mock Reward Transactions
export const mockRewardTransactions: RewardTransaction[] = [
	{
		id: 'tx-1',
		userId: 'user-123',
		userName: 'Nguyễn Văn A',
		ruleId: 'rule-1',
		ruleName: 'Hoàn thành khóa học React',
		type: 'course_completion',
		tokenAmount: 50,
		tokenSymbol: 'LEARN',
		status: 'completed',
		transactionHash: '0xabc123def456...',
		blockNumber: 18456789,
		gasUsed: 45000,
		createdAt: '2024-01-16T14:30:00Z',
		processedAt: '2024-01-16T14:31:00Z',
		metadata: {
			courseId: 'react-basic-course',
			courseName: 'React Cơ Bản',
			completionDate: '2024-01-16T14:30:00Z'
		}
	},
	{
		id: 'tx-2',
		userId: 'user-456',
		userName: 'Trần Thị B',
		ruleId: 'rule-2',
		ruleName: 'Điểm thi xuất sắc (90+)',
		type: 'exam_score',
		tokenAmount: 25,
		tokenSymbol: 'LEARN',
		status: 'completed',
		transactionHash: '0xdef456abc789...',
		blockNumber: 18456790,
		gasUsed: 42000,
		createdAt: '2024-01-16T16:45:00Z',
		processedAt: '2024-01-16T16:46:00Z',
		metadata: {
			examId: 'exam-react-001',
			examScore: 95,
			examName: 'Kiểm tra React'
		}
	},
	{
		id: 'tx-3',
		userId: 'user-789',
		userName: 'Lê Văn C',
		ruleId: 'rule-3',
		ruleName: 'Đăng nhập hàng ngày',
		type: 'daily_login',
		tokenAmount: 15,
		tokenSymbol: 'LEARN',
		status: 'completed',
		transactionHash: '0x789abc123def...',
		blockNumber: 18456791,
		gasUsed: 38000,
		createdAt: '2024-01-16T08:00:00Z',
		processedAt: '2024-01-16T08:01:00Z',
		metadata: {
			loginStreak: 7,
			lastLoginDate: '2024-01-16T08:00:00Z'
		}
	},
	{
		id: 'tx-4',
		userId: 'user-321',
		userName: 'Phạm Thị D',
		ruleId: 'rule-4',
		ruleName: 'Nộp bài tập đúng hạn',
		type: 'assignment_submission',
		tokenAmount: 10,
		tokenSymbol: 'LEARN',
		status: 'completed',
		transactionHash: '0x321def789abc...',
		blockNumber: 18456792,
		gasUsed: 35000,
		createdAt: '2024-01-16T17:20:00Z',
		processedAt: '2024-01-16T17:21:00Z',
		metadata: {
			assignmentId: 'assign-react-001',
			submissionDate: '2024-01-16T17:20:00Z',
			deadline: '2024-01-17T23:59:59Z'
		}
	},
	{
		id: 'tx-5',
		userId: 'user-654',
		userName: 'Hoàng Văn E',
		ruleId: 'rule-5',
		ruleName: 'Quiz hoàn hảo',
		type: 'quiz_perfect',
		tokenAmount: 20,
		tokenSymbol: 'LEARN',
		status: 'completed',
		transactionHash: '0x654abc321def...',
		blockNumber: 18456793,
		gasUsed: 40000,
		createdAt: '2024-01-16T15:10:00Z',
		processedAt: '2024-01-16T15:11:00Z',
		metadata: {
			quizId: 'quiz-react-001',
			quizScore: 100,
			quizName: 'Quiz React Cơ Bản'
		}
	},
	{
		id: 'tx-6',
		userId: 'user-987',
		userName: 'Nguyễn Thị F',
		ruleId: 'rule-1',
		ruleName: 'Hoàn thành khóa học React',
		type: 'course_completion',
		tokenAmount: 50,
		tokenSymbol: 'LEARN',
		status: 'pending',
		createdAt: '2024-01-16T18:00:00Z',
		metadata: {
			courseId: 'react-basic-course',
			courseName: 'React Cơ Bản',
			completionDate: '2024-01-16T18:00:00Z'
		}
	},
	{
		id: 'tx-7',
		userId: 'user-147',
		userName: 'Trần Văn G',
		ruleId: 'rule-2',
		ruleName: 'Điểm thi xuất sắc (90+)',
		type: 'exam_score',
		tokenAmount: 25,
		tokenSymbol: 'LEARN',
		status: 'failed',
		createdAt: '2024-01-16T16:00:00Z',
		failedReason: 'Insufficient gas fee',
		metadata: {
			examId: 'exam-react-002',
			examScore: 92,
			examName: 'Kiểm tra React Nâng Cao'
		}
	},
	{
		id: 'tx-8',
		userId: 'user-258',
		userName: 'Lê Thị H',
		ruleId: 'rule-6',
		ruleName: 'Giới thiệu bạn bè',
		type: 'referral',
		tokenAmount: 100,
		tokenSymbol: 'LEARN',
		status: 'completed',
		transactionHash: '0x258def147abc...',
		blockNumber: 18456794,
		gasUsed: 50000,
		createdAt: '2024-01-15T12:00:00Z',
		processedAt: '2024-01-15T12:01:00Z',
		metadata: {
			referredUserId: 'user-369',
			referredUserName: 'Nguyễn Văn I',
			referralDate: '2024-01-15T12:00:00Z'
		}
	}
]

// Mock Token Info
export const mockTokenInfo: TokenInfo = {
	symbol: 'LEARN',
	name: 'Learning Ecosystem Token',
	contractAddress: '0x9876543210fedcba9876543210fedcba98765432',
	decimals: 18,
	totalSupply: '10000000000000000000000000', // 10M tokens
	currentPrice: 0.15,
	marketCap: 1500000,
	holders: 3200,
	transfers24h: 892,
	rewardPool: 500000, // 500K tokens available for rewards
	distributedToday: 1250,
	distributedThisMonth: 15600
}

// Mock User Reward Summary
export const mockUserRewardSummary: UserRewardSummary[] = [
	{
		userId: 'user-123',
		userName: 'Nguyễn Văn A',
		totalEarned: 450,
		totalSpent: 200,
		currentBalance: 250,
		tokenSymbol: 'LEARN',
		lastRewardDate: '2024-01-16T14:30:00Z',
		rewardCount: 12,
		topRewardType: 'course_completion'
	},
	{
		userId: 'user-456',
		userName: 'Trần Thị B',
		totalEarned: 380,
		totalSpent: 150,
		currentBalance: 230,
		tokenSymbol: 'LEARN',
		lastRewardDate: '2024-01-16T16:45:00Z',
		rewardCount: 15,
		topRewardType: 'exam_score'
	},
	{
		userId: 'user-789',
		userName: 'Lê Văn C',
		totalEarned: 320,
		totalSpent: 100,
		currentBalance: 220,
		tokenSymbol: 'LEARN',
		lastRewardDate: '2024-01-16T08:00:00Z',
		rewardCount: 18,
		topRewardType: 'daily_login'
	},
	{
		userId: 'user-321',
		userName: 'Phạm Thị D',
		totalEarned: 280,
		totalSpent: 80,
		currentBalance: 200,
		tokenSymbol: 'LEARN',
		lastRewardDate: '2024-01-16T17:20:00Z',
		rewardCount: 20,
		topRewardType: 'assignment_submission'
	},
	{
		userId: 'user-654',
		userName: 'Hoàng Văn E',
		totalEarned: 250,
		totalSpent: 120,
		currentBalance: 130,
		tokenSymbol: 'LEARN',
		lastRewardDate: '2024-01-16T15:10:00Z',
		rewardCount: 10,
		topRewardType: 'quiz_perfect'
	}
]

// Mock Rule Performance
export const mockRulePerformance: RulePerformance[] = [
	{
		ruleId: 'rule-4',
		ruleName: 'Nộp bài tập đúng hạn',
		usageCount: 445,
		totalTokensDistributed: 4450,
		successRate: 98.5,
		lastUsed: '2024-01-16T17:20:00Z',
		averageTokensPerUse: 10
	},
	{
		ruleId: 'rule-1',
		ruleName: 'Hoàn thành khóa học React',
		usageCount: 234,
		totalTokensDistributed: 11700,
		successRate: 99.2,
		lastUsed: '2024-01-16T14:30:00Z',
		averageTokensPerUse: 50
	},
	{
		ruleId: 'rule-2',
		ruleName: 'Điểm thi xuất sắc (90+)',
		usageCount: 156,
		totalTokensDistributed: 3900,
		successRate: 97.8,
		lastUsed: '2024-01-16T16:45:00Z',
		averageTokensPerUse: 25
	},
	{
		ruleId: 'rule-3',
		ruleName: 'Đăng nhập hàng ngày',
		usageCount: 89,
		totalTokensDistributed: 1335,
		successRate: 100,
		lastUsed: '2024-01-16T08:00:00Z',
		averageTokensPerUse: 15
	},
	{
		ruleId: 'rule-5',
		ruleName: 'Quiz hoàn hảo',
		usageCount: 67,
		totalTokensDistributed: 1340,
		successRate: 98.5,
		lastUsed: '2024-01-16T15:10:00Z',
		averageTokensPerUse: 20
	},
	{
		ruleId: 'rule-6',
		ruleName: 'Giới thiệu bạn bè',
		usageCount: 23,
		totalTokensDistributed: 2300,
		successRate: 100,
		lastUsed: '2024-01-15T12:00:00Z',
		averageTokensPerUse: 100
	}
]

// Mock Reward Stats
export const mockRewardStats: RewardStats = {
	totalRules: 6,
	activeRules: 6,
	totalTransactions: 1014,
	todayTransactions: 8,
	totalTokensDistributed: 24500,
	todayTokensDistributed: 1250,
	averageRewardPerUser: 85.5,
	topRewardRule: 'Nộp bài tập đúng hạn',
	successRate: 98.2,
	pendingTransactions: 1,
	failedTransactions: 1
}

// Complete Reward Dashboard
export const mockRewardDashboard: RewardDashboard = {
	stats: mockRewardStats,
	rules: mockRewardRules,
	recentTransactions: mockRewardTransactions,
	tokenInfo: mockTokenInfo,
	topUsers: mockUserRewardSummary,
	rulePerformance: mockRulePerformance
}

// Helper functions
export function getRuleById(id: string): RewardRule | undefined {
	return mockRewardRules.find(rule => rule.id === id)
}

export function getActiveRules(): RewardRule[] {
	return mockRewardRules.filter(rule => rule.isActive)
}

export function getTransactionsByStatus(status: string): RewardTransaction[] {
	return mockRewardTransactions.filter(tx => tx.status === status)
}

export function getTransactionsByUser(userId: string): RewardTransaction[] {
	return mockRewardTransactions.filter(tx => tx.userId === userId)
}

export function getTransactionsByRule(ruleId: string): RewardTransaction[] {
	return mockRewardTransactions.filter(tx => tx.ruleId === ruleId)
}

export function getTodayTransactions(): RewardTransaction[] {
	const today = new Date().toISOString().split('T')[0]
	return mockRewardTransactions.filter(tx => 
		tx.createdAt.startsWith(today)
	)
}

export function getTopPerformingRules(limit = 5): RulePerformance[] {
	return mockRulePerformance
		.sort((a, b) => b.usageCount - a.usageCount)
		.slice(0, limit)
}

export function getTopEarningUsers(limit = 5): UserRewardSummary[] {
	return mockUserRewardSummary
		.sort((a, b) => b.totalEarned - a.totalEarned)
		.slice(0, limit)
}
