import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthForm from '../components/molecules/AuthForm'
import Input from '../components/atoms/Input'
import SuccessMessage from '../components/atoms/SuccessMessage'
import { validateEmail } from '../utils/authValidation'

export default function ForgotPasswordPage(): JSX.Element {
	const [formData, setFormData] = useState({
		email: ''
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [loading, setLoading] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		// Validate form
		const emailError = validateEmail(formData.email)
		
		if (emailError) {
			setErrors({ email: emailError })
			return
		}

		setLoading(true)
		
		// Simulate API call
		setTimeout(() => {
			setLoading(false)
			setShowSuccess(true)
		}, 1000)
	}

	return (
		<AuthForm
			title="Đặt lại mật khẩu"
			subtitle="Nhập email để nhận hướng dẫn đặt lại mật khẩu"
			onSubmit={handleSubmit}
			buttonText="Gửi liên kết đặt lại"
			loading={loading}
			footer={
				<p style={{ margin: 0 }}>
					Nhớ mật khẩu?{' '}
					<Link 
						to="/auth/login"
						style={{
							background: 'none',
							border: 'none',
							color: 'var(--primary)',
							cursor: 'pointer',
							textDecoration: 'underline',
							fontSize: 'inherit',
							fontFamily: 'inherit'
						}}
					>
						Đăng nhập
					</Link>
				</p>
			}
		>
			{showSuccess && (
				<SuccessMessage
					message="Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!"
					onClose={() => setShowSuccess(false)}
				/>
			)}
			
			<Input
				id="email"
				name="email"
				type="email"
				value={formData.email}
				onChange={handleInputChange}
				placeholder="Nhập email của bạn"
				error={errors.email}
				required
			/>
		</AuthForm>
	)
}