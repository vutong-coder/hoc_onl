import { ProctoringSession, Violation, ProctoringEvent } from '../types/proctoring'

// Mock Proctoring Sessions
export const mockProctorinSessions: ProctoringSession[] = [
	{
		id: 'session-1',
		examId: '1',
		examTitle: 'Kiểm tra giữa kỳ - Lập trình Web',
		userId: 'user-1',
		userName: 'Nguyễn Văn An',
		userAvatar: 'https://i.pravatar.cc/150?img=1',
		startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 phút trước
		duration: 90,
		status: 'active',
		riskLevel: 'low',
		cameraEnabled: true,
		audioEnabled: true,
		faceDetected: true,
		faceCount: 1,
		gazeDirection: 'center',
		audioDetected: false,
		totalViolations: 0,
		violations: [],
		tabSwitches: 0,
		fullscreenExited: 0,
		browserChanged: false,
		connectionStatus: 'online',
		lastPing: new Date().toISOString()
	},
	{
		id: 'session-2',
		examId: '2',
		examTitle: 'Bài tập thực hành - Cơ sở dữ liệu',
		userId: 'user-2',
		userName: 'Trần Thị Bình',
		userAvatar: 'https://i.pravatar.cc/150?img=2',
		startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 phút trước
		duration: 120,
		status: 'active',
		riskLevel: 'high',
		cameraEnabled: true,
		audioEnabled: true,
		faceDetected: false,
		faceCount: 0,
		gazeDirection: 'unknown',
		audioDetected: true,
		totalViolations: 5,
		violations: [
			{
				id: 'v1',
				sessionId: 'session-2',
				timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
				type: 'no_face_detected',
				severity: 'high',
				description: 'Không phát hiện khuôn mặt trong 15 giây',
				resolved: false
			},
			{
				id: 'v2',
				sessionId: 'session-2',
				timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
				type: 'audio_detected',
				severity: 'medium',
				description: 'Phát hiện giọng nói trong phòng thi',
				resolved: false
			},
			{
				id: 'v3',
				sessionId: 'session-2',
				timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
				type: 'tab_switch',
				severity: 'medium',
				description: 'Chuyển sang tab khác',
				resolved: true
			},
			{
				id: 'v4',
				sessionId: 'session-2',
				timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
				type: 'multiple_faces',
				severity: 'high',
				description: 'Phát hiện 2 khuôn mặt trong khung hình',
				resolved: false
			},
			{
				id: 'v5',
				sessionId: 'session-2',
				timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
				type: 'fullscreen_exit',
				severity: 'medium',
				description: 'Thoát chế độ toàn màn hình',
				resolved: false
			}
		],
		tabSwitches: 3,
		fullscreenExited: 2,
		browserChanged: false,
		connectionStatus: 'online',
		lastPing: new Date().toISOString()
	},
	{
		id: 'session-3',
		examId: '3',
		examTitle: 'Quiz nhanh - Thuật toán',
		userId: 'user-3',
		userName: 'Lê Minh Cường',
		userAvatar: 'https://i.pravatar.cc/150?img=3',
		startTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
		duration: 30,
		status: 'active',
		riskLevel: 'medium',
		cameraEnabled: true,
		audioEnabled: true,
		faceDetected: true,
		faceCount: 1,
		gazeDirection: 'left',
		audioDetected: false,
		totalViolations: 2,
		violations: [
			{
				id: 'v6',
				sessionId: 'session-3',
				timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
				type: 'looking_away',
				severity: 'low',
				description: 'Nhìn sang bên trái quá lâu',
				resolved: true
			},
			{
				id: 'v7',
				sessionId: 'session-3',
				timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
				type: 'tab_switch',
				severity: 'medium',
				description: 'Chuyển tab',
				resolved: false
			}
		],
		tabSwitches: 1,
		fullscreenExited: 0,
		browserChanged: false,
		connectionStatus: 'online',
		lastPing: new Date().toISOString()
	},
	{
		id: 'session-4',
		examId: '4',
		examTitle: 'Thi cuối kỳ - Hệ điều hành',
		userId: 'user-4',
		userName: 'Phạm Thị Dung',
		userAvatar: 'https://i.pravatar.cc/150?img=4',
		startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
		duration: 120,
		status: 'active',
		riskLevel: 'critical',
		cameraEnabled: false,
		audioEnabled: true,
		faceDetected: false,
		faceCount: 0,
		gazeDirection: 'unknown',
		audioDetected: true,
		totalViolations: 8,
		violations: [
			{
				id: 'v8',
				sessionId: 'session-4',
				timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
				type: 'no_face_detected',
				severity: 'critical',
				description: 'Camera bị tắt',
				resolved: false
			},
			{
				id: 'v9',
				sessionId: 'session-4',
				timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
				type: 'suspicious_audio',
				severity: 'high',
				description: 'Phát hiện âm thanh đáng ngờ',
				resolved: false
			}
		],
		tabSwitches: 5,
		fullscreenExited: 3,
		browserChanged: true,
		connectionStatus: 'unstable',
		lastPing: new Date(Date.now() - 30 * 1000).toISOString() // 30s trước
	},
	{
		id: 'session-5',
		examId: '1',
		examTitle: 'Kiểm tra giữa kỳ - Lập trình Web',
		userId: 'user-5',
		userName: 'Hoàng Văn Em',
		userAvatar: 'https://i.pravatar.cc/150?img=5',
		startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
		duration: 90,
		status: 'active',
		riskLevel: 'low',
		cameraEnabled: true,
		audioEnabled: true,
		faceDetected: true,
		faceCount: 1,
		gazeDirection: 'center',
		audioDetected: false,
		totalViolations: 0,
		violations: [],
		tabSwitches: 0,
		fullscreenExited: 0,
		browserChanged: false,
		connectionStatus: 'online',
		lastPing: new Date().toISOString()
	},
	{
		id: 'session-6',
		examId: '2',
		examTitle: 'Bài tập thực hành - Cơ sở dữ liệu',
		userId: 'user-6',
		userName: 'Đỗ Thị Phương',
		startTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
		endTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
		duration: 120,
		status: 'completed',
		riskLevel: 'low',
		cameraEnabled: true,
		audioEnabled: true,
		faceDetected: true,
		faceCount: 1,
		gazeDirection: 'center',
		audioDetected: false,
		totalViolations: 1,
		violations: [
			{
				id: 'v10',
				sessionId: 'session-6',
				timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
				type: 'tab_switch',
				severity: 'low',
				description: 'Chuyển tab 1 lần',
				resolved: true
			}
		],
		tabSwitches: 1,
		fullscreenExited: 0,
		browserChanged: false,
		connectionStatus: 'online'
	}
]

// Mock Events
export const mockProctoringEvents: ProctoringEvent[] = [
	{
		id: 'e1',
		sessionId: 'session-2',
		timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
		type: 'violation_detected',
		message: 'Phát hiện vi phạm: Thoát chế độ toàn màn hình'
	},
	{
		id: 'e2',
		sessionId: 'session-4',
		timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
		type: 'warning_sent',
		message: 'Đã gửi cảnh báo tới thí sinh về vi phạm'
	},
	{
		id: 'e3',
		sessionId: 'session-3',
		timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
		type: 'violation_detected',
		message: 'Phát hiện vi phạm: Chuyển tab'
	},
	{
		id: 'e4',
		sessionId: 'session-1',
		timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
		type: 'session_start',
		message: 'Phiên thi bắt đầu'
	},
	{
		id: 'e5',
		sessionId: 'session-6',
		timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
		type: 'session_end',
		message: 'Phiên thi kết thúc'
	}
]

// Helper functions
export function getActiveSessions(): ProctoringSession[] {
	return mockProctorinSessions.filter(s => s.status === 'active')
}

export function getHighRiskSessions(): ProctoringSession[] {
	return mockProctorinSessions.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical')
}

export function getSessionById(id: string): ProctoringSession | undefined {
	return mockProctorinSessions.find(s => s.id === id)
}

export function getViolationsBySession(sessionId: string): Violation[] {
	const session = getSessionById(sessionId)
	return session?.violations || []
}

