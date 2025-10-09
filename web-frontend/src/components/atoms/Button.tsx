import React from 'react'

interface ButtonProps {
	type?: 'button' | 'submit'
	children: React.ReactNode
	onClick?: () => void
	disabled?: boolean
	loading?: boolean
	variant?: 'primary' | 'secondary' | 'outline'
	size?: 'sm' | 'md' | 'lg'
	className?: string
	style?: React.CSSProperties
}

export default function Button({
	type = 'button',
	children,
	onClick,
	disabled = false,
	loading = false,
	variant = 'primary',
	size = 'md',
	className,
	style = {}
}: ButtonProps): JSX.Element {
	const sizeStyles = size === 'sm' ? {
		padding: '0.5rem 0.75rem',
		fontSize: '0.75rem'
	} : size === 'lg' ? {
		padding: '1rem 1.5rem',
		fontSize: '1rem'
	} : {
		padding: '0.75rem 1rem',
		fontSize: '0.875rem'
	}

	const baseStyles = {
		width: '100%',
		border: 'none',
		borderRadius: 'var(--radius-md)',
		fontWeight: '500',
		cursor: disabled || loading ? 'not-allowed' : 'pointer',
		transition: 'all 0.2s ease',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '0.5rem',
		opacity: disabled || loading ? 0.6 : 1,
		...sizeStyles
	}

	const variantStyles = variant === 'primary' ? {
		background: 'var(--primary)',
		color: 'var(--primary-foreground)'
	} : variant === 'secondary' ? {
		background: 'var(--secondary)',
		color: 'var(--secondary-foreground)'
	} : {
		background: 'transparent',
		color: 'var(--foreground)',
		border: '1px solid var(--border)'
	}

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled || loading}
			className={className}
			style={{
				...baseStyles,
				...variantStyles,
				...style
			}}
		>
			{loading && <span>⏳</span>}
			{children}
		</button>
	)
}
