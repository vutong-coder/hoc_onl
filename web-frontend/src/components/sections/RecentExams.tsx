import React, { useState } from 'react'
import { X, CheckCircle, Award, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ExamCard from '../atoms/ExamCard'

interface RecentExam {
	id: string
	title: string
	score?: number
	maxScore: number
	status: 'completed' | 'in-progress' | 'failed'
	date: string
	duration: string
	certificate?: boolean
}

interface RecentExamsProps {
	exams?: RecentExam[]
	onViewExam?: (examId: string) => void
	onRetakeExam?: (examId: string) => void
}

export default function RecentExams({
	exams = [
		{
			id: '1',
			title: 'Lập trình Python cơ bản',
			score: 85,
			maxScore: 100,
			status: 'completed',
			date: '2 giờ trước',
			duration: '45 phút',
			certificate: true
		},
		{
			id: '2',
			title: 'Cấu trúc dữ liệu & Thuật toán',
			score: 72,
			maxScore: 100,
			status: 'completed',
			date: '1 ngày trước',
			duration: '60 phút',
			certificate: false
		},
		{
			id: '3',
			title: 'Phát triển Web cơ bản',
			score: undefined,
			maxScore: 100,
			status: 'in-progress',
			date: 'Bắt đầu 30 phút trước',
			duration: '90 phút',
			certificate: false
		},
		{
			id: '4',
			title: 'Lập trình Python cơ bản',
			score: 85,
			maxScore: 100,
			status: 'completed',
			date: '2 giờ trước',
			duration: '45 phút',
			certificate: true
		},
	],
	onViewExam,
	onRetakeExam
}: RecentExamsProps): JSX.Element {
	const navigate = useNavigate()
	const [showExamDetailModal, setShowExamDetailModal] = useState(false)
	const [showCertificateModal, setShowCertificateModal] = useState(false)
	const [selectedExam, setSelectedExam] = useState<RecentExam | null>(null)

	const handleViewExam = (examId: string) => {
		const exam = exams.find(e => e.id === examId)
		if (exam) {
			setSelectedExam(exam)
			if (exam.status === 'in-progress') {
				// Navigate to continue exam
				navigate(`/user/exam/${examId}`)
			} else {
				// Show detail modal
				setShowExamDetailModal(true)
			}
			onViewExam?.(examId)
		}
	}

	const handleRetakeExam = (examId: string) => {
		const exam = exams.find(e => e.id === examId)
		if (exam) {
			navigate(`/user/exam/${examId}/retake`)
			onRetakeExam?.(examId)
		}
	}

	const handleViewAllExams = () => {
		navigate('/user/exams')
	}

	const handleViewCertificate = () => {
		setShowExamDetailModal(false)
		setShowCertificateModal(true)
	}

	const getScoreColor = (score?: number, maxScore: number = 100) => {
		if (!score) return 'var(--muted-foreground)'
		const percentage = (score / maxScore) * 100
		if (percentage >= 80) return 'var(--primary)'
		if (percentage >= 60) return 'var(--accent)'
		return 'var(--destructive)'
	}

	const getPerformanceMessage = (score?: number, maxScore: number = 100) => {
		if (!score) return ''
		const percentage = (score / maxScore) * 100
		if (percentage >= 90) return 'Xuất sắc! 🎉'
		if (percentage >= 80) return 'Rất tốt! 👍'
		if (percentage >= 70) return 'Tốt! ✓'
		if (percentage >= 60) return 'Đạt yêu cầu'
		return 'Cần cải thiện'
	}

	return (
		<>
			<div className="card stagger-load hover-lift interactive" style={{ animationDelay: '300ms', padding: '16px', height: '490px', display: 'flex', flexDirection: 'column', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
					<h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
						Bài thi gần đây
					</h3>
					<button
						onClick={handleViewAllExams}
						style={{
							fontSize: '14px',
							color: 'var(--primary)',
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							padding: '4px 8px',
							borderRadius: '6px',
							fontWeight: 500
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = 'var(--primary-light)'
							e.currentTarget.style.textDecoration = 'underline'
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = 'none'
							e.currentTarget.style.textDecoration = 'none'
						}}
					>
						Xem tất cả
					</button>
				</div>

				<div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
						{exams.map((exam) => (
							<ExamCard
								key={exam.id}
								exam={exam}
								onViewExam={handleViewExam}
								onRetakeExam={handleRetakeExam}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Exam Detail Modal */}
			{showExamDetailModal && selectedExam && selectedExam.status !== 'in-progress' && (
				<div style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'rgba(0, 0, 0, 0.7)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 10000,
					backdropFilter: 'blur(4px)',
					animation: 'fadeIn 0.2s ease'
				}}>
					<div style={{
						background: 'var(--card)',
						borderRadius: 'var(--radius-lg)',
						padding: '32px',
						maxWidth: '600px',
						width: '90%',
						maxHeight: '80vh',
						overflowY: 'auto',
						position: 'relative',
						boxShadow: 'var(--shadow-xl)',
						animation: 'slideInUp 0.3s ease'
					}}>
						<button
							onClick={() => setShowExamDetailModal(false)}
							style={{
								position: 'absolute',
								top: '16px',
								right: '16px',
								background: 'var(--muted)',
								border: 'none',
								borderRadius: '50%',
								width: '32px',
								height: '32px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								transition: 'all 0.2s ease'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = 'var(--destructive)'
								e.currentTarget.style.transform = 'scale(1.1)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'var(--muted)'
								e.currentTarget.style.transform = 'scale(1)'
							}}
						>
							<X style={{ width: '20px', height: '20px' }} />
						</button>

						<div style={{ textAlign: 'center' }}>
							{/* Score Circle */}
							<div style={{
								width: '120px',
								height: '120px',
								margin: '0 auto 24px',
								background: `linear-gradient(135deg, ${getScoreColor(selectedExam.score, selectedExam.maxScore)}, var(--accent))`,
								borderRadius: '50%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'column',
								boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
							}}>
								<span style={{ fontSize: '36px', fontWeight: 700, color: 'white' }}>
									{selectedExam.score}
								</span>
								<span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
									/{selectedExam.maxScore}
								</span>
							</div>

							<h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
								{selectedExam.title}
							</h2>

							<p style={{
								fontSize: '18px',
								fontWeight: 600,
								color: getScoreColor(selectedExam.score, selectedExam.maxScore),
								marginBottom: '24px'
							}}>
								{getPerformanceMessage(selectedExam.score, selectedExam.maxScore)}
							</p>

							{/* Stats Grid */}
							<div style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, 1fr)',
								gap: '16px',
								marginBottom: '24px',
								textAlign: 'left'
							}}>
								<div style={{
									padding: '16px',
									background: 'var(--muted)',
									borderRadius: 'var(--radius-md)',
									border: '1px solid var(--border)'
								}}>
									<div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
										<Clock style={{ width: '16px', height: '16px', color: 'var(--primary)', marginRight: '8px' }} />
										<span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
											Thời gian
										</span>
									</div>
									<p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
										{selectedExam.duration}
									</p>
								</div>

								<div style={{
									padding: '16px',
									background: 'var(--muted)',
									borderRadius: 'var(--radius-md)',
									border: '1px solid var(--border)'
								}}>
									<div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
										<TrendingUp style={{ width: '16px', height: '16px', color: 'var(--primary)', marginRight: '8px' }} />
										<span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
											Tỷ lệ đạt
										</span>
									</div>
									<p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
										{selectedExam.score ? Math.round((selectedExam.score / selectedExam.maxScore) * 100) : 0}%
									</p>
								</div>

								<div style={{
									padding: '16px',
									background: 'var(--muted)',
									borderRadius: 'var(--radius-md)',
									border: '1px solid var(--border)'
								}}>
									<div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
										<CheckCircle style={{ width: '16px', height: '16px', color: 'var(--primary)', marginRight: '8px' }} />
										<span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
											Trạng thái
										</span>
									</div>
									<p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
										{selectedExam.status === 'completed' ? 'Hoàn thành' : 'Không đạt'}
									</p>
								</div>

								<div style={{
									padding: '16px',
									background: 'var(--muted)',
									borderRadius: 'var(--radius-md)',
									border: '1px solid var(--border)'
								}}>
									<div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
										<Award style={{ width: '16px', height: '16px', color: 'var(--primary)', marginRight: '8px' }} />
										<span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
											Chứng chỉ
										</span>
									</div>
									<p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
										{selectedExam.certificate ? 'Có' : 'Không'}
									</p>
								</div>
							</div>

							{/* Action Buttons */}
							<div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
								{selectedExam.certificate && (
									<button
										onClick={handleViewCertificate}
										style={{
											flex: 1,
											padding: '12px',
											background: 'linear-gradient(135deg, var(--primary), var(--accent))',
											color: 'white',
											border: 'none',
											borderRadius: 'var(--radius-md)',
											fontSize: '16px',
											fontWeight: 600,
											cursor: 'pointer',
											transition: 'all 0.2s ease',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: '8px'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.transform = 'translateY(-2px)'
											e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.transform = 'translateY(0)'
											e.currentTarget.style.boxShadow = 'none'
										}}
									>
										<Award style={{ width: '20px', height: '20px' }} />
										Xem chứng chỉ
									</button>
								)}

								{selectedExam.score && selectedExam.score < 70 && (
									<button
										onClick={() => {
											setShowExamDetailModal(false)
											handleRetakeExam(selectedExam.id)
										}}
										style={{
											flex: 1,
											padding: '12px',
											background: 'var(--muted)',
											color: 'var(--foreground)',
											border: '1px solid var(--border)',
											borderRadius: 'var(--radius-md)',
											fontSize: '16px',
											fontWeight: 600,
											cursor: 'pointer',
											transition: 'all 0.2s ease'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.background = 'var(--border)'
											e.currentTarget.style.borderColor = 'var(--primary)'
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.background = 'var(--muted)'
											e.currentTarget.style.borderColor = 'var(--border)'
										}}
									>
										Thi lại
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Certificate Modal */}
			{showCertificateModal && selectedExam && selectedExam.certificate && (
				<div style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'rgba(0, 0, 0, 0.7)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 10001,
					backdropFilter: 'blur(4px)',
					animation: 'fadeIn 0.2s ease'
				}}>
					<div style={{
						background: 'var(--card)',
						borderRadius: 'var(--radius-lg)',
						padding: '32px',
						maxWidth: '700px',
						width: '90%',
						position: 'relative',
						boxShadow: 'var(--shadow-xl)',
						animation: 'slideInUp 0.3s ease'
					}}>
						<button
							onClick={() => setShowCertificateModal(false)}
							style={{
								position: 'absolute',
								top: '16px',
								right: '16px',
								background: 'var(--muted)',
								border: 'none',
								borderRadius: '50%',
								width: '32px',
								height: '32px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								transition: 'all 0.2s ease'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = 'var(--destructive)'
								e.currentTarget.style.transform = 'scale(1.1)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'var(--muted)'
								e.currentTarget.style.transform = 'scale(1)'
							}}
						>
							<X style={{ width: '20px', height: '20px' }} />
						</button>

						{/* Certificate Design */}
						<div style={{
							border: '4px solid var(--primary)',
							borderRadius: 'var(--radius-lg)',
							padding: '48px 32px',
							background: 'linear-gradient(135deg, var(--card) 0%, var(--muted) 100%)',
							position: 'relative',
							overflow: 'hidden'
						}}>
							{/* Decorative corners */}
							<div style={{
								position: 'absolute',
								top: '16px',
								left: '16px',
								width: '40px',
								height: '40px',
								borderTop: '3px solid var(--accent)',
								borderLeft: '3px solid var(--accent)'
							}} />
							<div style={{
								position: 'absolute',
								top: '16px',
								right: '16px',
								width: '40px',
								height: '40px',
								borderTop: '3px solid var(--accent)',
								borderRight: '3px solid var(--accent)'
							}} />
							<div style={{
								position: 'absolute',
								bottom: '16px',
								left: '16px',
								width: '40px',
								height: '40px',
								borderBottom: '3px solid var(--accent)',
								borderLeft: '3px solid var(--accent)'
							}} />
							<div style={{
								position: 'absolute',
								bottom: '16px',
								right: '16px',
								width: '40px',
								height: '40px',
								borderBottom: '3px solid var(--accent)',
								borderRight: '3px solid var(--accent)'
							}} />

							<div style={{ textAlign: 'center' }}>
								<Award style={{
									width: '64px',
									height: '64px',
									color: 'var(--primary)',
									marginBottom: '16px'
								}} />

								<h2 style={{
									fontSize: '32px',
									fontWeight: 700,
									marginBottom: '8px',
									background: 'linear-gradient(135deg, var(--primary), var(--accent))',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text'
								}}>
									Chứng chỉ Hoàn thành
								</h2>

								<p style={{ fontSize: '16px', color: 'var(--muted-foreground)', marginBottom: '32px' }}>
									Chứng nhận rằng bạn đã hoàn thành xuất sắc
								</p>

								<h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px', color: 'var(--foreground)' }}>
									{selectedExam.title}
								</h3>

								<div style={{
									display: 'inline-block',
									padding: '12px 24px',
									background: 'linear-gradient(135deg, var(--primary), var(--accent))',
									borderRadius: 'var(--radius-md)',
									marginBottom: '32px'
								}}>
									<p style={{ margin: 0, color: 'white', fontSize: '18px', fontWeight: 600 }}>
										Điểm số: {selectedExam.score}/{selectedExam.maxScore}
									</p>
								</div>

								<p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
									Ngày hoàn thành: {selectedExam.date}
								</p>
							</div>
						</div>

						<button
							onClick={() => setShowCertificateModal(false)}
							style={{
								marginTop: '24px',
								width: '100%',
								padding: '12px',
								background: 'linear-gradient(135deg, var(--primary), var(--accent))',
								color: 'white',
								border: 'none',
								borderRadius: 'var(--radius-md)',
								fontSize: '16px',
								fontWeight: 600,
								cursor: 'pointer',
								transition: 'all 0.2s ease'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'translateY(-2px)'
								e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'translateY(0)'
								e.currentTarget.style.boxShadow = 'none'
							}}
						>
							Tải xuống chứng chỉ
						</button>
					</div>
				</div>
			)}

			{/* Add animations */}
			<style>{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes slideInUp {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</>
	)
}
