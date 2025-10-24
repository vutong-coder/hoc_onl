import React from 'react'
import Modal from '../../components/common/Modal'
import { FileText, BookOpen, Clock, Hash, Target, Settings, CheckSquare, Save } from 'lucide-react'

interface EditExamModalProps {
	isOpen: boolean
	onClose: () => void
	onUpdateExam: (examData: Partial<any>) => void
	exam: any
	subjects: string[]
}

const EditExamModal: React.FC<EditExamModalProps> = ({
	isOpen,
	onClose,
	onUpdateExam,
	exam,
	subjects
}) => {
	if (!exam) return null

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		const form = (e.target as HTMLButtonElement).closest('.modal-content-modern')?.querySelector('form')
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
				showResults: formData.get('showResults') === 'on'
			}
			
			if (examData.title && examData.subject && examData.totalQuestions && examData.duration) {
				// Auto-calculate if not provided
				if (!examData.totalPoints) {
					examData.totalPoints = examData.totalQuestions * 2
				}
				if (!examData.passingScore) {
					examData.passingScore = Math.floor(examData.totalPoints * 0.5)
				}
				onUpdateExam(examData)
			} else {
				alert('Vui lòng điền đầy đủ các trường bắt buộc (*)')
			}
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Chỉnh sửa đề thi"
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
						Cập nhật
					</button>
				</>
			}
		>
			<div className="modal-content-wrapper">
				<form>
					<div className="modal-form-section">
						<div className="section-title">
							<FileText />
							<h4>Thông tin cơ bản</h4>
						</div>
						
						<div className="modal-form-group">
							<label className="form-label">
								<FileText />
								Tiêu đề đề thi <span className="required">*</span>
							</label>
							<input 
								type="text" 
								name="title" 
								className="form-input" 
								defaultValue={exam.title}
								placeholder="VD: Kiểm tra giữa kỳ - Lập trình Web" 
								required 
							/>
						</div>

						<div className="modal-form-group">
							<label className="form-label">
								<FileText />
								Mô tả
							</label>
							<textarea 
								name="description" 
								className="form-textarea" 
								defaultValue={exam.description || ''}
								placeholder="Mô tả ngắn về đề thi..."
								rows={3}
							/>
						</div>

						<div className="modal-form-row">
							<div className="modal-form-group">
								<label className="form-label">
									<BookOpen />
									Môn học <span className="required">*</span>
								</label>
								<select 
									name="subject" 
									className="form-select" 
									defaultValue={exam.subject}
									required
								>
									{subjects.map(s => (
										<option key={s} value={s}>{s}</option>
									))}
								</select>
							</div>

							<div className="modal-form-group">
								<label className="form-label">
									<Settings />
									Loại bài thi
								</label>
								<select 
									name="type" 
									className="form-select" 
									defaultValue={exam.type}
								>
									<option value="practice">Luyện tập</option>
									<option value="quiz">Kiểm tra</option>
									<option value="midterm">Giữa kỳ</option>
									<option value="final">Cuối kỳ</option>
									<option value="assignment">Bài tập</option>
								</select>
							</div>
						</div>
					</div>

					<div className="modal-form-section">
						<div className="section-title">
							<CheckSquare />
							<h4>Cấu hình bài thi</h4>
						</div>
						
						<div className="modal-form-row">
							<div className="modal-form-group">
								<label className="form-label">
									<CheckSquare />
									Số câu hỏi <span className="required">*</span>
								</label>
								<input 
									type="number" 
									name="totalQuestions" 
									className="form-input" 
									defaultValue={exam.totalQuestions}
									placeholder="30" 
									min="1"
									required 
								/>
							</div>

							<div className="modal-form-group">
								<label className="form-label">
									<Clock />
									Thời gian (phút) <span className="required">*</span>
								</label>
								<input 
									type="number" 
									name="duration" 
									className="form-input" 
									defaultValue={exam.duration}
									placeholder="60" 
									min="1"
									required 
								/>
							</div>

							<div className="modal-form-group">
								<label className="form-label">
									<Target />
									Độ khó
								</label>
								<select 
									name="difficulty" 
									className="form-select" 
									defaultValue={exam.difficulty}
								>
									<option value="easy">Dễ</option>
									<option value="medium">Trung bình</option>
									<option value="hard">Khó</option>
								</select>
							</div>
						</div>
					</div>

					<div className="modal-form-section">
						<div className="section-title">
							<Target />
							<h4>Thiết lập điểm số</h4>
						</div>
						
						<div className="modal-form-row">
							<div className="modal-form-group">
								<label className="form-label">
									<Target />
									Tổng điểm
								</label>
								<input 
									type="number" 
									name="totalPoints" 
									className="form-input" 
									defaultValue={exam.totalPoints}
									placeholder="Auto = Số câu × 2" 
									min="0"
								/>
								<small>Tự động tính nếu để trống</small>
							</div>

							<div className="modal-form-group">
								<label className="form-label">
									<Target />
									Điểm đạt
								</label>
								<input 
									type="number" 
									name="passingScore" 
									className="form-input" 
									defaultValue={exam.passingScore}
									placeholder="Auto = 50% tổng điểm" 
									min="0"
								/>
								<small>Tự động tính nếu để trống</small>
							</div>

							<div className="modal-form-group">
								<label className="form-label">
									<Hash />
									Số lần thi tối đa
								</label>
								<input 
									type="number" 
									name="maxAttempts" 
									className="form-input" 
									defaultValue={exam.maxAttempts}
									min="1"
								/>
							</div>
						</div>
					</div>

					<div className="modal-form-section">
						<div className="section-title">
							<Settings />
							<h4>Tùy chọn nâng cao</h4>
						</div>
						
						<div className="modal-checkbox-group">
							<div className="checkbox-item">
								<input 
									type="checkbox" 
									name="allowReview" 
									defaultChecked={exam.allowReview}
								/>
								<label>Cho phép xem lại câu hỏi</label>
							</div>

							<div className="checkbox-item">
								<input 
									type="checkbox" 
									name="shuffleQuestions" 
									defaultChecked={exam.shuffleQuestions}
								/>
								<label>Trộn câu hỏi</label>
							</div>

							<div className="checkbox-item">
								<input 
									type="checkbox" 
									name="showResults" 
									defaultChecked={exam.showResults}
								/>
								<label>Hiển thị kết quả</label>
							</div>
						</div>
					</div>

					<div className="modal-export-info">
						<div className="export-title">
							<Save />
							<h4>Lưu ý</h4>
						</div>
						<ul className="export-list">
							<li>Các thay đổi sẽ được lưu ngay lập tức</li>
							<li>Tổng điểm và điểm đạt sẽ tự động tính nếu để trống</li>
							{exam.status === 'ongoing' && <li>⚠️ Không thể sửa đề đang thi!</li>}
						</ul>
					</div>
				</form>
			</div>
		</Modal>
	)
}

export default EditExamModal
