import React from 'react'

interface PasswordStrengthProps {
	strength: 'weak' | 'fair' | 'good' | 'strong'
}

export default function PasswordStrength({ strength }: PasswordStrengthProps): JSX.Element {
	const getStrengthText = (strength: string) => {
		switch (strength) {
			case 'weak': return 'Weak password'
			case 'fair': return 'Fair password'
			case 'good': return 'Good password'
			case 'strong': return 'Strong password'
			default: return 'Enter password'
		}
	}

	const getStrengthColor = (strength: string) => {
		switch (strength) {
			case 'weak': return 'var(--destructive)'
			case 'fair': return 'oklch(0.8 0.2 60)'
			case 'good': return 'oklch(0.7 0.2 120)'
			case 'strong': return 'var(--accent)'
			default: return 'var(--border)'
		}
	}

	const getStrengthWidth = (strength: string) => {
		switch (strength) {
			case 'weak': return '25%'
			case 'fair': return '50%'
			case 'good': return '75%'
			case 'strong': return '100%'
			default: return '0%'
		}
	}

	return (
		<div style={{ marginTop: '0.5rem' }}>
			<div style={{
				height: '4px',
				width: getStrengthWidth(strength),
				backgroundColor: getStrengthColor(strength),
				borderRadius: '9999px',
				transition: 'width 0.3s ease, background-color 0.3s ease',
				marginBottom: '0.25rem'
			}}></div>
			<p style={{
				fontSize: '0.75rem',
				color: 'var(--muted-foreground)',
				margin: 0
			}}>{getStrengthText(strength)}</p>
		</div>
	)
}
