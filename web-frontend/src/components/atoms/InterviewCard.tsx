import React from 'react'
import { Clock, Lock, Star } from 'lucide-react'
import Badge from '../atoms/Badge'

interface Interview {
	id: string
	title: string
	description: string
	duration: string
	isLocked: boolean
	isNew?: boolean
}

interface InterviewCardProps {
	interview: Interview
	onStartInterview?: (id: string) => void
	onUnlockInterview?: (id: string) => void
}

export default function InterviewCard({ interview, onStartInterview, onUnlockInterview }: InterviewCardProps): JSX.Element {
	return (
		<div 
			style={{ 
				padding: '16px', 
				borderRadius: 'var(--radius-lg)', 
				border: '1px solid var(--border)', 
				background: 'var(--card)',
				transition: 'all 0.3s ease',
				position: 'relative',
				cursor: interview.isLocked ? 'default' : 'pointer'
			}}
			onMouseEnter={(e) => {
				if (!interview.isLocked) {
					e.currentTarget.style.borderColor = 'var(--accent)'
					e.currentTarget.style.transform = 'translateY(-2px)'
					e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
				}
			}}
			onMouseLeave={(e) => {
				if (!interview.isLocked) {
					e.currentTarget.style.borderColor = 'var(--border)'
					e.currentTarget.style.transform = 'translateY(0)'
					e.currentTarget.style.boxShadow = 'none'
				}
			}}
		>
			{/* New Badge */}
			{interview.isNew && (
				<div style={{ 
					position: 'absolute', 
					top: '-8px', 
					right: '-8px'
				}}>
					<Badge variant="accent" size="sm">
						<Star style={{ width: '12px', height: '12px' }} />
					</Badge>
				</div>
			)}

			{/* Content */}
			<div style={{ marginBottom: '12px' }}>
				<h3 style={{ 
					fontSize: '18px', 
					fontWeight: 600, 
					color: 'var(--foreground)', 
					marginBottom: '4px', 
					margin: 0 
				}}>
					{interview.title}
				</h3>
				<p style={{ 
					fontSize: '14px', 
					color: 'var(--muted-foreground)', 
					margin: 0 
				}}>
					{interview.description}
				</p>
			</div>

			{/* Duration */}
			<div style={{ 
				display: 'flex', 
				alignItems: 'center', 
				fontSize: '14px', 
				color: 'var(--muted-foreground)', 
				marginBottom: '16px' 
			}}>
				<Clock style={{ width: '16px', height: '16px', marginRight: '4px' }} />
				{interview.duration}
			</div>

			{/* Action Button */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				{interview.isLocked ? (
					<div style={{ display: 'flex', alignItems: 'center', color: 'var(--muted-foreground)' }}>
						<Lock style={{ width: '16px', height: '16px', marginRight: '8px' }} />
						<span style={{ fontSize: '14px' }}>Premium</span>
					</div>
				) : (
					<button 
						onClick={() => onStartInterview?.(interview.id)}
						style={{ 
							background: 'var(--primary)', 
							color: 'var(--primary-foreground)', 
							padding: '8px 16px', 
							borderRadius: 'var(--radius-md)', 
							fontSize: '14px', 
							fontWeight: 500, 
							border: 'none', 
							cursor: 'pointer',
							transition: 'background-color var(--transition-normal)'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = 'var(--accent)'
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = 'var(--primary)'
						}}
					>
						Try for Free
					</button>
				)}
				
				{interview.isLocked && (
					<button 
						onClick={() => onUnlockInterview?.(interview.id)}
						style={{ 
							color: 'var(--accent)', 
							fontSize: '14px', 
							fontWeight: 500, 
							background: 'none', 
							border: 'none', 
							cursor: 'pointer',
							transition: 'color var(--transition-normal)'
						}}
					>
						Unlock
					</button>
				)}
			</div>
		</div>
	)
}
