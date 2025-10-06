import React, { useState, useEffect } from 'react'

export default function ThemeToggle(): JSX.Element {
	const [isVisible, setIsVisible] = useState(true)
	const [isFadingOut, setIsFadingOut] = useState(false)
	const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')

	// Detect current theme
	const detectTheme = () => {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}

	// Show notification for 5 seconds
	const showNotification = () => {
		setIsVisible(true)
		setIsFadingOut(false)
		setCurrentTheme(detectTheme())
		
		// Start fade out after 4.5 seconds
		setTimeout(() => {
			setIsFadingOut(true)
		}, 4500)
		
		// Hide after 5 seconds
		setTimeout(() => {
			setIsVisible(false)
		}, 5000)
	}

	// Listen for theme changes
	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		
		// Show notification on page load
		showNotification()
		
		// Listen for theme changes
		const handleThemeChange = () => {
			showNotification()
		}
		
		mediaQuery.addEventListener('change', handleThemeChange)
		
		// Cleanup
		return () => {
			mediaQuery.removeEventListener('change', handleThemeChange)
		}
	}, [])

	if (!isVisible) return <></>

	return (
		<div style={{
			position: 'fixed',
			top: '1rem',
			right: '1rem',
			zIndex: 1000,
			background: 'var(--card)',
			border: '1px solid var(--border)',
			borderRadius: 'var(--radius-md)',
			padding: '0.75rem 1rem',
			boxShadow: 'var(--shadow-lg)',
			animation: isFadingOut ? 'fadeOut 0.5s ease-out forwards' : 'fadeInUp 0.3s ease-out forwards'
		}}>
			<div style={{
				fontSize: '0.75rem',
				color: 'var(--muted-foreground)',
				marginBottom: '0.25rem',
				textAlign: 'center'
			}}>
				Theme Mode
			</div>
			<div style={{
				fontSize: '0.875rem',
				color: 'var(--foreground)',
				fontWeight: '500',
				textAlign: 'center',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '0.5rem'
			}}>
				<span>{currentTheme === 'dark' ? '🌙' : '☀️'}</span>
				<span style={{ textTransform: 'capitalize' }}>{currentTheme}</span>
			</div>
			<div style={{
				fontSize: '0.75rem',
				color: 'var(--muted-foreground)',
				marginTop: '0.25rem',
				textAlign: 'center'
			}}>
				Auto-detected
			</div>
		</div>
	)
}
