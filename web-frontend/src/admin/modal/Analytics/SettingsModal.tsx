import React from 'react'
import { Save, RefreshCw } from 'lucide-react'
import Modal from '../../components/common/Modal'

interface SettingsModalProps {
	isOpen: boolean
	onClose: () => void
	isRealTimeEnabled: boolean
	onRealTimeToggle: () => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({
	isOpen,
	onClose,
	isRealTimeEnabled,
	onRealTimeToggle
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Cài đặt Analytics"
		>
			<div className="settings-content">
				<div className="settings-section">
					<h4>Cài đặt hiển thị</h4>
					<div className="settings-options">
						<label className="setting-option">
							<span>Tự động làm mới dữ liệu</span>
							<input type="checkbox" checked={isRealTimeEnabled} onChange={onRealTimeToggle} />
						</label>
						<label className="setting-option">
							<span>Hiển thị cảnh báo</span>
							<input type="checkbox" defaultChecked />
						</label>
						<label className="setting-option">
							<span>Hiển thị insights</span>
							<input type="checkbox" defaultChecked />
						</label>
					</div>
				</div>
				<div className="settings-section">
					<h4>Cài đặt biểu đồ</h4>
					<div className="settings-options">
						<label className="setting-option">
							<span>Hiệu ứng animation</span>
							<input type="checkbox" defaultChecked />
						</label>
						<label className="setting-option">
							<span>Hiển thị grid</span>
							<input type="checkbox" defaultChecked />
						</label>
						<label className="setting-option">
							<span>Hiển thị legend</span>
							<input type="checkbox" defaultChecked />
						</label>
					</div>
				</div>
				<div className="settings-actions">
					<button className="btn btn-primary">
						<Save className="w-4 h-4" />
						Lưu cài đặt
					</button>
					<button className="btn btn-secondary">
						<RefreshCw className="w-4 h-4" />
						Đặt lại mặc định
					</button>
				</div>
			</div>
		</Modal>
	)
}

export default SettingsModal
