import React from 'react'
import Modal from '../../components/common/Modal'

interface AddExamModalProps {
	isOpen: boolean
	onClose: () => void
	onAddExam: (examData: Partial<any>) => void
	subjects: string[]
}

const AddExamModal: React.FC<AddExamModalProps> = ({
	isOpen,
	onClose,
	onAddExam,
	subjects
}) => {
	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		const form = (e.target as HTMLButtonElement).closest('.modal-content')?.querySelector('form')
		if (form) {
			const formData = new FormData(form)
			const examData = {
				title: formData.get('title') as string,
				description: formData.get('description') as string,
				subject: formData.get('subject') as string,
				type: formData.get('type') as any,
				totalQuestions: parseInt(formData.get('totalQuestions') as string) || 0,
				duration: parseInt(formData.get('duration') as string) || 0,
				totalPoints: parseInt(formData.get('totalPoints') as string) || 0,
				passingScore: parseInt(formData.get('passingScore') as string) || 0,
				difficulty: formData.get('difficulty') as any,
				maxAttempts: parseInt(formData.get('maxAttempts') as string) || 1,
				allowReview: formData.get('allowReview') === 'on',
				shuffleQuestions: formData.get('shuffleQuestions') === 'on',
				showResults: formData.get('showResults') === 'on',
				status: 'draft' as const,
				createdBy: 'Admin'
			}
			
			if (examData.title && examData.subject && examData.totalQuestions && examData.duration) {
				// Auto-calculate if not provided
				if (!examData.totalPoints) {
					examData.totalPoints = examData.totalQuestions * 2
				}
				if (!examData.passingScore) {
					examData.passingScore = Math.floor(examData.totalPoints * 0.5)
				}
				onAddExam(examData)
			} else {
				alert('Vui lòng điền đầy đủ các trường bắt buộc (*)')
			}
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Thêm đề thi mới"
			maxWidth="700px"
			footer={
				<>
					<button
						className="btn btn-secondary"
						onClick={onClose}
					>
						Hủy
					</button>
					<button
						className="btn btn-primary"
						onClick={handleSubmit}
					>
						Thêm đề thi
					</button>
				</>
			}
		>
			<form>
				<div className="form-group">
					<label className="form-label">Tiêu đề đề thi *</label>
					<input 
						type="text" 
						name="title" 
						className="form-input" 
						placeholder="VD: Kiểm tra giữa kỳ - Lập trình Web" 
						required 
					/>
				</div>

				<div className="form-group">
					<label className="form-label">Mô tả</label>
					<textarea 
						name="description" 
						className="form-textarea" 
						placeholder="Mô tả ngắn về đề thi..."
						rows={3}
					/>
				</div>

				<div className="form-row">
					<div className="form-group">
						<label className="form-label">Môn học *</label>
						<select name="subject" className="form-select" required>
							{subjects.map(s => (
								<option key={s} value={s}>{s}</option>
							))}
						</select>
					</div>

					<div className="form-group">
						<label className="form-label">Loại bài thi</label>
						<select name="type" className="form-select" defaultValue="practice">
							<option value="practice">Luyện tập</option>
							<option value="quiz">Kiểm tra</option>
							<option value="midterm">Giữa kỳ</option>
							<option value="final">Cuối kỳ</option>
							<option value="assignment">Bài tập</option>
						</select>
					</div>
				</div>

				<div className="form-row">
					<div className="form-group">
						<label className="form-label">Số câu hỏi *</label>
						<input 
							type="number" 
							name="totalQuestions" 
							className="form-input" 
							placeholder="30" 
							min="1"
							required 
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Thời gian (phút) *</label>
						<input 
							type="number" 
							name="duration" 
							className="form-input" 
							placeholder="60" 
							min="1"
							required 
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Độ khó</label>
						<select name="difficulty" className="form-select" defaultValue="medium">
							<option value="easy">Dễ</option>
							<option value="medium">Trung bình</option>
							<option value="hard">Khó</option>
						</select>
					</div>
				</div>

				<div className="form-row">
					<div className="form-group">
						<label className="form-label">Tổng điểm</label>
						<input 
							type="number" 
							name="totalPoints" 
							className="form-input" 
							placeholder="Auto = Số câu × 2" 
							min="0"
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Điểm đạt</label>
						<input 
							type="number" 
							name="passingScore" 
							className="form-input" 
							placeholder="Auto = 50% tổng điểm" 
							min="0"
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Số lần thi tối đa</label>
						<input 
							type="number" 
							name="maxAttempts" 
							className="form-input" 
							defaultValue="3" 
							min="1"
						/>
					</div>
				</div>

				<div style={{ 
					display: 'flex', 
					gap: '24px', 
					padding: '16px',
					background: 'var(--muted)',
					borderRadius: 'var(--radius-md)',
					marginTop: '16px'
				}}>
					<label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
						<input 
							type="checkbox" 
							name="allowReview" 
							defaultChecked 
							style={{ width: '18px', height: '18px', cursor: 'pointer' }}
						/>
						<span style={{ fontSize: '14px' }}>Cho phép xem lại câu hỏi</span>
					</label>

					<label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
						<input 
							type="checkbox" 
							name="shuffleQuestions" 
							defaultChecked 
							style={{ width: '18px', height: '18px', cursor: 'pointer' }}
						/>
						<span style={{ fontSize: '14px' }}>Trộn câu hỏi</span>
					</label>

					<label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
						<input 
							type="checkbox" 
							name="showResults" 
							defaultChecked 
							style={{ width: '18px', height: '18px', cursor: 'pointer' }}
						/>
						<span style={{ fontSize: '14px' }}>Hiển thị kết quả</span>
					</label>
				</div>

				<div style={{ 
					marginTop: '16px',
					padding: '12px',
					background: 'var(--accent)',
					color: 'var(--accent-foreground)',
					borderRadius: 'var(--radius-md)',
					fontSize: '13px'
				}}>
					<strong>💡 Lưu ý:</strong> Trường có dấu (*) là bắt buộc. Tổng điểm và Điểm đạt sẽ tự động tính nếu không nhập.
				</div>
			</form>
		</Modal>
	)
}

export default AddExamModal
