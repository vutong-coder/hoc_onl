import React from 'react'
import Modal from '../../components/common/Modal'

interface ViewExamModalProps {
	isOpen: boolean
	onClose: () => void
	exam: any
}

const ViewExamModal: React.FC<ViewExamModalProps> = ({
	isOpen,
	onClose,
	exam
}) => {
	if (!exam) return null

	const getStatusLabel = (status: string) => {
		const labels: Record<string, string> = {
			draft: 'Nháp',
			published: 'Đã xuất bản',
			ongoing: 'Đang diễn ra',
			ended: 'Đã kết thúc',
			archived: 'Lưu trữ'
		}
		return labels[status] || status
	}

	const getTypeLabel = (type: string) => {
		const labels: Record<string, string> = {
			practice: 'Luyện tập',
			quiz: 'Kiểm tra',
			midterm: 'Giữa kỳ',
			final: 'Cuối kỳ',
			assignment: 'Bài tập'
		}
		return labels[type] || type
	}

	const getDifficultyLabel = (difficulty: string) => {
		const labels: Record<string, string> = {
			easy: 'Dễ',
			medium: 'Trung bình',
			hard: 'Khó'
		}
		return labels[difficulty] || difficulty
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Chi tiết đề thi"
			maxWidth="700px"
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
				<div>
					<h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
						{exam.title}
					</h3>
					<p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
						{exam.description}
					</p>
				</div>

				<div className="form-grid">
					<div>
						<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
							Môn học
						</label>
						<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{exam.subject}</p>
					</div>

					<div>
						<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
							Loại bài thi
						</label>
						<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{getTypeLabel(exam.type)}</p>
					</div>

					<div>
						<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
							Số câu hỏi
						</label>
						<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{exam.totalQuestions} câu</p>
					</div>

					<div>
						<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
							Thời gian
						</label>
						<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{exam.duration} phút</p>
					</div>

					<div>
						<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
							Tổng điểm
						</label>
						<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{exam.totalPoints} điểm</p>
					</div>

					<div>
						<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
							Điểm đạt
						</label>
						<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{exam.passingScore} điểm</p>
					</div>

					<div>
						<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
							Độ khó
						</label>
						<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{getDifficultyLabel(exam.difficulty)}</p>
					</div>

					<div>
						<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
							Trạng thái
						</label>
						<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{getStatusLabel(exam.status)}</p>
					</div>

					<div>
						<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
							Số lần thi tối đa
						</label>
						<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{exam.maxAttempts}</p>
					</div>

					<div>
						<label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted-foreground)' }}>
							Người tạo
						</label>
						<p style={{ margin: '4px 0 0', fontWeight: 500 }}>{exam.createdBy}</p>
					</div>
				</div>

				<div style={{ 
					padding: '16px',
					background: 'var(--muted)',
					borderRadius: 'var(--radius-md)',
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: '12px',
					fontSize: '14px'
				}}>
					<div>
						<label style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
							Xem lại câu hỏi
						</label>
						<p style={{ margin: '4px 0 0', fontWeight: 500 }}>
							{exam.allowReview ? '✓ Cho phép' : '✗ Không'}
						</p>
					</div>
					<div>
						<label style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
							Trộn câu hỏi
						</label>
						<p style={{ margin: '4px 0 0', fontWeight: 500 }}>
							{exam.shuffleQuestions ? '✓ Có' : '✗ Không'}
						</p>
					</div>
					<div>
						<label style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
							Hiển thị kết quả
						</label>
						<p style={{ margin: '4px 0 0', fontWeight: 500 }}>
							{exam.showResults ? '✓ Có' : '✗ Không'}
						</p>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default ViewExamModal
