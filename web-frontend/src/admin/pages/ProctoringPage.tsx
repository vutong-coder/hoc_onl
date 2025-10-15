import React, { useState } from 'react'
import { Activity, AlertTriangle, Eye, Users, LayoutGrid, List, Search } from 'lucide-react'
import useProctoring from '../hooks/useProctoring'
import SessionGrid from '../components/proctoring/SessionGrid'
import SessionDetailView from '../components/proctoring/SessionDetailView'
import Modal from '../components/common/Modal'
import SearchBar from '../components/common/SearchBar'
import Badge from '../components/common/Badge'
import '../styles/common.css'
import '../styles/proctoring.css'

type ViewMode = 'grid' | 'list'

export default function ProctoringPage(): JSX.Element {
	const {
		sessions,
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
	} = useProctoring()

	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

	const handleSessionClick = (session: any) => {
		setSelectedSession(session)
		setIsDetailModalOpen(true)
	}

	const handleTerminate = (sessionId: string) => {
		if (confirm('Bạn có chắc chắn muốn dừng phiên thi này?')) {
			terminateSession(sessionId)
			setIsDetailModalOpen(false)
		}
	}

	const handleSendWarning = (sessionId: string) => {
		sendWarning(sessionId)
		alert('Đã gửi cảnh báo tới thí sinh!')
	}

	const handleResolveViolation = (violationId: string) => {
		if (selectedSession) {
			resolveViolation(selectedSession.id, violationId)
		}
	}

	return (
		<div style={{ padding: '24px' }}>
			{/* Header */}
			<div style={{ marginBottom: '24px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
					<div>
						<h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0' }}>
							Giám Sát & Chống Gian Lận
						</h1>
						<p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
							Theo dõi thời gian thực các phiên thi đang diễn ra
						</p>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<div className="realtime-indicator">
							<div className="realtime-pulse" />
							<span>Cập nhật trực tiếp</span>
						</div>
						
						<label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
							<input
								type="checkbox"
								checked={autoRefresh}
								onChange={(e) => setAutoRefresh(e.target.checked)}
								style={{ width: '18px', height: '18px', cursor: 'pointer' }}
							/>
							<span style={{ fontSize: '14px' }}>Tự động làm mới</span>
						</label>
					</div>
				</div>
			</div>

			{/* Stats Overview */}
			<div className="stats-grid">
				<div className="stat-card">
					<div className="stat-card-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>
						<Users size={24} />
					</div>
					<div className="stat-card-content">
						<div className="stat-card-label">Phiên thi đang diễn ra</div>
						<div className="stat-card-value">{stats.totalActive}</div>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-card-icon" style={{ background: '#fee2e2', color: '#ef4444' }}>
						<AlertTriangle size={24} />
					</div>
					<div className="stat-card-content">
						<div className="stat-card-label">Phiên có nguy cơ cao</div>
						<div className="stat-card-value">{stats.highRiskSessions}</div>
						{stats.highRiskSessions > 0 && (
							<div className="stat-card-change negative">
								Cần chú ý!
							</div>
						)}
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-card-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
						<Eye size={24} />
					</div>
					<div className="stat-card-content">
						<div className="stat-card-label">Tổng vi phạm</div>
						<div className="stat-card-value">{stats.totalViolations}</div>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-card-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
						<Activity size={24} />
					</div>
					<div className="stat-card-content">
						<div className="stat-card-label">Mức rủi ro trung bình</div>
						<div className="stat-card-value">{stats.avgRiskLevel.toFixed(1)}/4</div>
						{stats.avgRiskLevel < 2 && (
							<div className="stat-card-change positive">
								Tình hình ổn định
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Filters & Controls */}
			<div style={{ 
				display: 'flex', 
				justifyContent: 'space-between', 
				alignItems: 'center',
				marginBottom: '24px',
				gap: '16px',
				flexWrap: 'wrap'
			}}>
				<SearchBar
					value={filters.search}
					onChange={(value) => updateFilter('search', value)}
					placeholder="Tìm kiếm theo tên thí sinh, ID..."
				/>

				<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
					{/* View Mode Toggle */}
					<div className="view-toggle">
						<button
							className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
							onClick={() => setViewMode('grid')}
						>
							<LayoutGrid size={18} />
						</button>
						<button
							className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
							onClick={() => setViewMode('list')}
						>
							<List size={18} />
						</button>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="filters-container">
				<div className="filter-group">
					<label className="filter-label">Bài thi</label>
					<select
						className="filter-select"
						value={filters.examId}
						onChange={(e) => updateFilter('examId', e.target.value)}
					>
						<option value="all">Tất cả bài thi</option>
						{exams.map((exam: any) => (
							<option key={exam.id} value={exam.id}>{exam.title}</option>
						))}
					</select>
				</div>

				<div className="filter-group">
					<label className="filter-label">Trạng thái</label>
					<select
						className="filter-select"
						value={filters.status}
						onChange={(e) => updateFilter('status', e.target.value)}
					>
						<option value="all">Tất cả</option>
						<option value="active">Đang thi</option>
						<option value="paused">Tạm dừng</option>
						<option value="completed">Hoàn thành</option>
						<option value="terminated">Đã dừng</option>
					</select>
				</div>

				<div className="filter-group">
					<label className="filter-label">Mức độ rủi ro</label>
					<select
						className="filter-select"
						value={filters.riskLevel}
						onChange={(e) => updateFilter('riskLevel', e.target.value)}
					>
						<option value="all">Tất cả mức độ</option>
						<option value="low">An toàn</option>
						<option value="medium">Cảnh báo</option>
						<option value="high">Nguy hiểm</option>
						<option value="critical">Nghiêm trọng</option>
					</select>
				</div>

				<div className="filter-group">
					<label className="filter-label">Kết quả</label>
					<div style={{ 
						padding: '8px 12px',
						background: 'var(--muted)',
						borderRadius: 'var(--radius-md)',
						fontSize: '14px',
						fontWeight: 500
					}}>
						Tìm thấy {sessions.length} phiên
					</div>
				</div>
			</div>

			{/* Sessions Display */}
			<div style={{ 
				background: 'var(--card)',
				borderRadius: 'var(--radius-lg)',
				padding: '20px',
				boxShadow: 'var(--shadow-sm)',
				minHeight: '400px'
			}}>
				<SessionGrid
					sessions={sessions}
					onSessionClick={handleSessionClick}
				/>
			</div>

			{/* Detail Modal */}
			{selectedSession && (
				<Modal
					isOpen={isDetailModalOpen}
					onClose={() => {
						setIsDetailModalOpen(false)
						setSelectedSession(null)
					}}
					title="Chi tiết phiên giám sát"
					maxWidth="1000px"
				>
					<SessionDetailView
						session={selectedSession}
						onResolveViolation={handleResolveViolation}
						onTerminate={handleTerminate}
						onSendWarning={handleSendWarning}
					/>
				</Modal>
			)}
		</div>
	)
}
