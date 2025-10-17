import React from 'react'
import Modal from '../../components/common/Modal'

interface DeleteExamModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	exam: any
}

const DeleteExamModal: React.FC<DeleteExamModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	exam
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Xác nhận xóa đề thi"
			footer={
				<>
					<button 
						className="btn btn-secondary"
						onClick={onClose}
					>
						Hủy
					</button>
					<button 
						className="btn btn-danger"
						onClick={onConfirm}
					>
						Xóa
					</button>
				</>
			}
		>
			<p style={{ margin: 0 }}>
				Bạn có chắc chắn muốn xóa đề thi <strong>{exam?.title}</strong>?
				<br />
				Hành động này không thể hoàn tác.
			</p>
		</Modal>
	)
}

export default DeleteExamModal
