import React from 'react'
import Card from '../atoms/Card'
import type { StatCardData } from '../../utils/types'

export default function StatCard({ title, value, subtitle, delayMs = 0 }: StatCardData): JSX.Element {
	return (
		<Card className="widget-load" style={{ animationDelay: `${delayMs}ms` }}>
			<h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
			<p style={{ fontSize: 36, fontWeight: 700, color: 'var(--primary)', lineHeight: 1, marginBottom: 8 }}>{value}</p>
			{subtitle ? <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 0 }}>{subtitle}</p> : null}
		</Card>
	)
}


