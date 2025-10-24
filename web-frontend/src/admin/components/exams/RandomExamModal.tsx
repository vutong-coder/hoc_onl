import React, { useState } from 'react'
import Modal from '../common/Modal'
import { Shuffle, AlertCircle } from 'lucide-react'
import { RandomExamConfig } from '../../types/exam'
import '../../styles/form.css'

interface RandomExamModalProps {
	isOpen: boolean
	onClose: () => void
	onGenerate: (config: RandomExamConfig) => void
}

const subjects = [
	'Lập trình Web',
	'Cơ sở dữ liệu',
	'Thuật toán',
	'Hệ điều hành',
	'Mạng máy tính',
	'Lập trình hướng đối tượng',
	'Trí tuệ nhân tạo',
	'Phát triển phần mềm',
	'An toàn thông tin',
	'Học máy'
]

export default function RandomExamModal({
	isOpen,
	onClose,
	onGenerate
}: RandomExamModalProps): JSX.Element {
	
	const [subject, setSubject] = useState(subjects[0])
	const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed')
	const [totalQuestions, setTotalQuestions] = useState(30)
	const [duration, setDuration] = useState(60)
	const [useCustomDistribution, setUseCustomDistribution] = useState(false)
	const [easyCount, setEasyCount] = useState(10)
	const [mediumCount, setMediumCount] = useState(15)
	const [hardCount, setHardCount] = useState(5)

	const handleGenerate = () => {
		const config: RandomExamConfig = {
			subject,
			difficulty,
			totalQuestions,
			duration,
			...(useCustomDistribution && difficulty === 'mixed' && {
				easyCount,
				mediumCount,
				hardCount
			})
		}
		
		onGenerate(config)
		resetForm()
	}

	const resetForm = () => {
		setSubject(subjects[0])
		setDifficulty('mixed')
		setTotalQuestions(30)
		setDuration(60)
		setUseCustomDistribution(false)
		setEasyCount(10)
		setMediumCount(15)
		setHardCount(5)
	}

	const handleClose = () => {
		resetForm()
		onClose()
	}

	// Validate custom distribution
	const isValidDistribution = () => {
		if (!useCustomDistribution || difficulty !== 'mixed') return true
		return (easyCount + mediumCount + hardCount) === totalQuestions
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Sinh đề thi ngẫu nhiên"
			maxWidth="600px"
			footer={
				<>
					<button 
						className="btn btn-secondary"
						onClick={handleClose}
					>
						Hủy
					</button>
					<button 
						className="btn btn-primary"
						onClick={handleGenerate}
						disabled={!isValidDistribution()}
					>
						<Shuffle size={18} />
						Sinh đề thi
					</button>
				</>
			}
		>
			<div>
				<div className="form-group">
					<label className="form-label">Môn học *</label>
					<select
						className="form-select"
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
					>
						{subjects.map(s => (
							<option key={s} value={s}>{s}</option>
						))}
					</select>
				</div>

				<div className="form-row">
					<div className="form-group">
						<label className="form-label">Tổng số câu hỏi *</label>
						<input
							type="number"
							className="form-input"
							value={totalQuestions}
							onChange={(e) => setTotalQuestions(parseInt(e.target.value) || 0)}
							min="1"
							max="100"
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Thời gian (phút) *</label>
						<input
							type="number"
							className="form-input"
							value={duration}
							onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
							min="1"
							max="300"
						/>
					</div>
				</div>

				<div className="form-group">
					<label className="form-label">Độ khó</label>
					<select
						className="form-select"
						value={difficulty}
						onChange={(e) => setDifficulty(e.target.value as any)}
					>
						<option value="mixed">Trộn lẫn (Dễ + TB + Khó)</option>
						<option value="easy">Chỉ câu dễ</option>
						<option value="medium">Chỉ câu trung bình</option>
						<option value="hard">Chỉ câu khó</option>
					</select>
				</div>

				{difficulty === 'mixed' && (
					<>
						<div className="form-group">
							<label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<input
									type="checkbox"
									checked={useCustomDistribution}
									onChange={(e) => setUseCustomDistribution(e.target.checked)}
								/>
								<span className="form-label" style={{ marginBottom: 0 }}>
									Tùy chỉnh phân bổ độ khó
								</span>
							</label>
						</div>

						{useCustomDistribution && (
							<>
								<div 
									style={{ 
										padding: '12px',
										background: 'var(--muted)',
										borderRadius: 'var(--radius-md)',
										marginBottom: '16px',
										display: 'flex',
										alignItems: 'center',
										gap: '8px',
										fontSize: '13px'
									}}
								>
									<AlertCircle size={16} />
									<span>
										Tổng phải bằng {totalQuestions} câu. 
										Hiện tại: {easyCount + mediumCount + hardCount} câu
									</span>
								</div>

								<div className="form-grid-3">
									<div className="form-group">
										<label className="form-label">Số câu dễ</label>
										<input
											type="number"
											className="form-input"
											value={easyCount}
											onChange={(e) => setEasyCount(parseInt(e.target.value) || 0)}
											min="0"
										/>
									</div>

									<div className="form-group">
										<label className="form-label">Số câu trung bình</label>
										<input
											type="number"
											className="form-input"
											value={mediumCount}
											onChange={(e) => setMediumCount(parseInt(e.target.value) || 0)}
											min="0"
										/>
									</div>

									<div className="form-group-full">
										<label className="form-label">Số câu khó</label>
										<input
											type="number"
											className="form-input"
											value={hardCount}
											onChange={(e) => setHardCount(parseInt(e.target.value) || 0)}
											min="0"
										/>
									</div>
								</div>

								{!isValidDistribution() && (
									<div 
										style={{ 
											color: '#ef4444',
											fontSize: '13px',
											marginTop: '8px'
										}}
									>
										⚠️ Tổng số câu ({easyCount + mediumCount + hardCount}) 
										phải bằng {totalQuestions}
									</div>
								)}
							</>
						)}
					</>
				)}

				<div 
					style={{ 
						marginTop: '20px',
						padding: '16px',
						background: 'var(--accent)',
						color: 'var(--accent-foreground)',
						borderRadius: 'var(--radius-md)',
						fontSize: '14px'
					}}
				>
					<strong>💡 Lưu ý:</strong> Hệ thống sẽ tự động chọn ngẫu nhiên câu hỏi từ ngân hàng đề thi 
					theo môn học và độ khó đã chọn.
				</div>
			</div>
		</Modal>
	)
}

