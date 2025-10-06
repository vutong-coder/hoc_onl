import React from 'react'

interface ButtonProps {
	type?: 'button' | 'submit'
	children: React.ReactNode
	onClick?: () => void
	disabled?: boolean
	loading?: boolean
	variant?: 'primary' | 'secondary'
	style?: React.CSSProperties
}

export default function Button({
	type = 'button',
	children,
	onClick,
	disabled = false,
	loading = false,
	variant = 'primary',
	style = {}
}: ButtonProps): JSX.Element {
	const baseStyles = {
		width: '100%',
		padding: '0.75rem 1rem',
		border: 'none',
		borderRadius: 'var(--radius-md)',
		fontSize: '0.875rem',
		fontWeight: '500',
		cursor: disabled || loading ? 'not-allowed' : 'pointer',
		transition: 'all 0.2s ease',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '0.5rem',
		opacity: disabled || loading ? 0.6 : 1
	}

	const variantStyles = variant === 'primary' ? {
		background: 'var(--primary)',
		color: 'var(--primary-foreground)'
	} : {
		background: 'var(--secondary)',
		color: 'var(--secondary-foreground)'
	}

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled || loading}
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
