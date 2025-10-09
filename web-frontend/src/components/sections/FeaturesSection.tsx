import React from 'react'
import { Code, Users, Award, Shield, Zap, Target } from 'lucide-react'

interface Feature {
	icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
	title: string
	description: string
}

interface FeaturesSectionProps {
	features?: Feature[]
}

export default function FeaturesSection({ 
	features = [
		{
			icon: Code,
			title: 'Practice Coding',
			description: 'Master programming skills with thousands of challenges across multiple languages and difficulty levels.'
		},
		{
			icon: Users,
			title: 'Join Community',
			description: 'Connect with millions of developers worldwide, share solutions, and learn from each other.'
		},
		{
			icon: Award,
			title: 'Earn Certifications',
			description: 'Validate your skills with industry-recognized certifications that boost your career prospects.'
		},
		{
			icon: Shield,
			title: 'Secure Platform',
			description: 'Practice in a secure environment with plagiarism detection and fair assessment tools.'
		},
		{
			icon: Zap,
			title: 'Real-time Feedback',
			description: 'Get instant feedback on your code with detailed explanations and optimization suggestions.'
		},
		{
			icon: Target,
			title: 'Career Preparation',
			description: 'Prepare for technical interviews with mock tests and real-world problem-solving scenarios.'
		}
	]
}: FeaturesSectionProps): JSX.Element {
	return (
		<section style={{ padding: '80px 0', background: 'var(--background)' }}>
			<div className="container mx-auto px-6" style={{
				maxWidth: '1200px',
				margin: '0 auto',
				padding: '0 24px'
			}}>
				<div className="text-center mb-16" style={{ textAlign: 'center', marginBottom: '64px' }}>
					<h2 style={{
						fontSize: '2.5rem',
						fontWeight: 700,
						marginBottom: '16px',
						fontFamily: 'var(--font-display)'
					}}>
						Why Choose EduPlatform?
					</h2>
					<p style={{
						fontSize: '1.125rem',
						color: 'var(--muted-foreground)',
						maxWidth: '600px',
						margin: '0 auto',
						lineHeight: 1.6
					}}>
						Everything you need to become a better developer and advance your career
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
					gap: '32px'
				}}>
					{features.map((feature, index) => (
						<div 
							key={index}
							className="card hover-lift interactive"
							style={{
								background: 'var(--gradient-card)',
								border: '1px solid var(--glass-border)',
								borderRadius: 'var(--radius-lg)',
								padding: '32px',
								backdropFilter: 'blur(10px)',
								WebkitBackdropFilter: 'blur(10px)',
								transition: 'all var(--transition-normal)',
								position: 'relative',
								overflow: 'hidden'
							}}
						>
							<div style={{
								width: '60px',
								height: '60px',
								background: 'var(--gradient-primary)',
								borderRadius: 'var(--radius-lg)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								marginBottom: '24px',
								boxShadow: 'var(--shadow-md)'
							}}>
								<feature.icon 
									className="w-8 h-8 text-[var(--primary-foreground)]"
									style={{ width: '32px', height: '32px', color: 'var(--primary-foreground)' }}
								/>
							</div>
							<h3 style={{
								fontSize: '1.25rem',
								fontWeight: 600,
								marginBottom: '12px',
								fontFamily: 'var(--font-display)'
							}}>
								{feature.title}
							</h3>
							<p style={{
								color: 'var(--muted-foreground)',
								lineHeight: 1.6,
								margin: 0
							}}>
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
