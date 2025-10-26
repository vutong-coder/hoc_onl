import { useState, useMemo, useCallback, useEffect } from 'react'
import { ProctoringSession, ProctoringFilters, SessionStats } from '../types/proctoring'
import { proctoringApi } from '../services/proctoringApi'

export default function useProctoring() {
	const [sessions, setSessions] = useState<ProctoringSession[]>([])
	const [loading, setLoading] = useState(true)
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

	// Transform backend data to frontend format
	const transformSession = useCallback((s: any): ProctoringSession => {
		const events = s.events || []
		const totalViolations = events.length
		const highSeverityViolations = events.filter((e: any) => e.severity === 'high').length
		const criticalViolations = events.filter((e: any) => e.severity === 'critical').length
		
		// Calculate risk level based on actual violations
		let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
		if (criticalViolations > 0 || highSeverityViolations > 5) {
			riskLevel = 'critical'
		} else if (highSeverityViolations > 2) {
			riskLevel = 'high'
		} else if (highSeverityViolations > 0 || totalViolations > 3) {
			riskLevel = 'medium'
		}
		
		// Calculate duration
		const startTime = new Date(s.startTime)
		const endTime = s.endTime ? new Date(s.endTime) : new Date()
		const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000)
		
		// Check if face detected from events
		const hasFaceDetectionEvents = events.some((e: any) => 
			e.eventType === 'FACE_NOT_DETECTED' || e.eventType === 'MULTIPLE_FACES'
		)
		const faceDetected = !events.some((e: any) => e.eventType === 'FACE_NOT_DETECTED')
		const faceCount = events.some((e: any) => e.eventType === 'MULTIPLE_FACES') ? 2 : 1
		
		return {
			id: s.id,
			examId: s.examId,
			examTitle: s.examId, // You may want to fetch exam title from another API
			userId: s.userId?.toString() || '',
			userName: `User ${s.userId}`,
			startTime: s.startTime,
			endTime: s.endTime,
			duration,
			status: s.status === 'in_progress' ? 'active' : s.status === 'terminated' ? 'terminated' : 'completed',
			riskLevel,
			cameraEnabled: true,
			audioEnabled: true,
			faceDetected,
			faceCount: faceDetected ? faceCount : 0,
			gazeDirection: events.some((e: any) => e.eventType === 'LOOKING_AWAY') ? 'left' : 'center',
			audioDetected: true,
			totalViolations,
			violations: events.map((e: any) => ({
				id: e.id,
				sessionId: e.sessionId,
				timestamp: e.timestamp,
				type: e.eventType.toLowerCase().replace(/_/g, '_') as any,
				severity: e.severity,
				description: e.metadata?.description || e.eventType,
				evidenceUrl: e.metadata?.storagePath ? proctoringApi.getMediaUrl(e.metadata.storagePath) : undefined,
				resolved: e.isReviewed || false
			})),
			tabSwitches: 0, // Not tracked in backend yet
			fullscreenExited: 0, // Not tracked in backend yet
			browserChanged: false, // Not tracked in backend yet
			connectionStatus: s.status === 'in_progress' ? 'online' : 'offline',
			lastPing: new Date().toISOString()
		}
	}, [])

	// Fetch sessions from API
	useEffect(() => {
		const fetchSessions = async () => {
			setLoading(true)
			try {
				const data = await proctoringApi.getAllSessions()
				
				// Backend already includes events in response, but fetch separately for reliability
				const sessionsWithEvents = await Promise.all(
					data.map(async (session: any) => {
						// Use events from include if available, otherwise fetch separately
						let events = session.events || []
						
						// If no events in response, fetch separately
						if (!events || events.length === 0) {
							try {
								events = await proctoringApi.getEventsBySession(session.id)
							} catch (error) {
								console.error(`Error fetching events for session ${session.id}:`, error)
								events = []
							}
						}
						
						return { ...session, events }
					})
				)
				
				const transformedSessions = sessionsWithEvents.map(transformSession)
				setSessions(transformedSessions)
			} catch (error) {
				console.error('Error fetching sessions:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchSessions()
	}, [transformSession])

	// Update filter
	const updateFilter = useCallback((key: keyof ProctoringFilters, value: any) => {
		setFilters(prev => ({ ...prev, [key]: value }))
	}, [])

	// Auto refresh
	useEffect(() => {
		if (!autoRefresh) return

		const interval = setInterval(async () => {
			try {
				const data = await proctoringApi.getAllSessions()
				
				// Use events from include if available, otherwise fetch separately
				const sessionsWithEvents = await Promise.all(
					data.map(async (session: any) => {
						let events = session.events || []
						
						if (!events || events.length === 0) {
							try {
								events = await proctoringApi.getEventsBySession(session.id)
							} catch (error) {
								console.error(`Error fetching events for session ${session.id}:`, error)
								events = []
							}
						}
						
						return { ...session, events }
					})
				)
				
				const transformedSessions = sessionsWithEvents.map(transformSession)
				setSessions(transformedSessions)
			} catch (error) {
				console.error('Error refreshing sessions:', error)
			}
		}, 5000) // Update every 5 seconds

		return () => clearInterval(interval)
	}, [autoRefresh, transformSession])

	// Terminate session
	const terminateSession = useCallback(async (sessionId: string) => {
		const success = await proctoringApi.terminateSession(sessionId)
		if (success) {
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
		}
	}, [selectedSession])

	// Send warning
	const sendWarning = useCallback((sessionId: string) => {
		// In real app, this would trigger a notification to the student
		console.log(`Warning sent to session ${sessionId}`)
		// Could add a warning event to violations here
	}, [])

	// Resolve violation
	const resolveViolation = useCallback(async (sessionId: string, violationId: string) => {
		const success = await proctoringApi.reviewEvent(violationId, true)
		if (success) {
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
		}
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
		resolveViolation,
		loading
	}
}

