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
			title: 'Python Programming Fundamentals',
			score: 85,
			maxScore: 100,
			status: 'completed',
			date: '2 hours ago',
			duration: '45 min',
			certificate: true
		},
		{
			id: '2',
			title: 'Data Structures & Algorithms',
			score: 72,
			maxScore: 100,
			status: 'completed',
			date: '1 day ago',
			duration: '60 min',
			certificate: false
		},
		{
			id: '3',
			title: 'Web Development Basics',
			score: undefined,
			maxScore: 100,
			status: 'in-progress',
			date: 'Started 30 min ago',
			duration: '90 min',
			certificate: false
		},
		{
			id: '4',
			title: 'Python Programming Fundamentals',
			score: 85,
			maxScore: 100,
			status: 'completed',
			date: '2 hours ago',
			duration: '45 min',
			certificate: true
		},
	],
	onViewExam,
	onRetakeExam
}: RecentExamsProps): JSX.Element {
	return (
		<div className="card stagger-load hover-lift interactive" style={{ animationDelay: '300ms', padding: '16px', height: '490px', display: 'flex', flexDirection: 'column', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
				<h3 style={{ fontSize: '18px', fontWeight: 600, marginLeft: '8px' }}>
					Recent Exams
				</h3>
				<button 
					style={{ fontSize: '14px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
				>
					View All
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
