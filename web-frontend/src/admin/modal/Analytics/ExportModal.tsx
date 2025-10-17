import React from 'react'
import { FileText } from 'lucide-react'
import Modal from '../../components/common/Modal'

interface ExportModalProps {
	isOpen: boolean
	onClose: () => void
	onExport: (format: 'excel' | 'pdf' | 'csv' | 'json') => Promise<void>
	isExporting: boolean
}

const ExportModal: React.FC<ExportModalProps> = ({
	isOpen,
	onClose,
	onExport,
	isExporting
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Xuất dữ liệu"
		>
			<div className="export-options">
				<div className="export-section">
					<h4>Định dạng xuất</h4>
					<div className="export-buttons">
						<button 
							className="btn btn-secondary"
							onClick={() => onExport('excel')}
							disabled={isExporting}
						>
							<FileText className="w-4 h-4" />
							Excel (.xlsx)
						</button>
						<button 
							className="btn btn-secondary"
							onClick={() => onExport('pdf')}
							disabled={isExporting}
						>
							<FileText className="w-4 h-4" />
							PDF (.pdf)
						</button>
						<button 
							className="btn btn-secondary"
							onClick={() => onExport('csv')}
							disabled={isExporting}
						>
							<FileText className="w-4 h-4" />
							CSV (.csv)
						</button>
						<button 
							className="btn btn-secondary"
							onClick={() => onExport('json')}
							disabled={isExporting}
						>
							<FileText className="w-4 h-4" />
							JSON (.json)
						</button>
					</div>
				</div>
				<div className="export-section">
					<h4>Tùy chọn xuất</h4>
					<div className="export-options-list">
						<label className="export-option">
							<input type="checkbox" defaultChecked />
							<span>Bao gồm biểu đồ</span>
						</label>
						<label className="export-option">
							<input type="checkbox" defaultChecked />
							<span>Bao gồm KPI</span>
						</label>
						<label className="export-option">
							<input type="checkbox" defaultChecked />
							<span>Bao gồm bảng xếp hạng</span>
						</label>
						<label className="export-option">
							<input type="checkbox" />
							<span>Bao gồm dữ liệu thô</span>
						</label>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default ExportModal
