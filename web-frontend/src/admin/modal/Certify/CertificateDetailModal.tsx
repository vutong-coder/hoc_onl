import React from 'react'
import { Users, Building2, Calendar, Clock, BookOpen } from 'lucide-react'
import Modal from '../../components/common/Modal'

interface CertificateDetailModalProps {
	isOpen: boolean
	onClose: () => void
	certificate: any
}

const CertificateDetailModal: React.FC<CertificateDetailModalProps> = ({
	isOpen,
	onClose,
	certificate
}) => {
	if (!certificate) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={certificate.certificateName || 'Chi tiết chứng chỉ'}
			maxWidth="800px"
		>
			<div className="certificate-detail-modal-content">
				<div className="certificate-detail-header">
					<div className="certificate-detail-info">
						<h2 className="certificate-detail-title">{certificate.certificateName}</h2>
						<div className="certificate-detail-meta">
							<div className="meta-item">
								<Users size={16} />
								<span>{certificate.recipientName}</span>
							</div>
							<div className="meta-item">
								<Building2 size={16} />
								<span>{certificate.organizationName}</span>
							</div>
							<div className="meta-item">
								<Calendar size={16} />
								<span>Cấp ngày: {new Date(certificate.issuedAt).toLocaleDateString('vi-VN')}</span>
							</div>
							<div className="meta-item">
								<Clock size={16} />
								<span>Hết hạn: {new Date(certificate.expiresAt).toLocaleDateString('vi-VN')}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="certificate-detail-sections">
					<div className="detail-section">
						<h3>Thông tin xác minh</h3>
						<div className="verification-info">
							<div className="verification-item">
								<strong>Mã xác minh:</strong> {certificate.verificationCode}
							</div>
							<div className="verification-item">
								<strong>URL xác minh:</strong> 
								<a href={certificate.metadata.verificationUrl} target="_blank" rel="noopener noreferrer">
									{certificate.metadata.verificationUrl}
								</a>
							</div>
							{certificate.blockchainHash && (
								<div className="verification-item">
									<strong>Blockchain Hash:</strong> 
									<span className="blockchain-hash">{certificate.blockchainHash}</span>
								</div>
							)}
						</div>
					</div>

					<div className="detail-section">
						<h3>Kết quả học tập</h3>
						<div className="score-info">
							<div className="score-item">
								<strong>Điểm số:</strong> {certificate.metadata.score}/100
							</div>
							<div className="score-item">
								<strong>Xếp loại:</strong> {certificate.metadata.grade}
							</div>
							<div className="score-item">
								<strong>Người cấp:</strong> {certificate.metadata.issuedBy}
							</div>
							<div className="score-item">
								<strong>Chức vụ:</strong> {certificate.metadata.issuedByTitle}
							</div>
						</div>
					</div>

					{certificate.courseName && (
						<div className="detail-section">
							<h3>Khóa học</h3>
							<div className="course-info">
								<div className="course-item">
									<BookOpen size={16} />
									<span>{certificate.courseName}</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</Modal>
	)
}

export default CertificateDetailModal
