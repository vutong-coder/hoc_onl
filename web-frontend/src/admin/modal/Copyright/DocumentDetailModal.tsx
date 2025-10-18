import React from 'react'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import { FileText, X } from 'lucide-react'
import { Document } from '../../types/copyright'

interface DocumentDetailModalProps {
	isOpen: boolean
	onClose: () => void
	document: Document | null
}

const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
	isOpen,
	onClose,
	document
}) => {
	if (!document) return null

	if (!isOpen) return null

	return (
		<div className="modal-overlay">
			<div className="modal-container document-detail-modal">
				<div className="modal-header">
					<div className="modal-title">
						<FileText size={24} />
						<h2>{document.title || 'Chi tiết tài liệu'}</h2>
					</div>
					<button className="modal-close" onClick={onClose}>
						<X size={20} />
					</button>
				</div>

				<div className="document-detail-content">
					<div className="document-info">
						<FileText className="file-icon" />
						<div className="document-meta">
							<h3>{document.title}</h3>
							<p>Tác giả: {document.author}</p>
							<p>Ngày đăng ký: {new Date(document.registrationDate).toLocaleString('vi-VN')}</p>
						</div>
						<Badge variant={document.status === 'verified' ? 'success' : document.status === 'pending' ? 'warning' : 'danger'}>
							{document.status === 'verified' ? 'Đã xác minh' : 
							 document.status === 'pending' ? 'Chờ xác minh' : 'Có tranh chấp'}
						</Badge>
					</div>
					
					<div className="content-section">
						<h4>Mô tả</h4>
						<p>{document.description}</p>
					</div>
					
					<div className="content-section">
						<h4>Thông tin Blockchain</h4>
						<div className="blockchain-info">
							<div className="info-item">
								<span className="label">Hash:</span>
								<span className="value">{document.hash}</span>
							</div>
							<div className="info-item">
								<span className="label">Blockchain Hash:</span>
								<span className="value">{document.blockchainHash}</span>
							</div>
							{document.transactionHash && (
								<div className="info-item">
									<span className="label">Transaction Hash:</span>
									<span className="value">{document.transactionHash}</span>
								</div>
							)}
							{document.blockNumber && (
								<div className="info-item">
									<span className="label">Block Number:</span>
									<span className="value">{document.blockNumber.toLocaleString()}</span>
								</div>
							)}
							{document.gasUsed && (
								<div className="info-item">
									<span className="label">Gas Used:</span>
									<span className="value">{document.gasUsed.toLocaleString()}</span>
								</div>
							)}
						</div>
					</div>
					
					<div className="content-section">
						<h4>Metadata</h4>
						<div className="metadata-info">
							<div className="info-item">
								<span className="label">Danh mục:</span>
								<span className="value">{document.metadata.category}</span>
							</div>
							<div className="info-item">
								<span className="label">Ngôn ngữ:</span>
								<span className="value">{document.metadata.language}</span>
							</div>
							<div className="info-item">
								<span className="label">Phiên bản:</span>
								<span className="value">{document.metadata.version}</span>
							</div>
							<div className="info-item">
								<span className="label">Giấy phép:</span>
								<span className="value">{document.metadata.license}</span>
							</div>
							{document.metadata.keywords.length > 0 && (
								<div className="info-item">
									<span className="label">Từ khóa:</span>
									<span className="value">{document.metadata.keywords.join(', ')}</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DocumentDetailModal
