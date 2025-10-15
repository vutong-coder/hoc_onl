import React from 'react'
import '../../styles/common.css'

interface BadgeProps {
	children: React.ReactNode
	variant?: 'success' | 'warning' | 'danger' | 'info' | 'secondary'
	className?: string
}

export default function Badge({ 
	children, 
	variant = 'secondary',
	className = '' 
}: BadgeProps): JSX.Element {
	
	return (
		<span className={`badge badge-${variant} ${className}`}>
			{children}
		</span>
	)
}

