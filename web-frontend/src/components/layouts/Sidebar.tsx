import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, Monitor, Video, Lock, Award, BookOpen, Building, Server, BarChart, Copyright } from 'lucide-react'

type Item = { icon: React.ReactNode; label: string; path: string }

const items: Item[] = [
	{ icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
	{ icon: <Users className="w-5 h-5" />, label: 'User Management', path: '/users' },
	{ icon: <FileText className="w-5 h-5" />, label: 'Exam Management', path: '/exams' },
	{ icon: <Monitor className="w-5 h-5" />, label: 'Online Exam', path: '/exam' },
	{ icon: <Video className="w-5 h-5" />, label: 'Proctoring & Anti-cheating', path: '/proctoring' },
	{ icon: <Lock className="w-5 h-5" />, label: 'Security & Blockchain', path: '/security' },
	{ icon: <Award className="w-5 h-5" />, label: 'Token Reward System', path: '/reward' },
	{ icon: <BookOpen className="w-5 h-5" />, label: 'Course Management', path: '/courses' },
	{ icon: <Building className="w-5 h-5" />, label: 'Organization Management', path: '/organizations' },
	{ icon: <Server className="w-5 h-5" />, label: 'System Admin', path: '/admin' },
	{ icon: <BarChart className="w-5 h-5" />, label: 'Analytics & Reports', path: '/analytics' },
	{ icon: <Copyright className="w-5 h-5" />, label: 'Document Copyright', path: '/copyright' },
]

export default function Sidebar(): JSX.Element {
	const location = useLocation()
	
	return (
		<aside className="sidebar-slide-in" style={{ 
			background: 'var(--sidebar)', 
			borderRight: '1px solid var(--sidebar-border)', 
			width: 260, 
			overflowY: 'auto',
			minHeight: '100vh',
			position: 'sticky',
			top: 0
		}}>
			<nav style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 24, paddingBottom: 24 }}>
				{items.map((item) => {
					const isActive = location.pathname === item.path
					return (
						<Link 
							key={item.label} 
							to={item.path} 
							className="menu-item-select hover-lift interactive" 
							style={{ 
								display: 'flex', 
								alignItems: 'center', 
								padding: '12px 16px', 
								borderRadius: 'var(--radius-md)', 
								color: isActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)', 
								background: isActive ? 'var(--sidebar-accent)' : 'transparent', 
								marginBottom: 4,
								textDecoration: 'none',
								fontSize: 15,
								fontWeight: isActive ? 500 : 400,
								transition: 'all var(--transition-normal)',
								position: 'relative',
								overflow: 'hidden'
							}}
							onMouseEnter={(e) => {
								if (!isActive) {
									e.currentTarget.style.background = 'var(--sidebar-hover)'
									e.currentTarget.style.color = 'var(--sidebar-hover-foreground)'
									e.currentTarget.style.transform = 'translateX(4px)'
								}
							}}
							onMouseLeave={(e) => {
								if (!isActive) {
									e.currentTarget.style.background = 'transparent'
									e.currentTarget.style.color = 'var(--sidebar-foreground)'
									e.currentTarget.style.transform = 'translateX(0)'
								}
							}}
						>
							<span style={{ marginRight: 12 }}>{item.icon}</span>
							<span>{item.label}</span>
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}
