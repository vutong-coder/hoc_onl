import React from 'react'
import { Edit2, Trash2, Eye, Copy, Play } from 'lucide-react'
import { Exam } from '../../types/exam'

interface ExamActionsProps {
	exam: Exam
	onEdit: (exam: Exam) => void
	onDelete: (exam: Exam) => void
	onView: (exam: Exam) => void
	onDuplicate: (exam: Exam) => void
}

export default function ExamActions({
	exam,
	onEdit,
	onDelete,
	onView,
	onDuplicate
}: ExamActionsProps): JSX.Element {
	
	return (
		<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
			{/* Nút xem chi tiết */}
			<button
				className="btn btn-sm btn-secondary"
				onClick={() => onView(exam)}
				title="Xem chi tiết"
			>
				<Eye size={16} />
			</button>

			{/* Nút sao chép */}
			<button
				className="btn btn-sm btn-secondary"
				onClick={() => onDuplicate(exam)}
				title="Sao chép đề thi"
			>
				<Copy size={16} />
			</button>

			{/* Nút chỉnh sửa */}
			<button
				className="btn btn-sm btn-secondary"
				onClick={() => onEdit(exam)}
				title="Chỉnh sửa"
				disabled={exam.status === 'ongoing' || exam.status === 'ended'}
			>
				<Edit2 size={16} />
			</button>

			{/* Nút xóa */}
			<button
				className="btn btn-sm btn-danger"
				onClick={() => onDelete(exam)}
				title="Xóa"
				disabled={exam.status === 'ongoing'}
			>
				<Trash2 size={16} />
			</button>
		</div>
	)
}

