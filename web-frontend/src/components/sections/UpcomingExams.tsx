import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react'

interface UpcomingExam {
	id: string
	title: string
	date: string
	time: string
	duration: string
	type: 'scheduled' | 'practice' | 'certification'
	status: 'upcoming' | 'registered' | 'ready'
	proctoring?: boolean
}

interface UpcomingExamsProps {
	exams?: UpcomingExam[]
	onRegisterExam?: (examId: string) => void
	onViewExam?: (examId: string) => void
	onStartExam?: (examId: string) => void
}

export default function UpcomingExams({ 
	exams = [
		{
			id: 'javascript-advanced',
			title: 'JavaScript nâng cao',
			date: 'Hôm nay',
			time: '2:00 chiều',
			duration: '90 phút',
			type: 'certification',
			status: 'ready',
			proctoring: true
		},
		{
			id: 'react-fundamentals',
			title: 'Phát triển React cơ bản',
			date: 'Ngày mai',
			time: '10:00 sáng',
			duration: '60 phút',
			type: 'scheduled',
			status: 'registered',
			proctoring: true
		},
		{
			id: 'data-structures',
			title: 'Bài kiểm tra Cấu trúc dữ liệu',
			date: '15 tháng 12, 2024',
			time: '3:30 chiều',
			duration: '45 phút',
			type: 'practice',
			status: 'upcoming',
			proctoring: false
		}
	],
	onRegisterExam,
	onViewExam,
	onStartExam
}: UpcomingExamsProps): JSX.Element {
	const navigate = useNavigate()
	const getTypeColor = (type: string) => {
		switch (type) {
			case 'certification':
				return 'var(--accent)'
			case 'scheduled':
				return 'var(--primary)'
			case 'practice':
				return 'var(--primary)'
			default:
				return 'var(--muted-foreground)'
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'ready':
				return <CheckCircle className="w-4 h-4 text-green-500" style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
			case 'registered':
				return <Clock className="w-4 h-4 text-blue-500" style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
			case 'upcoming':
				return <AlertCircle className="w-4 h-4 text-yellow-500" style={{ width: '16px', height: '16px', color: 'var(--accent)' }} />
			default:
				return null
		}
	}

	const handleStartExam = (examId: string) => {
		if (onStartExam) {
			onStartExam(examId)
		} else {
			// Navigate to pre-check page for proctored exams
			navigate(`/exam/${examId}/pre-check`)
		}
	}

	const handleViewExam = (examId: string) => {
		if (onViewExam) {
			onViewExam(examId)
		} else {
			// Navigate to exam details or pre-check
			navigate(`/exam/${examId}/pre-check`)
		}
	}

	const handleRegisterExam = (examId: string) => {
		if (onRegisterExam) {
			onRegisterExam(examId)
		} else {
			// Handle registration logic here
			console.log('Register for exam:', examId)
		}
	}

	const getActionButton = (exam: UpcomingExam) => {
		switch (exam.status) {
			case 'ready':
				return (
					<button 
						onClick={() => handleStartExam(exam.id)}
						className="bg-[var(--primary)] text-[var(--primary-foreground)] px-3 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
						style={{ 
							background: 'var(--gradient-primary)', 
							color: 'var(--primary-foreground)', 
							padding: '8px 12px', 
							borderRadius: 'var(--radius-md)', 
							fontSize: '14px', 
							fontWeight: 500, 
							border: 'none', 
							cursor: 'pointer',
							transition: 'opacity var(--transition-normal)'
						}}
					>
						Bắt đầu thi
					</button>
				)
			case 'registered':
				return (
					<button 
						onClick={() => handleViewExam(exam.id)}
						className="px-3 py-2 border border-[var(--border)] text-[var(--foreground)] rounded-md text-sm font-medium hover:border-[var(--accent)] transition-colors"
						style={{ 
							padding: '8px 12px', 
							border: '1px solid var(--border)', 
							color: 'var(--foreground)', 
							borderRadius: 'var(--radius-md)', 
							fontSize: '14px', 
							fontWeight: 500, 
							background: 'none', 
							cursor: 'pointer',
							transition: 'border-color var(--transition-normal)'
						}}
					>
						Xem chi tiết
					</button>
				)
			case 'upcoming':
				return (
					<button 
						onClick={() => handleRegisterExam(exam.id)}
						className="bg-[var(--accent)] text-[var(--accent-foreground)] px-3 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
						style={{ 
							background: 'var(--gradient-accent)', 
							color: 'var(--accent-foreground)', 
							padding: '8px 12px', 
							borderRadius: 'var(--radius-md)', 
							fontSize: '14px', 
							fontWeight: 500, 
							border: 'none', 
							cursor: 'pointer',
							transition: 'opacity var(--transition-normal)'
						}}
					>
						Đăng ký
					</button>
				)
			default:
				return null
		}
	}

	return (
		<div className="card stagger-load hover-lift interactive" style={{ animationDelay: '500ms', padding: '16px', height: '490px', display: 'flex', flexDirection: 'column', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
			<div className="flex items-center justify-between mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
				<h3 className="text-lg font-semibold flex items-center" style={{ fontSize: '18px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center' }}>
					<Calendar className="w-5 h-5 mr-2" style={{ width: '20px', height: '20px', marginRight: '8px', color: 'var(--accent)' }} />
					Bài thi sắp tới
				</h3>
				<button 
					className="text-sm text-[var(--accent)] hover:underline"
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
					Xem lịch
				</button>
			</div>

			<div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {exams.map((exam) => (
                        <div key={exam.id} style={{ 
                            padding: '12px', 
                            borderRadius: 'var(--radius-md)', 
                            border: '1px solid var(--border)', 
                            transition: 'border-color var(--transition-normal)',
                            cursor: 'pointer'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ flex: 1, marginRight: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                        {getStatusIcon(exam.status)}
                                        <h4 style={{ fontSize: '14px', fontWeight: 500, marginLeft: '8px'}}>
                                            {exam.title}
                                        </h4>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>
                                        <Calendar style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                                        {exam.date} at {exam.time}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: 'var(--muted-foreground)' }}>
                                        <Clock style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                                        {exam.duration}
                                        {exam.proctoring && (
                                            <span style={{ marginLeft: '8px', padding: '2px 8px', background: 'var(--destructive)', color: 'var(--destructive-foreground)', borderRadius: '9999px', fontSize: '12px', opacity: 0.8 }}>
                                                Giám sát
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                                    <span style={{ 
                                        fontSize: '12px', 
                                        padding: '2px 8px', 
                                        borderRadius: '9999px', 
                                        fontWeight: 500,
                                        background: getTypeColor(exam.type) + '20', // Thêm opacity vào màu nền
                                        color: getTypeColor(exam.type)
                                    }}>
                                        {exam.type}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {getActionButton(exam)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
	)
}
