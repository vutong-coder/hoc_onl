import React from 'react'
import { Violation } from '../../types/proctoring'
import Badge from '../common/Badge'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import '../../styles/table.css'

interface EventLogProps {
	violations: Violation[]
	onResolve?: (violationId: string) => void
}

export default function EventLog({ violations, onResolve }: EventLogProps): JSX.Element {
	
	const getSeverityBadgeVariant = (severity: string) => {
		switch (severity) {
			case 'low': return 'secondary'
			case 'medium': return 'warning'
			case 'high': return 'danger'
			case 'critical': return 'danger'
			default: return 'secondary'
		}
	}

	const getSeverityLabel = (severity: string) => {
		switch (severity) {
			case 'low': return 'Thấp'
			case 'medium': return 'Trung bình'
			case 'high': return 'Cao'
			case 'critical': return 'Nghiêm trọng'
			default: return severity
		}
	}

	const getViolationTypeLabel = (type: string) => {
		const labels: Record<string, string> = {
			no_face_detected: 'Không phát hiện khuôn mặt',
			multiple_faces: 'Nhiều khuôn mặt',
			face_not_visible: 'Khuôn mặt không rõ',
			looking_away: 'Nhìn ra ngoài',
			audio_detected: 'Phát hiện giọng nói',
			suspicious_audio: 'Âm thanh đáng ngờ',
			tab_switch: 'Chuyển tab',
			fullscreen_exit: 'Thoát toàn màn hình',
			browser_change: 'Đổi trình duyệt',
			connection_lost: 'Mất kết nối',
			unauthorized_device: 'Thiết bị không được phép',
			screen_share_detected: 'Phát hiện chia sẻ màn hình',
			camera_status: 'Trạng thái camera',
			other: 'Khác'
		}
		return labels[type] || type
	}

	const formatTime = (timestamp: string) => {
		try {
			return formatDistanceToNow(new Date(timestamp), {
				addSuffix: true,
				locale: vi
			})
		} catch {
			return timestamp
		}
	}

	if (violations.length === 0) {
		return (
			<div className="admin-table-empty">
				<div className="admin-table-empty-icon">✓</div>
				<div className="admin-table-empty-text">Chưa có vi phạm nào được ghi nhận</div>
			</div>
		)
	}

	return (
		<div style={{ maxHeight: '500px', overflowY: 'auto' }}>
			<table className="admin-table">
				<thead>
					<tr>
						<th>Thời gian</th>
						<th>Loại vi phạm</th>
						<th>Mô tả</th>
						<th>Mức độ</th>
						<th>Trạng thái</th>
						{onResolve && <th>Hành động</th>}
					</tr>
				</thead>
				<tbody>
					{violations.map(violation => (
						<tr key={violation.id}>
							<td style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
								{formatTime(violation.timestamp)}
							</td>
							<td>
								<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<AlertTriangle size={16} color={
										violation.severity === 'critical' ? '#dc2626' :
										violation.severity === 'high' ? '#f59e0b' : '#6b7280'
									} />
									{getViolationTypeLabel(violation.type)}
								</div>
							</td>
							<td style={{ fontSize: '13px' }}>
								{violation.description}
							</td>
							<td>
								<Badge variant={getSeverityBadgeVariant(violation.severity)}>
									{getSeverityLabel(violation.severity)}
								</Badge>
							</td>
							<td>
								{violation.resolved ? (
									<div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
										<CheckCircle size={16} />
										<span style={{ fontSize: '13px' }}>Đã xử lý</span>
									</div>
								) : (
									<div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}>
										<XCircle size={16} />
										<span style={{ fontSize: '13px' }}>Chưa xử lý</span>
									</div>
								)}
							</td>
							{onResolve && (
								<td>
									{!violation.resolved && (
										<button
											className="btn btn-sm btn-secondary"
											onClick={() => onResolve(violation.id)}
										>
											Đánh dấu đã xử lý
										</button>
									)}
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

