import React from 'react'
import Card from '../common/Card'
import { KPIMetric } from '../../types/analytics'
import { 
	TrendingUp, 
	TrendingDown, 
	Minus,
	DollarSign,
	Users,
	CheckCircle,
	BookOpen,
	Award,
	Star
} from 'lucide-react'

interface KpiGridProps {
	kpis: KPIMetric[]
	onKpiClick?: (kpi: KPIMetric) => void
}

const getIcon = (iconName: string) => {
	const iconMap = {
		DollarSign,
		Users,
		CheckCircle,
		BookOpen,
		Award,
		Star
	}
	return iconMap[iconName as keyof typeof iconMap] || Users
}

const getTrendIcon = (changeType: 'increase' | 'decrease' | 'stable') => {
	switch (changeType) {
		case 'increase':
			return <TrendingUp className="w-4 h-4 text-success" />
		case 'decrease':
			return <TrendingDown className="w-4 h-4 text-danger" />
		default:
			return <Minus className="w-4 h-4 text-muted" />
	}
}

const formatValue = (value: number, unit: string) => {
	if (unit === 'VND') {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value)
	}
	
	if (unit === '%') {
		return `${value.toFixed(1)}%`
	}
	
	if (unit === 'sao') {
		return `${value.toFixed(1)} ⭐`
	}
	
	return new Intl.NumberFormat('vi-VN').format(value)
}

export const KpiGrid: React.FC<KpiGridProps> = ({ kpis, onKpiClick }) => {
	return (
		<div className="kpi-grid">
			{kpis.map((kpi) => {
				const IconComponent = getIcon(kpi.icon)
				
				return (
					<Card 
						key={kpi.id} 
						className="kpi-card"
						onClick={() => onKpiClick?.(kpi)}
					>
						<div className="kpi-header">
							<div className="kpi-icon" style={{ color: kpi.color }}>
								<IconComponent className="w-6 h-6" />
							</div>
							<div className="kpi-trend">
								{getTrendIcon(kpi.changeType)}
								<span className={`kpi-change kpi-change-${kpi.changeType}`}>
									{Math.abs(kpi.change).toFixed(1)}%
								</span>
							</div>
						</div>
						
						<div className="kpi-content">
							<div className="kpi-value">
								{formatValue(kpi.value, kpi.unit)}
							</div>
							<div className="kpi-name">{kpi.name}</div>
							<div className="kpi-period">{kpi.period}</div>
						</div>
						
						{kpi.description && (
							<div className="kpi-description">
								{kpi.description}
							</div>
						)}
						
						{kpi.threshold && (
							<div className="kpi-threshold">
								<div className="threshold-bar">
									<div 
										className="threshold-fill"
										style={{ 
											width: `${Math.min(100, (kpi.value / kpi.threshold.critical) * 100)}%`,
											backgroundColor: kpi.value >= kpi.threshold.warning 
												? 'var(--success)' 
												: kpi.value >= kpi.threshold.critical 
													? 'var(--warning)' 
													: 'var(--danger)'
										}}
									/>
								</div>
								<div className="threshold-labels">
									<span>Thấp: {formatValue(kpi.threshold.critical, kpi.unit)}</span>
									<span>Cao: {formatValue(kpi.threshold.warning, kpi.unit)}</span>
								</div>
							</div>
						)}
					</Card>
				)
			})}
		</div>
	)
}
