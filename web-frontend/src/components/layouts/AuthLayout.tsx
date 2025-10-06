import React, { useState } from 'react'
import LoginPage from '../../pages/LoginPage'
import RegisterPage from '../../pages/RegisterPage'
import ForgotPasswordPage from '../../pages/ForgotPasswordPage'
import ThemeToggle from '../atoms/ThemeToggle'

export type AuthPageType = 'login' | 'register' | 'forgot'

export default function AuthLayout(): JSX.Element {
	const [currentPage, setCurrentPage] = useState<AuthPageType>('login')

	const showPage = (pageId: AuthPageType) => {
		setCurrentPage(pageId)
	}

	return (
		<div style={{
			minHeight: '100vh',
			width: '100vw',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			background: 'var(--background)',
			color: 'var(--foreground)',
			fontFamily: 'var(--font-sans)',
			padding: '2rem',
			boxSizing: 'border-box'
		}}>
			<ThemeToggle />
			<div style={{
				width: '100%',
				maxWidth: '24rem',
				minWidth: '18rem',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center'
			}}>
				{currentPage === 'login' && (
					<div style={{
						width: '100%',
						animation: 'fadeInUp 0.3s ease-out forwards'
					}}>
						<LoginPage onNavigate={showPage} />
					</div>
				)}
				{currentPage === 'register' && (
					<div style={{
						width: '100%',
						animation: 'fadeInUp 0.3s ease-out forwards'
					}}>
						<RegisterPage onNavigate={showPage} />
					</div>
				)}
				{currentPage === 'forgot' && (
					<div style={{
						width: '100%',
						animation: 'fadeInUp 0.3s ease-out forwards'
					}}>
						<ForgotPasswordPage onNavigate={showPage} />
					</div>
				)}
			</div>
		</div>
	)
}
