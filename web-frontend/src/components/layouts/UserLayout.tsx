import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import UserHeader from './UserHeader'
import ChatBox from '../molecules/ChatBox'

export default function UserLayout(): JSX.Element {
	const [isChatOpen, setIsChatOpen] = useState(false)

	const handleChatToggle = () => {
		setIsChatOpen(!isChatOpen)
	}

	const handleChatClose = () => {
		setIsChatOpen(false)
	}

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100vh',
			background: 'var(--background)',
			color: 'var(--foreground)',
			fontFamily: 'var(--font-sans)'
		}}>
			<UserHeader />
			<main style={{ flex: 1, paddingTop: '80px' }}>
				<Outlet />
			</main>
			
			{/* Chat Box - Fixed position in bottom right */}
			<ChatBox 
				isOpen={isChatOpen}
				onToggle={handleChatToggle}
				onClose={handleChatClose}
			/>
		</div>
	)
}
