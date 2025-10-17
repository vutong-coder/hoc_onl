import React from 'react'
import Modal from '../../components/common/Modal'

interface DashboardFiltersModalProps {
	isOpen: boolean
	onClose: () => void
	filters: any
	onUpdateFilter: (key: string, value: any) => void
	onClearFilters: () => void
}

const DashboardFiltersModal: React.FC<DashboardFiltersModalProps> = ({
	isOpen,
	onClose,
	filters,
	onUpdateFilter,
	onClearFilters
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Bộ lọc Dashboard"
			maxWidth="400px"
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
				<div>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
						Khoảng thời gian
					</label>
					<select
						value={filters.timeRange}
						onChange={(e) => onUpdateFilter('timeRange', e.target.value)}
						className="form-select"
					>
						<option value="7d">7 ngày qua</option>
						<option value="30d">30 ngày qua</option>
						<option value="90d">90 ngày qua</option>
						<option value="1y">1 năm qua</option>
						<option value="all">Tất cả</option>
					</select>
				</div>

				<div>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
						Loại hoạt động
					</label>
					<select
						value={filters.activityType}
						onChange={(e) => onUpdateFilter('activityType', e.target.value)}
						className="form-select"
					>
						<option value="all">Tất cả</option>
						<option value="user_registration">Đăng ký người dùng</option>
						<option value="course_enrollment">Đăng ký khóa học</option>
						<option value="course_completion">Hoàn thành khóa học</option>
						<option value="payment_received">Thanh toán</option>
						<option value="system_alert">Cảnh báo hệ thống</option>
					</select>
				</div>

				<div>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
						Trạng thái
					</label>
					<select
						value={filters.status}
						onChange={(e) => onUpdateFilter('status', e.target.value)}
						className="form-select"
					>
						<option value="all">Tất cả</option>
						<option value="success">Thành công</option>
						<option value="warning">Cảnh báo</option>
						<option value="error">Lỗi</option>
						<option value="info">Thông tin</option>
					</select>
				</div>

				<div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
					<button className="btn btn-secondary" onClick={onClearFilters}>
						Xóa bộ lọc
					</button>
					<button className="btn btn-primary" onClick={onClose}>
						Áp dụng
					</button>
				</div>
			</div>
		</Modal>
	)
}

export default DashboardFiltersModal
