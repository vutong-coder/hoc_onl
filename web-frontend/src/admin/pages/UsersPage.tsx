import React, { useState, useRef } from 'react'
import { Plus, Download, Upload, FileDown } from 'lucide-react'
import SearchBar from '../components/common/SearchBar'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import UserTable from '../components/users/UserTable'
import useUsers from '../hooks/useUsers'
import { User } from '../types/user'
import { exportUsersToExcel, importUsersFromExcel, downloadExcelTemplate } from '../utils/excelHelpers'
import '../styles/common.css'
import '../styles/form.css'

export default function UsersPage(): JSX.Element {
	const {
		users,
		allUsers,
		filters,
		updateFilter,
		currentPage,
		setCurrentPage,
		totalPages,
		totalItems,
		itemsPerPage,
		sortKey,
		sortOrder,
		handleSort,
		deleteUser,
		toggleUserStatus,
		updateUser,
		addUser
	} = useUsers()

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [userToDelete, setUserToDelete] = useState<User | null>(null)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [userToEdit, setUserToEdit] = useState<User | null>(null)
	const [isAddModalOpen, setIsAddModalOpen] = useState(false)
	const [isImportModalOpen, setIsImportModalOpen] = useState(false)
	const [importFile, setImportFile] = useState<File | null>(null)
	const [importPreview, setImportPreview] = useState<Partial<User>[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Xử lý chỉnh sửa user
	const handleEdit = (user: User) => {
		setUserToEdit(user)
		setIsEditModalOpen(true)
	}

	// Xử lý xóa user
	const handleDelete = (user: User) => {
		setUserToDelete(user)
		setIsDeleteModalOpen(true)
	}

	// Xác nhận xóa
	const confirmDelete = () => {
		if (userToDelete) {
			deleteUser(userToDelete.id)
			setIsDeleteModalOpen(false)
			setUserToDelete(null)
		}
	}

	// Xử lý toggle status
	const handleToggleStatus = (user: User) => {
		toggleUserStatus(user.id)
	}

	// Xử lý thêm user mới
	const handleAddUser = (userData: Partial<User>) => {
		addUser(userData as Omit<User, 'id' | 'createdAt'>)
		setIsAddModalOpen(false)
	}

	// Xử lý export Excel
	const handleExportExcel = () => {
		exportUsersToExcel(allUsers)
	}

	// Xử lý import Excel
	const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setImportFile(file)
		
		try {
			const users = await importUsersFromExcel(file)
			setImportPreview(users)
			setIsImportModalOpen(true)
		} catch (error) {
			alert('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại file.')
			console.error(error)
		}
	}

	// Xác nhận import
	const confirmImport = () => {
		importPreview.forEach(userData => {
			addUser(userData as Omit<User, 'id' | 'createdAt'>)
		})
		setIsImportModalOpen(false)
		setImportFile(null)
		setImportPreview([])
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	// Download template
	const handleDownloadTemplate = () => {
		downloadExcelTemplate()
	}

	return (
		<div style={{ padding: '24px' }}>
			{/* Header */}
			<div style={{ marginBottom: '24px' }}>
				<h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0' }}>
					Quản lý Người dùng
				</h1>
				<p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
					Quản lý tài khoản người dùng trong hệ thống
				</p>
			</div>

			{/* Actions Bar */}
			<div style={{ 
				display: 'flex', 
				justifyContent: 'space-between', 
				alignItems: 'center',
				marginBottom: '24px',
				gap: '16px',
				flexWrap: 'wrap'
			}}>
				<SearchBar
					value={filters.search}
					onChange={(value) => updateFilter('search', value)}
					placeholder="Tìm kiếm theo tên, email, số điện thoại..."
				/>

				<div style={{ display: 'flex', gap: '12px' }}>
					<input
						ref={fileInputRef}
						type="file"
						accept=".xlsx,.xls"
						style={{ display: 'none' }}
						onChange={handleImportFile}
					/>
					<button 
						className="btn btn-secondary"
						onClick={() => fileInputRef.current?.click()}
					>
						<Upload size={18} />
						Nhập dữ liệu
					</button>
					<button 
						className="btn btn-secondary"
						onClick={handleExportExcel}
					>
						<Download size={18} />
						Xuất Excel
					</button>
					<button 
						className="btn btn-primary"
						onClick={() => setIsAddModalOpen(true)}
					>
						<Plus size={18} />
						Thêm người dùng
					</button>
				</div>
			</div>

			{/* Filters */}
			<div className="filters-container">
				<div className="filter-group">
					<label className="filter-label">Vai trò</label>
					<select
						className="filter-select"
						value={filters.role}
						onChange={(e) => updateFilter('role', e.target.value)}
					>
						<option value="all">Tất cả vai trò</option>
						<option value="admin">Quản trị viên</option>
						<option value="teacher">Giảng viên</option>
						<option value="student">Học viên</option>
						<option value="user">Người dùng</option>
					</select>
				</div>

				<div className="filter-group">
					<label className="filter-label">Trạng thái</label>
					<select
						className="filter-select"
						value={filters.status}
						onChange={(e) => updateFilter('status', e.target.value)}
					>
						<option value="all">Tất cả trạng thái</option>
						<option value="active">Hoạt động</option>
						<option value="inactive">Không hoạt động</option>
						<option value="suspended">Bị khóa</option>
					</select>
				</div>

				<div className="filter-group">
					<label className="filter-label">Kết quả</label>
					<div style={{ 
						padding: '8px 12px',
						background: 'var(--muted)',
						borderRadius: 'var(--radius-md)',
						fontSize: '14px',
						fontWeight: 500
					}}>
						Tìm thấy {totalItems} người dùng
					</div>
				</div>
			</div>

			{/* Table */}
			<div style={{ 
				background: 'var(--card)',
				borderRadius: 'var(--radius-lg)',
				boxShadow: 'var(--shadow-sm)',
				overflow: 'hidden'
			}}>
				<UserTable
					users={users}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onToggleStatus={handleToggleStatus}
					onSort={handleSort}
					sortKey={sortKey}
					sortOrder={sortOrder}
				/>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
					totalItems={totalItems}
					itemsPerPage={itemsPerPage}
				/>
			)}

			{/* Delete Modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="Xác nhận xóa người dùng"
				footer={
					<>
						<button 
							className="btn btn-secondary"
							onClick={() => setIsDeleteModalOpen(false)}
						>
							Hủy
						</button>
						<button 
							className="btn btn-danger"
							onClick={confirmDelete}
						>
							Xóa
						</button>
					</>
				}
			>
				<p style={{ margin: 0 }}>
					Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete?.name}</strong>?
					<br />
					Hành động này không thể hoàn tác.
				</p>
			</Modal>

			{/* Add User Modal */}
			<Modal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				title="Thêm người dùng mới"
				maxWidth="550px"
				footer={
					<>
						<button 
							className="btn btn-secondary"
							onClick={() => setIsAddModalOpen(false)}
						>
							Hủy
						</button>
						<button 
							className="btn btn-primary"
							onClick={(e) => {
								const form = (e.target as HTMLButtonElement).closest('.modal-content')?.querySelector('form')
								if (form) {
									const formData = new FormData(form)
									const userData = {
										name: formData.get('name') as string,
										email: formData.get('email') as string,
										phone: formData.get('phone') as string,
										role: formData.get('role') as any,
										department: formData.get('department') as string,
										status: 'active' as const
									}
									if (userData.name && userData.email) {
										handleAddUser(userData)
									} else {
										alert('Vui lòng điền đầy đủ họ tên và email')
									}
								}
							}}
						>
							Thêm người dùng
						</button>
					</>
				}
			>
				<form>
					<div className="form-group">
						<label className="form-label">Họ và tên *</label>
						<input
							type="text"
							name="name"
							className="form-input"
							placeholder="Nhập họ và tên"
							required
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Email *</label>
						<input
							type="email"
							name="email"
							className="form-input"
							placeholder="Nhập địa chỉ email"
							required
						/>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Số điện thoại</label>
							<input
								type="tel"
								name="phone"
								className="form-input"
								placeholder="Nhập số điện thoại"
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Vai trò</label>
							<select
								name="role"
								className="form-select"
								defaultValue="student"
							>
								<option value="admin">Quản trị viên</option>
								<option value="teacher">Giảng viên</option>
								<option value="student">Học viên</option>
								<option value="user">Người dùng</option>
							</select>
						</div>
					</div>

					<div className="form-group">
						<label className="form-label">Phòng ban</label>
						<input
							type="text"
							name="department"
							className="form-input"
							placeholder="Nhập tên phòng ban"
						/>
					</div>
				</form>
			</Modal>

			{/* Import Preview Modal */}
			<Modal
				isOpen={isImportModalOpen}
				onClose={() => {
					setIsImportModalOpen(false)
					setImportPreview([])
					setImportFile(null)
				}}
				title="Xem trước dữ liệu nhập"
				maxWidth="800px"
				footer={
					<>
						<button 
							className="btn btn-secondary"
							onClick={handleDownloadTemplate}
						>
							<FileDown size={18} />
							Tải mẫu Excel
						</button>
						<button 
							className="btn btn-secondary"
							onClick={() => {
								setIsImportModalOpen(false)
								setImportPreview([])
								setImportFile(null)
							}}
						>
							Hủy
						</button>
						<button 
							className="btn btn-primary"
							onClick={confirmImport}
							disabled={importPreview.length === 0}
						>
							Nhập {importPreview.length} người dùng
						</button>
					</>
				}
			>
				<div>
					<p style={{ marginBottom: '16px', color: 'var(--muted-foreground)' }}>
						Đã tìm thấy <strong>{importPreview.length}</strong> người dùng hợp lệ từ file <strong>{importFile?.name}</strong>
					</p>

					{importPreview.length > 0 ? (
						<div style={{ maxHeight: '400px', overflowY: 'auto' }}>
							<table className="admin-table">
								<thead>
									<tr>
										<th>Họ và tên</th>
										<th>Email</th>
										<th>Vai trò</th>
										<th>Phòng ban</th>
									</tr>
								</thead>
								<tbody>
									{importPreview.map((user, index) => (
										<tr key={index}>
											<td>{user.name}</td>
											<td>{user.email}</td>
											<td>
												<span className="badge badge-info">
													{user.role === 'admin' ? 'Quản trị viên' :
													 user.role === 'teacher' ? 'Giảng viên' :
													 user.role === 'student' ? 'Học viên' : 'Người dùng'}
												</span>
											</td>
											<td>{user.department || '-'}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="admin-table-empty">
							<div className="admin-table-empty-icon">⚠️</div>
							<div className="admin-table-empty-text">
								Không tìm thấy dữ liệu hợp lệ trong file
							</div>
						</div>
					)}
				</div>
			</Modal>

			{/* Edit Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title="Chỉnh sửa thông tin người dùng"
				maxWidth="550px"
				footer={
					<>
						<button 
							className="btn btn-secondary"
							onClick={() => setIsEditModalOpen(false)}
						>
							Hủy
						</button>
						<button 
							className="btn btn-primary"
							onClick={() => {
								// TODO: Implement save logic
								setIsEditModalOpen(false)
							}}
						>
							Lưu thay đổi
						</button>
					</>
				}
			>
				<div>
					<div className="form-group">
						<label className="form-label">Họ và tên</label>
						<input
							type="text"
							className="form-input"
							defaultValue={userToEdit?.name}
							placeholder="Nhập họ và tên"
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Email</label>
						<input
							type="email"
							className="form-input"
							defaultValue={userToEdit?.email}
							placeholder="Nhập địa chỉ email"
						/>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Số điện thoại</label>
							<input
								type="tel"
								className="form-input"
								defaultValue={userToEdit?.phone}
								placeholder="Nhập số điện thoại"
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Vai trò</label>
							<select
								className="form-select"
								defaultValue={userToEdit?.role}
							>
								<option value="admin">Quản trị viên</option>
								<option value="teacher">Giảng viên</option>
								<option value="student">Học viên</option>
								<option value="user">Người dùng</option>
							</select>
						</div>
					</div>

					<div className="form-group">
						<label className="form-label">Phòng ban</label>
						<input
							type="text"
							className="form-input"
							defaultValue={userToEdit?.department}
							placeholder="Nhập tên phòng ban"
						/>
					</div>
				</div>
			</Modal>
		</div>
	)
}
