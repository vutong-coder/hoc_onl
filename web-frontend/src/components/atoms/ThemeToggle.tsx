import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle(): JSX.Element {
	const { theme, toggleTheme } = useTheme()

	return (
		<button
			onClick={toggleTheme}
			style={{
				position: 'fixed',
				top: '1rem',
				right: '1rem',
				zIndex: 1000,
				width: '48px',
				height: '48px',
				background: 'var(--card)',
				border: '1px solid var(--border)',
				borderRadius: '50%',
				cursor: 'pointer',
				color: 'var(--foreground)',
				transition: 'all var(--transition-normal)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: 'var(--shadow-lg)',
				backdropFilter: 'blur(10px)',
				WebkitBackdropFilter: 'blur(10px)'
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.background = 'var(--accent)'
				e.currentTarget.style.color = 'var(--accent-foreground)'
				e.currentTarget.style.transform = 'scale(1.05)'
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.background = 'var(--card)'
				e.currentTarget.style.color = 'var(--foreground)'
				e.currentTarget.style.transform = 'scale(1)'
			}}
			title={`Chuyển sang chế độ ${theme === 'light' ? 'tối' : 'sáng'}`}
		>
			{theme === 'dark' ? (
				<Sun style={{ width: '20px', height: '20px' }} />
			) : (
				<Moon style={{ width: '20px', height: '20px' }} />
			)}
		</button>
	)
}
