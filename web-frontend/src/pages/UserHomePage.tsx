import React from 'react'
import WelcomeBanner from '../components/sections/WelcomeBanner'
import MockInterviews from '../components/sections/MockInterviews'
import PracticeSkills from '../components/sections/PracticeSkills'
import TokenWallet from '../components/atoms/TokenWallet'
import RecentExams from '../components/sections/RecentExams'
import CourseProgress from '../components/sections/CourseProgress'
import UpcomingExams from '../components/sections/UpcomingExams'
import Footer from '../components/layouts/Footer'

export default function UserHomePage(): JSX.Element {
	const handleStartInterview = (interviewId: string) => {
		console.log(`Start interview ${interviewId}`)
	}

	const handleUnlockInterview = (interviewId: string) => {
		console.log(`Unlock interview ${interviewId}`)
	}

	const handleSkillClick = (skillId: string) => {
		console.log(`Practice skill ${skillId}`)
	}

	const handleViewExam = (examId: string) => {
		console.log(`View exam ${examId}`)
	}

	const handleRetakeExam = (examId: string) => {
		console.log(`Retake exam ${examId}`)
	}

	const handleContinueCourse = (courseId: string) => {
		console.log(`Continue course ${courseId}`)
	}

	const handleViewCourse = (courseId: string) => {
		console.log(`View course ${courseId}`)
	}

	return (
		<div style={{
			background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
			minHeight: '100vh',
			position: 'relative'
		}}>
			{/* Background Pattern */}
			<div style={{
				content: '',
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 1000 1000\\"><defs><radialGradient id=\\"bg\\" cx=\\"50%\\" cy=\\"50%\\"><stop offset=\\"0%\\" stop-color=\\"%23334155\\" stop-opacity=\\"0.3\\"/><stop offset=\\"100%\\" stop-color=\\"%23334155\\" stop-opacity=\\"0\\"/></radialGradient></defs><circle cx=\\"200\\" cy=\\"200\\" r=\\"400\\" fill=\\"url(%23bg)\\"/><circle cx=\\"800\\" cy=\\"300\\" r=\\"300\\" fill=\\"url(%23bg)\\"/><circle cx=\\"400\\" cy=\\"800\\" r=\\"350\\" fill=\\"url(%23bg)\\"/></svg>")',
				opacity: 0.6,
				pointerEvents: 'none',
				zIndex: 1
			}} />
			
			<main style={{
				paddingTop: 'var(--space-24)',
				maxWidth: '1400px',
				margin: '0 auto',
				padding: 'var(--space-24) var(--space-6) 0',
				position: 'relative',
				zIndex: 2
			}}>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 'var(--space-8)'
				}}>
					{/* Welcome Banner */}
					<WelcomeBanner 
						userName="User" 
						level={5} 
						xp={2500}
						totalExams={12}
						certificates={3}
						streak={7}
					/>

					{/* Main Content - Flexbox Layout */}
					<div style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '16px',
						marginBottom: '32px'
					}}>
						{/* Row 1 - Mock Interviews và Token Wallet */}
						<div style={{
							display: 'flex',
							gap: '16px'
						}}>
							<div style={{
								flex: '2',
								minHeight: '280px'
							}}>
								{/* Mock Interviews */}
								<MockInterviews 
									onStartInterview={handleStartInterview}
									onUnlockInterview={handleUnlockInterview}
								/>
							</div>

							<div style={{
								flex: '1',
								minHeight: '280px'
							}}>
								{/* Token Wallet */}
								<TokenWallet />
							</div>
						</div>

						{/* Row 2 - Practice Skills Full Width */}
						<div style={{
							minHeight: '280px'
						}}>
							{/* Practice Skills */}
							<PracticeSkills 
								onSkillClick={handleSkillClick}
							/>
						</div>

						{/* Row 3 - Recent Exams, Course Progress, Upcoming Exams */}
						<div style={{
							display: 'flex',
							gap: '16px'
						}}>
							<div style={{
								flex: '1',
								minHeight: '280px'
							}}>
								{/* Recent Exams */}
								<RecentExams 
									onViewExam={handleViewExam}
									onRetakeExam={handleRetakeExam}
								/>
							</div>

							<div style={{
								flex: '1',
								minHeight: '280px'
							}}>
								{/* Course Progress */}
								<CourseProgress 
									onContinueCourse={handleContinueCourse}
									onViewCourse={handleViewCourse}
								/>
							</div>

							<div style={{
								flex: '1',
								minHeight: '280px'
							}}>
								{/* Upcoming Exams */}
								<UpcomingExams />
							</div>
						</div>

					</div>
				</div>
		</main>

		{/* Footer */}
		<Footer />
	</div>
)
}