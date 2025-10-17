import React from 'react'
import Modal from '../../components/common/Modal'
import { User } from '../../types/user'

interface AddUserModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (userData: Partial<User>) => void
}

const AddUserModal: React.FC<AddUserModalProps> = ({
	isOpen,
	onClose,
	onSave
}) => {
	const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
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
				onSave(userData)
			} else {
				alert('Vui lòng điền đầy đủ họ tên và email')
			}
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Thêm người dùng mới"
			maxWidth="550px"
			footer={
				<>
					<button 
						className="btn btn-secondary"
						onClick={onClose}
					>
						Hủy
					</button>
					<button 
						className="btn btn-primary"
						onClick={handleSubmit}
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
	)
}

export default AddUserModal
