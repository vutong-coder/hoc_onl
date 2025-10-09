import React from 'react'
import { Star } from 'lucide-react'

interface Testimonial {
	name: string
	role: string
	company: string
	content: string
	rating: number
}

interface TestimonialsSectionProps {
	testimonials?: Testimonial[]
}

export default function TestimonialsSection({ 
	testimonials = [
		{
			name: 'Sarah Chen',
			role: 'Software Engineer',
			company: 'Google',
			content: 'EduPlatform helped me land my dream job at Google. The practice problems and mock interviews were invaluable.',
			rating: 5
		},
		{
			name: 'Michael Rodriguez',
			role: 'Full Stack Developer',
			company: 'Microsoft',
			content: 'The community support and detailed explanations made learning complex algorithms much easier.',
			rating: 5
		},
		{
			name: 'Emily Johnson',
			role: 'Data Scientist',
			company: 'Amazon',
			content: 'The certification program gave me the confidence to apply for senior positions. Highly recommended!',
			rating: 5
		}
	]
}: TestimonialsSectionProps): JSX.Element {
	return (
		<section style={{ 
			padding: '80px 0', 
			background: 'var(--gradient-background)',
			position: 'relative'
		}}>
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
						Loved by Developers Worldwide
					</h2>
					<p style={{
						fontSize: '1.125rem',
						color: 'var(--muted-foreground)',
						maxWidth: '600px',
						margin: '0 auto',
						lineHeight: 1.6
					}}>
						See what our community members have to say about their success stories
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
					gap: '32px'
				}}>
					{testimonials.map((testimonial, index) => (
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
							<div className="flex items-center mb-4" style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: '16px'
							}}>
								{Array.from({ length: testimonial.rating }).map((_, i) => (
									<Star 
										key={i}
										className="w-5 h-5 text-[var(--accent)] fill-current"
										style={{ 
											width: '20px', 
											height: '20px', 
											color: 'var(--accent)',
											marginRight: '4px'
										}} 
									/>
								))}
							</div>
							<p style={{
								fontSize: '1rem',
								lineHeight: 1.6,
								marginBottom: '24px',
								fontStyle: 'italic'
							}}>
								"{testimonial.content}"
							</p>
							<div>
								<div style={{
									fontWeight: 600,
									marginBottom: '4px',
									fontFamily: 'var(--font-display)'
								}}>
									{testimonial.name}
								</div>
								<div style={{
									fontSize: '0.875rem',
									color: 'var(--muted-foreground)'
								}}>
									{testimonial.role} at {testimonial.company}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
