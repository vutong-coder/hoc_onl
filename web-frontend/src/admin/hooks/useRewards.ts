import { useState, useMemo, useCallback, useEffect } from 'react'
import { 
	RewardRule, 
	RewardTransaction, 
	RewardFilters, 
	RewardDashboard,
	RewardRuleForm,
	TransactionStatus,
	RewardType
} from '../types/reward'
import { 
	mockRewardDashboard,
	mockRewardRules,
	mockRewardTransactions,
	mockTokenInfo
} from '../mock/rewards'

export default function useRewards() {
	const [dashboard, setDashboard] = useState<RewardDashboard>(mockRewardDashboard)
	const [filters, setFilters] = useState<RewardFilters>({
		search: '',
		ruleType: 'all',
		status: 'all',
		dateRange: 'today',
		tokenSymbol: 'all'
	})
	const [activeTab, setActiveTab] = useState<'dashboard' | 'rules' | 'transactions'>('dashboard')
	const [isRuleEditorOpen, setIsRuleEditorOpen] = useState(false)
	const [editingRule, setEditingRule] = useState<RewardRule | null>(null)
	const [selectedTransaction, setSelectedTransaction] = useState<RewardTransaction | null>(null)

	// Filter rules
	const filteredRules = useMemo(() => {
		let result = [...dashboard.rules]

		// Search filter
		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			result = result.filter(rule =>
				rule.name.toLowerCase().includes(searchLower) ||
				rule.description.toLowerCase().includes(searchLower) ||
				rule.type.toLowerCase().includes(searchLower)
			)
		}

		// Rule type filter
		if (filters.ruleType !== 'all') {
			result = result.filter(rule => rule.type === filters.ruleType)
		}

		return result.sort((a, b) => a.priority - b.priority)
	}, [dashboard.rules, filters])

	// Filter transactions
	const filteredTransactions = useMemo(() => {
		let result = [...dashboard.recentTransactions]

		// Search filter
		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			result = result.filter(tx =>
				tx.userName.toLowerCase().includes(searchLower) ||
				tx.ruleName.toLowerCase().includes(searchLower) ||
				tx.type.toLowerCase().includes(searchLower)
			)
		}

		// Status filter
		if (filters.status !== 'all') {
			result = result.filter(tx => tx.status === filters.status)
		}

		// Token symbol filter
		if (filters.tokenSymbol !== 'all') {
			result = result.filter(tx => tx.tokenSymbol === filters.tokenSymbol)
		}

		// Date range filter
		const now = new Date()
		const timeFilter = {
			today: 24 * 60 * 60 * 1000,
			week: 7 * 24 * 60 * 60 * 1000,
			month: 30 * 24 * 60 * 60 * 1000,
			year: 365 * 24 * 60 * 60 * 1000,
			all: Infinity
		}

		if (filters.dateRange !== 'all') {
			const timeLimit = timeFilter[filters.dateRange]
			result = result.filter(tx => {
				const txTime = new Date(tx.createdAt).getTime()
				return (now.getTime() - txTime) <= timeLimit
			})
		}

		return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	}, [dashboard.recentTransactions, filters])

	// Update filter
	const updateFilter = useCallback((key: keyof RewardFilters, value: any) => {
		setFilters(prev => ({ ...prev, [key]: value }))
	}, [])

	// Rule management
	const addRule = useCallback((ruleForm: RewardRuleForm) => {
		const newRule: RewardRule = {
			id: `rule-${Date.now()}`,
			name: ruleForm.name,
			description: ruleForm.description,
			type: ruleForm.type,
			trigger: ruleForm.trigger,
			conditions: ruleForm.conditions.map((c, index) => ({
				id: `cond-${Date.now()}-${index}`,
				type: c.type,
				operator: c.operator,
				value: c.value,
				description: c.description
			})),
			tokenAmount: ruleForm.tokenAmount,
			tokenSymbol: ruleForm.tokenSymbol,
			isActive: ruleForm.isActive,
			priority: ruleForm.priority,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			createdBy: 'admin-user',
			usageCount: 0
		}

		setDashboard(prev => ({
			...prev,
			rules: [newRule, ...prev.rules],
			stats: {
				...prev.stats,
				totalRules: prev.stats.totalRules + 1,
				activeRules: prev.stats.activeRules + (ruleForm.isActive ? 1 : 0)
			}
		}))
	}, [])

	const updateRule = useCallback((ruleId: string, ruleForm: RewardRuleForm) => {
		setDashboard(prev => ({
			...prev,
			rules: prev.rules.map(rule =>
				rule.id === ruleId
					? {
						...rule,
						name: ruleForm.name,
						description: ruleForm.description,
						type: ruleForm.type,
						trigger: ruleForm.trigger,
						conditions: ruleForm.conditions.map((c, index) => ({
							id: `cond-${Date.now()}-${index}`,
							type: c.type,
							operator: c.operator,
							value: c.value,
							description: c.description
						})),
						tokenAmount: ruleForm.tokenAmount,
						tokenSymbol: ruleForm.tokenSymbol,
						isActive: ruleForm.isActive,
						priority: ruleForm.priority,
						updatedAt: new Date().toISOString()
					}
					: rule
			)
		}))
	}, [])

	const deleteRule = useCallback((ruleId: string) => {
		setDashboard(prev => {
			const rule = prev.rules.find(r => r.id === ruleId)
			return {
				...prev,
				rules: prev.rules.filter(r => r.id !== ruleId),
				stats: {
					...prev.stats,
					totalRules: prev.stats.totalRules - 1,
					activeRules: prev.stats.activeRules - (rule?.isActive ? 1 : 0)
				}
			}
		})
	}, [])

	const toggleRuleStatus = useCallback((ruleId: string) => {
		setDashboard(prev => ({
			...prev,
			rules: prev.rules.map(rule =>
				rule.id === ruleId
					? { ...rule, isActive: !rule.isActive, updatedAt: new Date().toISOString() }
					: rule
			),
			stats: {
				...prev.stats,
				activeRules: prev.rules.reduce((count, rule) => {
					if (rule.id === ruleId) {
						return count + (rule.isActive ? 0 : 1) // If currently active, decrease by 1, else increase by 1
					}
					return count + (rule.isActive ? 1 : 0)
				}, 0)
			}
		}))
	}, [])

	const duplicateRule = useCallback((rule: RewardRule) => {
		const duplicatedRule: RewardRule = {
			...rule,
			id: `rule-${Date.now()}`,
			name: `${rule.name} (Copy)`,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			usageCount: 0,
			lastUsed: undefined
		}

		setDashboard(prev => ({
			...prev,
			rules: [duplicatedRule, ...prev.rules],
			stats: {
				...prev.stats,
				totalRules: prev.stats.totalRules + 1,
				activeRules: prev.stats.activeRules + (rule.isActive ? 1 : 0)
			}
		}))
	}, [])

	// Transaction management
	const retryTransaction = useCallback((transactionId: string) => {
		setDashboard(prev => ({
			...prev,
			recentTransactions: prev.recentTransactions.map(tx =>
				tx.id === transactionId
					? { 
						...tx, 
						status: 'processing' as TransactionStatus,
						processedAt: undefined,
						failedReason: undefined
					}
					: tx
			)
		}))

		// Simulate retry success after 2 seconds
		setTimeout(() => {
			setDashboard(prev => {
				const transaction = prev.recentTransactions.find(tx => tx.id === transactionId)
				if (!transaction) return prev

				return {
					...prev,
					recentTransactions: prev.recentTransactions.map(tx =>
						tx.id === transactionId
							? { 
								...tx, 
								status: 'completed' as TransactionStatus,
								processedAt: new Date().toISOString(),
								transactionHash: `0x${Math.random().toString(16).substr(2, 8)}...`,
								blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
								gasUsed: Math.floor(Math.random() * 20000) + 30000
							}
							: tx
					),
					stats: {
						...prev.stats,
						totalTransactions: prev.stats.totalTransactions + 1,
						todayTransactions: prev.stats.todayTransactions + 1,
						totalTokensDistributed: prev.stats.totalTokensDistributed + transaction.tokenAmount,
						todayTokensDistributed: prev.stats.todayTokensDistributed + transaction.tokenAmount,
						failedTransactions: Math.max(0, prev.stats.failedTransactions - 1)
					}
				}
			})
		}, 2000)
	}, [])

	// Modal management
	const openRuleEditor = useCallback((rule?: RewardRule) => {
		setEditingRule(rule || null)
		setIsRuleEditorOpen(true)
	}, [])

	const closeRuleEditor = useCallback(() => {
		setIsRuleEditorOpen(false)
		setEditingRule(null)
	}, [])

	const saveRule = useCallback((ruleForm: RewardRuleForm) => {
		if (editingRule) {
			updateRule(editingRule.id, ruleForm)
		} else {
			addRule(ruleForm)
		}
		closeRuleEditor()
	}, [editingRule, addRule, updateRule, closeRuleEditor])

	// Simulate real-time updates
	useEffect(() => {
		const interval = setInterval(() => {
			setDashboard(prev => {
				// Simulate new transactions occasionally
				if (Math.random() < 0.1) { // 10% chance
					const activeRules = prev.rules.filter(rule => rule.isActive)
					if (activeRules.length > 0) {
						const randomRule = activeRules[Math.floor(Math.random() * activeRules.length)]
						const users = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D']
						const randomUser = users[Math.floor(Math.random() * users.length)]
						
						const newTransaction: RewardTransaction = {
							id: `tx-${Date.now()}`,
							userId: `user-${Math.floor(Math.random() * 1000)}`,
							userName: randomUser,
							ruleId: randomRule.id,
							ruleName: randomRule.name,
							type: randomRule.type,
							tokenAmount: randomRule.tokenAmount,
							tokenSymbol: randomRule.tokenSymbol,
							status: 'completed',
							transactionHash: `0x${Math.random().toString(16).substr(2, 8)}...`,
							blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
							gasUsed: Math.floor(Math.random() * 20000) + 30000,
							createdAt: new Date().toISOString(),
							processedAt: new Date().toISOString()
						}

						return {
							...prev,
							recentTransactions: [newTransaction, ...prev.recentTransactions].slice(0, 100),
							stats: {
								...prev.stats,
								totalTransactions: prev.stats.totalTransactions + 1,
								todayTransactions: prev.stats.todayTransactions + 1,
								totalTokensDistributed: prev.stats.totalTokensDistributed + randomRule.tokenAmount,
								todayTokensDistributed: prev.stats.todayTokensDistributed + randomRule.tokenAmount
							},
							rules: prev.rules.map(rule =>
								rule.id === randomRule.id
									? { ...rule, usageCount: rule.usageCount + 1, lastUsed: new Date().toISOString() }
									: rule
							)
						}
					}
				}
				return prev
			})
		}, 10000) // Update every 10 seconds

		return () => clearInterval(interval)
	}, [])

	// Helper functions
	const getRuleById = useCallback((id: string) => {
		return dashboard.rules.find(rule => rule.id === id)
	}, [dashboard.rules])

	const getTransactionsByStatus = useCallback((status: TransactionStatus) => {
		return dashboard.recentTransactions.filter(tx => tx.status === status)
	}, [dashboard.recentTransactions])

	const getTransactionsByUser = useCallback((userId: string) => {
		return dashboard.recentTransactions.filter(tx => tx.userId === userId)
	}, [dashboard.recentTransactions])

	const getTodayTransactions = useCallback(() => {
		const today = new Date().toISOString().split('T')[0]
		return dashboard.recentTransactions.filter(tx => 
			tx.createdAt.startsWith(today)
		)
	}, [dashboard.recentTransactions])

	return {
		// Data
		dashboard,
		rules: filteredRules,
		transactions: filteredTransactions,
		filters,
		
		// Actions
		updateFilter,
		addRule,
		updateRule,
		deleteRule,
		toggleRuleStatus,
		duplicateRule,
		retryTransaction,
		
		// Modal management
		isRuleEditorOpen,
		editingRule,
		openRuleEditor,
		closeRuleEditor,
		saveRule,
		
		// Tab management
		activeTab,
		setActiveTab,
		
		// Selection
		selectedTransaction,
		setSelectedTransaction,
		
		// Helper functions
		getRuleById,
		getTransactionsByStatus,
		getTransactionsByUser,
		getTodayTransactions
	}
}
