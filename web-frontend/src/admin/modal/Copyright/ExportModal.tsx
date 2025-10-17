import React from 'react'
import Modal from '../../components/common/Modal'
import { Download } from 'lucide-react'
import { Document } from '../../types/copyright'

interface ExportModalProps {
	isOpen: boolean
	onClose: () => void
	onExportDocuments: (documents: Document[]) => Promise<void>
	documents: Document[]
	isExporting: boolean
}

const ExportModal: React.FC<ExportModalProps> = ({
	isOpen,
	onClose,
	onExportDocuments,
	documents,
	isExporting
}) => {
	const handleExport = (format: string) => {
		onExportDocuments(documents)
	}

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
							onClick={() => handleExport('excel')}
							disabled={isExporting}
						>
							<Download className="w-4 h-4" />
							Excel (.xlsx)
						</button>
						<button 
							className="btn btn-secondary"
							onClick={() => handleExport('csv')}
							disabled={isExporting}
						>
							<Download className="w-4 h-4" />
							CSV (.csv)
						</button>
						<button 
							className="btn btn-secondary"
							onClick={() => handleExport('json')}
							disabled={isExporting}
						>
							<Download className="w-4 h-4" />
							JSON (.json)
						</button>
					</div>
				</div>
				<div className="export-section">
					<h4>Tùy chọn xuất</h4>
					<div className="export-options-list">
						<label className="export-option">
							<input type="checkbox" defaultChecked />
							<span>Bao gồm metadata</span>
						</label>
						<label className="export-option">
							<input type="checkbox" defaultChecked />
							<span>Bao gồm lịch sử xác minh</span>
						</label>
						<label className="export-option">
							<input type="checkbox" defaultChecked />
							<span>Bao gồm tranh chấp</span>
						</label>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default ExportModal
