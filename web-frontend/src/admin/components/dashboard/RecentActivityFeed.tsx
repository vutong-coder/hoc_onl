import React from 'react'
import { RecentActivity, ActivityType, ActivityStatus } from '../../types/dashboard'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { 
	UserPlus, 
	BookOpen, 
	Award, 
	Upload, 
	CreditCard, 
	GraduationCap, 
	Star, 
	AlertTriangle, 
	Settings,
	RefreshCw,
	Clock,
	User,
	FileText
} from 'lucide-react'
import Badge from '../common/Badge'
import '../../styles/dashboard.css'

interface RecentActivityFeedProps {
	activities: RecentActivity[]
	loading?: boolean
	onActivityClick?: (activity: RecentActivity) => void
}

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ 
	activities, 
	loading = false, 
	onActivityClick 
}) => {
	const getActivityIcon = (type: ActivityType) => {
		switch (type) {
			case 'user_registration':
				return <UserPlus size={16} />
			case 'course_enrollment':
				return <BookOpen size={16} />
			case 'course_completion':
				return <Award size={16} />
			case 'course_published':
				return <Upload size={16} />
			case 'course_updated':
				return <RefreshCw size={16} />
			case 'payment_received':
				return <CreditCard size={16} />
			case 'certificate_issued':
				return <GraduationCap size={16} />
			case 'review_submitted':
				return <Star size={16} />
			case 'system_alert':
				return <AlertTriangle size={16} />
			case 'admin_action':
				return <Settings size={16} />
			default:
				return <FileText size={16} />
		}
	}

	const getActivityColor = (type: ActivityType) => {
		switch (type) {
			case 'user_registration':
			case 'course_enrollment':
			case 'course_completion':
			case 'course_published':
			case 'payment_received':
			case 'certificate_issued':
			case 'review_submitted':
				return 'var(--success)'
			case 'course_updated':
			case 'admin_action':
				return 'var(--info)'
			case 'system_alert':
				return 'var(--warning)'
			default:
				return 'var(--muted-foreground)'
		}
	}

	const getStatusBadgeVariant = (status: ActivityStatus) => {
		switch (status) {
			case 'success': return 'success'
			case 'warning': return 'warning'
			case 'error': return 'danger'
			case 'info': return 'info'
			default: return 'secondary'
		}
	}

	const formatTime = (timestamp: string) => {
		try {
			return formatDistanceToNow(new Date(timestamp), {
				addSuffix: true,
				locale: vi
			})
		} catch (error) {
			return 'N/A'
		}
	}

	const formatActivityDescription = (activity: RecentActivity) => {
		let description = activity.description
		
		// Thêm thông tin metadata nếu có
		if (activity.metadata) {
			if (activity.metadata.amount && activity.metadata.tokenSymbol) {
				description += ` (${activity.metadata.amount.toLocaleString()} ${activity.metadata.tokenSymbol})`
			}
			if (activity.metadata.rating) {
				description += ` (${activity.metadata.rating} sao)`
			}
			if (activity.metadata.tokensEarned) {
				description += ` (+${activity.metadata.tokensEarned} token)`
			}
		}
		
		return description
	}

	if (loading) {
		return (
			<div className="activity-feed">
				<div className="activity-header">
					<div className="activity-title-skeleton"></div>
					<div className="activity-subtitle-skeleton"></div>
				</div>
				<div className="activity-list">
					{Array.from({ length: 5 }).map((_, index) => (
						<div key={index} className="activity-item-skeleton">
							<div className="activity-icon-skeleton"></div>
							<div className="activity-content-skeleton">
								<div className="activity-title-skeleton"></div>
								<div className="activity-description-skeleton"></div>
								<div className="activity-time-skeleton"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="activity-feed">
			<div className="activity-header">
				<div className="activity-title">
					<Clock size={20} />
					Hoạt động gần đây
				</div>
				<div className="activity-subtitle">
					Theo dõi các hoạt động mới nhất trong hệ thống
				</div>
			</div>

			<div className="activity-list">
				{activities.length === 0 ? (
					<div className="activity-empty">
						<FileText size={48} />
						<p>Không có hoạt động nào</p>
					</div>
				) : (
					activities.map((activity) => (
						<div
							key={activity.id}
							className={`activity-item ${onActivityClick ? 'clickable' : ''}`}
							onClick={() => onActivityClick?.(activity)}
						>
							<div className="activity-icon" style={{ color: getActivityColor(activity.type) }}>
								{getActivityIcon(activity.type)}
							</div>
							
							<div className="activity-content">
								<div className="activity-header-row">
									<div className="activity-title-text">
										{activity.title}
									</div>
									<div className="activity-time">
										{formatTime(activity.timestamp)}
									</div>
								</div>
								
								<div className="activity-description">
									{formatActivityDescription(activity)}
								</div>
								
								{activity.user && (
									<div className="activity-user">
										<User size={12} />
										<span>{activity.user}</span>
									</div>
								)}
								
								{activity.course && (
									<div className="activity-course">
										<BookOpen size={12} />
										<span>{activity.course}</span>
									</div>
								)}
								
								<div className="activity-footer">
									<Badge variant={getStatusBadgeVariant(activity.status)}>
										{activity.status}
									</Badge>
									
									{activity.metadata && (
										<div className="activity-metadata">
											{activity.metadata.certificateIssued && (
												<Badge variant="info" style={{ fontSize: '10px', padding: '2px 6px' }}>
													<GraduationCap size={10} style={{ marginRight: '3px' }} />
													Chứng chỉ
												</Badge>
											)}
											{activity.metadata.tokensEarned && (
												<Badge variant="success" style={{ fontSize: '10px', padding: '2px 6px' }}>
													+{activity.metadata.tokensEarned} token
												</Badge>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{activities.length > 0 && (
				<div className="activity-footer">
					<button className="btn btn-sm btn-outline">
						Xem tất cả hoạt động
					</button>
				</div>
			)}
		</div>
	)
}

export default RecentActivityFeed
