import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import DashboardPage from '../pages/DashboardPage'
import UsersPage from '../pages/UsersPage' 
import ExamsPage from '../pages/ExamsPage' // Trang quản lý bài thi đã được thiết kế lại
import ProctoringPage from '../pages/ProctoringPage' // Trang giám sát đã được thiết kế lại
import SecurityPage from '../pages/SecurityPage'
import RewardPage from '../pages/RewardPage'
import CoursesPage from '../pages/CoursesPage'
import OrganizationsPage from '../pages/OrganizationsPage'
import AdminPage from '../pages/AdminPage'
import { AnalyticsPage } from '../pages/AnalyticsPage'
import CopyrightPage from '../pages/CopyrightPage'
import AdminExamPage from '../pages/AdminExamPage'
import CertifyPage from '../pages/CertifyPage'

export default function AdminRoutes(): JSX.Element {
	return (
		<Routes>
			<Route element={<DashboardLayout />}>
				<Route index element={<Navigate to="dashboard" replace />} />
				<Route path="dashboard" element={<DashboardPage />} />
				<Route path="users" element={<UsersPage />} />
				<Route path="exams" element={<ExamsPage />} />
				<Route path="exam" element={<AdminExamPage />} />
				<Route path="proctoring" element={<ProctoringPage />} />
				<Route path="security" element={<SecurityPage />} />
				<Route path="reward" element={<RewardPage />} />
				<Route path="courses" element={<CoursesPage />} />
				<Route path="organizations" element={<OrganizationsPage />} />
				<Route path="certify" element={<CertifyPage />} />
				<Route path="admin" element={<AdminPage />} />
				<Route path="analytics" element={<AnalyticsPage />} />
				<Route path="copyright" element={<CopyrightPage />} />
			</Route>
		</Routes>
	)
}
