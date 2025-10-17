import React from 'react'
import Modal from '../../components/common/Modal'
import { Settings, RefreshCw } from 'lucide-react'

interface SettingsModalProps {
	isOpen: boolean
	onClose: () => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({
	isOpen,
	onClose
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Cài đặt bản quyền"
		>
			<div className="settings-content">
				<div className="settings-section">
					<h4>Cài đặt Blockchain</h4>
					<div className="settings-options">
						<label className="setting-option">
							<span>Mạng Blockchain</span>
							<select defaultValue="mainnet">
								<option value="mainnet">Ethereum Mainnet</option>
								<option value="testnet">Ethereum Testnet</option>
								<option value="polygon">Polygon</option>
								<option value="bsc">BSC</option>
							</select>
						</label>
						<label className="setting-option">
							<span>Gas Price Multiplier</span>
							<input type="number" defaultValue="1.2" step="0.1" min="1" max="3" />
						</label>
						<label className="setting-option">
							<span>Backup to IPFS</span>
							<input type="checkbox" defaultChecked />
						</label>
					</div>
				</div>
				<div className="settings-section">
					<h4>Cài đặt xác minh</h4>
					<div className="settings-options">
						<label className="setting-option">
							<span>Tự động xác minh</span>
							<input type="checkbox" defaultChecked />
						</label>
						<label className="setting-option">
							<span>Ngưỡng xác minh</span>
							<input type="number" defaultValue="90" min="0" max="100" />
						</label>
						<label className="setting-option">
							<span>Thời gian giải quyết tranh chấp</span>
							<input type="number" defaultValue="7" min="1" max="30" />
						</label>
					</div>
				</div>
				<div className="settings-actions">
					<button className="btn btn-primary">
						<Settings className="w-4 h-4" />
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
