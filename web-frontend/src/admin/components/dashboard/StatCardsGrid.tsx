import React from 'react'
import { DashboardStats } from '../../types/dashboard'
import StatCard from '../common/StatCard'
import { Users, BookOpen, TrendingUp, DollarSign, Activity, Award, Calendar, CreditCard } from 'lucide-react'
import '../../styles/dashboard.css'

interface StatCardsGridProps {
	stats: DashboardStats
	loading?: boolean
}

const StatCardsGrid: React.FC<StatCardsGridProps> = ({ stats, loading = false }) => {
	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
		return num.toString()
	}

	const formatCurrency = (amount: number) => {
		return `${(amount / 1000000).toFixed(1)}M LEARN`
	}

	if (loading) {
		return (
			<div className="stat-cards-grid">
				{Array.from({ length: 8 }).map((_, index) => (
					<div key={index} className="stat-card-skeleton">
						<div className="skeleton-icon"></div>
						<div className="skeleton-content">
							<div className="skeleton-title"></div>
							<div className="skeleton-value"></div>
							<div className="skeleton-subtitle"></div>
						</div>
					</div>
				))}
			</div>
		)
	}

	return (
		<div className="stat-cards-grid">
			{/* Tổng người dùng */}
			<StatCard
				title="Tổng người dùng"
				value={formatNumber(stats.totalUsers)}
				subtitle={`${formatNumber(stats.activeUsers)} đang hoạt động`}
				icon={<Users size={24} />}
				gradient="primary"
				trend={{ value: stats.userGrowthRate, isPositive: stats.userGrowthRate > 0 }}
			/>

			{/* Tổng khóa học */}
			<StatCard
				title="Tổng khóa học"
				value={stats.totalCourses.toString()}
				subtitle={`${stats.publishedCourses} đã xuất bản`}
				icon={<BookOpen size={24} />}
				gradient="accent"
				trend={{ value: stats.courseGrowthRate, isPositive: stats.courseGrowthRate > 0 }}
			/>

			{/* Tổng đăng ký */}
			<StatCard
				title="Tổng đăng ký"
				value={formatNumber(stats.totalEnrollments)}
				subtitle={`${stats.todayEnrollments} hôm nay`}
				icon={<TrendingUp size={24} />}
				gradient="primary"
				trend={{ value: stats.enrollmentGrowthRate, isPositive: stats.enrollmentGrowthRate > 0 }}
			/>

			{/* Tổng doanh thu */}
			<StatCard
				title="Tổng doanh thu"
				value={formatCurrency(stats.totalRevenue)}
				subtitle={`${formatCurrency(stats.todayRevenue)} hôm nay`}
				icon={<DollarSign size={24} />}
				gradient="accent"
				trend={{ value: stats.revenueGrowthRate, isPositive: stats.revenueGrowthRate > 0 }}
			/>

			{/* Người dùng hoạt động */}
			<StatCard
				title="Người dùng hoạt động"
				value={formatNumber(stats.activeUsers)}
				subtitle={`${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% tổng số`}
				icon={<Activity size={24} />}
				gradient="primary"
				trend={{ value: stats.userGrowthRate, isPositive: stats.userGrowthRate > 0 }}
			/>

			{/* Khóa học xuất bản */}
			<StatCard
				title="Khóa học xuất bản"
				value={stats.publishedCourses.toString()}
				subtitle={`${((stats.publishedCourses / stats.totalCourses) * 100).toFixed(1)}% tổng số`}
				icon={<Award size={24} />}
				gradient="accent"
				trend={{ value: stats.courseGrowthRate, isPositive: stats.courseGrowthRate > 0 }}
			/>

			{/* Đăng ký hôm nay */}
			<StatCard
				title="Đăng ký hôm nay"
				value={stats.todayEnrollments.toString()}
				subtitle={`${((stats.todayEnrollments / stats.totalEnrollments) * 100).toFixed(2)}% tổng số`}
				icon={<Calendar size={24} />}
				gradient="primary"
				trend={{ value: stats.enrollmentGrowthRate, isPositive: stats.enrollmentGrowthRate > 0 }}
			/>

			{/* Doanh thu hôm nay */}
			<StatCard
				title="Doanh thu hôm nay"
				value={formatCurrency(stats.todayRevenue)}
				subtitle={`${((stats.todayRevenue / stats.totalRevenue) * 100).toFixed(2)}% tổng số`}
				icon={<CreditCard size={24} />}
				gradient="accent"
				trend={{ value: stats.revenueGrowthRate, isPositive: stats.revenueGrowthRate > 0 }}
			/>
		</div>
	)
}

export default StatCardsGrid
