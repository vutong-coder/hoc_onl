import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import DashboardLayout from '../components/layouts/DashboardLayout'
import UserLayout from '../components/layouts/UserLayout'
import AuthLayout from '../components/layouts/AuthLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import DashboardPage from '../pages/DashboardPage'
import UserHomePage from '../pages/UserHomePage'
import PreparePage from '../pages/PreparePage'
import LandingPage from '../pages/LandingPage'
import ExamPage from '../pages/ExamPage'
import { ExamPreCheckPage } from '../pages/ExamPreCheckPage'
import { ExamTakingPage } from '../pages/ExamTakingPage'
import { ExamResultPage } from '../pages/ExamResultPage'
import { ExamDetailPage } from '../pages/ExamDetailPage'
import MonitorPage from '../pages/MonitorPage'
import RewardPage from '../pages/RewardPage'
import CertifyPage from '../pages/CertifyPage'
import CertificationDetailPage from '../pages/CertificationDetailPage'
import CompetePage from '../pages/CompetePage'
import ContestDetailPage from '../pages/ContestDetailPage'
import ProfilePage from '../pages/ProfilePage'
import SettingsPage from '../pages/SettingsPage'
import LeaderboardPage from '../pages/LeaderboardPage'
import RewardStorePage from '../pages/RewardStorePage'
import TokenTransferPage from '../pages/TokenTransferPage'
import { checkAuth } from '../store/slices/authSlice'

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
	const dispatch = useAppDispatch()
	const { loggedIn } = useAppSelector((state) => state.auth)

	// Check authentication on app load
	useEffect(() => {
		dispatch(checkAuth())
	}, [dispatch])
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/auth/*" element={<AuthLayout />} />
				<Route path="/login" element={<Navigate to="/auth" replace />} />
				
				{/* Admin Routes */}
				<Route path="/admin/*" element={
					<ProtectedRoute requiredRole="admin">
						<DashboardLayout />
					</ProtectedRoute>
				}>
					<Route index element={<Navigate to="/admin/dashboard" replace />} />
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
				
				{/* Landing Page */}
				<Route path="/" element={<LandingPage />} />
				
				{/* User Routes */}
				<Route path="/user/*" element={
					<ProtectedRoute requiredRole="user">
						<UserLayout />
					</ProtectedRoute>
				}>
					<Route index element={<UserHomePage />} />
					<Route path="home" element={<UserHomePage />} />
					<Route path="prepare" element={<UserHomePage />} />
                <Route path="certify" element={<CertifyPage />} />
                <Route path="certify/:certificationId" element={<CertificationDetailPage />} />
                <Route path="compete" element={<CompetePage />} />
                <Route path="compete/:contestId" element={<ContestDetailPage />} />
					<Route path="exam" element={<ExamPage />} />
					<Route path="monitor" element={<MonitorPage />} />
					<Route path="reward" element={<RewardPage />} />
					<Route path="profile" element={<ProfilePage />} />
					<Route path="settings" element={<SettingsPage />} />
					<Route path="leaderboard" element={<LeaderboardPage />} />
				</Route>
				
				{/* Exam Routes - Standalone pages without layout */}
				<Route path="/exam/:examId/pre-check" element={
					<ProtectedRoute requiredRole="user">
						<ExamPreCheckPage />
					</ProtectedRoute>
				} />
				<Route path="/exam/:examId/take" element={
					<ProtectedRoute requiredRole="user">
						<ExamTakingPage />
					</ProtectedRoute>
				} />
				<Route path="/exam/:examId/result" element={
					<ProtectedRoute requiredRole="user">
						<ExamResultPage />
					</ProtectedRoute>
				} />
				<Route path="/exam/:examId/detail" element={
					<ProtectedRoute requiredRole="user">
						<ExamDetailPage />
					</ProtectedRoute>
				} />
				
				<Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
			</Routes>
		</BrowserRouter>
	)
}


