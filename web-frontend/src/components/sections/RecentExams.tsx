import React from 'react'
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
	return (
		<div className="card stagger-load hover-lift interactive" style={{ animationDelay: '300ms', padding: '16px', height: '490px', display: 'flex', flexDirection: 'column', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
				<h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
					Bài thi gần đây
				</h3>
				<button 
					style={{ 
						fontSize: '14px', 
						color: '#3b82f6', 
						background: 'none', 
						border: 'none', 
						cursor: 'pointer', 
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
						padding: '4px 8px',
						borderRadius: '6px',
						fontWeight: 500
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
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
							onViewExam={onViewExam}
							onRetakeExam={onRetakeExam}
						/>
					))}
				</div>
			</div>	
		</div>
	)
}
