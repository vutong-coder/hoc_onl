import React from 'react'
import { GraduationCap, Bell, Settings } from 'lucide-react'

export default function Header(): JSX.Element {
	return (
		<header
			style={{
				position: 'sticky',
				top: 0,
				zIndex: 10,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				padding: '16px 24px',
				background: 'var(--card)',
				borderBottom: '1px solid var(--border)',
				boxShadow: 'var(--shadow-sm)'
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<GraduationCap className="w-8 h-8" color="oklch(0.6 0.15 160)" />
				<h1 style={{ fontSize: 20, fontWeight: 600, marginLeft: 8 }}>EduPlatform</h1>
			</div>
			<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
				<div style={{ position: 'relative' }}>
					<button aria-label="Notifications" className="icon-btn" style={{ color: 'var(--muted-foreground)' }}>
						<Bell className="w-5 h-5" />
					</button>
					<span style={{ position: 'absolute', top: 4, right: 6, width: 8, height: 8, background: 'var(--destructive)', borderRadius: 9999 }} />
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<img src="https://placehold.co/40x40" alt="Profile" style={{ width: 40, height: 40, borderRadius: 9999, border: '1px solid var(--border)' }} />
					<div>
						<p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>Admin User</p>
						<p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: 0 }}>Administrator</p>
					</div>
				</div>
				<button aria-label="Settings" className="icon-btn" style={{ color: 'var(--muted-foreground)' }}>
					<Settings className="w-5 h-5" />
				</button>
			</div>
		</header>
	)
}


