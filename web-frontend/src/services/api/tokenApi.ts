import { api } from './examApi'
import { mockBanks, mockGifts } from './mockData'

export interface RewardRequest {
	userId: string
	walletAddress: string
	amount?: number
	reason?: string
}

export interface WithdrawalRequest {
	userId: string
	walletAddress: string
	amount: number
	bankAccount: string
	bankName: string
	accountHolder: string
}

export interface GiftItem {
	id: string
	name: string
	description: string
	imageUrl: string
	tokenPrice: number
	stockQuantity: number
	category: 'electronics' | 'voucher' | 'course' | 'physical' | 'other'
}

export interface RedeemGiftRequest {
	userId: string
	walletAddress: string
	giftId: string
	quantity: number
	deliveryAddress?: string
}

export interface CourseUnlockRequest {
	userId: string
	walletAddress: string
	courseId: string
	tokenPrice: number
}

export interface TokenTransaction {
	id: string
	userId: string
	walletAddress: string
	type: 'earn' | 'spend' | 'withdrawal' | 'reward'
	amount: number
	description: string
	transactionHash?: string
	status: 'pending' | 'processing' | 'completed' | 'failed'
	createdAt: string
	updatedAt: string
}

/**
 * Award tokens for completing a lesson
 */
export async function awardLessonCompletion(request: RewardRequest): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/reward/lesson', request)
	return res.data
}

/**
 * Award tokens for passing an exam
 */
export async function awardExamPass(request: RewardRequest & { score: number }): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/reward/exam', request)
	return res.data
}

/**
 * Award tokens for daily streak
 */
export async function awardDailyStreak(request: RewardRequest & { streakDays: number }): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/reward/streak', request)
	return res.data
}

/**
 * Award tokens for earning certification
 */
export async function awardCertification(request: RewardRequest): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/reward/certification', request)
	return res.data
}

/**
 * Award tokens for winning contest
 */
export async function awardContestWin(request: RewardRequest & { rank: number }): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/reward/contest', request)
	return res.data
}

/**
 * Get available gifts for redemption
 */
export async function getAvailableGifts(category?: string): Promise<GiftItem[]> {
	try {
		const params = category ? { category } : {}
		const res = await api.get<GiftItem[]>('/tokens/gifts', { params })
		return res.data
	} catch (error) {
		// Return mock data if API fails
		console.log('Using mock gift data')
		return category && category !== 'all'
			? mockGifts.filter(g => g.category === category)
			: mockGifts
	}
}

/**
 * Get gift details by ID
 */
export async function getGiftDetails(giftId: string): Promise<GiftItem> {
	const res = await api.get<GiftItem>(`/tokens/gifts/${giftId}`)
	return res.data
}

/**
 * Redeem a gift using tokens
 */
export async function redeemGift(request: RedeemGiftRequest): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/redeem/gift', request)
	return res.data
}

/**
 * Unlock a course using tokens
 */
export async function unlockCourse(request: CourseUnlockRequest): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/redeem/course', request)
	return res.data
}

/**
 * Request withdrawal to bank account
 */
export async function requestBankWithdrawal(request: WithdrawalRequest): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/withdrawal/bank', request)
	return res.data
}

/**
 * Get withdrawal transaction status
 */
export async function getWithdrawalStatus(transactionId: string): Promise<TokenTransaction> {
	const res = await api.get<TokenTransaction>(`/tokens/withdrawal/${transactionId}`)
	return res.data
}

/**
 * Get user's token transaction history
 */
export async function getUserTransactionHistory(
	userId: string,
	limit?: number,
	offset?: number
): Promise<{ transactions: TokenTransaction[], total: number }> {
	const params = { limit, offset }
	const res = await api.get<{ transactions: TokenTransaction[], total: number }>(
		`/tokens/transactions/${userId}`,
		{ params }
	)
	return res.data
}

/**
 * Get user's token balance from backend
 */
export async function getUserTokenBalance(userId: string): Promise<{
	balance: number
	totalEarned: number
	totalSpent: number
}> {
	const res = await api.get<{
		balance: number
		totalEarned: number
		totalSpent: number
	}>(`/tokens/balance/${userId}`)
	return res.data
}

/**
 * Verify token transaction on blockchain
 */
export async function verifyTransaction(transactionHash: string): Promise<{
	verified: boolean
	status: string
	details?: any
}> {
	const res = await api.post<{
		verified: boolean
		status: string
		details?: any
	}>('/tokens/verify', { transactionHash })
	return res.data
}

/**
 * Get token statistics
 */
export async function getTokenStats(): Promise<{
	totalSupply: number
	totalUsers: number
	totalTransactions: number
	totalRewardsIssued: number
	totalRedeemed: number
}> {
	const res = await api.get<{
		totalSupply: number
		totalUsers: number
		totalTransactions: number
		totalRewardsIssued: number
		totalRedeemed: number
	}>('/tokens/stats')
	return res.data
}

/**
 * Get supported banks for withdrawal
 */
export async function getSupportedBanks(): Promise<Array<{
	code: string
	name: string
	shortName: string
	logo: string
}>> {
	try {
		const res = await api.get<Array<{
			code: string
			name: string
			shortName: string
			logo: string
		}>>('/tokens/banks')
		return res.data
	} catch (error) {
		// Return mock data if API fails
		console.log('Using mock bank data')
		return mockBanks
	}
}

/**
 * Calculate withdrawal fee
 */
export async function calculateWithdrawalFee(amount: number): Promise<{
	amount: number
	fee: number
	netAmount: number
	rate: number
}> {
	const res = await api.post<{
		amount: number
		fee: number
		netAmount: number
		rate: number
	}>('/tokens/withdrawal/calculate-fee', { amount })
	return res.data
}
