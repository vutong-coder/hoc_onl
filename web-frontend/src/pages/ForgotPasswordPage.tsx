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
			title="Reset Password"
			subtitle="Enter your email to receive reset instructions"
			onSubmit={handleSubmit}
			buttonText="Send Reset Link"
			loading={loading}
			footer={
				<p style={{ margin: 0 }}>
					Remember your password?{' '}
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
						Sign in
					</Link>
				</p>
			}
		>
			{showSuccess && (
				<SuccessMessage
					message="Password reset link sent to your email!"
					onClose={() => setShowSuccess(false)}
				/>
			)}
			
			<Input
				id="email"
				name="email"
				type="email"
				value={formData.email}
				onChange={handleInputChange}
				placeholder="Enter your email"
				error={errors.email}
				required
			/>
		</AuthForm>
	)
}