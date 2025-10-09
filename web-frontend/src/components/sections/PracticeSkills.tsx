import React from 'react'
import { 
	TreePine, 
	Snowflake, 
	SquareDot, 
	Brain, 
	Code, 
	Coffee, 
	Zap,
	Database,
	Globe,
	Shield,
	Target
} from 'lucide-react'
import Badge from '../atoms/Badge'
import SkillCard from '../atoms/SkillCard'

interface Skill {
	id: string
	title: string
	icon: React.ReactNode
	category: 'algorithm' | 'language' | 'framework' | 'tool'
	progress?: number
	isCompleted?: boolean
}

interface PracticeSkillsProps {
	skills?: Skill[]
	onSkillClick?: (skillId: string) => void
}

export default function PracticeSkills({ 
	skills = [
		// Algorithms & Data Structures
		{ id: '1', title: 'Algorithms', icon: <TreePine className="w-5 h-5" style={{ width: '20px', height: '20px' }} />, category: 'algorithm', progress: 75 },
		{ id: '2', title: 'Data Structures', icon: <Snowflake className="w-5 h-5" style={{ width: '20px', height: '20px' }} />, category: 'algorithm', progress: 60 },
		{ id: '3', title: 'Mathematics', icon: <SquareDot className="w-5 h-5" style={{ width: '20px', height: '20px' }} />, category: 'algorithm', progress: 45 },
		{ id: '4', title: 'Artificial Intelligence', icon: <Brain className="w-5 h-5" style={{ width: '20px', height: '20px' }} />, category: 'algorithm', progress: 30 },
		
		// Programming Languages
		{ id: '5', title: 'C', icon: <Code className="w-5 h-5" style={{ width: '20px', height: '20px' }} />, category: 'language', progress: 80 },
		{ id: '6', title: 'C++', icon: <Code className="w-5 h-5" style={{ width: '20px', height: '20px' }} />, category: 'language', progress: 70 },
		{ id: '7', title: 'Java', icon: <Coffee className="w-5 h-5" style={{ width: '20px', height: '20px' }} />, category: 'language', progress: 85 },
		{ id: '8', title: 'Python', icon: <Zap className="w-5 h-5" style={{ width: '20px', height: '20px' }} />, category: 'language', progress: 90 },
		
		// Frameworks & Tools
		{ id: '9', title: 'Database', icon: <Database className="w-5 h-5" style={{ width: '20px', height: '20px' }} />, category: 'tool', progress: 65 },
		{ id: '10', title: 'Web Development', icon: <Globe className="w-5 h-5" style={{ width: '20px', height: '20px' }} />, category: 'framework', progress: 55 },
		{ id: '11', title: 'Security', icon: <Shield className="w-5 h-5" style={{ width: '20px', height: '20px' }} />, category: 'tool', progress: 40 },
		{ id: '12', title: 'System Design', icon: <Target className="w-5 h-5" style={{ width: '20px', height: '20px' }} />, category: 'algorithm', progress: 25 }
	],
	onSkillClick
}: PracticeSkillsProps): JSX.Element {
	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'algorithm':
				return '#3b82f6'
			case 'language':
				return '#10b981'
			case 'framework':
				return '#f59e0b'
			case 'tool':
				return '#8b5cf6'
			default:
				return 'var(--muted-foreground)'
		}
	}

	const getProgressColor = (progress: number) => {
		if (progress >= 80) return '#10b981'
		if (progress >= 60) return '#3b82f6'
		if (progress >= 40) return '#f59e0b'
		return '#ef4444'
	}

	return (
		<div className="card stagger-load hover-lift interactive" style={{ animationDelay: '200ms', padding: '16px' }}>
			{/* Header */}
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<h2 style={{ fontSize: '24px', fontWeight: 700, marginRight: '8px' }}>
						Practice Skills
					</h2>
					<Badge variant="accent">
						Free
					</Badge>
				</div>
				<button style={{ 
					color: 'var(--foreground)', 
					background: 'none', 
					border: 'none', 
					cursor: 'pointer',
					transition: 'color var(--transition-normal)'
				}}>
					View All
				</button>
			</div>

			{/* Skills Grid */}
			<div style={{ 
				display: 'grid', 
				gridTemplateColumns: 'repeat(4, 1fr)', 
				gap: '12px' 
			}}>
				{skills.map((skill) => (
					<SkillCard
						key={skill.id}
						skill={skill}
						onSkillClick={onSkillClick}
					/>
				))}
			</div>

			{/* Load More Button */}
			<div style={{ textAlign: 'center', marginTop: '20px' }}>
				<button style={{ 
					padding: '8px 24px', 
					border: '1px solid var(--border)', 
					color: 'var(--foreground)', 
					borderRadius: 'var(--radius-md)', 
					background: 'none', 
					cursor: 'pointer',
					transition: 'all var(--transition-normal)'
				}}>
					Load More Skills
				</button>
			</div>
		</div>
	)
}
