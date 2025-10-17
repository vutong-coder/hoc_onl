import React from 'react'
import Modal from '../../components/common/Modal'

interface DashboardSettingsModalProps {
	isOpen: boolean
	onClose: () => void
	settings: any
	onUpdateSettings: (key: string, value: any) => void
}

const DashboardSettingsModal: React.FC<DashboardSettingsModalProps> = ({
	isOpen,
	onClose,
	settings,
	onUpdateSettings
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Cài đặt Dashboard"
			maxWidth="500px"
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
				<div>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
						Khoảng thời gian làm mới (giây)
					</label>
					<input
						type="number"
						value={settings.refreshInterval}
						onChange={(e) => onUpdateSettings('refreshInterval', parseInt(e.target.value))}
						min="10"
						max="300"
						className="form-input"
					/>
				</div>

				<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
					<input
						type="checkbox"
						id="autoRefresh"
						checked={settings.autoRefresh}
						onChange={(e) => onUpdateSettings('autoRefresh', e.target.checked)}
					/>
					<label htmlFor="autoRefresh">Tự động làm mới</label>
				</div>

				<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
					<input
						type="checkbox"
						id="showCharts"
						checked={settings.showCharts}
						onChange={(e) => onUpdateSettings('showCharts', e.target.checked)}
					/>
					<label htmlFor="showCharts">Hiển thị biểu đồ</label>
				</div>

				<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
					<input
						type="checkbox"
						id="showActivities"
						checked={settings.showActivities}
						onChange={(e) => onUpdateSettings('showActivities', e.target.checked)}
					/>
					<label htmlFor="showActivities">Hiển thị hoạt động</label>
				</div>

				<div>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
						Loại biểu đồ
					</label>
					<select
						value={settings.chartType}
						onChange={(e) => onUpdateSettings('chartType', e.target.value)}
						className="form-select"
					>
						<option value="line">Đường</option>
						<option value="bar">Cột</option>
						<option value="pie">Tròn</option>
						<option value="doughnut">Vòng tròn</option>
					</select>
				</div>
			</div>
		</Modal>
	)
}

export default DashboardSettingsModal
