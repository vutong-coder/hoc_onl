import React, { useState, useEffect } from 'react'
import Modal from '../../components/common/Modal'
import { User, User as UserIcon, Mail, Phone, Shield, Building } from 'lucide-react'
import { User as UserType } from '../../types/user'

interface EditUserModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (userData: Partial<User>) => void
	user: User | null
}

const EditUserModal: React.FC<EditUserModalProps> = ({
	isOpen,
	onClose,
	onSave,
	user
}) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		role: 'student',
		department: ''
	})

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				phone: user.phone || '',
				role: user.role || 'student',
				department: user.department || ''
			})
		}
	}, [user])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
	}

	const handleSubmit = () => {
		if (formData.name && formData.email) {
			onSave(formData)
		} else {
			alert('Vui lòng điền đầy đủ họ tên và email')
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Chỉnh sửa thông tin người dùng"
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
						Lưu thay đổi
					</button>
				</>
			}
		>
			<div className="modal-content-wrapper">
				<div className="modal-form-section">
					<div className="section-title">
						<UserIcon />
						<h4>Thông tin cơ bản</h4>
					</div>
					
					<div className="modal-form-group">
						<label className="form-label">
							<UserIcon />
							Họ và tên <span className="required">*</span>
						</label>
						<input
							type="text"
							name="name"
							className="form-input"
							value={formData.name}
							onChange={handleInputChange}
							placeholder="Nhập họ và tên"
						/>
					</div>

					<div className="modal-form-group">
						<label className="form-label">
							<Mail />
							Email <span className="required">*</span>
						</label>
						<input
							type="email"
							name="email"
							className="form-input"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="Nhập địa chỉ email"
						/>
					</div>
				</div>

				<div className="modal-form-section">
					<div className="section-title">
						<Phone />
						<h4>Thông tin liên hệ</h4>
					</div>
					
					<div className="modal-form-row">
						<div className="modal-form-group">
							<label className="form-label">
								<Phone />
								Số điện thoại
							</label>
							<input
								type="tel"
								name="phone"
								className="form-input"
								value={formData.phone}
								onChange={handleInputChange}
								placeholder="Nhập số điện thoại"
							/>
						</div>

						<div className="modal-form-group">
							<label className="form-label">
								<Shield />
								Vai trò
							</label>
							<select
								name="role"
								className="form-select"
								value={formData.role}
								onChange={handleInputChange}
							>
								<option value="admin">Quản trị viên</option>
								<option value="teacher">Giảng viên</option>
								<option value="student">Học viên</option>
								<option value="user">Người dùng</option>
							</select>
						</div>
					</div>

					<div className="modal-form-group">
						<label className="form-label">
							<Building />
							Phòng ban
						</label>
						<input
							type="text"
							name="department"
							className="form-input"
							value={formData.department}
							onChange={handleInputChange}
							placeholder="Nhập tên phòng ban"
						/>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default EditUserModal
