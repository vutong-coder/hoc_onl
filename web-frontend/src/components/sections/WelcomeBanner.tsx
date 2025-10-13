import React from 'react'
import { Star, TrendingUp, Award, Calendar } from 'lucide-react'
import StatCard from '../atoms/StatCard'
import DailyStreakCard from '../atoms/DailyStreakCard'

interface WelcomeBannerProps {
	userName?: string
	level?: number
	xp?: number
	totalExams?: number
	certificates?: number
	streak?: number
}

export default function WelcomeBanner({ 
	userName = 'User', 
	level = 5, 
	xp = 2500,
	totalExams = 12,
	certificates = 3,
	streak = 7
}: WelcomeBannerProps): JSX.Element {
	return (
		<div style={{
			background: 'var(--gradient-card)',
			borderRadius: '20px',
			padding: '32px',
			border: '1px solid var(--border)',
			boxShadow: 'var(--shadow-md)',
			marginBottom: '24px',
			position: 'relative',
			overflow: 'hidden',
			transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
		}}>
			{/* Background Pattern */}
			<div style={{
				position: 'absolute',
				top: 0,
				right: 0,
				width: '200px',
				height: '200px',
				background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
				borderRadius: '50%',
				transform: 'translate(50%, -50%)',
				zIndex: 0
			}} />

			{/* Main Content */}
			<div style={{ position: 'relative', zIndex: 1 }}>
				{/* Header Section */}
				<div style={{ 
					marginBottom: '32px',
					textAlign: 'center'
				}}>
					<h1 style={{ 
						fontSize: '36px', 
						fontWeight: 800, 
						marginBottom: '12px', 
						margin: 0, 
						color: 'var(--foreground)',
						background: 'linear-gradient(135deg, var(--foreground) 0%, var(--accent) 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text'
					}}>
						Chào mừng trở lại, {userName}! 👋
					</h1>
					<p style={{ 
						fontSize: '18px', 
						color: 'var(--muted-foreground)', 
						margin: 0,
						fontWeight: 500
					}}>
						Sẵn sàng tiếp tục hành trình học tập của bạn chưa?
					</p>
				</div>

				{/* Stats Grid - Two Column Layout */}
				<div style={{
					display: 'grid',
					gridTemplateColumns: '2fr 1fr',
					gap: '32px',
					marginBottom: '32px',
					alignItems: 'start'
				}}>
					{/* Left Column - Stats */}
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, 1fr)',
						gap: '20px'
					}}>
						<StatCard 
							title="Cấp độ" 
							value={level} 
							icon={<Star style={{ width: '28px', height: '28px' }} />} 
							gradient="primary" 
						/>
						<StatCard 
							title="Tổng XP" 
							value={xp.toLocaleString()} 
							icon={<TrendingUp style={{ width: '28px', height: '28px' }} />} 
							gradient="accent" 
						/>
						<StatCard 
							title="Bài thi đã làm" 
							value={totalExams} 
							icon={<Calendar style={{ width: '28px', height: '28px' }} />} 
							gradient="primary" 
						/>
						<StatCard 
							title="Chứng chỉ" 
							value={certificates} 
							icon={<Award style={{ width: '28px', height: '28px' }} />} 
							gradient="accent" 
						/>
					</div>

					{/* Right Column - Daily Streak */}
					<div style={{
						background: 'var(--background)',
						borderRadius: 'var(--radius-lg)',
						padding: '24px',
						border: '1px solid var(--border)',
						boxShadow: 'var(--shadow-sm)',
						height: 'fit-content'
					}}>
						<DailyStreakCard 
							currentStreak={streak}
							weeklyProgress={[true, true, true, true, true, true, true]}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}