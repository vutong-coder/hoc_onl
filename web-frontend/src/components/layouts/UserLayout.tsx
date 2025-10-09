import React from 'react'
import { Outlet } from 'react-router-dom'
import UserHeader from './UserHeader'
import ThemeToggle from '../atoms/ThemeToggle'

export default function UserLayout(): JSX.Element {
	return (
		<div style={{ 
			display: 'flex', 
			flexDirection: 'column', 
			minHeight: '100vh',
			background: 'var(--background)',
			color: 'var(--foreground)',
			fontFamily: 'var(--font-sans)'
		}}>
			<ThemeToggle />
			<UserHeader />
			<main style={{ flex: 1 }}>
				<Outlet />
			</main>
		</div>
	)
}
