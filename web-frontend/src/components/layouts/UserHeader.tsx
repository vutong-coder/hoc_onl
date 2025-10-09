import React, { useState, useEffect } from 'react'
import { LogOut, Menu, X, Bell, Search, MessageCircle, Moon, Grid3X3, ChevronDown, User, Trophy, Settings, Bookmark, Users, FileText, Shield } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logoutUser } from '../../store/slices/authSlice'
import Logo from '../atoms/Logo'

export default function UserHeader(): JSX.Element {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
	const [userMenuOpen, setUserMenuOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const { user } = useAppSelector((state) => state.auth)

	// Determine active navigation item based on current path
	const getActiveNavItem = () => {
		const path = location.pathname
		if (path.includes('/certify')) return 'certify'
		if (path.includes('/compete')) return 'compete'
		return 'prepare' // default to prepare
	}

	const handleLogout = () => {
		dispatch(logoutUser())
		navigate('/')
	}

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen)
	}

	const handleDropdownToggle = (dropdown: string) => {
		setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
	}

	const toggleUserMenu = () => {
		setUserMenuOpen(!userMenuOpen)
	}

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			// Handle search logic here
			console.log('Searching for:', searchQuery)
		}
	}

	// Close user menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (userMenuOpen) {
				const target = event.target as HTMLElement
				if (!target.closest('[data-user-menu]')) {
					setUserMenuOpen(false)
				}
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [userMenuOpen])

	return (
		<header
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				zIndex: 10,
				background: 'var(--background)',
				borderBottom: '1px solid var(--border)',
				boxShadow: 'var(--shadow-sm)',
				backdropFilter: 'blur(12px)',
				WebkitBackdropFilter: 'blur(12px)',
				transition: 'all var(--transition-normal)',
				width: '100%',
				boxSizing: 'border-box'
			}}
		>
			<div 
				style={{
					padding: '16px 24px',
					paddingRight: 'calc(24px + 1rem)',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					boxSizing: 'border-box',
					maxWidth: '100vw'
				}}
			>
				{/* Left Side - Logo */}
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Link to="/user" style={{ textDecoration: 'none' }}>
						<Logo text="EduPlatform" />
					</Link>
				</div>

				{/* Center - Navigation Menu */}
				<nav style={{ display: 'flex', alignItems: 'center', gap: '32px', fontSize: '14px', fontWeight: 600 }}>
					{/* Prepare */}
					<Link 
						to="/user/prepare" 
						style={{ 
							textDecoration: 'none',
							transition: 'all var(--transition-normal)',
							position: 'relative',
							paddingBottom: '4px',
							color: getActiveNavItem() === 'prepare' ? 'var(--foreground)' : 'var(--muted-foreground)'
						}}
					>
						Prepare
						{/* Green underline for active item */}
						{getActiveNavItem() === 'prepare' && (
							<div 
								style={{
									position: 'absolute',
									bottom: '-2px',
									left: 0,
									right: 0,
									height: '2px',
									background: '#00ff00',
									borderRadius: '1px'
								}}
							/>
						)}
					</Link>

					{/* Certify */}
					<Link 
						to="/user/certify" 
						style={{ 
							textDecoration: 'none',
							transition: 'all var(--transition-normal)',
							position: 'relative',
							paddingBottom: '4px',
							color: getActiveNavItem() === 'certify' ? 'var(--foreground)' : 'var(--muted-foreground)'
						}}
					>
						Certify
						{/* Green underline for active item */}
						{getActiveNavItem() === 'certify' && (
							<div 
								style={{
									position: 'absolute',
									bottom: '-2px',
									left: 0,
									right: 0,
									height: '2px',
									background: '#00ff00',
									borderRadius: '1px'
								}}
							/>
						)}
					</Link>

					{/* Compete */}
					<Link 
						to="/user/compete" 
						style={{ 
							textDecoration: 'none',
							transition: 'all var(--transition-normal)',
							position: 'relative',
							paddingBottom: '4px',
							color: getActiveNavItem() === 'compete' ? 'var(--foreground)' : 'var(--muted-foreground)'
						}}
					>
						Compete
						{/* Green underline for active item */}
						{getActiveNavItem() === 'compete' && (
							<div 
								style={{
									position: 'absolute',
									bottom: '-2px',
									left: 0,
									right: 0,
									height: '2px',
									background: '#00ff00',
									borderRadius: '1px'
								}}
							/>
						)}
					</Link>
				</nav>

				{/* Right Side - Search, Notifications and User Actions */}
				<div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 'none' }}>
					{/* Search Bar */}
					<div 
						style={{ 
							position: 'relative', 
							display: 'block',
							zIndex: 10,
							backgroundColor: 'transparent'
						}}
					>
						<Search 
							style={{
								position: 'absolute',
								left: '12px',
								top: '50%',
								transform: 'translateY(-50%)',
								width: '20px',
								height: '20px',
								color: '#6b7280',
								zIndex: 2
							}}
						/>
						<form onSubmit={handleSearch} style={{ display: 'block' }}>
							<input 
								type="text" 
								placeholder="Search challenges..." 
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								style={{
									width: '220px',
									height: '40px',
									background: '#f3f4f6',
									border: '1px solid #d1d5db',
									borderRadius: '8px',
									paddingLeft: '40px',
									paddingRight: '16px',
									fontSize: '14px',
									color: '#374151',
									transition: 'all 0.2s ease',
									display: 'block',
									zIndex: 1,
									position: 'relative'
								}}
								onFocus={(e) => {
									e.target.style.borderColor = '#3b82f6'
									e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)'
									e.target.style.outline = 'none'
								}}
								onBlur={(e) => {
									e.target.style.borderColor = '#d1d5db'
									e.target.style.boxShadow = 'none'
								}}
							/>
						</form>
					</div>

					{/* Notifications */}
					<div style={{ position: 'relative' }}>
						<button 
							aria-label="Notifications" 
							style={{
								width: '40px',
								height: '40px',
								background: 'var(--card)',
								border: '1px solid var(--border)',
								borderRadius: '50%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								color: 'var(--foreground)',
								transition: 'all var(--transition-normal)',
								position: 'relative',
								overflow: 'hidden',
								boxShadow: 'var(--shadow-sm)'
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
							onClick={() => handleDropdownToggle('notifications')}
						>
							<Bell style={{ width: '20px', height: '20px' }} />
							<span style={{ 
								position: 'absolute', 
								top: '6px', 
								right: '6px', 
								width: '8px', 
								height: '8px', 
								background: 'var(--destructive)', 
								borderRadius: '50%',
								border: '2px solid var(--background)'
							}} />
						</button>
					</div>

					{/* Right Side Icons */}
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						{/* Chat Icon */}
						<button 
							style={{
								width: '40px',
								height: '40px',
								background: 'var(--card)',
								border: '1px solid var(--border)',
								borderRadius: '50%',
								cursor: 'pointer',
								color: 'var(--foreground)',
								transition: 'all var(--transition-normal)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: 'var(--shadow-sm)'
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
						>
							<MessageCircle style={{ width: '20px', height: '20px' }} />
						</button>

						{/* Dark Mode Toggle */}
						<button 
							style={{
								width: '40px',
								height: '40px',
								background: 'var(--card)',
								border: '1px solid var(--border)',
								borderRadius: '50%',
								cursor: 'pointer',
								color: 'var(--foreground)',
								transition: 'all var(--transition-normal)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: 'var(--shadow-sm)'
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
						>
							<Moon style={{ width: '20px', height: '20px' }} />
						</button>

						{/* User Avatar with Dropdown */}
						{user && (
							<div style={{ position: 'relative' }} data-user-menu>
								<button 
									onClick={toggleUserMenu}
									style={{
										width: '40px',
										height: '40px',
										background: 'var(--card)',
										border: '1px solid var(--border)',
										borderRadius: '50%',
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: 'var(--foreground)',
										fontSize: '16px',
										fontWeight: 600,
										transition: 'all var(--transition-normal)',
										position: 'relative',
										boxShadow: 'var(--shadow-sm)'
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
								>
									{user.name ? user.name.charAt(0).toUpperCase() : 'U'}
									<ChevronDown 
										style={{ 
											width: '12px', 
											height: '12px', 
											position: 'absolute',
											bottom: '-2px',
											right: '-2px',
											background: 'var(--background)',
											borderRadius: '50%',
											padding: '2px'
										}} 
									/>
								</button>

								{/* User Dropdown Menu */}
								{userMenuOpen && (
									<div style={{
										position: 'absolute',
										top: '100%',
										right: 0,
										marginTop: '8px',
										background: 'white',
										borderRadius: '8px',
										boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
										border: '1px solid #e5e7eb',
										minWidth: '200px',
										zIndex: 1000,
										overflow: 'hidden'
									}}>
										{/* Menu Items */}
										<div style={{ padding: '8px 0' }}>
											{[
												{ icon: <User style={{ width: '16px', height: '16px' }} />, label: 'Profile' },
												{ icon: <Trophy style={{ width: '16px', height: '16px' }} />, label: 'Leaderboard' },
												{ icon: <Settings style={{ width: '16px', height: '16px' }} />, label: 'Settings' },
												{ icon: <Bookmark style={{ width: '16px', height: '16px' }} />, label: 'Bookmarks' },
												{ icon: <Users style={{ width: '16px', height: '16px' }} />, label: 'Network' },
												{ icon: <FileText style={{ width: '16px', height: '16px' }} />, label: 'Submissions' },
												{ icon: <Shield style={{ width: '16px', height: '16px' }} />, label: 'Administration' },
												{ icon: <LogOut style={{ width: '16px', height: '16px' }} />, label: 'Logout', onClick: handleLogout }
											].map((item, index) => (
												<button
													key={index}
													onClick={item.onClick || (() => console.log(`Clicked ${item.label}`))}
													style={{
														width: '100%',
														padding: '12px 16px',
														background: 'transparent',
														border: 'none',
														cursor: 'pointer',
														display: 'flex',
														alignItems: 'center',
														gap: '12px',
														color: '#6b7280',
														fontSize: '14px',
														fontWeight: 400,
														transition: 'all var(--transition-normal)',
														textAlign: 'left'
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.background = '#f3f4f6'
														e.currentTarget.style.color = '#374151'
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.background = 'transparent'
														e.currentTarget.style.color = '#6b7280'
													}}
												>
													{item.icon}
													{item.label}
												</button>
											))}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	)
}