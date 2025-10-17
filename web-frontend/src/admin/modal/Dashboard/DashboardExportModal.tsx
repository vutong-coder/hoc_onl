import React from 'react'
import { FileSpreadsheet, BarChart3, TrendingUp, BookOpen, Activity, Users, CheckCircle, Table } from 'lucide-react'
import Modal from '../../components/common/Modal'

interface DashboardExportModalProps {
	isOpen: boolean
	onClose: () => void
	onExportComplete: () => void
	onExportStats: () => void
	onExportUserGrowth: () => void
	onExportCategories: () => void
	onExportActivities: () => void
	onExportPerformers: () => void
	onExportSystemHealth: () => void
}

const DashboardExportModal: React.FC<DashboardExportModalProps> = ({
	isOpen,
	onClose,
	onExportComplete,
	onExportStats,
	onExportUserGrowth,
	onExportCategories,
	onExportActivities,
	onExportPerformers,
	onExportSystemHealth
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Xuất dữ liệu Excel"
			maxWidth="600px"
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
				<div style={{ marginBottom: '16px' }}>
					<p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
						Chọn loại dữ liệu bạn muốn xuất ra file Excel:
					</p>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
					<button
						className="btn btn-primary"
						onClick={onExportComplete}
						style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
					>
						<FileSpreadsheet size={18} />
						<div style={{ textAlign: 'left' }}>
							<div style={{ fontWeight: 600 }}>Dashboard hoàn chỉnh</div>
							<div style={{ fontSize: '12px', opacity: 0.8 }}>Tất cả dữ liệu trong 1 file</div>
						</div>
					</button>

					<button
						className="btn btn-outline"
						onClick={onExportStats}
						style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
					>
						<BarChart3 size={18} />
						<div style={{ textAlign: 'left' }}>
							<div style={{ fontWeight: 600 }}>Thống kê tổng quan</div>
							<div style={{ fontSize: '12px', opacity: 0.8 }}>8 chỉ số chính</div>
						</div>
					</button>

					<button
						className="btn btn-outline"
						onClick={onExportUserGrowth}
						style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
					>
						<TrendingUp size={18} />
						<div style={{ textAlign: 'left' }}>
							<div style={{ fontWeight: 600 }}>Tăng trưởng người dùng</div>
							<div style={{ fontSize: '12px', opacity: 0.8 }}>30 ngày gần nhất</div>
						</div>
					</button>

					<button
						className="btn btn-outline"
						onClick={onExportCategories}
						style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
					>
						<BookOpen size={18} />
						<div style={{ textAlign: 'left' }}>
							<div style={{ fontWeight: 600 }}>Danh mục khóa học</div>
							<div style={{ fontSize: '12px', opacity: 0.8 }}>8 danh mục</div>
						</div>
					</button>

					<button
						className="btn btn-outline"
						onClick={onExportActivities}
						style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
					>
						<Activity size={18} />
						<div style={{ textAlign: 'left' }}>
							<div style={{ fontWeight: 600 }}>Hoạt động gần đây</div>
							<div style={{ fontSize: '12px', opacity: 0.8 }}>10 hoạt động mới nhất</div>
						</div>
					</button>

					<button
						className="btn btn-outline"
						onClick={onExportPerformers}
						style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
					>
						<Users size={18} />
						<div style={{ textAlign: 'left' }}>
							<div style={{ fontWeight: 600 }}>Top Performers</div>
							<div style={{ fontSize: '12px', opacity: 0.8 }}>5 người xuất sắc nhất</div>
						</div>
					</button>

					<button
						className="btn btn-outline"
						onClick={onExportSystemHealth}
						style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
					>
						<CheckCircle size={18} />
						<div style={{ textAlign: 'left' }}>
							<div style={{ fontWeight: 600 }}>Tình trạng hệ thống</div>
							<div style={{ fontSize: '12px', opacity: 0.8 }}>Health & Alerts</div>
						</div>
					</button>
				</div>

				<div style={{ 
					marginTop: '20px', 
					padding: '16px', 
					background: 'var(--muted)', 
					borderRadius: 'var(--radius-md)',
					border: '1px solid var(--border)'
				}}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
						<Table size={16} />
						<span style={{ fontWeight: 600, fontSize: '14px' }}>Thông tin xuất file</span>
					</div>
					<ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
						<li>File Excel (.xlsx) với nhiều sheet</li>
						<li>Tên file tự động với ngày xuất</li>
						<li>Dữ liệu được format theo tiếng Việt</li>
						<li>Hỗ trợ mở bằng Excel, Google Sheets</li>
					</ul>
				</div>
			</div>
		</Modal>
	)
}

export default DashboardExportModal
