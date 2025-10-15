import React from 'react'
import StatCard from '../components/common/StatCard'
import ProgressCard from '../components/common/ProgressCard'

export default function DashboardPage(): JSX.Element {
	return (
		<div style={{ padding: '24px' }}>
			<h2 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 24px' }}>Tổng quan Dashboard</h2>
			<div className="dashboard-grid">
				<StatCard title="Thống kê nhanh" value="1,234" subtitle="Người dùng hoạt động" />
				<StatCard title="Bài kiểm tra gần đây" value="5" subtitle="Đã lên lịch tuần này" />
				<StatCard title="Số dư Token" value="10,500" subtitle="Tổng Token đã phân phối" />

				<ProgressCard title="Tiến độ khóa học" percent={65} delayMs={300} />

				<section className="widget-load hover-effect" style={{ animationDelay: '400ms', background: 'var(--card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 24 }}>
					<h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Tải tài liệu lên</h3>
					<p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 16 }}>Tải lên tài liệu học tập một cách an toàn</p>
					<button className="button-primary button-click">Tải lên ngay</button>
				</section>

				<section className="widget-load hover-effect" style={{ animationDelay: '500ms', background: 'var(--card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 24 }}>
					<h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Phân tích</h3>
					<p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 16 }}>Xem báo cáo và thông tin chi tiết</p>
					<button className="button-primary button-click">Xem báo cáo</button>
				</section>
			</div>
		</div>
	)
}


