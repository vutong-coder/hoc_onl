import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../components/layouts/DashboardLayout'
import AuthLayout from '../components/layouts/AuthLayout'
import DashboardPage from '../pages/DashboardPage'
import ExamPage from '../pages/ExamPage'
import MonitorPage from '../pages/MonitorPage'
import RewardPage from '../pages/RewardPage'

// Tạo các trang placeholder cho các chức năng khác
const UsersPage = () => <div><h2>User Management</h2><p>Quản lý người dùng</p></div>
const ExamsPage = () => <div><h2>Exam Management</h2><p>Quản lý bài thi</p></div>
const ProctoringPage = () => <div><h2>Proctoring & Anti-cheating</h2><p>Giám sát và chống gian lận</p></div>
const SecurityPage = () => <div><h2>Security & Blockchain</h2><p>Bảo mật và blockchain</p></div>
const CoursesPage = () => <div><h2>Course Management</h2><p>Quản lý khóa học</p></div>
const OrganizationsPage = () => <div><h2>Organization Management</h2><p>Quản lý tổ chức</p></div>
const AdminPage = () => <div><h2>System Admin</h2><p>Quản trị hệ thống</p></div>
const AnalyticsPage = () => <div><h2>Analytics & Reports</h2><p>Phân tích và báo cáo</p></div>
const CopyrightPage = () => <div><h2>Document Copyright</h2><p>Bản quyền tài liệu</p></div>

export default function AppRoutes(): JSX.Element {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/auth/*" element={<AuthLayout />} />
				<Route path="/login" element={<Navigate to="/auth" replace />} />
				<Route path="/" element={<DashboardLayout />}>
					<Route index element={<Navigate to="/dashboard" replace />} />
					<Route path="dashboard" element={<DashboardPage />} />
					<Route path="users" element={<UsersPage />} />
					<Route path="exams" element={<ExamsPage />} />
					<Route path="exam" element={<ExamPage />} />
					<Route path="proctoring" element={<ProctoringPage />} />
					<Route path="security" element={<SecurityPage />} />
					<Route path="reward" element={<RewardPage />} />
					<Route path="courses" element={<CoursesPage />} />
					<Route path="organizations" element={<OrganizationsPage />} />
					<Route path="admin" element={<AdminPage />} />
					<Route path="analytics" element={<AnalyticsPage />} />
					<Route path="copyright" element={<CopyrightPage />} />
				</Route>
				<Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
			</Routes>
		</BrowserRouter>
	)
}


