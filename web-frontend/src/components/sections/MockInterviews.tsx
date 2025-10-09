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
            title: 'Software Engineer',
            description: 'Problem Solving (Medium)',
            duration: '60 mins',
            difficulty: 'Medium',
            isLocked: false,
            isFree: true,
            isNew: true
        },
        {
            id: '2',
            title: 'Frontend Developer',
            description: 'React (Medium)',
            duration: '60 mins',
            difficulty: 'Medium',
            isLocked: true,
            isFree: false
        },
        {
            id: '3',
            title: 'Backend Developer',
            description: 'Node (Medium)',
            duration: '60 mins',
            difficulty: 'Medium',
            isLocked: true,
            isFree: false
        },
        {
            id: '4',
            title: 'System Design',
            description: 'Architecture Design (Medium)',
            duration: '60 mins',
            difficulty: 'Medium',
            isLocked: true,
            isFree: false
        },
        {
            id: '5',
            title: 'Data Scientist',
            description: 'Python & Pandas (Hard)',
            duration: '90 mins',
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
                        AI-powered Mock Interviews
                    </h2>
                    <Badge variant="primary">
                        New
                    </Badge>
                </div>
                <button style={{ 
                    color: 'var(--foreground)', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    transition: 'color var(--transition-normal)'
                }}>
                    Know More
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