import React from 'react'
import StatCard from '../components/atoms/StatCard'
import ProgressCard from '../components/atoms/ProgressCard'

export default function DashboardPage(): JSX.Element {
	return (
		<div style={{ padding: '24px' }}>
			<h2 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 24px' }}>Dashboard Overview</h2>
			<div className="dashboard-grid">
				<StatCard title="Quick Stats" value="1,234" subtitle="Active Users" />
				<StatCard title="Recent Exams" value="5" subtitle="Scheduled this week" />
				<StatCard title="Token Balance" value="10,500" subtitle="Total Tokens Distributed" />

				<ProgressCard title="Course Progress" percent={65} delayMs={300} />

				<section className="widget-load hover-effect" style={{ animationDelay: '400ms', background: 'var(--card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 24 }}>
					<h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Upload Document</h3>
					<p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 16 }}>Securely upload academic materials</p>
					<button className="button-primary button-click">Upload Now</button>
				</section>

				<section className="widget-load hover-effect" style={{ animationDelay: '500ms', background: 'var(--card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 24 }}>
					<h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Analytics</h3>
					<p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 16 }}>View detailed reports and insights</p>
					<button className="button-primary button-click">View Reports</button>
				</section>
			</div>
		</div>
	)
}


