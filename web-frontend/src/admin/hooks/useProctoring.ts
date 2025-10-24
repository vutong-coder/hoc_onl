import { useState, useMemo, useCallback, useEffect } from 'react'
import { ProctoringSession, ProctoringFilters, SessionStats } from '../types/proctoring'
import { mockProctorinSessions } from '../mock/proctoring'

export default function useProctoring() {
	const [sessions, setSessions] = useState<ProctoringSession[]>(mockProctorinSessions)
	const [filters, setFilters] = useState<ProctoringFilters>({
		search: '',
		status: 'all',
		riskLevel: 'all',
		examId: 'all'
	})
	const [selectedSession, setSelectedSession] = useState<ProctoringSession | null>(null)
	const [autoRefresh, setAutoRefresh] = useState(true)

	// Filter sessions
	const filteredSessions = useMemo(() => {
		let result = [...sessions]

		// Search
		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			result = result.filter(s =>
				s.userName.toLowerCase().includes(searchLower) ||
				s.examTitle.toLowerCase().includes(searchLower) ||
				s.userId.toLowerCase().includes(searchLower)
			)
		}

		// Status filter
		if (filters.status !== 'all') {
			result = result.filter(s => s.status === filters.status)
		}

		// Risk level filter
		if (filters.riskLevel !== 'all') {
			result = result.filter(s => s.riskLevel === filters.riskLevel)
		}

		// Exam filter
		if (filters.examId !== 'all') {
			result = result.filter(s => s.examId === filters.examId)
		}

		return result
	}, [sessions, filters])

	// Calculate stats
	const stats: SessionStats = useMemo(() => {
		const activeSessions = sessions.filter(s => s.status === 'active')
		const highRiskSessions = activeSessions.filter(s => 
			s.riskLevel === 'high' || s.riskLevel === 'critical'
		)
		const totalViolations = activeSessions.reduce((sum, s) => sum + s.totalViolations, 0)
		
		const riskScores = activeSessions.map(s => {
			switch (s.riskLevel) {
				case 'low': return 1
				case 'medium': return 2
				case 'high': return 3
				case 'critical': return 4
				default: return 0
			}
		})
		const avgRiskLevel = riskScores.length > 0 
			? riskScores.reduce((sum: number, score) => sum + score, 0) / riskScores.length
			: 0

		return {
			totalActive: activeSessions.length,
			totalViolations,
			highRiskSessions: highRiskSessions.length,
			avgRiskLevel
		}
	}, [sessions])

	// Get unique exams
	const exams = useMemo(() => {
		const uniqueExams = Array.from(
			new Set(sessions.map(s => JSON.stringify({ id: s.examId, title: s.examTitle })))
		).map(str => JSON.parse(str))
		return uniqueExams
	}, [sessions])

	// Update filter
	const updateFilter = useCallback((key: keyof ProctoringFilters, value: any) => {
		setFilters(prev => ({ ...prev, [key]: value }))
	}, [])

	// Simulate real-time updates
	useEffect(() => {
		if (!autoRefresh) return

		const interval = setInterval(() => {
			setSessions(prev => prev.map(session => {
				if (session.status !== 'active') return session

				// Simulate random events
				const random = Math.random()
				
				// Update connection status
				if (random < 0.1) {
					return {
						...session,
						connectionStatus: random < 0.05 ? 'unstable' : 'online',
						lastPing: new Date().toISOString()
					}
				}

				// Update face detection
				if (random < 0.2 && random > 0.1) {
					const faceDetected = Math.random() > 0.3
					return {
						...session,
						faceDetected,
						faceCount: faceDetected ? (Math.random() > 0.9 ? 2 : 1) : 0,
						gazeDirection: faceDetected ? 
							(['center', 'left', 'right', 'up'] as const)[Math.floor(Math.random() * 4)] : 'unknown'
					}
				}

				// Update audio detection
				if (random < 0.3 && random > 0.2) {
					return {
						...session,
						audioDetected: Math.random() > 0.7
					}
				}

				return session
			}))
		}, 3000) // Update every 3 seconds

		return () => clearInterval(interval)
	}, [autoRefresh])

	// Terminate session
	const terminateSession = useCallback((sessionId: string) => {
		setSessions(prev => prev.map(s =>
			s.id === sessionId
				? {
					...s,
					status: 'terminated' as const,
					endTime: new Date().toISOString()
				}
				: s
		))
		if (selectedSession?.id === sessionId) {
			setSelectedSession(null)
		}
	}, [selectedSession])

	// Send warning
	const sendWarning = useCallback((sessionId: string) => {
		// In real app, this would trigger a notification to the student
		console.log(`Warning sent to session ${sessionId}`)
		// Could add a warning event to violations here
	}, [])

	// Resolve violation
	const resolveViolation = useCallback((sessionId: string, violationId: string) => {
		setSessions(prev => prev.map(s =>
			s.id === sessionId
				? {
					...s,
					violations: s.violations.map(v =>
						v.id === violationId ? { ...v, resolved: true } : v
					)
				}
				: s
		))
	}, [])

	// Update risk level based on violations
	useEffect(() => {
		setSessions(prev => prev.map(session => {
			if (session.status !== 'active') return session

			const unresolvedViolations = session.violations.filter(v => !v.resolved).length
			const criticalViolations = session.violations.filter(v => 
				v.severity === 'critical' && !v.resolved
			).length

			let riskLevel: typeof session.riskLevel = 'low'
			
			if (criticalViolations > 0 || unresolvedViolations >= 5) {
				riskLevel = 'critical'
			} else if (unresolvedViolations >= 3) {
				riskLevel = 'high'
			} else if (unresolvedViolations >= 1) {
				riskLevel = 'medium'
			}

			return { ...session, riskLevel }
		}))
	}, [sessions.map(s => s.violations.length).join(',')])

	return {
		sessions: filteredSessions,
		allSessions: sessions,
		filters,
		updateFilter,
		stats,
		exams,
		selectedSession,
		setSelectedSession,
		autoRefresh,
		setAutoRefresh,
		terminateSession,
		sendWarning,
		resolveViolation
	}
}

