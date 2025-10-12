import React from 'react'
import { Star } from 'lucide-react'
import Badge from '../atoms/Badge'
import InterviewCard from '../atoms/InterviewCard'

interface MockInterview {
    id: string
    title: string
    description: string
    duration: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    isLocked: boolean
    isFree: boolean
    isNew?: boolean
}

interface MockInterviewsProps {
    interviews?: MockInterview[]
    onStartInterview?: (interviewId: string) => void
    onUnlockInterview?: (interviewId: string) => void
}

export default function MockInterviews({ 
    interviews = [
        {
            id: '1',
            title: 'Kỹ sư phần mềm',
            description: 'Giải quyết vấn đề (Trung bình)',
            duration: '60 phút',
            difficulty: 'Medium',
            isLocked: false,
            isFree: true,
            isNew: true
        },
        {
            id: '2',
            title: 'Lập trình viên Frontend',
            description: 'React (Trung bình)',
            duration: '60 phút',
            difficulty: 'Medium',
            isLocked: true,
            isFree: false
        },
        {
            id: '3',
            title: 'Lập trình viên Backend',
            description: 'Node (Trung bình)',
            duration: '60 phút',
            difficulty: 'Medium',
            isLocked: true,
            isFree: false
        },
        {
            id: '4',
            title: 'Thiết kế hệ thống',
            description: 'Thiết kế kiến trúc (Trung bình)',
            duration: '60 phút',
            difficulty: 'Medium',
            isLocked: true,
            isFree: false
        },
        {
            id: '5',
            title: 'Khoa học dữ liệu',
            description: 'Python & Pandas (Khó)',
            duration: '90 phút',
            difficulty: 'Hard',
            isLocked: true,
            isFree: false
        }
    ],
    onStartInterview,
    onUnlockInterview
}: MockInterviewsProps): JSX.Element {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return '#10b981'
            case 'Medium':
                return '#f59e0b'
            case 'Hard':
                return '#ef4444'
            default:
                return 'var(--muted-foreground)'
        }
    }

    return (
        <div className="card stagger-load hover-lift interactive" style={{ 
            animationDelay: '100ms', 
            height: '370px', 
            padding: '16px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '20px',
                flexShrink: 0 
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, marginRight: '8px' }}>
                        Phỏng vấn mô phỏng AI
                    </h2>
                    <Badge variant="primary">
                        Mới
                    </Badge>
                </div>
                <button 
                    style={{ 
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
                    Tìm hiểu thêm
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', minHeight: 0 }}>
                {/* Interview Cards Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '12px' 
                }}>
                    {interviews.map((interview) => (
                        <InterviewCard
                            key={interview.id}
                            interview={interview}
                            onStartInterview={onStartInterview}
                            onUnlockInterview={onUnlockInterview}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}